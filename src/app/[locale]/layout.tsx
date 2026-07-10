import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HtmlLang } from "@/components/layout/HtmlLang";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.siteName,
    description: dict.tagline,
    openGraph: {
      title: dict.siteName,
      description: dict.tagline,
      locale: locale === "ru" ? "ru_RU" : "en_US",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <HtmlLang locale={locale as Locale} />
      <Header
        locale={locale as Locale}
        labels={{
          taglineHero: dict.taglineHero,
          privacy: dict.privacy,
          howToPlay: dict.howToPlay,
        }}
      />
      <main className="flex-1">{children}</main>
      <Footer locale={locale as Locale} />
    </>
  );
}
