/** 82-0-style spin pacing — club then era, ease-out land. */
export const SPIN_CLUB_MS = 1000;
export const SPIN_ERA_MS = 1000;
export const SPIN_GAP_MS = 160;
export const SPIN_TOTAL_MS = SPIN_CLUB_MS + SPIN_GAP_MS + SPIN_ERA_MS;

export const DRUM_HEIGHT = 80;

export const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
