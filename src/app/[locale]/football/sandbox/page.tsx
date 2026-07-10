import { notFound } from "next/navigation";
import { SportSandbox } from "@/components/game/SportSandbox";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

export default async function FootballSandboxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <SportSandbox
      sport="football"
      locale={locale}
      dict={getDictionary(locale)}
      players={[]}
      playHref={`/${locale}/football`}
      deferPlayerLoad
      allPlayers
    />
  );
}
