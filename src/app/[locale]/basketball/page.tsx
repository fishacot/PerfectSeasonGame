import { redirect } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/dictionaries";

export default async function BasketballPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) redirect("/");
  redirect(`/${locale}/basketball/play`);
}
