import { SandboxShell } from "@/components/game/SandboxShell";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Nested loading has no parent params — keep shell locale-agnostic. */
export default function BasketballSandboxLoading() {
  const dict = getDictionary("en");
  return (
    <SandboxShell
      sport="basketball"
      locale="en"
      dict={dict}
      playHref="/en/basketball/play"
    />
  );
}
