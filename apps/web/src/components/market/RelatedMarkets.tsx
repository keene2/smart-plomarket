"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/market";
import { allEvents } from "@/mock/markets";

const periodTabs = ["5分钟", "15分钟", "1天"] as const;

export function RelatedMarkets({
  event,
  currentMarketId,
}: {
  event: Event;
  currentMarketId: string;
}) {
  const [activePeriod, setActivePeriod] = useState<string>("15分钟");

  // Show other events as "related"
  const related = allEvents
    .filter((e) => e.id !== event.id)
    .flatMap((e) =>
      e.markets.map((m) => ({
        eventSlug: e.slug,
        title: `${e.title}`,
        question: m.question,
        yesPrice: m.outcomes.find((o) => o.label.toLowerCase() === "yes")?.price ?? 0,
        category: e.category,
        imageUrl: e.imageUrl,
      }))
    )
    .slice(0, 5);

  const categoryIcons: Record<string, string> = {
    crypto: "₿",
    politics: "🏛",
    sports: "⚽",
    culture: "🎭",
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Period tabs */}
      <div className="flex gap-1 border-b border-border px-4 py-2">
        {periodTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActivePeriod(tab)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activePeriod === tab
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Related market list */}
      <div className="divide-y divide-border">
        {related.map((r, i) => (
          <Link
            key={i}
            href={`/event/${r.eventSlug}`}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
              {categoryIcons[r.category] ?? "📊"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {r.title}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  r.yesPrice > 0.5 ? "bg-yes" : "bg-no"
                )}
              />
              <span className="text-sm font-semibold text-foreground">
                {(r.yesPrice * 100).toFixed(0)}%
              </span>
              <span className="text-xs text-muted-foreground">
                {r.yesPrice > 0.5 ? "Up" : "Down"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
