import { SportModeSelectShell } from "@/components/game/SportModeSelectShell";
import { SPORTS } from "@/lib/config/sports";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Nested loading has no parent params — keep shell locale-agnostic. */
export default function BasketballPlayLoading() {
  const dict = getDictionary("en");
  return (
    <SportModeSelectShell
      sport="basketball"
      locale="en"
      dict={dict}
      brand={SPORTS.basketball.brand}
    />
  );
}
