"use client";

import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { MarketCard } from "@/components/MarketCard";
import { FeaturedHero } from "@/components/FeaturedHero";
import { TrendingSidebar } from "@/components/TrendingSidebar";
import { getEvents } from "@/services/market";
import type { Event } from "@/types/market";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  // Featured event: highest volume
  const featuredEvent = useMemo(() => {
    if (events.length === 0) return null;
    return [...events].sort((a, b) => b.volume - a.volume)[0]!;
  }, [events]);

  const filtered = useMemo(() => {
    let result = events;
    // Exclude featured from grid
    if (featuredEvent && activeCategory === "all" && !search.trim()) {
      result = result.filter((e) => e.id !== featuredEvent.id);
    }
    if (activeCategory !== "all" && activeCategory !== "trending") {
      result = result.filter((e) => e.category === activeCategory);
    }
    if (activeCategory === "trending") {
      result = [...result].sort((a, b) => b.volume - a.volume).slice(0, 8);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.title.toLowerCase().includes(q));
    }
    return result;
  }, [events, activeCategory, search, featuredEvent]);

  const showHero = activeCategory === "all" && !search.trim() && featuredEvent;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Sub-header: search */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search markets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-input bg-background py-1.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mx-auto max-w-7xl px-6">
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </div>

      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Hero section: Featured + Trending sidebar */}
        {showHero && (
          <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
            <FeaturedHero event={featuredEvent} />
            <TrendingSidebar events={events} />
          </div>
        )}

        {/* Section header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {showHero ? "全部市场" : activeCategory === "trending" ? "热门市场" : "市场"}
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {filtered.length} 个市场
          </span>
        </div>

        {/* Market grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((event) => (
            <MarketCard key={event.id} event={event} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-sm text-muted-foreground">
            没有找到相关市场
          </div>
        )}
      </main>
    </div>
  );
}
