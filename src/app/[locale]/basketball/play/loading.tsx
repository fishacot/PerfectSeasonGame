import { SportModeSelectShell } from "@/components/game/SportModeSelectShell";
import { SPORTS } from "@/lib/config/sports";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

export default async function BasketballPlayLoading({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale);

  return (
    <SportModeSelectShell
      sport="basketball"
      locale={locale}
      dict={dict}
      brand={SPORTS.basketball.brand}
    />
  );
}
