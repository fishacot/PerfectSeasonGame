/**
 * 38-0.org player helpers — mirrors webpack module 80841 computeOverall.
 */

/**
 * 38-0.org club label → game club.
 * Only the 3 popular leagues (EPL / La Liga / Serie A).
 */
export const CLUB_TO_GAME = {
  // EPL
  Arsenal: "Arsenal",
  Chelsea: "Chelsea",
  Liverpool: "Liverpool",
  "Manchester City": "Manchester City",
  "Manchester United": "Manchester United",
  "Man City": "Manchester City",
  "Man United": "Manchester United",
  Tottenham: "Tottenham",
  // La Liga
  Barcelona: "Barcelona",
  "Real Madrid": "Real Madrid",
  "Atletico Madrid": "Atletico Madrid",
  Sevilla: "Sevilla",
  // Serie A
  "AC Milan": "AC Milan",
  "Inter Milan": "Inter Milan",
  Juventus: "Juventus",
  Napoli: "Napoli",
};

/** All clubs we accept from 38-0.org into the game DB. */
export const GAME_CLUBS = new Set(Object.values(CLUB_TO_GAME));

/** Exact 38-0.org computeOverall(primaryPosition, areaStats). */
export function compute380Overall(primary, stats) {
  const {
    attack,
    midfield,
    defense,
    goalkeeping,
    physical,
    technical,
    uclImpact,
    premFit,
  } = stats;
  if (primary === "GK") {
    return Math.round(
      0.55 * goalkeeping +
        0.15 * defense +
        0.1 * technical +
        0.1 * uclImpact +
        0.1 * premFit,
    );
  }
  if (primary === "CB" || primary === "LB" || primary === "RB") {
    return Math.round(
      0.4 * defense +
        0.2 * physical +
        0.15 * technical +
        0.15 * uclImpact +
        0.1 * premFit,
    );
  }
  if (primary === "CM" || primary === "CAM") {
    const blend =
      primary === "CAM" ? attack : Math.max(defense, 0.6 * attack);
    return Math.round(
      0.4 * midfield +
        0.25 * technical +
        0.15 * blend +
        0.1 * uclImpact +
        0.1 * premFit,
    );
  }
  return Math.round(
    0.45 * attack +
      0.2 * technical +
      0.1 * physical +
      0.15 * uclImpact +
      0.1 * midfield,
  );
}

/** Normalize 38-0 position tags for our lineup validator. */
export function map380Positions(positions, primary) {
  const out = new Set(positions);
  if (primary) out.add(primary);
  if (out.has("CAM")) out.add("AM");
  if (out.has("LW") || out.has("RW")) out.add("FW");
  if (out.has("LB") || out.has("RB")) out.add("DF");
  if (out.has("CM")) out.add("MF");
  if (out.has("CB")) out.add("DF");
  return [...out];
}

/**
 * ponytail: 38-0.org has no season G/A — derive display stats from area ratings.
 * Ceiling: not FBref-accurate; upgrade path = merge 38-0.app EPL season rows when available.
 */
export function derive380DisplayStats(primary, area) {
  const { attack, midfield, goalkeeping, defense } = area;
  if (primary === "GK") {
    return { goals: 0, assists: 0, cleanSheets: Math.max(0, Math.round(goalkeeping * 0.14)) };
  }
  if (primary === "CB" || primary === "LB" || primary === "RB") {
    return {
      goals: Math.max(0, Math.round(attack * 0.04)),
      assists: Math.max(0, Math.round(midfield * 0.06)),
    };
  }
  if (primary === "CM" || primary === "CAM") {
    return {
      goals: Math.max(0, Math.round(attack * 0.12)),
      assists: Math.max(0, Math.round(midfield * 0.15)),
    };
  }
  return {
    goals: Math.max(0, Math.round(attack * 0.28)),
    assists: Math.max(0, Math.round(midfield * 0.07)),
  };
}

export function extract380OrgPlayers(chunkJs) {
  const re =
    /l\("([^"]+)","([^"]+)","([^"]+)","(\d{4}s)",(\[[^\]]*\]),"([^"]*)",(\{[^}]+\})\)/g;
  const players = [];
  let m;
  while ((m = re.exec(chunkJs))) {
    const [, id, name, club, decade, posJson, primary, statsJson] = m;
    let positions;
    let area;
    try {
      positions = JSON.parse(posJson.replace(/'/g, '"'));
      area = (0, eval)(`(${statsJson})`);
    } catch {
      continue;
    }
    players.push({ id, name, club, decade, positions, primary, area });
  }
  if (!players.length) throw new Error("no 38-0.org players extracted from chunk");
  return players;
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  const ron = {
    attack: 92,
    midfield: 90,
    defense: 42,
    goalkeeping: 8,
    physical: 78,
    technical: 96,
    uclImpact: 92,
    premFit: 78,
  };
  console.assert(compute380Overall("CAM", ron) === 91, "Ronaldinho OVR");
  console.assert(derive380DisplayStats("CAM", ron).goals > 0, "CAM goals");
  console.log("380-utils self-check ok");
}
