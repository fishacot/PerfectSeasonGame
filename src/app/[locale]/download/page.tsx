import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

const APK_URL = "/download/perfect-season.apk";
const APK_BYTES = 10_232_924;
// ponytail: replace with Play Store URL after first release
const PLAY_STORE_URL: string | null = null;

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const ru = locale === "ru";

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-display text-3xl">
        {ru ? "Приложение Perfect Season" : "Perfect Season app"}
      </h1>

      <p className="mt-4 rounded-lg border border-sport/30 bg-sport/10 px-4 py-3 text-sm">
        {ru
          ? "Официальная установка скоро в Google Play и App Store — без скачивания APK и обхода защиты телефона."
          : "Official install coming to Google Play and the App Store — no APK sideload or security bypass."}
      </p>

      {PLAY_STORE_URL ? (
        <a
          href={PLAY_STORE_URL}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-sport px-6 py-4 font-display text-lg text-sport-fg no-underline hover:opacity-90"
        >
          {ru ? "Скачать в Google Play" : "Get it on Google Play"}
        </a>
      ) : (
        <p className="mt-4 text-sm text-muted">
          {ru
            ? "Google Play: релиз готовится. Пока доступна только бета для тестеров."
            : "Google Play release in progress. Beta sideload for testers only."}
        </p>
      )}

      <details className="mt-8 rounded-lg border border-white/10 bg-surface/50 px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium text-muted">
          {ru ? "Бета: установка APK (только для тестеров)" : "Beta: APK install (testers only)"}
        </summary>
        <p className="mt-3 text-xs text-muted">
          {ru
            ? "Не рекомендуется для обычных пользователей. Безопаснее дождаться Google Play."
            : "Not recommended for general users. Wait for Google Play when possible."}
        </p>
        <a
          href={APK_URL}
          download="PerfectSeason.apk"
          className="mt-4 inline-block rounded-lg border border-white/20 px-4 py-2 text-sport no-underline hover:bg-white/5"
        >
          {ru ? "Скачать APK" : "Download APK"}
        </a>
        <p className="mt-2 text-xs text-muted">
          {(APK_BYTES / 1_000_000).toFixed(2)} MB · {APK_BYTES.toLocaleString()} {ru ? "байт" : "bytes"}
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-muted">
          {ru ? (
            <>
              <li>Скачайте файл → откройте в «Файлы» → «Загрузки» (Chrome сам установку не запускает).</li>
              <li>Нажмите «Установить». Игра: <strong>Perfect Season</strong> в списке приложений.</li>
            </>
          ) : (
            <>
              <li>Download → open from Files → Downloads (Chrome won’t auto-install).</li>
              <li>Tap Install. App name: <strong>Perfect Season</strong>.</li>
            </>
          )}
        </ol>
      </details>

      <p className="mt-6 text-sm text-muted">
        <Link href={`/${locale}`} className="text-sport hover:underline">
          ← {dict.siteName}
        </Link>
      </p>
    </div>
  );
}
