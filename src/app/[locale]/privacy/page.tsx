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
          ? "Приложение Perfect Season (Classic) работает офлайн. История результатов хранится только на вашем устройстве (localStorage). Мы не собираем имя, email или геолокацию для офлайн-игры. Опциональный вход и друзья — только если вы сами включите эту функцию на сайте; тогда используется cookie сессии."
          : "Perfect Season (Classic) works offline. Result history is stored only on your device (localStorage). We do not collect name, email, or location for offline play. Optional sign-in and friends — only if you enable that on the web; then a session cookie is used."}
      </p>
      <p className="mt-2 text-sm text-muted">
        {locale === "ru"
          ? "Контакты разработчика: через сайт perfectseason.duckdns.org"
          : "Developer contact: via perfectseason.duckdns.org"}
      </p>
    </div>
  );
}
