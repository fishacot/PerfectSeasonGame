"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { applyTheme, readTheme, type Theme } from "@/lib/theme";

const THEMES: Theme[] = ["dark", "light"];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readTheme());
    setMounted(true);
  }, []);

  const select = (next: Theme) => {
    applyTheme(next);
    setTheme(next);
  };

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-border/50 bg-surface/50 p-0.5"
      role="group"
      aria-label="Theme"
    >
      {THEMES.map((t) => {
        // ponytail: avoid SSR/localStorage mismatch until mounted
        const active = mounted && theme === t;
        const Icon = t === "dark" ? Moon : Sun;
        return (
          <button
            key={t}
            type="button"
            aria-pressed={active}
            aria-label={t === "dark" ? "Dark theme" : "Light theme"}
            title={t === "dark" ? "Dark" : "Light"}
            onClick={() => select(t)}
            className={`rounded-md p-1.5 transition-all sm:p-2 ${
              active
                ? "bg-sport/20 text-sport shadow-sm"
                : "text-muted hover:bg-surface-hover hover:text-text"
            }`}
          >
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.25} />
          </button>
        );
      })}
    </div>
  );
}
