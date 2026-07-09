/** Non-linear win curve: each extra win costs more roster strength (82-0 public description). */
export function nonlinearWinCurve(score: number, maxWins: number): number {
  const normalized = Math.max(0, Math.min(1, score / 100));
  const exponent = 2.4; // 82-0-style diminishing returns
  const raw = Math.pow(normalized, exponent) * maxWins;
  return Math.round(raw);
}

/** Category gates cap wins when any line/category is weak. */
export function applyCategoryGates(
  projectedWins: number,
  categories: Record<string, number>,
  maxWins: number,
): { wins: number; weakest: string; message: string } {
  const entries = Object.entries(categories);
  if (entries.length === 0) {
    return {
      wins: projectedWins,
      weakest: "",
      message: "",
    };
  }

  let wins = projectedWins;
  let weakest = entries[0][0];
  let minVal = entries[0][1];

  for (const [key, val] of entries) {
    if (val < minVal) {
      minVal = val;
      weakest = key;
    }
    const gateFloor = (val / 100) * maxWins * 0.85;
    wins = Math.min(wins, Math.round(gateFloor + (maxWins - gateFloor) * 0.15));
  }

  const perfect = maxWins;
  let message = "";
  if (wins < perfect && minVal < 70) {
    message = `Weak ${weakest} capped your ceiling`;
  } else if (wins < perfect) {
    message = `Balance across ${weakest} held you short of perfect`;
  } else {
    message = "Perfect season achieved!";
  }

  return { wins, weakest, message };
}

export function chemistryBonus(clubs: string[], eras: string[]): number {
  let bonus = 1;
  const clubCounts = new Map<string, number>();
  for (const club of clubs) {
    clubCounts.set(club, (clubCounts.get(club) ?? 0) + 1);
  }
  for (const count of clubCounts.values()) {
    if (count >= 2) bonus += 0.03 * (count - 1);
  }
  const eraCounts = new Map<string, number>();
  for (const era of eras) {
    eraCounts.set(era, (eraCounts.get(era) ?? 0) + 1);
  }
  for (const count of eraCounts.values()) {
    if (count >= 2) bonus += 0.015 * (count - 1);
  }
  return Math.min(bonus, 1.12);
}

// ponytail: assert self-check — run via `npx tsx src/lib/simulation/engine.ts`
export function runEngineSelfCheck(): void {
  const strong = nonlinearWinCurve(95, 82);
  const mid = nonlinearWinCurve(65, 82);
  const weak = nonlinearWinCurve(30, 82);
  console.assert(strong > mid && mid > weak, "curve ordering");

  const gated = applyCategoryGates(80, { ATT: 95, DEF: 40, MID: 70, GK: 65 }, 82);
  console.assert(gated.wins < 80, "gate caps wins");

  const chem = chemistryBonus(["Lakers", "Lakers"], ["2000s", "2010s"]);
  console.assert(chem > 1, "chemistry bonus");
}

if (require.main === module) {
  runEngineSelfCheck();
  console.log("engine self-check ok");
}
