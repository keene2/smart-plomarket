# 路线图

## MVP（目标 8–10 周）

| 阶段 | 周数 | 交付物 | 验收标准 |
| --- | --- | --- | --- |
| **W1–2：基建** | 2 | 仓库骨架、CI/CD、Privy 接入 PoC、Polymarket 元数据入库、DB schema 建好 | 本地能登录、能看到从 Gamma API 拉下来的市场列表 |
| **W3–4：行情 + 交易** | 2 | 市场列表 / 详情页 / 下单闭环 | 真钱下出一单 Polymarket 订单，订单簿正常显示 |
| **W5–6：聪明钱 P0** | 2 | trade-indexer、鲸鱼实时 feed、地址详情页、基础 KOL 标签 | 鲸鱼 feed 延迟 <15s，50 个 KOL 标签已 seed |
| **W7：PnL 榜 + 关注** | 1 | PnL 聚合、4 窗口榜单、watchlist、站内通知 | 榜单与 Dune 对账误差 <2% |
| **W8：分享 + i18n + 打磨** | 1 | 分享卡片、中文内容校对、bug fix | 3 张可分享的图（持仓 / 市场 / KOL） |
| **W9–10：Beta** | 2 | 邀请码 Beta、KOL 冷启动运营、监控上线 | 邀请 200 人；DAU ≥ 50；0 P0 bug |

## V1.5（MVP 后 4–6 周）

聚焦"补齐体验 + 数据稳健"。

- Telegram bot：鲸鱼推送 / 关注地址动作 / 下单通知
- 跨链地址画像（Solana / Base / Ethereum Mainnet）
- Wash trade 检测
- 自建 Polygon archive node，降低对 Alchemy 依赖
- 英文版本正式开放
- 数据 API（免费版，rate-limited）

## V2（MVP 后 3–5 个月）

**核心**：一键跟单（Copy Trading）。

- 跟单策略：
  - 固定金额 / 按比例跟
  - 单笔 / 累计止损
  - 白名单市场 / 分类过滤
- 执行路径：用户授权 Privy 钱包一次性 approve 跟单合约；或前端守护进程挂后台自动下单
- 跟单抽成（商业化起点）：盈利部分抽 10%（业内常见）
- 跟单社区：把跟单组合做成"策略"，排行可订阅
- 高级数据订阅：付费解锁完整 all-time 榜、原始事件 API

## V3 方向（探索）

- 自营预测市场（subject to 合规）
- 信号市场：用户发布 YES/NO 预测，其他人订阅
- AI 分析：LLM 对事件/市场做背景解读
- 移动 App（iOS / Android）

---

## 关键里程碑依赖图

```
基建 ─┬─▶ 行情+交易 ─┬─▶ 聪明钱 P0 ─┬─▶ PnL 榜 ─┬─▶ 分享+i18n ─▶ Beta
       │               │                │            │
       └── Privy 可用 ──┘                └── trade-indexer 稳定 ──┘
```

**风险关键路径**：
- trade-indexer 的稳定性决定鲸鱼 feed 和 PnL 榜是否可信 → W5 就要上线并跑稳
- Privy 的下单签名联调是 W3–4 最大未知数 → W1 就启动 PoC，别等到 W3
