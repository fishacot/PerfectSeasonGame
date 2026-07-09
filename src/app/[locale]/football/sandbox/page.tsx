import { notFound } from "next/navigation";
import { SandboxClient } from "@/components/game/SandboxClient";
import { loadAllFootballPlayers } from "@/lib/data/loaders";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

export default async function FootballSandboxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <SandboxClient
      sport="football"
      locale={locale}
      dict={getDictionary(locale)}
      players={loadAllFootballPlayers()}
      playHref={`/${locale}/football`}
    />
  );
}
