"use client";

import Link from "next/link";
import { Bookmark, Share2 } from "lucide-react";
import type { Event } from "@/types/market";

function formatVolume(n: number): string {
  if (n >= 100_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `$${(n / 10_000).toFixed(1)}万`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function formatEndDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("zh-CN", { month: "long", day: "numeric" });
}

const categoryEmojis: Record<string, string> = {
  politics: "🏛️",
  crypto: "₿",
  sports: "⚽",
  culture: "🎭",
  science: "🔬",
  economy: "📊",
  finance: "💰",
  weather: "🌤️",
  other: "📌",
};

export function MarketCard({ event }: { event: Event }) {
  const displayMarkets = event.markets.filter((m) => !m.resolved).slice(0, 3);

  return (
    <Link
      href={`/event/${event.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:bg-accent/50"
    >
      {/* Header: icon + title */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
          {categoryEmojis[event.category] ?? "📌"}
        </div>
        <h3 className="text-sm font-semibold leading-snug text-card-foreground line-clamp-2">
          {event.title}
        </h3>
      </div>

      {/* Market rows */}
      <div className="mb-4 flex-1 space-y-2">
        {displayMarkets.map((market) => {
          const yesOutcome = market.outcomes[0];
          const noOutcome = market.outcomes[1];
          if (!yesOutcome) return null;
          const pct = Math.round(yesOutcome.price * 100);
          const yesCents = (yesOutcome.price * 100).toFixed(1);
          const noCents = noOutcome
            ? (noOutcome.price * 100).toFixed(1)
            : (100 - yesOutcome.price * 100).toFixed(1);

          return (
            <div
              key={market.id}
              className="flex items-center gap-2"
            >
              <span className="min-w-[4rem] text-xs tabular-nums text-muted-foreground">
                {formatEndDate(market.endDate)}
              </span>
              <div className="flex flex-1 items-center justify-end gap-2">
                <span className="text-sm font-semibold tabular-nums text-card-foreground">
                  {pct > 0 ? `${pct}%` : "<1%"}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="flex h-6 w-9 items-center justify-center rounded-md border text-[11px] font-medium transition-colors hover:bg-[hsl(var(--yes)/0.08)]"
                  style={{
                    borderColor: "hsl(var(--yes) / 0.3)",
                    color: "hsl(var(--yes))",
                  }}
                >
                  是
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="flex h-6 w-9 items-center justify-center rounded-md border text-[11px] font-medium transition-colors hover:bg-[hsl(var(--no)/0.08)]"
                  style={{
                    borderColor: "hsl(var(--no) / 0.3)",
                    color: "hsl(var(--no))",
                  }}
                >
                  否
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground tabular-nums">
        <span>{formatVolume(event.volume)} 交易量</span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="transition-colors hover:text-foreground"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="transition-colors hover:text-foreground"
          >
            <Bookmark className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
