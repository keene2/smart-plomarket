"use client";

import Link from "next/link";
import { Star, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/market";

function formatVolume(n: number): string {
  if (n >= 100_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `$${(n / 10_000).toFixed(1)}万`;
  return `$${n}`;
}

function formatMultiplier(price: number): string {
  if (price <= 0) return "--";
  const m = 1 / price;
  if (m >= 100) return `${Math.round(m)}x`;
  return `${m.toFixed(1)}x`;
}

interface FeaturedHeroProps {
  event: Event;
}

export function FeaturedHero({ event }: FeaturedHeroProps) {
  const topMarkets = event.markets.slice(0, 4);

  return (
    <Link
      href={`/event/${event.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50"
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Featured</span>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="text-muted-foreground/30 transition-colors hover:text-foreground"
        >
          <Star className="h-3.5 w-3.5" />
        </button>
      </div>

      <h2 className="mb-1 text-lg font-semibold text-card-foreground">
        {event.title}
      </h2>
      <p className="mb-5 text-xs text-muted-foreground">
        {formatVolume(event.volume)} vol · {event.markets.length} markets
      </p>

      <div className="flex gap-6">
        {/* Chart placeholder */}
        <div className="hidden flex-1 items-center justify-center rounded-md border border-dashed border-border sm:flex">
          <span className="text-xs text-muted-foreground/40">Chart</span>
        </div>

        {/* Outcomes */}
        <div className="w-full space-y-2 sm:w-[260px]">
          {topMarkets.map((market) => {
            const outcome = market.outcomes[0];
            if (!outcome) return null;
            const pct = Math.round(outcome.price * 100);
            const change = outcome.priceChange24h;
            return (
              <div key={market.id} className="flex items-baseline justify-between rounded-md bg-muted/50 px-3 py-2">
                <span className="text-sm text-card-foreground">{outcome.label}</span>
                <div className="flex items-baseline gap-2 tabular-nums">
                  {change !== 0 && (
                    <span className={cn("text-[11px]", change > 0 ? "text-yes" : "text-no")}>
                      {change > 0 ? "+" : ""}{(change * 100).toFixed(1)}%
                    </span>
                  )}
                  <span className={cn("text-sm font-semibold", pct >= 50 ? "text-yes" : "text-no")}>
                    {pct > 0 ? `${pct}%` : "<1%"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
        <span>查看详情</span>
        <ArrowUpRight className="h-3 w-3" />
      </div>
    </Link>
  );
}
