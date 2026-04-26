"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Event, Market, Trade, SmartMoneySummary, WhaleEvent } from "@/types/market";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type TabKey = "rules" | "comments" | "holders" | "positions" | "activity";

const tabs: { key: TabKey; label: string; count?: number }[] = [
  { key: "rules", label: "规则" },
  { key: "comments", label: "评论" },
  { key: "holders", label: "顶级持仓者" },
  { key: "positions", label: "持仓" },
  { key: "activity", label: "动态" },
];

function formatAmount(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}分钟`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时`;
  return `${Math.floor(hours / 24)}天`;
}

const tagStyles: Record<string, string> = {
  whale: "bg-whale/10 text-whale",
  kol: "bg-kol/10 text-kol",
  smart_money: "bg-interactive/10 text-interactive",
  institution: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  new: "bg-secondary text-secondary-foreground",
};

export function MarketTabs({
  event,
  market,
  trades,
  smartMoney,
  whaleEvents,
}: {
  event: Event;
  market: Market;
  trades: Trade[];
  smartMoney: SmartMoneySummary | null;
  whaleEvents: WhaleEvent[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("rules");

  return (
    <div className="mt-4">
      {/* Tab headers */}
      <div className="flex gap-0 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.key === "comments" && (
              <span className="ml-1 text-muted-foreground">(128)</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-4">
        {activeTab === "rules" && (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{event.description}</p>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs">
                <span className="text-foreground">市场开放时间：</span>{" "}
                {new Date(market.endDate).toLocaleDateString("zh-CN")}
              </p>
            </div>
          </div>
        )}

        {activeTab === "holders" && smartMoney && (
          <div className="space-y-2">
            {smartMoney.topHolders.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {h.label ?? h.address}
                    </span>
                    <div className="flex gap-1">
                      {h.tags.map((t) => (
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
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <span className={h.position === "yes" ? "text-yes" : "text-no"}>
                      {h.position === "yes" ? "Yes" : "No"}
                    </span>
                    <span className="font-mono text-foreground">
                      {formatAmount(h.shares)}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-mono",
                      h.pnl >= 0 ? "text-yes" : "text-no"
                    )}
                  >
                    {h.pnl >= 0 ? "+" : ""}
                    {formatAmount(Math.abs(h.pnl))} ({h.pnlPercent.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-2">
            {whaleEvents.map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-2.5 rounded-lg bg-muted/30 px-3 py-2.5"
              >
                <div className="mt-0.5">
                  {e.action === "buy" ? (
                    <ArrowUpRight className="h-4 w-4 text-yes" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-no" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground">
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
                  <p className="text-xs text-muted-foreground">
                    {e.action === "buy" ? "买入" : "卖出"}{" "}
                    <span className={e.outcome === "Yes" ? "text-yes" : "text-no"}>
                      {e.outcome}
                    </span>{" "}
                    · {formatAmount(e.amount)} @ {(e.price * 100).toFixed(0)}¢
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {timeAgo(e.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                placeholder="发表评论..."
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                disabled
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-50"
              >
                发布
              </button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              登录后可以发表评论
            </p>
          </div>
        )}

        {activeTab === "positions" && (
          <div className="text-center text-sm text-muted-foreground py-8">
            登录后查看你的持仓
          </div>
        )}
      </div>
    </div>
  );
}
