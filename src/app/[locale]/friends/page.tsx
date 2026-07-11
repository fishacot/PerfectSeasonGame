import { notFound } from "next/navigation";
import { FriendsClient } from "@/components/friends/FriendsClient";
import { PageFade } from "@/components/layout/PageFade";
import { isValidLocale } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/types";

export default async function FriendsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <PageFade>
      <FriendsClient locale={locale as Locale} />
    </PageFade>
  );
}
