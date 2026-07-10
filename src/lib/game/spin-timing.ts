/** 82-0-style spin pacing — club then era, ease-out land, then hold reveal. */
export const SPIN_CLUB_MS = 1000;
export const SPIN_ERA_MS = 1000;
export const SPIN_GAP_MS = 160;
export const SPIN_HOLD_MS = 700;
export const SPIN_TOTAL_MS = SPIN_CLUB_MS + SPIN_GAP_MS + SPIN_ERA_MS + SPIN_HOLD_MS;

export const DRUM_HEIGHT = 80;

export const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type SpinPhase = "club" | "gap" | "era" | "hold" | "done";

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Map elapsed spin ms to phase (club → gap → era → hold → done). */
export function getSpinPhase(elapsedMs: number): SpinPhase {
  if (elapsedMs < SPIN_CLUB_MS) return "club";
  if (elapsedMs < SPIN_CLUB_MS + SPIN_GAP_MS) return "gap";
  if (elapsedMs < SPIN_CLUB_MS + SPIN_GAP_MS + SPIN_ERA_MS) return "era";
  if (elapsedMs < SPIN_TOTAL_MS) return "hold";
  return "done";
}

/** Delays (ms) after spin start for each stage transition in full team+era spin. */
export function fullSpinStageDelays(): readonly [number, number, number] {
  return [SPIN_CLUB_MS + SPIN_GAP_MS, SPIN_ERA_MS, SPIN_HOLD_MS];
}

/** ponytail: self-check at import — fails fast if constants drift */
const _spinParts = SPIN_CLUB_MS + SPIN_GAP_MS + SPIN_ERA_MS + SPIN_HOLD_MS;
if (_spinParts !== SPIN_TOTAL_MS) {
  throw new Error(`SPIN_TOTAL_MS mismatch: ${_spinParts} !== ${SPIN_TOTAL_MS}`);
}
if (SPIN_HOLD_MS < 500) {
  throw new Error("SPIN_HOLD_MS must be long enough to read land");
}
if (SPIN_CLUB_MS <= 0 || SPIN_ERA_MS <= 0) {
  throw new Error("drum durations must be positive");
}
if (getSpinPhase(0) !== "club" || getSpinPhase(SPIN_TOTAL_MS) !== "done") {
  throw new Error("getSpinPhase boundaries broken");
}
