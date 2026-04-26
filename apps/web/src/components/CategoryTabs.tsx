"use client";

import { cn } from "@/lib/utils";

const categories = [
  { key: "all", label: "全部" },
  { key: "trending", label: "突发" },
  { key: "crypto", label: "加密货币" },
  { key: "sports", label: "体育" },
  { key: "politics", label: "地缘政治" },
  { key: "science", label: "科技" },
  { key: "economy", label: "经济" },
  { key: "finance", label: "金融" },
  { key: "culture", label: "文化" },
  { key: "weather", label: "天气" },
];

interface CategoryTabsProps {
  active: string;
  onChange: (key: string) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-border">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={cn(
            "whitespace-nowrap px-3 py-2.5 text-sm transition-colors",
            active === cat.key
              ? "border-b-2 border-foreground font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
