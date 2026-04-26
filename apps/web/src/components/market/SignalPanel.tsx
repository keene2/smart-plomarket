"use client";

import { cn } from "@/lib/utils";
import type { SmartMoneySummary, WhaleEvent } from "@/types/market";
import { Fish, Crown, ArrowUpRight, ArrowDownRight } from "lucide-react";

const tagStyles: Record<string, string> = {
  whale: "bg-whale/10 text-whale",
  kol: "bg-kol/10 text-kol",
  smart_money: "bg-interactive/10 text-interactive",
  institution: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  new: "bg-secondary text-secondary-foreground",
};

function formatAmount(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ─── Direction Bar ───
function DirectionBar({ summary }: { summary: SmartMoneySummary }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Smart Money Direction</span>
        <span>
          <Fish className="mr-1 inline h-3 w-3 text-whale" />
          {summary.whaleCount} whales · <Crown className="mr-1 inline h-3 w-3 text-kol" />
          {summary.kolCount} KOLs
        </span>
      </div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className="bg-yes transition-all"
          style={{ width: `${summary.yesPercent}%` }}
        />
        <div
          className="bg-no transition-all"
          style={{ width: `${summary.noPercent}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs font-medium">
        <span className="text-yes">Yes {summary.yesPercent}%</span>
        <span className="text-no">No {summary.noPercent}%</span>
      </div>
    </div>
  );
}

// ─── Whale Feed ───
function WhaleFeed({ events }: { events: WhaleEvent[] }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-medium text-muted-foreground">Whale Activity</h4>
      <div className="space-y-2">
        {events.slice(0, 5).map((e) => (
          <div
            key={e.id}
            className="flex items-start gap-2 rounded-md bg-muted/50 px-2.5 py-2 text-sm"
          >
            <div className="mt-0.5">
              {e.action === "buy" ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-yes" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-no" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-mono text-xs text-foreground">
                  {e.addressLabel ?? e.address}
                </span>
                {e.tags.map((t) => (
                  <span
                    key={t}
                    className={cn(
                      "rounded px-1 py-0.5 text-[10px] font-medium",
                      tagStyles[t] ?? tagStyles.new
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {e.action === "buy" ? "Bought" : "Sold"}{" "}
                <span className={e.outcome === "Yes" ? "text-yes" : "text-no"}>
                  {e.outcome}
                </span>{" "}
                · {formatAmount(e.amount)} @ {(e.price * 100).toFixed(0)}¢
                {e.pnl !== undefined && (
                  <span className={cn("ml-1", e.pnl >= 0 ? "text-yes" : "text-no")}>
                    ({e.pnl >= 0 ? "+" : ""}
                    {formatAmount(Math.abs(e.pnl))})
                  </span>
                )}
              </div>
            </div>
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {timeAgo(e.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SignalPanel({
  summary,
  whaleEvents,
}: {
  summary: SmartMoneySummary;
  whaleEvents: WhaleEvent[];
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">Smart Money Signals</h3>
      <DirectionBar summary={summary} />
      <WhaleFeed events={whaleEvents} />
    </div>
  );
}
