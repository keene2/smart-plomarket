# 数据模型

## 1. 分库原则

| 库 | 用途 | 关键考量 |
| --- | --- | --- |
| **Postgres**（业务库） | 用户、关注、标签、通知、市场元数据、聚合快照 | 事务 + 关系型 + 多表 JOIN |
| **ClickHouse**（时序库） | `trades`、`price_ticks` 原始事件 | 按地址 / 市场大聚合、写入吞吐高 |
| **Redis**（缓存） | 热点市场、leaderboard、WS pubsub、Stream | TTL + sorted set + stream |

**划分原则**：写入频繁 & 需要大聚合的时序数据放 ClickHouse；需要事务一致性的业务状态放 Postgres。PnL / 持仓是定时从 ClickHouse 聚合后写回 Postgres 的快照。

---

## 2. Postgres 表

### 2.1 `users`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid PK | |
| privy_id | text UNIQUE | Privy 用户 id |
| wallet_address | text UNIQUE | 小写、0x 前缀 |
| email | text | 可空 |
| twitter_handle | text | 可空 |
| locale | text | 默认 'zh-CN' |
| created_at | timestamptz | |
| last_login_at | timestamptz | |

索引：`(wallet_address)`、`(privy_id)`

### 2.2 `markets`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | bigint PK | |
| polymarket_id | text UNIQUE | Polymarket 的 condition_id |
| slug | text UNIQUE | |
| question_en | text | |
| question_zh | text | 可空，LLM 中译 + 人工校对 |
| description | text | |
| category | text | |
| tags | text[] | |
| end_date | timestamptz | |
| resolved | boolean | |
| resolution_outcome | text | 'YES' / 'NO' / null |
| volume_total | numeric | 冗余，定时回填 |
| liquidity | numeric | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

索引：`(end_date)`、`(resolved, volume_total DESC)`、`(category, volume_total DESC)`、`(slug)`

### 2.3 `labels`（KOL / 已知地址标签）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid PK | |
| address | text | 小写 |
| label | text | 昵称 |
| avatar_url | text | |
| twitter_handle | text | |
| category | text | 'politics' / 'crypto' / 'sports' / ... |
| verified | boolean | 官方核验 |
| source | text | 'official' / 'community' / 'self_claimed' |
| created_by | uuid FK users.id | null 表示运营 |
| created_at | timestamptz | |

索引：`(address)`（UNIQUE 每地址一条或多条？）、建议 `(address, source)` UNIQUE 复合

### 2.4 `watchlists`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| user_id | uuid FK users.id | |
| address | text | 关注的地址 |
| note | text | 用户自定义备注 |
| created_at | timestamptz | |

PK：`(user_id, address)`
索引：`(address)`（反查：该地址被多少人关注）

### 2.5 `alerts`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid PK | |
| user_id | uuid FK | |
| type | text | 'watched_trade' / 'order_filled' / 'market_resolved' / 'whale_in_my_market' |
| payload | jsonb | 事件详情 |
| read_at | timestamptz | 可空 |
| created_at | timestamptz | |

索引：`(user_id, created_at DESC)`、`(user_id, read_at) where read_at is null`

### 2.6 `positions`（持仓快照，5min 刷新）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| address | text | |
| market_id | bigint FK markets.id | |
| outcome | text | 'YES' / 'NO' |
| shares | numeric | 持有份数 |
| avg_cost | numeric | 平均成本价 (0–1) |
| realized_pnl | numeric | 该市场已实现盈亏（USDC） |
| unrealized_pnl | numeric | 按当前盘口 mid 算 |
| updated_at | timestamptz | |

PK：`(address, market_id, outcome)`
索引：`(address, updated_at DESC)`、`(market_id)`

### 2.7 `pnl_snapshots`（榜单原表）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| address | text | |
| window | text | '24h' / '7d' / '30d' / 'all' |
| realized_pnl | numeric | |
| unrealized_pnl | numeric | |
| total_volume | numeric | |
| trade_count | int | |
| win_count | int | |
| win_rate | numeric | |
| composite_score | numeric | 综合分（见 whale-algorithm.md） |
| snapshot_at | timestamptz | |

PK：`(address, window)`（最新一条直接覆盖）
索引：`(window, composite_score DESC)` — 榜单主查询

### 2.8 `whale_events`（命中阈值的鲸鱼单）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | bigserial PK | |
| tx_hash | text | |
| log_index | int | |
| address | text | |
| market_id | bigint FK | |
| outcome | text | |
| side | text | 'BUY' / 'SELL' |
| amount_usd | numeric | 成交额（USDC） |
| price | numeric | |
| tier | text | 'large' / 'whale' / 'mega' |
| block_time | timestamptz | |
| created_at | timestamptz | |

UNIQUE：`(tx_hash, log_index)`
索引：`(block_time DESC)`、`(market_id, block_time DESC)`、`(address, block_time DESC)`

---

## 3. ClickHouse 表

### 3.1 `trades`（核心事件表）

```sql
CREATE TABLE trades (
    tx_hash         String,
    log_index       UInt32,
    block_number    UInt64,
    block_time      DateTime,
    market_id       UInt64,
    condition_id    String,
    outcome         Enum8('YES' = 1, 'NO' = 2),
    maker           String,
    taker           String,
    side            Enum8('BUY' = 1, 'SELL' = 2),  -- taker 视角
    shares          Decimal(38, 6),
    price           Decimal(10, 6),  -- 0.000001 – 0.999999
    amount_usd      Decimal(38, 6),  -- shares * price
    fee             Decimal(38, 6)
) ENGINE = ReplacingMergeTree(block_time)
ORDER BY (market_id, block_time, tx_hash, log_index);
```

- `ReplacingMergeTree`：同一 `(tx_hash, log_index)` 被重放时自然去重
- 分区可按月 `PARTITION BY toYYYYMM(block_time)`

### 3.2 `price_ticks`（市场最新价时序）

```sql
CREATE TABLE price_ticks (
    market_id   UInt64,
    outcome     Enum8('YES' = 1, 'NO' = 2),
    price       Decimal(10, 6),
    volume_1m   Decimal(38, 6),
    ts          DateTime
) ENGINE = MergeTree
PARTITION BY toYYYYMM(ts)
ORDER BY (market_id, ts);
```

由 trade-indexer 按 1 min 聚合写入，供 K 线图使用。

### 3.3 常用 ClickHouse 查询示例

**某地址累计 PnL（已实现）**

```sql
SELECT
    sum(if(side = 'SELL', shares * price, -shares * price)) AS net_usd
FROM trades
WHERE taker = :addr OR maker = :addr
```

（实际需根据 taker / maker 分别算，简化示意）

**按地址成交额排行（24h）**

```sql
SELECT taker AS address, sum(amount_usd) AS vol
FROM trades
WHERE block_time >= now() - INTERVAL 1 DAY
GROUP BY taker
ORDER BY vol DESC
LIMIT 100;
```

---

## 4. Redis 结构

| Key | 结构 | 用途 |
| --- | --- | --- |
| `market:hot` | sorted set | 热门市场（score=24h vol） |
| `leaderboard:{window}` | sorted set | `window ∈ {24h, 7d, 30d, all}`，score=composite |
| `whale:feed` | stream | 全局鲸鱼流，WS 消费 |
| `whale:feed:{market_id}` | stream | 单市场 |
| `alerts:{user_id}` | stream | 个人推送 |
| `price:{market_id}:{outcome}` | string（带 TTL 5s） | 最新价缓存 |
| `pos:{address}` | hash | 该地址持仓精简缓存（5 min TTL） |

---

## 5. 索引 & 性能备注

- **Postgres**
  - `pnl_snapshots` 按 `(window, composite_score DESC)` 建索引，榜单查询 <10 ms
  - `alerts` 按 `(user_id, created_at DESC)` + 条件索引未读
  - `watchlists` 双向索引（正向：用户看关注，反向：地址被多少人关注）
- **ClickHouse**
  - 主键 `ORDER BY (market_id, block_time)` 对"某市场最近成交"最快
  - 按地址查询走次级聚合查询 + SKIP INDEX on `taker`
- **分区**：trades / price_ticks 按月，一年后可冷迁

---

## 6. 数据一致性 & 对账

- **权威源**：Polygon RPC 链上事件
- **trade-indexer 写入前**：要求区块 ≥ 3 个确认
- **对账 Job**（每日）：用 Subgraph `Trade` 实体 vs. ClickHouse `trades`，按 `(tx_hash, log_index)` diff，不一致入 `reconciliation_diffs` 表报警
- **PnL 重算**：每月一次全量重跑（防止中间 bug 累计偏差）

---

## 7. 后续扩展预留

| v2 需求 | 预留设计 |
| --- | --- |
| 跟单执行 | 新增 `copy_configs`、`copy_executions` 表，与 `watchlists` 区分 |
| 跨链画像 | `users` 加 `linked_addresses jsonb`；新库 `cross_chain_activity` |
| 数据订阅 | `subscriptions`、`api_keys` 表，计费走 Stripe |
