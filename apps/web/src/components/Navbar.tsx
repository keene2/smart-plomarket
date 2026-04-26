"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const categories = [
  { label: "热门", icon: "📈" },
  { label: "突发", icon: "" },
  { label: "最新", icon: "" },
  null, // divider
  { label: "政治", icon: "" },
  { label: "体育", icon: "" },
  { label: "加密", icon: "" },
  { label: "电竞", icon: "" },
  { label: "财务", icon: "" },
  { label: "科技", icon: "" },
  { label: "文化", icon: "" },
  { label: "经济", icon: "" },
  { label: "天气", icon: "" },
] as const;

export function Navbar() {
  return (
    <header className="border-b border-border bg-card">
      {/* Top bar */}
      <nav className="flex h-12 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-foreground">
          <span className="text-sm font-bold tracking-tight">ORACLE</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">Smart Polymarket</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </nav>

      {/* Category bar */}
      <div className="scrollbar-none flex items-center gap-0.5 overflow-x-auto border-t border-border px-4 py-1.5">
        {categories.map((cat, i) => {
          if (!cat) {
            return (
              <div key={`div-${i}`} className="mx-2 h-4 w-px shrink-0 bg-border" />
            );
          }
          return (
            <button
              key={cat.label}
              className="shrink-0 rounded-md px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {cat.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
