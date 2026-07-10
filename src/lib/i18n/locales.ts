import type { Locale } from "@/lib/types";

export const locales: Locale[] = ["en", "ru"];

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
