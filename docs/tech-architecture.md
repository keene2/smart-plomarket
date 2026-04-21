# 技术架构

## 1. 架构分层概览

```
┌────────────────────────────────────────────────────────┐
│ 客户端层 (Next.js Web)                                  │
│  ├── Privy SDK（登录 + TEE 钱包签名）                   │
│  ├── TanStack Query（REST 拉取）                        │
│  └── WebSocket（行情 + 鲸鱼推送）                        │
└───────────────┬────────────────────────────────────────┘
                │ HTTPS / WSS
┌───────────────▼────────────────────────────────────────┐
│ API 层（Fastify / Node.js）                             │
│  ├── REST：市场、地址、榜单、用户                       │
│  ├── WS：实时鲸鱼 feed、订单状态                         │
│  └── Auth：Privy JWT 校验                                │
└───┬───────────┬───────────────────────┬─────────────────┘
    │           │                       │
┌───▼───┐  ┌───▼──────┐  ┌─────────────▼─────────────────┐
│Postgres│  │ClickHouse │  │Redis                          │
│业务数据 │  │/Timescale │  │（缓存 + pubsub + 消息队列）    │
└────────┘  │ 时序数据   │  └───────────────────────────────┘
            └───────────┘
                ▲
                │ 写入
┌───────────────┴────────────────────────────────────────┐
│ 数据采集 Worker                                         │
│  ├── market-sync：Gamma API 拉市场元数据（1 min/次）    │
│  ├── trade-indexer：Polygon RPC 事件 + CLOB WS → trades │
│  ├── pnl-aggregator：5 min 定时聚合持仓 / PnL           │
│  └── whale-detector：inline 触发阈值告警                │
└────────────────────────────────────────────────────────┘
                ▲
                │
┌───────────────┴────────────────────────────────────────┐
│ 外部依赖                                                │
│  Polymarket CLOB REST / WS                              │
│  Polymarket Gamma API（市场元数据）                      │
│  Polymarket Subgraph (The Graph)                        │
│  Polygon RPC (Alchemy / QuickNode)                      │
│  Privy（钱包 + 身份）                                    │
└────────────────────────────────────────────────────────┘
```

## 2. 前端

- **Next.js 14 (App Router) + TypeScript**
- **Tailwind CSS + shadcn/ui**（快速出样式，后期按 GMGN 风格覆盖）
- **TanStack Query**（REST 数据缓存与刷新）
- **wagmi + viem**（链上交互、合约读取）
- **Privy SDK**（登录 + 嵌入式钱包 + EIP-712 签名）
- **Lightweight Charts**（概率走势，性能好）
- **next-intl**（i18n，预留中英）

**打包部署**：Vercel。SSR 用于市场详情页 SEO（中文长尾词）。

## 3. API 层

- **Fastify（Node.js）或 NestJS**
  - MVP 推荐 Fastify：轻量、性能好、OpenAPI 自动生成
- **REST 路由**：
  - `/markets`、`/markets/:id`
  - `/addresses/:addr`、`/addresses/:addr/trades`、`/addresses/:addr/positions`
  - `/leaderboard?window=24h|7d|30d|all`
  - `/whales/feed`（分页 / 历史）
  - `/me/watchlist`、`/me/portfolio`、`/me/alerts`
- **WebSocket**：
  - `/ws/whales`（全局鲸鱼流）
  - `/ws/markets/:id`（单市场成交流）
  - `/ws/alerts`（个人通知）
- **Auth**：前端带 Privy JWT → 后端用 Privy 的 JWKS 验签，拿到 `privy_id` + `wallet`。

## 4. 数据层

| 数据类型 | 存储 | 说明 |
| --- | --- | --- |
| 用户、watchlist、labels、通知 | **Postgres** | 强事务、关系型 |
| trades、price ticks | **ClickHouse**（推荐）或 TimescaleDB | 高写入、聚合查询 |
| PnL / 持仓快照 | **Postgres**（物化视图） | 5 min 刷新 |
| 热点缓存、leaderboard、WS pubsub | **Redis** | TTL + sorted set |
| 鲸鱼 fan-out | **Redis Stream**（或 NATS） | 消费者：WS 推送、通知、邮件 |

**推荐**：MVP 期用 Postgres + ClickHouse + Redis 三件套。ClickHouse 对 PnL 这种"按地址聚合所有历史成交"的查询性能最好。

## 5. 数据采集（核心）

### 5.1 市场元数据

- 拉 **Polymarket Gamma API**（`https://gamma-api.polymarket.com/markets`）
- 频率：1 min / 次全量 diff，新市场即时入库
- 字段：id、slug、question、outcomes、category、volume、end_date、resolved、resolution

### 5.2 成交数据（关键）

双轨：

1. **Polygon RPC 事件订阅**（实时、权威）
   - 订阅 Polymarket Exchange 合约 `OrderFilled` 事件
   - 订阅 CTF 合约的 `PositionSplit` / `PositionMerge` 事件
   - 每条事件解码 → 入 ClickHouse `trades` 表
   - 关键：用 **confirmed block**（3 个确认以上）避免链重组

2. **Polymarket CLOB WebSocket**（补充，延迟更低）
   - 订阅 `market` channel，拿到 taker fill 事件
   - 用于前端立即展示，但持久化仍以 RPC 事件为准

3. **Subgraph 回填**（历史冷启动）
   - 首次上线拉一次全量历史（按月分片）
   - 后续作为对账数据源

### 5.3 Worker 清单

| 名字 | 语言/运行时 | 作用 | 频率 |
| --- | --- | --- | --- |
| `market-sync` | Node | Gamma API → Postgres `markets` | 1 min |
| `trade-indexer` | Node（viem） | RPC 事件 → ClickHouse `trades` + Redis Stream | 实时 |
| `pnl-aggregator` | Node / SQL job | 聚合 positions、PnL snapshot | 5 min |
| `whale-detector` | inline in trade-indexer | 过阈值 → Redis Stream `whale.events` | 实时 |
| `notification-dispatcher` | Node | 消费 whale/alerts stream → 站内/Email/TG | 实时 |
| `leaderboard-refresher` | Node / SQL | 刷新各 window 榜单到 Redis | 1 min |

## 6. 钱包与交易

- **登录**：Privy（邮箱 / Google / Twitter / WalletConnect）
- **嵌入式钱包**：Privy TEE 钱包，密钥在 Privy 侧，签名由前端发起
- **下单流程**：
  1. 前端组装 Polymarket EIP-712 `Order` 结构
  2. 调 Privy SDK `signTypedData`
  3. POST 到 `clob.polymarket.com/order`
  4. 订单状态订阅 WS（或轮询）
- **授权**：首次下单让用户一次性 approve
  - `USDC.e` → Polymarket Exchange
  - `CTF (ConditionalTokens)` → Polymarket Exchange
- **Gas**：Polygon gas 低，但仍由用户钱包支付（v1 不做 gas 代付，v2 可选）

## 7. 部署拓扑

| 组件 | 推荐 | 备注 |
| --- | --- | --- |
| Web（Next.js） | Vercel | 自带 CDN、SSR |
| API（Fastify） | Render / Fly.io | 多区域冗余可选 |
| Workers | Fly.io / Railway | 与 API 同环境 |
| Postgres | Neon / Supabase | 托管即可 |
| ClickHouse | ClickHouse Cloud / 自托管 | 数据量起来再上自托管 |
| Redis | Upstash / Redis Cloud | Upstash pay-per-request 友好 |
| RPC | Alchemy + QuickNode 双活 | 关键：带 archive |
| 监控 | Sentry + PostHog + Grafana | 数据管道健康度用 Grafana |

## 8. 关键风险 & 降级

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| Polymarket CLOB API 故障 | 下单中断 | 显示"交易暂不可用"banner，读操作不受影响 |
| Polygon RPC 丢块 | 鲸鱼 feed 停更 | 双 RPC 供应商，自动切换；Subgraph 回补 |
| Subgraph 延迟 | 历史对账错 | 对账任务打标注，延后重算 |
| Privy 宕机 | 用户登录 / 签名失败 | 首页显示 Privy 状态，鼓励导出私钥自托管 |
| 链重组 | trades 表脏数据 | 要求 ≥ 3 确认；重组回滚 + 重放 |
| PnL 算错（分叉市场） | 榜单不准 | 每日对账 + 用户反馈入口 |
| 合规（地域 / ToS） | 法律风险 | 首页免责声明、IP 地理提示（但不硬阻止） |

## 9. 监控 & SLO（MVP）

- 鲸鱼 feed 端到端延迟 p95 < 15s
- API 可用性 ≥ 99.5%
- 下单成功率 ≥ 98%（失败需明确原因提示）
- 数据对账误差 < 2%
