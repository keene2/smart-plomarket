"use client";

import { cn } from "@/lib/utils";
import type { Event, Market } from "@/types/market";
import { ChevronDown, BarChart2, CandlestickChart, Settings } from "lucide-react";

// Matching chart colors
const LINE_COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(168, 100%, 35%)",
  "hsl(0, 100%, 67%)",
  "hsl(263, 70%, 58%)",
  "hsl(45, 93%, 47%)",
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function getOutcomeName(market: Market): string {
  const yes = market.outcomes.find((o) => o.label.toLowerCase() !== "no");
  return yes?.label ?? market.question;
}

function getYesPrice(market: Market): number {
  const yes = market.outcomes.find((o) => o.label.toLowerCase() !== "no");
  return yes?.price ?? 0;
}

export function TimeSlotNav({
  event,
  selectedMarket,
  onSelectMarket,
}: {
  event: Event;
  selectedMarket: Market;
  onSelectMarket: (market: Market) => void;
}) {
  const isMultiMarket = event.markets.length > 1;

  return (
    <div className="mt-3 space-y-3">
      {/* Row 1: Time slots + chart type toggles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent">
            过去
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* Date tabs from markets */}
          {event.markets.map((m) => {
            const isSelected = m.id === selectedMarket.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMarket(m)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {formatDate(m.endDate)}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <button className="rounded-md bg-accent p-1.5 text-foreground">
            <BarChart2 className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1.5 text-muted-foreground hover:text-foreground">
            <CandlestickChart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Legend (multi-market) */}
      {isMultiMarket && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {event.markets.map((m, i) => {
            const pct = getYesPrice(m);
            const pctStr = pct >= 0.01 ? `${(pct * 100).toFixed(1)}%` : "<1%";
            return (
              <button
                key={m.id}
                onClick={() => onSelectMarket(m)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: LINE_COLORS[i % LINE_COLORS.length] }}
                />
                <span>{getOutcomeName(m)}</span>
                <span className="font-mono font-medium text-foreground">{pctStr}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Row 3: Volume + date + time range */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>💰 ${(event.volume).toLocaleString()} 交易量</span>
          <span>|</span>
          <span>📅 {formatDate(event.endDate)}</span>
        </div>
        <div className="flex items-center gap-1">
          {["1小时", "6小时", "1天", "1周", "1个月", "全部"].map((range, i) => (
            <button
              key={range}
              className={cn(
                "rounded-md px-2 py-1 text-xs transition-colors",
                range === "全部"
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range}
            </button>
          ))}
          <button className="ml-1 rounded-md p-1 text-muted-foreground hover:text-foreground">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
