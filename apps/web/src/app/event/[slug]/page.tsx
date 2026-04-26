"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { MarketHeader } from "@/components/market/MarketHeader";
import { ChartArea } from "@/components/market/ChartArea";
import { TimeSlotNav } from "@/components/market/TimeSlotNav";
import { MultiMarketList } from "@/components/market/MultiMarketList";
import { TradingPanel } from "@/components/market/TradingPanel";
import { RelatedMarkets } from "@/components/market/RelatedMarkets";
import { OrderBookSection } from "@/components/market/OrderBookSection";
import { MarketTabs } from "@/components/market/MarketTabs";
import { SignalPanel } from "@/components/market/SignalPanel";
import {
  getEventBySlug,
  getOrderBook,
  getRecentTrades,
  getWhaleEvents,
  getSmartMoneySummary,
  getPriceHistory,
} from "@/services/market";
import type {
  Event,
  Market,
  OrderBook as OrderBookType,
  Trade,
  WhaleEvent,
  SmartMoneySummary,
  PricePoint,
} from "@/types/market";

export default function EventPage() {
  const params = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBookType | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [whaleEvents, setWhaleEvents] = useState<WhaleEvent[]>([]);
  const [smartMoney, setSmartMoney] = useState<SmartMoneySummary | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);

  useEffect(() => {
    getEventBySlug(params.slug).then((e) => {
      if (e) {
        setEvent(e);
        setSelectedMarket(e.markets[0] ?? null);
      }
    });
  }, [params.slug]);

  useEffect(() => {
    if (!selectedMarket) return;
    const id = selectedMarket.id;
    getOrderBook(id).then(setOrderBook);
    getRecentTrades(id).then(setTrades);
    getWhaleEvents(id).then(setWhaleEvents);
    getSmartMoneySummary(id).then(setSmartMoney);
    getPriceHistory(id).then(setPriceHistory);
  }, [selectedMarket]);

  if (!event || !selectedMarket) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  const isMultiMarket = event.markets.length > 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-[1280px] px-4 pt-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div className="min-w-0">
            <MarketHeader event={event} market={selectedMarket} />

            {/* Chart */}
            <ChartArea data={priceHistory} market={selectedMarket} event={event} />

            {/* Time slots + legend + volume bar + time range */}
            <TimeSlotNav
              event={event}
              selectedMarket={selectedMarket}
              onSelectMarket={setSelectedMarket}
            />

            {/* Multi-market list (Polymarket-style) */}
            {isMultiMarket && (
              <MultiMarketList
                event={event}
                selectedMarket={selectedMarket}
                onSelectMarket={setSelectedMarket}
              />
            )}

            {/* Order book */}
            {orderBook && (
              <OrderBookSection data={orderBook} volume={selectedMarket.volume24h} />
            )}

            {/* Tabs: rules, comments, holders, positions, activity */}
            <MarketTabs
              event={event}
              market={selectedMarket}
              trades={trades}
              smartMoney={smartMoney}
              whaleEvents={whaleEvents}
            />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <TradingPanel event={event} market={selectedMarket} />
          </div>
        </div>
      </div>
    </div>
  );
}
