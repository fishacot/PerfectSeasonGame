import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 prose prose-invert">
      <h1 className="font-display text-3xl">{dict.privacy}</h1>
      <p className="mt-4 text-muted">{dict.disclaimer}</p>
      <p className="mt-4 text-sm text-muted">
        {locale === "ru"
          ? "Мы используем localStorage для истории результатов. Аналитика — опционально."
          : "We use localStorage for result history. Analytics optional."}
      </p>
    </div>
  );
}
