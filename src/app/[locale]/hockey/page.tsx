import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";
import { ChevronLeft } from "lucide-react";

export default async function HockeyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="page-shell py-8 sm:py-16" data-sport="hockey">
      <Link
        href={`/${locale}`}
        className="group micro-label flex items-center gap-2 text-muted transition-all hover:text-sport"
      >
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {locale === "ru" ? "НАЗАД В ХАБ" : "BACK TO HUB"}
      </Link>

      <div className="mx-auto mt-10 max-w-xl text-center sm:mt-16">
        <p className="mb-4 inline-block rounded-lg border border-amber-400/40 bg-amber-400/15 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-amber-200">
          {dict.hockey.comingSoon}
        </p>
        <h1 className="page-title text-sport">{dict.hockey.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          {dict.hockey.comingSoonBody}
        </p>
        <p className="mt-6 text-xs text-muted/70 sm:text-sm">{dict.hockey.desc}</p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href={`/${locale}/basketball`}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-text transition-all hover:border-sport/40 hover:bg-sport/10"
          >
            Basketball
          </Link>
          <Link
            href={`/${locale}/football`}
            className="inline-flex items-center justify-center rounded-xl bg-sport px-6 py-3.5 text-sm font-semibold text-bg shadow-[0_10px_30px_var(--sport-glow)] transition-all hover:glow-sport active:scale-95"
          >
            Football
          </Link>
        </div>
      </div>
    </div>
  );
}
