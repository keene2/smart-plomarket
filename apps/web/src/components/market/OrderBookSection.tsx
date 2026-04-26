"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { OrderBook } from "@/types/market";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function formatSize(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function OrderBookSection({
  data,
  volume,
}: {
  data: OrderBook;
  volume: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const maxTotal = Math.max(
    ...data.bids.map((b) => b.total),
    ...data.asks.map((a) => a.total)
  );

  return (
    <div className="mt-4 rounded-xl border border-border bg-card">
      {/* Collapsible header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">订单簿</span>
          <Info className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {formatVolume(volume)} 交易量
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-4 py-3">
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Bids */}
            <div>
              <div className="mb-1.5 grid grid-cols-2 font-medium text-muted-foreground">
                <span>价格</span>
                <span className="text-right">数量</span>
              </div>
              {data.bids.map((bid, i) => (
                <div key={i} className="relative grid grid-cols-2 py-0.5">
                  <div
                    className="absolute inset-y-0 left-0 bg-yes/8"
                    style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                  />
                  <span className="relative font-mono text-yes">
                    {(bid.price * 100).toFixed(1)}¢
                  </span>
                  <span className="relative text-right font-mono text-muted-foreground">
                    {formatSize(bid.size)}
                  </span>
                </div>
              ))}
            </div>

            {/* Asks */}
            <div>
              <div className="mb-1.5 grid grid-cols-2 font-medium text-muted-foreground">
                <span>价格</span>
                <span className="text-right">数量</span>
              </div>
              {data.asks.map((ask, i) => (
                <div key={i} className="relative grid grid-cols-2 py-0.5">
                  <div
                    className="absolute inset-y-0 right-0 bg-no/8"
                    style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                  />
                  <span className="relative font-mono text-no">
                    {(ask.price * 100).toFixed(1)}¢
                  </span>
                  <span className="relative text-right font-mono text-muted-foreground">
                    {formatSize(ask.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 text-center text-xs text-muted-foreground">
            Spread: {(data.spread * 100).toFixed(1)}¢
          </div>
        </div>
      )}
    </div>
  );
}
