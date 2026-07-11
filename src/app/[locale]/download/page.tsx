import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

const APK_URL = "/download/perfect-season.apk";
const APK_BYTES = 9_985_275;

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
        {ru ? "Скачать приложение Android" : "Download Android app"}
      </h1>
      <p className="mt-3 text-muted text-sm">
        {ru
          ? "После скачивания Chrome сам не откроет установку — это нормально. Следуйте шагам ниже."
          : "Chrome will not open the installer automatically — that is normal. Follow the steps below."}
      </p>

      <a
        href={APK_URL}
        download="PerfectSeason.apk"
        className="mt-6 flex w-full items-center justify-center rounded-xl bg-sport px-6 py-4 font-display text-lg text-sport-fg no-underline hover:opacity-90"
      >
        {ru ? "Скачать Perfect Season (.apk)" : "Download Perfect Season (.apk)"}
      </a>
      <p className="mt-2 text-center text-xs text-muted">
        {ru ? "Размер файла:" : "File size:"} {(APK_BYTES / 1_000_000).toFixed(2)} MB ({APK_BYTES.toLocaleString()}{" "}
        {ru ? "байт" : "bytes"})
      </p>

      <ol className="mt-8 list-decimal space-y-4 pl-5 text-sm leading-relaxed">
        {ru ? (
          <>
            <li>
              Нажмите кнопку выше. Дождитесь <strong>9,99 МБ / 9,99 МБ</strong> (или закройте окно загрузки — файл уже
              может лежать в «Загрузках»).
            </li>
            <li>
              <strong>Откройте файл вручную</strong> — любой способ:
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                <li>потяните шторку сверху → нажмите «PerfectSeason.apk»;</li>
                <li>Chrome → ⋮ → <strong>Загрузки</strong> → нажмите на файл;</li>
                <li>приложение <strong>«Файлы»</strong> / <strong>«Мои файлы»</strong> → папка <strong>Загрузки</strong>.</li>
              </ul>
            </li>
            <li>В окне установки нажмите <strong>«Установить»</strong>.</li>
            <li>
              Если Play Защита: <strong>Подробнее</strong> → <strong>Всё равно установить</strong>.
            </li>
            <li>
              Если пишет «запрещено»: Настройки → Приложения → <strong>Chrome</strong> → Разрешить установку из этого
              источника.
            </li>
            <li>Игра появится в списке приложений как <strong>Perfect Season</strong> (ярлык на рабочий стол может не добавиться).</li>
          </>
        ) : (
          <>
            <li>Tap the button above. Wait until the download finishes (~9.99 MB).</li>
            <li>
              <strong>Open the file manually</strong>: notification shade, Chrome → Downloads, or Files → Downloads.
            </li>
            <li>Tap <strong>Install</strong>.</li>
            <li>If Play Protect warns: <strong>More details</strong> → <strong>Install anyway</strong>.</li>
            <li>Allow Chrome to install unknown apps in system settings if prompted.</li>
            <li>Look for <strong>Perfect Season</strong> in the app list.</li>
          </>
        )}
      </ol>

      <p className="mt-8 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        {ru
          ? "Если «App not installed»: удалите старую попытку (Настройки → Приложения → Perfect Season), скачайте файл заново с этой страницы и проверьте, что размер файла совпадает."
          : "If you see “App not installed”: uninstall any old attempt, re-download from this page, and verify the file size matches."}
      </p>

      <p className="mt-6 text-sm text-muted">
        <Link href={`/${locale}`} className="text-sport hover:underline">
          ← {dict.siteName}
        </Link>
      </p>
    </div>
  );
}
