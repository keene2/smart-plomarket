# 聪明钱算法

本文档定义"聪明钱"的三种口径，以及对应的实时 / 离线计算规则。按 PRD 优先级：

1. **大额持仓 / 下注鲸鱼**（P0，实时）
2. **身份已知 KOL / 事件帐号**（P0，运营 + 社区）
3. **结算后 PnL / ROI 榜单**（P1，定时聚合）

---

## 1. 鲸鱼 / 大额单（Whale Monitor）

### 1.1 分层阈值（默认，前端可切换）

| 层级 | 单笔成交额（USDC） | 默认展示 |
| --- | --- | --- |
| `large`（大单） | ≥ 1,000 | 折叠在二级 tab |
| `whale`（鲸鱼） | ≥ 10,000 | 首页默认 |
| `mega`（超级鲸鱼） | ≥ 50,000 | Push + Email |

> 阈值写入配置中心（Postgres `app_config` 表或 Redis），运营可动态调。

### 1.2 触发规则

每条 `trade` 事件入库后，在 `trade-indexer` 内联计算：

```
amount_usd = shares * price
if amount_usd >= THRESHOLD.mega: tier = 'mega'
elif amount_usd >= THRESHOLD.whale: tier = 'whale'
elif amount_usd >= THRESHOLD.large: tier = 'large'
else: skip
```

命中后：
1. 写 Postgres `whale_events`
2. 推 Redis Stream `whale:feed` 和 `whale:feed:{market_id}`
3. 若 `mega` 或 taker 在某用户 `watchlists` 中 → 推 `alerts:{user_id}`

### 1.3 防噪声

- **相同地址 5 分钟内连续多笔**：聚合成一条 "batch" 推送，额度累加
- **自成交（maker == taker）**：直接过滤
- **做市机构名单**（运营维护）：可选择在默认 feed 中隐藏，在 "MM" tab 单独看
- **wash trade 检测（v1.5）**：同地址对倒、短时间内对冲开平仓，打 suspicious 标

### 1.4 可观测指标

- feed 端到端延迟（链上 block_time → 前端收到 WS）p95 < 15s
- 命中率：每日鲸鱼数 / 总 trades 数，用于检验阈值合理性

---

## 2. 已知身份 KOL 标签

### 2.1 数据来源

| 来源 | 可信度 | 标记 |
| --- | --- | --- |
| 官方 seed（运营手动维护） | 高 | `source='official'`, `verified=true` |
| 自报（用户在我们平台绑定 Twitter + 签名钱包） | 高 | `source='self_claimed'`, `verified=true` |
| 社区投稿（需证据链接） | 中 | `source='community'`, `verified=false` |
| 推断（Twitter 公开信息 + LLM 抽取） | 低 | `source='inferred'`, `verified=false` |

### 2.2 自报验证流程

1. 用户在"KOL 认领"页输入 Twitter handle
2. 系统生成一次性字符串，要求用户用绑定钱包签名
3. 用户把签名发 tweet（含特定 hashtag + wallet address）
4. 后端抓取该 tweet 并用 `ecrecover` 校验签名
5. 通过 → `labels` 新增一条 `verified=true, source='self_claimed'`

### 2.3 社区投稿

- 前端表单：钱包地址 + 证据 URL（Twitter post / Medium 文章）+ 描述
- 入 `label_submissions` 审核队列
- 运营审核：通过 → 落 `labels`；驳回 → 记原因

### 2.4 冷启动 seed（建议首批 50 个）

- **政治向 20**：Nate Silver、538、知名记者、Biden/Trump 分析师、体育博彩转政治的大V
- **加密向 20**：公开自报钱包的加密 KOL（Cobie、Hsaka 等）、DeFi 协议创始人
- **体育向 10**：Polymarket 主流体育市场的知名地址

---

## 3. PnL / ROI 榜单

### 3.1 窗口与刷新频率

| 窗口 | 计算范围 | 刷新频率 |
| --- | --- | --- |
| 24h | 最近 24 小时内**交易过**的地址 | 5 min |
| 7d | 最近 7 天交易过 | 15 min |
| 30d | 最近 30 天交易过 | 1 h |
| all | 所有历史交易过的地址 | 6 h |

### 3.2 PnL 计算

对每个地址在窗口内：

```
realized_pnl   = Σ (sell_amount_usd) − Σ (buy_amount_usd) on 已平仓的 outcome position
                 + Σ (settled_payout - buy_cost) on 已结算市场
unrealized_pnl = Σ (shares * current_mid_price - cost_basis) on 未平仓的 outcome position
total_pnl      = realized_pnl + unrealized_pnl
```

- 成本基准：**加权平均成本**（avg_cost）
- 未实现的市场价：取该 outcome 的 orderbook mid（bid + ask）/ 2
- 已结算市场：
  - 中 outcome → `payout = shares`（每股 1 USDC）
  - 错 outcome → `payout = 0`

### 3.3 胜率

```
win_count    = 已结算市场中押中 outcome 的次数
loss_count   = 押错的次数
tie_count    = 市场无效 / 退款的次数（不计）
win_rate     = win_count / (win_count + loss_count)
```

> 窗口按结算时间（不是下注时间）归属到 24h / 7d / 30d 桶。

### 3.4 过滤

- 最小交易次数：`trade_count ≥ 5`（24h 榜）、`≥ 20`（30d 榜）、`≥ 50`（all）
- 最小成交额：`total_volume ≥ 1000 USDC`
- 排除内部账户（合约地址、运营地址，维护在 `excluded_addresses` 表）

### 3.5 综合分（默认排序指标）

目标：既奖励赚钱多（PnL），也奖励稳定（胜率），还要求活跃（trade_count），避免运气型大赢家。

```
composite_score = log(1 + max(0, total_pnl))
                  * (win_rate^0.5)
                  * log(1 + trade_count)
```

- `log(1 + total_pnl)`：对数压缩，避免大户一骑绝尘
- `win_rate^0.5`：开平方减弱极端胜率影响
- `log(1 + trade_count)`：鼓励活跃
- 亏损地址 `total_pnl < 0` → `composite_score = 0`

**开放**：这是第一版公式，上线后用实际数据回测校准。PnL 组需建立"地址综合分 vs. 未来 30d 表现"的监控。

### 3.6 计算流程（ClickHouse → Postgres）

伪代码：

```sql
-- 1. 在 ClickHouse 算每个地址的 raw 指标
SELECT
    taker AS address,
    sum(if(side='BUY', amount_usd, 0)) AS buy_vol,
    sum(if(side='SELL', amount_usd, 0)) AS sell_vol,
    count(DISTINCT market_id) AS markets_touched,
    count() AS trade_count,
    sum(amount_usd) AS total_volume
FROM trades
WHERE block_time >= now() - INTERVAL :window
GROUP BY taker
HAVING total_volume >= 1000 AND trade_count >= :min_trades;

-- 2. JOIN positions 拿未实现 PnL
-- 3. JOIN resolved markets 拿已实现 PnL
-- 4. 计算 composite_score
-- 5. UPSERT 到 Postgres pnl_snapshots
-- 6. 刷新 Redis leaderboard:{window}
```

---

## 4. 边界情况

| 场景 | 处理 |
| --- | --- |
| **多 outcome 市场**（>2 个） | 按每个 outcome 独立维护 position；PnL 按 outcome 聚合到市场 |
| **市场取消 / 分叉** | Polymarket 极少发生；若发生，对应 trades 标 `invalidated=true`，PnL 重算 |
| **链重组** | trade-indexer 要求 ≥3 确认；若重组导致 trade 消失，清理对应行并回放 |
| **地址代理 / 合约地址** | 识别已知代理（如 Polymarket Relayer），不计入榜单；展示仍保留 |
| **自成交 / Wash** | 1.3 防噪声 + v1.5 wash detector |
| **空投 / 转账持仓** | v1 不处理（仍按当前持仓计算未实现 PnL，成本可能失真） |
| **gas / 手续费** | PnL 扣除 Polymarket taker fee；gas 不扣（金额相对小且不好归属） |

---

## 5. 输出数据契约（供前端 / API 使用）

### 5.1 鲸鱼事件

```json
{
  "id": 12345,
  "tx_hash": "0xabc...",
  "address": "0x123...",
  "label": { "name": "Nate Silver", "avatar": "...", "verified": true },
  "market": { "id": 42, "question_zh": "特朗普会赢 2028 大选吗？", "slug": "..." },
  "outcome": "YES",
  "side": "BUY",
  "shares": 50000,
  "price": 0.42,
  "amount_usd": 21000,
  "tier": "whale",
  "block_time": "2026-04-21T10:23:45Z"
}
```

### 5.2 榜单条目

```json
{
  "rank": 1,
  "address": "0x...",
  "label": null,
  "window": "7d",
  "realized_pnl": 12450.21,
  "unrealized_pnl": 830.5,
  "total_pnl": 13280.71,
  "total_volume": 156000,
  "trade_count": 87,
  "win_rate": 0.62,
  "composite_score": 8.43
}
```

### 5.3 地址画像

```json
{
  "address": "0x...",
  "label": { ... },
  "summary": {
    "total_pnl_all": 50234.1,
    "total_pnl_30d": 3200.5,
    "win_rate_all": 0.58,
    "markets_touched": 124,
    "largest_win": { "market_id": 99, "pnl": 12000 }
  },
  "followed_by_count": 384,
  "current_positions": [ ... ]
}
```
