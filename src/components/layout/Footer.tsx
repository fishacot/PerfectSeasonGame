import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/types";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const dict = getDictionary(locale);

  return (
    <footer className="mt-auto border-t border-white/5 bg-surface/30 backdrop-blur-md">
      <div className="page-shell flex flex-col items-center py-8 sm:py-12">
        <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
          <div className="h-1 w-6 rounded-full bg-sport opacity-40 sm:w-8" />
          <p className="font-display text-lg tracking-[0.15em] text-muted uppercase sm:text-2xl sm:tracking-[0.2em]">
            PERFECT SEASON <span className="text-sport opacity-60">HUB</span>
          </p>
          <div className="h-1 w-6 rounded-full bg-sport opacity-40 sm:w-8" />
        </div>

        <p className="max-w-2xl text-center text-[9px] font-bold uppercase leading-relaxed tracking-[0.15em] text-muted opacity-60 sm:text-[10px] sm:tracking-[0.2em]">
          {dict.disclaimer}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted/60 sm:text-[10px]">
          <Link href={`/${locale}/privacy`} className="hover:text-sport">
            {dict.privacy}
          </Link>
          {locale === "en" || locale === "ru" ? (
            <>
              <Link href={`/${locale}/basketball/sandbox`} className="hover:text-sport">
                {dict.sandbox.title} NBA
              </Link>
              <Link href={`/${locale}/football/sandbox`} className="hover:text-sport">
                {dict.sandbox.title} 38-0
              </Link>
            </>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 sm:mt-8 sm:flex-row sm:gap-6">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted/40 sm:text-[10px]">
            © {new Date().getFullYear()} — {dict.siteName.toUpperCase()}
          </p>
          <div className="hidden h-3 w-px bg-white/5 sm:block" />
          <p className="text-[9px] font-black uppercase tracking-widest text-muted/40 sm:text-[10px]">
            v0.1.0 · beta
          </p>
        </div>
      </div>
    </footer>
  );
}
