# Design System — ORACLE (Smart Polymarket)

## Product Context
- **What this is:** Polymarket smart money analytics layer, trading dashboard with whale/KOL signal intelligence
- **Who it's for:** Chinese Web3 retail traders (GMGN background), prediction market traders
- **Space/industry:** DeFi, prediction markets, on-chain analytics
- **Project type:** Trading web app / data dashboard

## Aesthetic Direction
- **Direction:** shadcn/ui — clean, precise, utility-first
- **Decoration level:** Minimal — typography and spacing do the work
- **Mood:** Professional trading terminal that feels modern and approachable, not Bloomberg-dense
- **Reference sites:** shadcn.com, Kalshi (color clarity), Polymarket (trading UX)

## Typography
- **Display/Hero:** Geist — clean geometric sans, shadcn convention
- **Body:** Geist — single font family for consistency
- **UI/Labels:** Geist (medium weight for emphasis)
- **Data/Tables:** Geist (tabular-nums) — native OpenType tabular figures
- **Code/Mono:** Geist Mono — addresses, hashes, prices
- **CJK:** Noto Sans SC — Chinese content fallback
- **Loading:** Google Fonts (Noto Sans SC), cdnfonts (Geist family)
- **Scale:**
  - xs: 0.75rem / 12px
  - sm: 0.875rem / 14px
  - base: 1rem / 16px
  - lg: 1.125rem / 18px
  - xl: 1.25rem / 20px
  - 2xl: 1.5rem / 24px
  - 3xl: 1.875rem / 30px
  - 4xl: 2.25rem / 36px

## Color
- **Approach:** Restrained — shadcn zinc neutral base, semantic color for trading signals only
- **System:** HSL format via CSS custom properties, matching shadcn/ui convention

### Light Mode
| Token | HSL | Usage |
|-------|-----|-------|
| --background | 0 0% 100% | Page background |
| --foreground | 240 10% 3.9% | Primary text |
| --card | 0 0% 100% | Card surfaces |
| --card-foreground | 240 10% 3.9% | Card text |
| --primary | 240 5.9% 10% | Primary buttons, emphasis |
| --primary-foreground | 0 0% 98% | Text on primary |
| --secondary | 240 4.8% 95.9% | Secondary surfaces |
| --secondary-foreground | 240 5.9% 10% | Text on secondary |
| --muted | 240 4.8% 95.9% | Muted backgrounds |
| --muted-foreground | 240 3.8% 46.1% | Subdued text |
| --accent | 240 4.8% 95.9% | Accent surfaces |
| --accent-foreground | 240 5.9% 10% | Text on accent |
| --destructive | 0 84.2% 60.2% | Destructive actions |
| --border | 240 5.9% 90% | Borders |
| --input | 240 5.9% 90% | Input borders |
| --ring | 240 5.9% 10% | Focus rings |

### Dark Mode
| Token | HSL | Usage |
|-------|-----|-------|
| --background | 240 10% 3.9% | Page background |
| --foreground | 0 0% 98% | Primary text |
| --card | 240 10% 7% | Card surfaces |
| --card-foreground | 0 0% 98% | Card text |
| --primary | 0 0% 98% | Primary buttons |
| --primary-foreground | 240 5.9% 10% | Text on primary |
| --secondary | 240 3.7% 15.9% | Secondary surfaces |
| --muted | 240 3.7% 15.9% | Muted backgrounds |
| --muted-foreground | 240 5% 64.9% | Subdued text |
| --border | 240 3.7% 15.9% | Borders |
| --input | 240 3.7% 15.9% | Input borders |

### Semantic (Trading)
| Token | HSL | Usage |
|-------|-----|-------|
| --yes | 168 100% 35% | YES/bullish, positive PnL |
| --yes-foreground | 0 0% 100% | Text on yes |
| --no | 0 100% 67% | NO/bearish, negative PnL |
| --no-foreground | 0 0% 100% | Text on no |
| --whale | 38 92% 50% | Whale activity indicators |
| --kol | 263 70% 58% | KOL/influencer badges |
| --interactive | 221 83% 53% | Interactive links, active states |

### Usage in CSS
```css
background-color: hsl(var(--background));
color: hsl(var(--foreground));
border-color: hsl(var(--border));
```

## Spacing
- **Base unit:** 4px (0.25rem)
- **Density:** Comfortable for trading data, not cramped
- **Scale:** 0.5(2px) 1(4px) 1.5(6px) 2(8px) 3(12px) 4(16px) 5(20px) 6(24px) 8(32px) 10(40px) 12(48px) 16(64px)

## Layout
- **Approach:** Grid-disciplined, three-column trading layout
- **Trading layout:** Chart (5fr) | Order Panel (3fr) | Signal Panel (3fr)
- **Max content width:** Full viewport for trading, 1280px for non-trading pages
- **Border radius:**
  - --radius: 0.5rem (8px) — default
  - sm: calc(var(--radius) - 4px) — 4px
  - md: calc(var(--radius) - 2px) — 6px
  - lg: var(--radius) — 8px
  - xl: calc(var(--radius) + 4px) — 12px
  - full: 9999px — pills, avatars

## Motion
- **Approach:** Minimal-functional — transitions aid comprehension, nothing decorative
- **Easing:** ease-out (enter), ease-in (exit), ease-in-out (move)
- **Duration:** micro(50ms) short(150ms) medium(200ms) long(300ms)

## Component Conventions (shadcn/ui style)
- Buttons: solid primary (dark bg), outline (border only), ghost (no border/bg)
- Badges: muted bg with text, not heavy colored pills
- Inputs: 1px border matching --input, rounded-md, focus ring via --ring
- Cards: --card bg, 1px --border, rounded-lg, subtle shadow in light mode
- Tables: no zebra stripes, 1px bottom border per row, muted header

## Tech Stack
- **UI framework:** shadcn/ui (copy-paste components, not npm package)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Charts:** Lightweight Charts (TradingView)
- **Font loading:** next/font or CDN link tags

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-25 | shadcn/ui over Ant Design | Cleaner aesthetic, HSL token system, better customizability for trading UI |
| 2026-04-25 | Geist single font family | shadcn convention, clean and consistent, good tabular-nums support |
| 2026-04-25 | HSL color system | shadcn/ui standard, easy light/dark mode, CSS custom property native |
| 2026-04-25 | Restrained color approach | Neutral base keeps trading signals (yes/no/whale/kol) visually prominent |
| 2026-04-25 | Three-column trading layout | Chart(5) + Order(3) + Signal(3) balances data density with readability |
