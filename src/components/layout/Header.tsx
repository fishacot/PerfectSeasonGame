"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { getDictionary, locales } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/types";

interface HeaderProps {
  locale: Locale;
}

function swapLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }
  return `/${target}${pathname === "/" ? "" : pathname}`;
}

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const dict = getDictionary(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-bg/85 backdrop-blur-2xl">
      <div className="page-shell flex items-center justify-between gap-3 py-3 sm:gap-4 sm:py-4">
        <Link href={`/${locale}`} className="group flex min-w-0 items-center gap-2.5 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface transition-all duration-300 group-hover:scale-105 sm:h-12 sm:w-12 sm:rounded-2xl">
            <span className="font-display text-2xl text-text sm:text-3xl">P</span>
          </div>
          <div className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-xl tracking-tighter text-text sm:text-3xl">
              PERFECT<span className="ml-[0.12em] opacity-60">SEASON</span>
            </span>
            <span className="mt-0.5 hidden text-[10px] font-black uppercase tracking-[0.25em] text-muted md:block">
              {dict.taglineHero}
            </span>
          </div>
        </Link>

        <nav className="flex shrink-0 items-center gap-1 rounded-xl border border-border/50 bg-surface/70 p-1 backdrop-blur-md sm:gap-1.5 sm:rounded-2xl sm:p-1.5">
          <Link
            href={`/${locale}/privacy`}
            className="hidden rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted transition-all hover:bg-surface-hover hover:text-text md:block lg:px-4 lg:py-2"
          >
            {dict.privacy}
          </Link>
          <Link
            href={`/${locale}/how-to-play`}
            className="hidden rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted transition-all hover:bg-surface-hover hover:text-text md:block lg:px-4 lg:py-2"
          >
            {dict.howToPlay}
          </Link>
          <div className="mx-0.5 hidden h-4 w-px bg-border md:block" />
          <ThemeToggle />
          <div className="mx-0.5 hidden h-4 w-px bg-border sm:block" />
          {locales.map((loc) => (
            <Link
              key={loc}
              href={swapLocalePath(pathname, loc)}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all sm:rounded-xl sm:px-4 sm:py-2 ${
                loc === locale
                  ? "bg-sport/20 text-sport shadow-sm"
                  : "text-muted hover:bg-surface-hover hover:text-text"
              }`}
            >
              {loc}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
