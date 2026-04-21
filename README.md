# Smart Polymarket

**Polymarket 的聪明钱数据层 + 交易前端**

本项目把 GMGN 在 Solana memecoin 场景验证过的"聚合行情 + 聪明钱画像"心智搬到预测市场赛道：

- 用户用邮箱 / Twitter 一键登录（Privy TEE 钱包），无需熟悉 Web3
- 实时监控 Polymarket 上的鲸鱼下注、KOL 动向、PnL 榜单
- 下单撮合与结算仍走 Polymarket 原生链上合约，我们只做**聚合层**
- 中文优先，v1 后补英文

**当前状态：文档阶段**。代码实现尚未启动，待产品评审后再开工。

## 文档导航

| 文档 | 内容 |
| --- | --- |
| [docs/PRD.md](docs/PRD.md) | 产品需求、用户画像、V1 功能范围、开放问题 |
| [docs/tech-architecture.md](docs/tech-architecture.md) | 系统分层、技术栈选型、外部依赖、风险 |
| [docs/data-model.md](docs/data-model.md) | 数据表设计、索引策略、分库思路 |
| [docs/whale-algorithm.md](docs/whale-algorithm.md) | 聪明钱 / 鲸鱼 / KOL / PnL 的算法与口径 |
| [docs/roadmap.md](docs/roadmap.md) | MVP 8–10 周里程碑、v2+ 预告 |

## 开发分支

所有当前阶段的设计文档均提交在 `claude/prediction-market-design-L83Ze` 分支。代码开发启动后会拆分子分支。
