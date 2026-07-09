"use client";

import type { SportId } from "@/lib/types";
import { createContext, useContext, type ReactNode } from "react";

const SportThemeContext = createContext<SportId | null>(null);

export function SportThemeProvider({
  sport,
  children,
}: {
  sport: SportId;
  children: ReactNode;
}) {
  return (
    <div data-sport={sport}>
      <SportThemeContext.Provider value={sport}>
        {children}
      </SportThemeContext.Provider>
    </div>
  );
}

export function useSportTheme(): SportId | null {
  return useContext(SportThemeContext);
}
