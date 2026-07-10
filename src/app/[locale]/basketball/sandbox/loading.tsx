import { SandboxShell } from "@/components/game/SandboxShell";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

export default async function BasketballSandboxLoading({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale);

  return (
    <SandboxShell
      sport="basketball"
      locale={locale}
      dict={dict}
      playHref={`/${locale}/basketball/play`}
    />
  );
}
