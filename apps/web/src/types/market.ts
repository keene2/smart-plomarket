export type EventCategory =
  | "politics"
  | "crypto"
  | "sports"
  | "culture"
  | "science"
  | "economy"
  | "finance"
  | "weather"
  | "other";

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: EventCategory;
  imageUrl?: string;
  endDate: string;
  volume: number;
  markets: Market[];
}

export interface Market {
  id: string;
  slug: string;
  question: string;
  outcomes: Outcome[];
  volume24h: number;
  liquidity: number;
  endDate: string;
  resolved: boolean;
  resolution?: string;
}

export interface Outcome {
  id: string;
  label: string;
  price: number;
  priceChange24h: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
}

export interface Trade {
  id: string;
  timestamp: string;
  side: "buy" | "sell";
  outcome: string;
  price: number;
  size: number;
  maker: string;
}

export interface WhaleEvent {
  id: string;
  timestamp: string;
  address: string;
  addressLabel?: string;
  action: "buy" | "sell";
  outcome: string;
  amount: number;
  price: number;
  pnl?: number;
  tags: WalletTag[];
}

export type WalletTag = "whale" | "kol" | "smart_money" | "institution" | "new";

export interface SmartMoneySummary {
  yesPercent: number;
  noPercent: number;
  whaleCount: number;
  kolCount: number;
  topHolders: HolderInfo[];
}

export interface HolderInfo {
  address: string;
  label?: string;
  tags: WalletTag[];
  position: "yes" | "no";
  shares: number;
  avgPrice: number;
  pnl: number;
  pnlPercent: number;
}

export interface PricePoint {
  time: number;
  value: number;
}

export interface UserPosition {
  marketId: string;
  outcome: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}
