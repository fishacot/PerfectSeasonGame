import { notFound } from "next/navigation";
import { SandboxClient } from "@/components/game/SandboxClient";
import { loadBasketballPlayers } from "@/lib/data/loaders";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

export default async function BasketballSandboxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <SandboxClient
      sport="basketball"
      locale={locale}
      dict={getDictionary(locale)}
      players={loadBasketballPlayers()}
      playHref={`/${locale}/basketball/play`}
    />
  );
}
