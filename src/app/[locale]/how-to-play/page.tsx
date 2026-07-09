import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

export default async function HowToPlayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const page = dict.howToPlayPage;

  return (
    <div className="page-shell max-w-2xl py-8 sm:py-12">
      <Link
        href={`/${locale}`}
        className="text-xs font-bold uppercase tracking-widest text-muted hover:text-sport"
      >
        ← {dict.siteName}
      </Link>

      <h1 className="page-title mt-5 text-text sm:mt-6">{page.title.toUpperCase()}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">{page.intro}</p>

      <ol className="mt-8 flex flex-col gap-4 sm:mt-10 sm:gap-6">
        {page.steps.map((step, i) => (
          <li
            key={step.title}
            className="rounded-xl border border-white/10 bg-surface/60 p-4 backdrop-blur-sm sm:rounded-2xl sm:p-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sport">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-2 font-display text-xl tracking-wide text-text sm:text-2xl">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-8 rounded-xl border border-sport/20 bg-sport/5 p-4 text-sm leading-relaxed text-muted sm:mt-10 sm:rounded-2xl sm:p-5">
        {page.sportsNote}
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-surface/60 p-4 sm:p-5">
        <h2 className="font-display text-lg tracking-wide text-text sm:text-xl">
          {page.calcTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{page.calcBody}</p>
      </div>
    </div>
  );
}
