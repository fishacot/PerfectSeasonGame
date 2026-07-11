import { locales } from "@/lib/i18n/dictionaries";

export const dynamic = "force-static";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://83.147.235.105:8088";
  const paths = ["", "/basketball/play", "/football", "/hockey", "/how-to-play", "/privacy", "/download"];
  const entries = [];
  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date("2026-01-01"),
      });
    }
  }
  return entries;
}
