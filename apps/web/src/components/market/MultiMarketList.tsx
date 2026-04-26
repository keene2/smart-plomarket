"use client";

import { cn } from "@/lib/utils";
import type { Event, Market } from "@/types/market";
import { ArrowUp, ArrowDown } from "lucide-react";

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  if (n >= 1_000) return `$${Math.round(n / 1_000).toLocaleString()},${String(n % 1_000).padStart(3, "0")}`;
  return `$${n.toLocaleString()}`;
}

function getOutcomeName(market: Market): string {
  const yes = market.outcomes.find((o) => o.label.toLowerCase() !== "no");
  return yes?.label ?? market.question;
}

function getYesPrice(market: Market): number {
  const yes = market.outcomes.find((o) => o.label.toLowerCase() !== "no");
  return yes?.price ?? 0;
}

function getNoPrice(market: Market): number {
  const no = market.outcomes.find((o) => o.label.toLowerCase() === "no");
  return no?.price ?? 0;
}

function getChange(market: Market): number {
  const yes = market.outcomes.find((o) => o.label.toLowerCase() !== "no");
  return yes?.priceChange24h ?? 0;
}

export function MultiMarketList({
  event,
  selectedMarket,
  onSelectMarket,
}: {
  event: Event;
  selectedMarket: Market;
  onSelectMarket: (market: Market) => void;
}) {
  if (event.markets.length <= 1) return null;

  const markets = [...event.markets].sort((a, b) => getYesPrice(b) - getYesPrice(a));

  return (
    <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
      {markets.map((m) => {
        const yesPrice = getYesPrice(m);
        const noPrice = getNoPrice(m);
        const change = getChange(m);
        const pctStr = yesPrice >= 0.01 ? `${Math.round(yesPrice * 100)}%` : "<1%";
        const changeStr = `${Math.abs(Math.round(change * 100))}%`;
        const isSelected = m.id === selectedMarket.id;
        const yesCents = Math.max(0.1, yesPrice * 100).toFixed(1);
        const noCents = Math.max(0.1, noPrice * 100).toFixed(1);

        return (
          <div
            key={m.id}
            onClick={() => onSelectMarket(m)}
            className={cn(
              "flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/50",
              isSelected && "bg-accent/30"
            )}
          >
            {/* Name + volume */}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground">
                {getOutcomeName(m)}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                ${m.volume24h.toLocaleString()} 交易量
              </div>
            </div>

            {/* Probability */}
            <div className="w-20 text-right">
              <div className="text-2xl font-bold text-foreground">{pctStr}</div>
            </div>

            {/* Change */}
            <div className="w-16 text-right">
              <div className={cn(
                "flex items-center justify-end gap-0.5 text-sm font-medium",
                change >= 0 ? "text-yes" : "text-no"
              )}>
                {change >= 0 ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {changeStr}
              </div>
            </div>

            {/* Buy Yes button */}
            <button
              onClick={(e) => { e.stopPropagation(); }}
              className={cn(
                "w-[120px] rounded-xl border px-3 py-2 text-center text-sm font-medium text-yes transition-colors",
                isSelected
                  ? "border-yes bg-yes/10 text-yes hover:bg-yes/15"
                  : "border-foreground/15 bg-transparent text-yes hover:bg-foreground/[0.04]"
              )}
            >
              是 {yesCents}¢
            </button>

            {/* Buy No button */}
            <button
              onClick={(e) => { e.stopPropagation(); }}
              className={cn(
                "w-[120px] rounded-xl border px-3 py-2 text-center text-sm font-medium text-no transition-colors",
                isSelected
                  ? "border-no bg-no/10 text-no hover:bg-no/15"
                  : "border-foreground/15 bg-transparent text-no hover:bg-foreground/[0.04]"
              )}
            >
              否 {noCents}¢
            </button>
          </div>
        );
      })}
    </div>
  );
}
