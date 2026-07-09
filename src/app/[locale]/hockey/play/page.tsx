import { notFound, redirect } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/dictionaries";

/** Hockey play is gated until NHL draft ships — send to Coming Soon. */
export default async function HockeyPlayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  redirect(`/${locale}/hockey`);
}
