"use client";

import type { Event, Market } from "@/types/market";
import { Code, Share2, Bookmark } from "lucide-react";

const categoryLabels: Record<string, string> = {
  crypto: "加密",
  politics: "政治",
  sports: "体育",
  culture: "文化",
  science: "科学",
  economy: "经济",
  finance: "财务",
  weather: "天气",
  other: "其他",
};

const subcategoryLabels: Record<string, string> = {
  crypto: "数字货币",
  politics: "国际政治",
  sports: "体育赛事",
  culture: "流行文化",
  science: "科技前沿",
  economy: "经济政策",
  finance: "金融市场",
  weather: "天气预测",
  other: "其他",
};

export function MarketHeader({
  event,
}: {
  event: Event;
  market: Market;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-start gap-4">
        {/* Event image */}
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          {/* Category breadcrumb */}
          <div className="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>{categoryLabels[event.category] ?? "其他"}</span>
            <span>·</span>
            <span>{subcategoryLabels[event.category] ?? "其他"}</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">{event.title}</h1>
            <div className="flex items-center gap-1">
              <button className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                <Code className="h-4 w-4" />
              </button>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
