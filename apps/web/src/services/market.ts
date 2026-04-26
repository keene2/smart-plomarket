import {
  allEvents,
  mockOrderBook,
  mockTrades,
  mockWhaleEvents,
  mockSmartMoney,
  mockPriceHistory,
} from "@/mock/markets";
import type {
  Event,
  Market,
  OrderBook,
  Trade,
  WhaleEvent,
  SmartMoneySummary,
  PricePoint,
} from "@/types/market";

// Service layer: swap these implementations for real API calls later.
// Only change this file, components stay untouched.

export async function getEvents(): Promise<Event[]> {
  return allEvents;
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  return allEvents.find((e) => e.slug === slug);
}

export async function getMarketById(marketId: string): Promise<Market | undefined> {
  for (const event of allEvents) {
    const market = event.markets.find((m) => m.id === marketId);
    if (market) return market;
  }
  return undefined;
}

export async function getOrderBook(_marketId: string): Promise<OrderBook> {
  return mockOrderBook;
}

export async function getRecentTrades(_marketId: string): Promise<Trade[]> {
  return mockTrades;
}

export async function getWhaleEvents(_marketId: string): Promise<WhaleEvent[]> {
  return mockWhaleEvents;
}

export async function getSmartMoneySummary(_marketId: string): Promise<SmartMoneySummary> {
  return mockSmartMoney;
}

export async function getPriceHistory(_marketId: string): Promise<PricePoint[]> {
  return mockPriceHistory;
}
