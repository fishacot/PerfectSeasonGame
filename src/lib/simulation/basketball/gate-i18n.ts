import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { GateMessageKey } from "@/lib/simulation/basketball/engine";

export function localizedGateMessage(
  dict: Dictionary,
  gateKey: GateMessageKey | string | undefined,
  gateMessage: string,
): string {
  if (gateKey && gateKey in dict.gateMessages) {
    return dict.gateMessages[gateKey as keyof typeof dict.gateMessages];
  }
  return gateMessage;
}
