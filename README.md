# Smart Polymarket

**Polymarket 的聪明钱数据层 + 交易前端**

本项目把 GMGN 在 Solana memecoin 场景验证过的"聚合行情 + 聪明钱画像"心智搬到预测市场赛道：

- 用户用邮箱 / Twitter 一键登录（Privy TEE 钱包），无需熟悉 Web3
- 实时监控 Polymarket 上的鲸鱼下注、KOL 动向、PnL 榜单
- 下单撮合与结算仍走 Polymarket 原生链上合约，我们只做**聚合层**
- 中文优先，v1 后补英文

## 当前状态

- ✅ PRD / 技术方案 / 数据模型 / 聪明钱算法文档
- ✅ monorepo 骨架（pnpm + Turborepo）、apps/web（Next.js 14 + Ant Design + Privy）、CI
- ⏳ 数据采集（apps/indexer）、API（apps/api）、聪明钱 feed、PnL 榜
- ⏳ 跟单（v2）

## 文档

| 文档 | 内容 |
| --- | --- |
| [docs/PRD.md](docs/PRD.md) | 产品需求、用户画像、V1 功能范围、开放问题 |
| [docs/tech-architecture.md](docs/tech-architecture.md) | 系统分层、技术栈选型、外部依赖、风险 |
| [docs/data-model.md](docs/data-model.md) | 数据表设计、索引策略、分库思路 |
| [docs/whale-algorithm.md](docs/whale-algorithm.md) | 聪明钱 / 鲸鱼 / KOL / PnL 的算法与口径 |
| [docs/roadmap.md](docs/roadmap.md) | MVP 8–10 周里程碑、v2+ 预告 |

## 仓库结构

```
smart-plomarket/
├── apps/
│   └── web/               # Next.js 14 App Router + Ant Design + Privy
├── packages/
│   └── tsconfig/          # 共享 TS 配置
├── infra/
│   └── docker-compose.yml # 本地 Postgres / Redis / ClickHouse
├── .github/workflows/     # CI
└── docs/
```

## 本地开发

### 先决条件

- Node 22（见 `.nvmrc`）
- pnpm 10.33+
- Docker（用于本地数据库）
- Privy App ID（在 <https://dashboard.privy.io> 新建 app 获取）

### 步骤

```bash
# 1. 安装依赖
pnpm install

# 2. 启动本地数据库
docker compose -f infra/docker-compose.yml up -d

# 3. 配置环境变量
cp .env.example apps/web/.env.local
# 编辑 apps/web/.env.local 填入 NEXT_PUBLIC_PRIVY_APP_ID

# 4. 启动 web dev server
pnpm dev
```

打开 <http://localhost:3000> 即可看到登录页。未配置 Privy App ID 时页面会提示缺失。

### 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动所有 app 的 dev server |
| `pnpm build` | 构建全部 |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |

## 开发分支

当前阶段所有工作都落在 `claude/prediction-market-design-L83Ze`，合入 `main` 后再建新特性分支。
