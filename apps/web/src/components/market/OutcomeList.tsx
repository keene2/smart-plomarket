"use client";

import { cn } from "@/lib/utils";
import type { Event, Market } from "@/types/market";

function formatPercent(n: number): string {
  const pct = (n * 100).toFixed(1);
  return `${pct}%`;
}

function formatChange(n: number): string {
  const pct = (n * 100).toFixed(1);
  return n >= 0 ? `+${pct}%` : `${pct}%`;
}

export function OutcomeList({
  event,
  selectedMarket,
  onSelectMarket,
}: {
  event: Event;
  selectedMarket: Market;
  onSelectMarket: (market: Market) => void;
}) {
  const isMultiMarket = event.markets.length > 1;

  if (!isMultiMarket) {
    // Binary market: show YES/NO inline
    const outcomes = selectedMarket.outcomes;
    return (
      <div className="flex gap-2 border-b border-border bg-card px-6 py-3">
        {outcomes.map((o) => {
          const isYes = o.label.toLowerCase() === "yes";
          return (
            <div
              key={o.id}
              className={cn(
                "flex flex-1 items-center justify-between rounded-lg border px-4 py-3",
                isYes
                  ? "border-yes/20 bg-yes/5"
                  : "border-no/20 bg-no/5"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                    isYes
                      ? "bg-yes text-yes-foreground"
                      : "bg-no text-no-foreground"
                  )}
                >
                  {isYes ? "Y" : "N"}
                </span>
                <span className="font-medium text-foreground">{o.label}</span>
              </div>
              <div className="text-right">
                <div className={cn("text-lg font-semibold", isYes ? "text-yes" : "text-no")}>
                  {formatPercent(o.price)}
                </div>
                <div
                  className={cn(
                    "text-xs",
                    o.priceChange24h >= 0 ? "text-yes" : "text-no"
                  )}
                >
                  {formatChange(o.priceChange24h)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Multi-market: show all candidates as a sortable list
  const candidates = event.markets.map((m) => {
    const yes = m.outcomes.find((o) => o.label.toLowerCase() === "yes");
    return { market: m, price: yes?.price ?? 0, change: yes?.priceChange24h ?? 0 };
  });
  candidates.sort((a, b) => b.price - a.price);

  return (
    <div className="border-b border-border bg-card">
      <div className="grid grid-cols-[1fr_80px_80px] gap-2 px-6 py-2 text-xs font-medium text-muted-foreground">
        <span>Outcome</span>
        <span className="text-right">Prob</span>
        <span className="text-right">24h</span>
      </div>
      {candidates.map(({ market: m, price, change }) => {
        const isSelected = m.id === selectedMarket.id;
        // Extract candidate name from question
        const name = m.question
          .replace(/^Will\s+/i, "")
          .replace(/\s+win.*$/i, "")
          .replace(/\?$/, "");
        return (
          <button
            key={m.id}
            onClick={() => onSelectMarket(m)}
            className={cn(
              "grid w-full grid-cols-[1fr_80px_80px] gap-2 px-6 py-2.5 text-left text-sm transition-colors",
              "hover:bg-accent",
              isSelected && "bg-accent"
            )}
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor: `hsl(var(--interactive))`,
                  opacity: 0.3 + price * 0.7,
                }}
              />
              <span className={cn("truncate", isSelected ? "font-medium text-foreground" : "text-foreground")}>
                {name}
              </span>
            </span>
            <span className="text-right font-mono font-medium text-foreground">
              {formatPercent(price)}
            </span>
            <span
              className={cn(
                "text-right font-mono text-xs",
                change >= 0 ? "text-yes" : "text-no"
              )}
            >
              {formatChange(change)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
