import type { Metadata } from "next";
import { locales } from "@/lib/i18n/dictionaries";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://perfectseasonhub.com";
  const paths = ["", "/basketball/play", "/football", "/hockey", "/how-to-play", "/privacy"];
  const entries = [];
  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
      });
    }
  }
  return entries;
}
