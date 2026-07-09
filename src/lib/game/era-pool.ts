import type { Era } from "@/lib/types";

export function filterAvailableEras(
  allEras: readonly Era[],
  usedEras: Era[],
  maxPerEra: number,
): Era[] {
  const counts = new Map<Era, number>();
  for (const era of usedEras) {
    counts.set(era, (counts.get(era) ?? 0) + 1);
  }
  return allEras.filter((era) => (counts.get(era) ?? 0) < maxPerEra);
}

export function pickRandom<T>(items: T[], rng: () => number = Math.random): T {
  return items[Math.floor(rng() * items.length)];
}

export function createRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function hashDateSeed(date: string, salt: string): number {
  let h = 0;
  const str = `${date}:${salt}`;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
