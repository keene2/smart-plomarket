"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/theme/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { mode, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2",
        "border border-border bg-background hover:bg-accent",
        "text-muted-foreground hover:text-foreground",
        "transition-colors"
      )}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
