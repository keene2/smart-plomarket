"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/market";

function formatVolume(n: number): string {
  if (n >= 100_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `$${(n / 10_000).toFixed(1)}万`;
  return `$${n}`;
}

interface TrendingSidebarProps {
  events: Event[];
}

export function TrendingSidebar({ events }: TrendingSidebarProps) {
  const trending = [...events]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Trending
      </h3>

      <div className="space-y-0.5">
        {trending.map((event, i) => {
          const topOutcome = event.markets[0]?.outcomes[0];
          const pct = topOutcome ? Math.round(topOutcome.price * 100) : 0;

          return (
            <Link
              key={event.id}
              href={`/event/${event.slug}`}
              className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50"
            >
              <span className="w-4 text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-card-foreground">
                  {event.title}
                </p>
                <p className="text-[11px] tabular-nums text-muted-foreground">
                  {formatVolume(event.volume)}
                </p>
              </div>
              {topOutcome && pct > 0 && (
                <span
                  className={cn(
                    "text-xs font-semibold tabular-nums",
                    pct >= 50 ? "text-yes" : "text-no"
                  )}
                >
                  {pct}%
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
