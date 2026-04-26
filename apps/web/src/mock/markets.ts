import type {
  Event,
  OrderBook,
  Trade,
  WhaleEvent,
  SmartMoneySummary,
  PricePoint,
} from "@/types/market";

// ─── Political multi-candidate event ───
export const presidentEvent: Event = {
  id: "evt-president-2028",
  slug: "us-president-2028",
  title: "2028 US Presidential Election Winner",
  description: "Who will win the 2028 United States presidential election?",
  category: "politics",
  endDate: "2028-11-03T00:00:00Z",
  volume: 285_400_000,
  markets: [
    {
      id: "mkt-president-vance",
      slug: "vance-president-2028",
      question: "Will JD Vance win the 2028 Presidential Election?",
      outcomes: [
        { id: "out-vance-yes", label: "Yes", price: 0.38, priceChange24h: 0.02 },
        { id: "out-vance-no", label: "No", price: 0.62, priceChange24h: -0.02 },
      ],
      volume24h: 12_300_000,
      liquidity: 4_500_000,
      endDate: "2028-11-03T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-president-newsom",
      slug: "newsom-president-2028",
      question: "Will Gavin Newsom win the 2028 Presidential Election?",
      outcomes: [
        { id: "out-newsom-yes", label: "Yes", price: 0.22, priceChange24h: -0.01 },
        { id: "out-newsom-no", label: "No", price: 0.78, priceChange24h: 0.01 },
      ],
      volume24h: 8_100_000,
      liquidity: 3_200_000,
      endDate: "2028-11-03T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-president-desantis",
      slug: "desantis-president-2028",
      question: "Will Ron DeSantis win the 2028 Presidential Election?",
      outcomes: [
        { id: "out-desantis-yes", label: "Yes", price: 0.15, priceChange24h: 0.005 },
        { id: "out-desantis-no", label: "No", price: 0.85, priceChange24h: -0.005 },
      ],
      volume24h: 5_400_000,
      liquidity: 2_100_000,
      endDate: "2028-11-03T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-president-harris",
      slug: "harris-president-2028",
      question: "Will Kamala Harris win the 2028 Presidential Election?",
      outcomes: [
        { id: "out-harris-yes", label: "Yes", price: 0.12, priceChange24h: -0.03 },
        { id: "out-harris-no", label: "No", price: 0.88, priceChange24h: 0.03 },
      ],
      volume24h: 4_200_000,
      liquidity: 1_800_000,
      endDate: "2028-11-03T00:00:00Z",
      resolved: false,
    },
  ],
};

// ─── Binary YES/NO event (crypto) ───
export const btcEvent: Event = {
  id: "evt-btc-100k",
  slug: "btc-above-100k-june",
  title: "Bitcoin above $100k on June 30?",
  description: "Will Bitcoin's price be at or above $100,000 USD at 11:59 PM ET on June 30, 2026?",
  category: "crypto",
  endDate: "2026-06-30T23:59:00Z",
  volume: 48_700_000,
  markets: [
    {
      id: "mkt-btc-100k",
      slug: "btc-100k-june-2026",
      question: "Bitcoin above $100k on June 30, 2026?",
      outcomes: [
        { id: "out-btc-yes", label: "Yes", price: 0.67, priceChange24h: 0.04 },
        { id: "out-btc-no", label: "No", price: 0.33, priceChange24h: -0.04 },
      ],
      volume24h: 3_200_000,
      liquidity: 1_900_000,
      endDate: "2026-06-30T23:59:00Z",
      resolved: false,
    },
  ],
};

// ─── Sports event ───
export const nbaEvent: Event = {
  id: "evt-nba-champion-2026",
  slug: "nba-champion-2026",
  title: "2025-26 NBA Champion",
  description: "Which team will win the 2025-26 NBA Championship?",
  category: "sports",
  endDate: "2026-06-20T00:00:00Z",
  volume: 92_500_000,
  markets: [
    {
      id: "mkt-nba-celtics",
      slug: "celtics-nba-2026",
      question: "Will the Celtics win the 2025-26 NBA Championship?",
      outcomes: [
        { id: "out-celtics-yes", label: "Yes", price: 0.28, priceChange24h: 0.01 },
        { id: "out-celtics-no", label: "No", price: 0.72, priceChange24h: -0.01 },
      ],
      volume24h: 2_100_000,
      liquidity: 980_000,
      endDate: "2026-06-20T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-nba-thunder",
      slug: "thunder-nba-2026",
      question: "Will the Thunder win the 2025-26 NBA Championship?",
      outcomes: [
        { id: "out-thunder-yes", label: "Yes", price: 0.24, priceChange24h: 0.03 },
        { id: "out-thunder-no", label: "No", price: 0.76, priceChange24h: -0.03 },
      ],
      volume24h: 1_800_000,
      liquidity: 870_000,
      endDate: "2026-06-20T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-nba-nuggets",
      slug: "nuggets-nba-2026",
      question: "Will the Nuggets win the 2025-26 NBA Championship?",
      outcomes: [
        { id: "out-nuggets-yes", label: "Yes", price: 0.18, priceChange24h: -0.02 },
        { id: "out-nuggets-no", label: "No", price: 0.82, priceChange24h: 0.02 },
      ],
      volume24h: 1_400_000,
      liquidity: 720_000,
      endDate: "2026-06-20T00:00:00Z",
      resolved: false,
    },
  ],
};

// ─── Order book (for BTC 100k market) ───
export const mockOrderBook: OrderBook = {
  bids: [
    { price: 0.67, size: 45_000, total: 45_000 },
    { price: 0.66, size: 32_000, total: 77_000 },
    { price: 0.65, size: 28_000, total: 105_000 },
    { price: 0.64, size: 51_000, total: 156_000 },
    { price: 0.63, size: 18_000, total: 174_000 },
    { price: 0.62, size: 42_000, total: 216_000 },
    { price: 0.61, size: 35_000, total: 251_000 },
    { price: 0.60, size: 67_000, total: 318_000 },
  ],
  asks: [
    { price: 0.68, size: 38_000, total: 38_000 },
    { price: 0.69, size: 29_000, total: 67_000 },
    { price: 0.70, size: 55_000, total: 122_000 },
    { price: 0.71, size: 22_000, total: 144_000 },
    { price: 0.72, size: 41_000, total: 185_000 },
    { price: 0.73, size: 33_000, total: 218_000 },
    { price: 0.74, size: 19_000, total: 237_000 },
    { price: 0.75, size: 48_000, total: 285_000 },
  ],
  spread: 0.01,
};

// ─── Recent trades ───
export const mockTrades: Trade[] = [
  { id: "t1", timestamp: "2026-04-25T08:32:15Z", side: "buy", outcome: "Yes", price: 0.67, size: 12_500, maker: "0x1a2b...3c4d" },
  { id: "t2", timestamp: "2026-04-25T08:31:42Z", side: "sell", outcome: "Yes", price: 0.66, size: 8_200, maker: "0x5e6f...7g8h" },
  { id: "t3", timestamp: "2026-04-25T08:30:58Z", side: "buy", outcome: "Yes", price: 0.67, size: 25_000, maker: "0x9i0j...1k2l" },
  { id: "t4", timestamp: "2026-04-25T08:29:11Z", side: "buy", outcome: "No", price: 0.34, size: 5_800, maker: "0x3m4n...5o6p" },
  { id: "t5", timestamp: "2026-04-25T08:28:03Z", side: "sell", outcome: "Yes", price: 0.65, size: 15_000, maker: "0x7q8r...9s0t" },
  { id: "t6", timestamp: "2026-04-25T08:26:45Z", side: "buy", outcome: "Yes", price: 0.66, size: 42_000, maker: "0xWhale...01" },
  { id: "t7", timestamp: "2026-04-25T08:25:12Z", side: "sell", outcome: "No", price: 0.33, size: 9_300, maker: "0xAbc...Def" },
  { id: "t8", timestamp: "2026-04-25T08:24:01Z", side: "buy", outcome: "Yes", price: 0.65, size: 18_700, maker: "0xGhi...Jkl" },
];

// ─── Whale feed ───
export const mockWhaleEvents: WhaleEvent[] = [
  {
    id: "w1",
    timestamp: "2026-04-25T08:32:15Z",
    address: "0xWhale...01",
    addressLabel: "Whale_Alpha",
    action: "buy",
    outcome: "Yes",
    amount: 150_000,
    price: 0.67,
    pnl: 23_400,
    tags: ["whale", "smart_money"],
  },
  {
    id: "w2",
    timestamp: "2026-04-25T08:15:30Z",
    address: "0xKOL...02",
    addressLabel: "CryptoKing",
    action: "buy",
    outcome: "Yes",
    amount: 85_000,
    price: 0.65,
    pnl: 12_750,
    tags: ["kol"],
  },
  {
    id: "w3",
    timestamp: "2026-04-25T07:45:00Z",
    address: "0xInst...03",
    addressLabel: "Fund_Beta",
    action: "sell",
    outcome: "Yes",
    amount: 200_000,
    price: 0.68,
    pnl: -8_600,
    tags: ["whale", "institution"],
  },
  {
    id: "w4",
    timestamp: "2026-04-25T07:20:00Z",
    address: "0xNew...04",
    action: "buy",
    outcome: "Yes",
    amount: 45_000,
    price: 0.64,
    tags: ["new"],
  },
  {
    id: "w5",
    timestamp: "2026-04-25T06:50:00Z",
    address: "0xSmart...05",
    addressLabel: "DegenTrader",
    action: "buy",
    outcome: "No",
    amount: 120_000,
    price: 0.35,
    pnl: -15_200,
    tags: ["smart_money", "kol"],
  },
];

// ─── Smart money summary ───
export const mockSmartMoney: SmartMoneySummary = {
  yesPercent: 72,
  noPercent: 28,
  whaleCount: 14,
  kolCount: 8,
  topHolders: [
    { address: "0xWhale...01", label: "Whale_Alpha", tags: ["whale", "smart_money"], position: "yes", shares: 220_000, avgPrice: 0.52, pnl: 33_000, pnlPercent: 28.8 },
    { address: "0xInst...03", label: "Fund_Beta", tags: ["whale", "institution"], position: "yes", shares: 180_000, avgPrice: 0.45, pnl: 39_600, pnlPercent: 48.9 },
    { address: "0xKOL...02", label: "CryptoKing", tags: ["kol"], position: "yes", shares: 130_000, avgPrice: 0.58, pnl: 11_700, pnlPercent: 15.5 },
    { address: "0xSmart...05", label: "DegenTrader", tags: ["smart_money", "kol"], position: "no", shares: 120_000, avgPrice: 0.35, pnl: -2_400, pnlPercent: -5.7 },
    { address: "0xNew...04", tags: ["new"], position: "yes", shares: 45_000, avgPrice: 0.64, pnl: 1_350, pnlPercent: 4.7 },
  ],
};

// ─── Price history (30 days, daily) ───
function generatePriceHistory(startPrice: number, days: number): PricePoint[] {
  const points: PricePoint[] = [];
  const now = Date.now();
  let price = startPrice;
  for (let i = days; i >= 0; i--) {
    const drift = (Math.random() - 0.48) * 0.03;
    price = Math.max(0.05, Math.min(0.95, price + drift));
    points.push({
      time: Math.floor((now - i * 86_400_000) / 1000),
      value: Math.round(price * 100) / 100,
    });
  }
  return points;
}

export const mockPriceHistory = generatePriceHistory(0.45, 30);

// ─── Economy: Fed rate decision ───
export const fedRateEvent: Event = {
  id: "evt-fed-rate-april",
  slug: "fed-rate-decision-april",
  title: "四月份的美联储决策?",
  description: "美联储将在四月份做出什么利率决定?",
  category: "economy",
  imageUrl: "https://polymarket.com/icons/fed.png",
  endDate: "2026-04-30T00:00:00Z",
  volume: 94_883_600,
  markets: [
    {
      id: "mkt-fed-nochange",
      slug: "fed-no-change",
      question: "Will the Fed keep rates unchanged?",
      outcomes: [
        { id: "out-fed-nc-yes", label: "没有变化", price: 0.99, priceChange24h: 0.0 },
        { id: "out-fed-nc-no", label: "No", price: 0.01, priceChange24h: 0.0 },
      ],
      volume24h: 1_200_000,
      liquidity: 800_000,
      endDate: "2026-04-30T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-fed-cut25",
      slug: "fed-cut-25bp",
      question: "Will the Fed cut rates by 25bp?",
      outcomes: [
        { id: "out-fed-cut-yes", label: "25个基点的下降", price: 0.002, priceChange24h: 0.0 },
        { id: "out-fed-cut-no", label: "No", price: 0.998, priceChange24h: 0.0 },
      ],
      volume24h: 500_000,
      liquidity: 300_000,
      endDate: "2026-04-30T00:00:00Z",
      resolved: false,
    },
  ],
};

// ─── Politics: Strait of Hormuz ───
export const hormuzEvent: Event = {
  id: "evt-hormuz-ships",
  slug: "hormuz-ship-transit",
  title: "Will __ ships transit the Strait of Hormuz on any day by end of...?",
  description: "Ship transit count through Strait of Hormuz",
  category: "politics",
  endDate: "2026-06-30T00:00:00Z",
  volume: 1_109_000,
  markets: [
    {
      id: "mkt-hormuz-40",
      slug: "hormuz-40-ships",
      question: "40+ ships transit?",
      outcomes: [
        { id: "out-h40-yes", label: "40+", price: 0.42, priceChange24h: 0.02 },
        { id: "out-h40-no", label: "No", price: 0.58, priceChange24h: -0.02 },
      ],
      volume24h: 200_000,
      liquidity: 150_000,
      endDate: "2026-06-30T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-hormuz-60",
      slug: "hormuz-60-ships",
      question: "60+ ships transit?",
      outcomes: [
        { id: "out-h60-yes", label: "60+", price: 0.27, priceChange24h: -0.01 },
        { id: "out-h60-no", label: "No", price: 0.73, priceChange24h: 0.01 },
      ],
      volume24h: 180_000,
      liquidity: 120_000,
      endDate: "2026-06-30T00:00:00Z",
      resolved: false,
    },
  ],
};

// ─── Economy: WTI Crude Oil ───
export const wtiEvent: Event = {
  id: "evt-wti-april",
  slug: "wti-crude-oil-april",
  title: "What will WTI Crude Oil (WTI) hit in April 2026?",
  description: "WTI crude oil price target for April 2026",
  category: "economy",
  endDate: "2026-04-30T00:00:00Z",
  volume: 44_058_900,
  markets: [
    {
      id: "mkt-wti-100",
      slug: "wti-above-100",
      question: "WTI above $100?",
      outcomes: [
        { id: "out-wti100-yes", label: "↑ $100", price: 0.57, priceChange24h: 0.03 },
        { id: "out-wti100-no", label: "No", price: 0.43, priceChange24h: -0.03 },
      ],
      volume24h: 800_000,
      liquidity: 600_000,
      endDate: "2026-04-30T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-wti-85",
      slug: "wti-below-85",
      question: "WTI below $85?",
      outcomes: [
        { id: "out-wti85-yes", label: "↓ $85", price: 0.32, priceChange24h: -0.01 },
        { id: "out-wti85-no", label: "No", price: 0.68, priceChange24h: 0.01 },
      ],
      volume24h: 600_000,
      liquidity: 450_000,
      endDate: "2026-04-30T00:00:00Z",
      resolved: false,
    },
  ],
};

// ─── Science/Tech: Best AI model ───
export const aiModelEvent: Event = {
  id: "evt-ai-model-may",
  slug: "best-ai-model-may",
  title: "Which company has the best AI model end of May?",
  description: "Which company will have the top-ranked AI model at the end of May 2026?",
  category: "science",
  endDate: "2026-05-31T00:00:00Z",
  volume: 22_010_000,
  markets: [
    {
      id: "mkt-ai-anthropic",
      slug: "ai-anthropic",
      question: "Anthropic best AI model?",
      outcomes: [
        { id: "out-ai-ant-yes", label: "安思博 (Anthropic)", price: 0.52, priceChange24h: 0.04 },
        { id: "out-ai-ant-no", label: "No", price: 0.48, priceChange24h: -0.04 },
      ],
      volume24h: 500_000,
      liquidity: 350_000,
      endDate: "2026-05-31T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-ai-google",
      slug: "ai-google",
      question: "Google best AI model?",
      outcomes: [
        { id: "out-ai-goog-yes", label: "谷歌", price: 0.27, priceChange24h: -0.02 },
        { id: "out-ai-goog-no", label: "No", price: 0.73, priceChange24h: 0.02 },
      ],
      volume24h: 400_000,
      liquidity: 280_000,
      endDate: "2026-05-31T00:00:00Z",
      resolved: false,
    },
  ],
};

// ─── Sports: NBA Playoffs ───
export const nbaPlayoffsEvent: Event = {
  id: "evt-nba-playoffs-lal-hou",
  slug: "nba-playoffs-lakers-rockets",
  title: "NBA Playoffs: Who Will Win Series? - Lakers vs. Rockets",
  description: "Who will win the NBA Playoff series between Lakers and Rockets?",
  category: "sports",
  endDate: "2026-05-15T00:00:00Z",
  volume: 69_800,
  markets: [
    {
      id: "mkt-nba-lal",
      slug: "nba-lakers-win",
      question: "Will the Lakers win?",
      outcomes: [
        { id: "out-lal-yes", label: "LAL", price: 0.92, priceChange24h: 0.01 },
        { id: "out-lal-no", label: "No", price: 0.08, priceChange24h: -0.01 },
      ],
      volume24h: 30_000,
      liquidity: 20_000,
      endDate: "2026-05-15T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-nba-hou",
      slug: "nba-rockets-win",
      question: "Will the Rockets win?",
      outcomes: [
        { id: "out-hou-yes", label: "HOU", price: 0.09, priceChange24h: -0.01 },
        { id: "out-hou-no", label: "No", price: 0.91, priceChange24h: 0.01 },
      ],
      volume24h: 25_000,
      liquidity: 18_000,
      endDate: "2026-05-15T00:00:00Z",
      resolved: false,
    },
  ],
};

// ─── Politics: Iran enriched uranium ───
export const iranUraniumEvent: Event = {
  id: "evt-iran-uranium",
  slug: "iran-enriched-uranium",
  title: "US obtains Iranian enriched uranium by...?",
  description: "Will the US obtain Iranian enriched uranium?",
  category: "politics",
  endDate: "2026-12-31T00:00:00Z",
  volume: 4_470_700,
  markets: [
    {
      id: "mkt-iran-u-yes",
      slug: "iran-uranium-yes",
      question: "US obtains Iranian enriched uranium?",
      outcomes: [
        { id: "out-iran-yes", label: "Yes", price: 0.28, priceChange24h: -0.03 },
        { id: "out-iran-no", label: "No", price: 0.71, priceChange24h: 0.03 },
      ],
      volume24h: 350_000,
      liquidity: 200_000,
      endDate: "2026-12-31T00:00:00Z",
      resolved: false,
    },
  ],
};

// ─── Finance: Patek prices ───
export const patekEvent: Event = {
  id: "evt-patek-prices",
  slug: "patek-prices-april",
  title: "Will Patek prices hit __ by April 30?",
  description: "Patek Philippe watch price targets",
  category: "finance",
  endDate: "2026-04-30T00:00:00Z",
  volume: 82_000,
  markets: [
    {
      id: "mkt-patek-108k",
      slug: "patek-108k",
      question: "Patek above $108,000?",
      outcomes: [
        { id: "out-p108-yes", label: "↑ $108,000", price: 0.25, priceChange24h: 0.02 },
        { id: "out-p108-no", label: "No", price: 0.75, priceChange24h: -0.02 },
      ],
      volume24h: 15_000,
      liquidity: 10_000,
      endDate: "2026-04-30T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-patek-109k",
      slug: "patek-109k",
      question: "Patek above $109,000?",
      outcomes: [
        { id: "out-p109-yes", label: "↑ $109,000", price: 0.06, priceChange24h: -0.01 },
        { id: "out-p109-no", label: "No", price: 0.94, priceChange24h: 0.01 },
      ],
      volume24h: 12_000,
      liquidity: 8_000,
      endDate: "2026-04-30T00:00:00Z",
      resolved: false,
    },
  ],
};

// ─── Politics: Iran regime ───
export const iranRegimeEvent: Event = {
  id: "evt-iran-regime",
  slug: "iran-regime-collapse",
  title: "伊朗政权会在6月30日之前倒台吗?",
  description: "Will Iran regime collapse before June 30?",
  category: "politics",
  endDate: "2026-06-30T00:00:00Z",
  volume: 24_212_800,
  markets: [
    {
      id: "mkt-iran-regime",
      slug: "iran-regime-yes",
      question: "Iran regime collapse before June 30?",
      outcomes: [
        { id: "out-ir-yes", label: "Yes", price: 0.14, priceChange24h: -0.02 },
        { id: "out-ir-no", label: "No", price: 0.87, priceChange24h: 0.02 },
      ],
      volume24h: 1_500_000,
      liquidity: 900_000,
      endDate: "2026-06-30T00:00:00Z",
      resolved: false,
    },
  ],
};

// ─── Politics: Israel-Syria ───
export const israelSyriaEvent: Event = {
  id: "evt-israel-syria",
  slug: "israel-syria-agreement",
  title: "以色列 x 叙利亚 安全 协议 由......?",
  description: "Israel-Syria security agreement timeline",
  category: "politics",
  endDate: "2026-06-30T00:00:00Z",
  volume: 767_200,
  markets: [
    {
      id: "mkt-is-jun30",
      slug: "israel-syria-jun30",
      question: "Agreement by June 30?",
      outcomes: [
        { id: "out-is-j30-yes", label: "六月30", price: 0.08, priceChange24h: 0.01 },
        { id: "out-is-j30-no", label: "No", price: 0.92, priceChange24h: -0.01 },
      ],
      volume24h: 80_000,
      liquidity: 50_000,
      endDate: "2026-06-30T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-is-mar31",
      slug: "israel-syria-mar31",
      question: "Agreement by March 31?",
      outcomes: [
        { id: "out-is-m31-yes", label: "三月31日", price: 0.0, priceChange24h: 0.0 },
        { id: "out-is-m31-no", label: "No", price: 1.0, priceChange24h: 0.0 },
      ],
      volume24h: 0,
      liquidity: 0,
      endDate: "2026-03-31T00:00:00Z",
      resolved: true,
      resolution: "No",
    },
  ],
};

// ─── Politics: France election ───
export const franceElectionEvent: Event = {
  id: "evt-france-election",
  slug: "france-election",
  title: "法国选举由...?",
  description: "French election timeline",
  category: "politics",
  endDate: "2026-12-31T00:00:00Z",
  volume: 1_055_900,
  markets: [
    {
      id: "mkt-fr-jun30",
      slug: "france-election-jun30",
      question: "French election by June 30, 2026?",
      outcomes: [
        { id: "out-fr-j30-yes", label: "2026年6月30日", price: 0.02, priceChange24h: 0.0 },
        { id: "out-fr-j30-no", label: "No", price: 0.98, priceChange24h: 0.0 },
      ],
      volume24h: 50_000,
      liquidity: 30_000,
      endDate: "2026-06-30T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-fr-dec31",
      slug: "france-election-dec31",
      question: "French election by Dec 31, 2025?",
      outcomes: [
        { id: "out-fr-d31-yes", label: "2025年12月31日", price: 0.0, priceChange24h: 0.0 },
        { id: "out-fr-d31-no", label: "No", price: 1.0, priceChange24h: 0.0 },
      ],
      volume24h: 0,
      liquidity: 0,
      endDate: "2025-12-31T00:00:00Z",
      resolved: true,
      resolution: "No",
    },
  ],
};

// ─── Culture: Taylor Swift x Travis Kelce ───
export const taylorSwiftEvent: Event = {
  id: "evt-taylor-travis",
  slug: "taylor-travis-breakup",
  title: "泰勒·斯威夫特 x 特拉维斯·凯尔斯通过...?",
  description: "Will Taylor Swift and Travis Kelce break up?",
  category: "culture",
  endDate: "2026-06-30T00:00:00Z",
  volume: 222_900,
  markets: [
    {
      id: "mkt-tt-jun30",
      slug: "taylor-travis-jun30",
      question: "Break up by June 30?",
      outcomes: [
        { id: "out-tt-j30-yes", label: "六月 30", price: 0.08, priceChange24h: -0.01 },
        { id: "out-tt-j30-no", label: "No", price: 0.92, priceChange24h: 0.01 },
      ],
      volume24h: 30_000,
      liquidity: 20_000,
      endDate: "2026-06-30T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-tt-oct31",
      slug: "taylor-travis-oct31",
      question: "Break up by October 31?",
      outcomes: [
        { id: "out-tt-o31-yes", label: "October 31", price: 0.0, priceChange24h: 0.0 },
        { id: "out-tt-o31-no", label: "No", price: 1.0, priceChange24h: 0.0 },
      ],
      volume24h: 0,
      liquidity: 0,
      endDate: "2025-10-31T00:00:00Z",
      resolved: true,
      resolution: "No",
    },
  ],
};

// ─── Crypto: Abstract token ───
export const abstractTokenEvent: Event = {
  id: "evt-abstract-token",
  slug: "abstract-token-launch",
  title: "Abstract会在__发布代币吗?",
  description: "Will Abstract launch their token?",
  category: "crypto",
  endDate: "2026-12-31T00:00:00Z",
  volume: 482_900,
  markets: [
    {
      id: "mkt-abs-dec31",
      slug: "abstract-dec31-2026",
      question: "Abstract token by Dec 31, 2026?",
      outcomes: [
        { id: "out-abs-d26-yes", label: "2026年12月31日", price: 0.33, priceChange24h: 0.02 },
        { id: "out-abs-d26-no", label: "No", price: 0.67, priceChange24h: -0.02 },
      ],
      volume24h: 60_000,
      liquidity: 40_000,
      endDate: "2026-12-31T00:00:00Z",
      resolved: false,
    },
    {
      id: "mkt-abs-dec25",
      slug: "abstract-dec31-2025",
      question: "Abstract token by Dec 31, 2025?",
      outcomes: [
        { id: "out-abs-d25-yes", label: "2025年12月31日", price: 0.0, priceChange24h: 0.0 },
        { id: "out-abs-d25-no", label: "No", price: 1.0, priceChange24h: 0.0 },
      ],
      volume24h: 0,
      liquidity: 0,
      endDate: "2025-12-31T00:00:00Z",
      resolved: true,
      resolution: "No",
    },
  ],
};

export const allEvents: Event[] = [
  fedRateEvent,
  hormuzEvent,
  wtiEvent,
  aiModelEvent,
  nbaPlayoffsEvent,
  iranUraniumEvent,
  patekEvent,
  iranRegimeEvent,
  israelSyriaEvent,
  franceElectionEvent,
  taylorSwiftEvent,
  abstractTokenEvent,
  presidentEvent,
  btcEvent,
  nbaEvent,
];
