import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** BBR season URL year → season start year (2019-20 → 2019). */
export function bbrYearToSeasonStart(bbrYear) {
  return bbrYear - 1;
}

/** Era label → BBR URL ending years for each season in the decade. */
export function eraToBbrYears(era) {
  const decade = parseInt(era, 10);
  return Array.from({ length: 10 }, (_, i) => decade + 1 + i);
}

export function seasonStartToEra(seasonStart) {
  const decade = Math.floor(seasonStart / 10) * 10;
  return `${decade}s`;
}

const FRANCHISE_MAP = JSON.parse(
  readFileSync(join(__dirname, "bbr-franchise-map.json"), "utf8"),
);

/** Combos where franchise history cannot reach 52 unique players in-era. */
export const POOL_MIN_EXCEPTIONS = JSON.parse(
  readFileSync(join(__dirname, "pool-min-exceptions.json"), "utf8"),
);

export function getFranchiseAbbr(club, bbrYear) {
  const entry = FRANCHISE_MAP[club];
  if (!entry) throw new Error(`Unknown club: ${club}`);
  if (entry.default) return entry.default;
  for (const row of entry.byBbrYear) {
    if (row.fromBbrYear != null && bbrYear < row.fromBbrYear) continue;
    if (bbrYear <= row.until) return row.abbr;
  }
  return null;
}

/** Latest BBR team-season page that may exist. ponytail: month<Oct → season ending this year. */
export function maxBbrYear() {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() < 9 ? y : y + 1;
}

export function clubSeasonsInEra(club, era) {
  const entry = FRANCHISE_MAP[club];
  const decade = parseInt(era, 10);
  const first = entry?.firstSeasonStart ?? 1946;
  const cap = maxBbrYear();
  const years = eraToBbrYears(era).filter((y) => {
    const start = bbrYearToSeasonStart(y);
    return start >= first && start >= decade && start < decade + 10 && y <= cap;
  });
  return years
    .map((y) => ({ bbrYear: y, abbr: getFranchiseAbbr(club, y) }))
    .filter((s) => s.abbr != null);
}

/** Map BBR position codes to draft slots (82-0: PG/SG/SF/PF/C). */
export function mapPositions(bbrPos) {
  const p = (bbrPos ?? "").trim().toUpperCase();
  if (!p) return ["SF"];
  if (p === "G") return ["PG", "SG"];
  if (p === "F") return ["SF", "PF"];
  if (p.includes("-")) {
    const parts = p.split("-").flatMap((x) => mapPositions(x));
    return [...new Set(parts)];
  }
  if (["PG", "SG", "SF", "PF", "C"].includes(p)) return [p];
  return ["SF"];
}

export function basketballRating(stats) {
  const raw =
    50 +
    2.2 * stats.ppg +
    0.9 * stats.rpg +
    1.1 * stats.apg +
    2 * stats.spg +
    1.5 * stats.bpg;
  return Math.min(99, Math.max(50, Math.round(raw)));
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "").trim();
}

function parseNum(s) {
  const n = parseFloat(String(s).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Prefer BBR `csk` hidden precision over rounded cell text. */
function cellStat(row, stat) {
  const re = new RegExp(
    `data-stat="${stat}"[^>]*csk="([^"]+)"`,
  );
  const csk = row.match(re);
  if (csk) return parseNum(csk[1]);
  const re2 = new RegExp(`data-stat="${stat}"[^>]*>([^<]*)`);
  const m = row.match(re2);
  return m ? parseNum(m[1]) : 0;
}

function cellName(row) {
  const m = row.match(
    /data-stat="name_display"[^>]*>[\s\S]*?<a href="\/players\/[^"]+">([^<]+)<\/a>/,
  );
  return m ? m[1].trim() : "";
}

function cellPos(row) {
  const m = row.match(/data-stat="pos"[^>]*>([^<]*)</);
  return m ? m[1].trim() : "";
}

/**
 * Parse BBR team per_game table (regular season block only).
 * Returns [] if page has no table (team did not exist that year).
 */
export function parsePerGameTable(html) {
  const tableId =
    html.includes('id="per_game_stats"') ? "per_game_stats" : "per_game";
  const marker = `id="${tableId}"`;
  const idx = html.indexOf(marker);
  if (idx < 0) return [];

  const slice = html.slice(idx, idx + 180_000);
  const tbodyStart = slice.indexOf("<tbody>");
  const tbodyEnd = slice.indexOf("</tbody>");
  if (tbodyStart < 0 || tbodyEnd < 0) return [];

  const tbody = slice.slice(tbodyStart, tbodyEnd);
  const rows = tbody.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) ?? [];
  const players = [];

  for (const row of rows) {
    if (row.includes("Team Totals")) continue;
    const name = cellName(row);
    if (!name) continue;

    const pos = cellPos(row);
    const games = cellStat(row, "games");
    const mp = cellStat(row, "mp_per_g");
    const trb = cellStat(row, "trb_per_g");
    const ast = cellStat(row, "ast_per_g");
    const stl = cellStat(row, "stl_per_g");
    const blk = cellStat(row, "blk_per_g");
    const pts = cellStat(row, "pts_per_g");

    if (games < 1) continue;

    const round1 = (n) => Math.round(n * 10) / 10;

    players.push({
      name,
      pos,
      games,
      mpg: mp,
      stats: {
        ppg: round1(pts),
        rpg: round1(trb),
        apg: round1(ast),
        spg: round1(stl),
        bpg: round1(blk),
      },
      minutes: games * mp,
    });
  }

  return players;
}

export function mergeDecadePlayers(seasonRows) {
  const byName = new Map();

  for (const { season, players } of seasonRows) {
    for (const p of players) {
      const key = p.name.trim().toLowerCase();
      const prev = byName.get(key);
      const mapped = mapPositions(p.pos);
      if (!prev) {
        byName.set(key, {
          name: p.name,
          positions: mapped,
          season,
          stats: { ...p.stats },
          games: p.games,
          mpg: p.mpg,
          minutes: p.minutes,
        });
        continue;
      }
      const positions = [...new Set([...prev.positions, ...mapped])];
      if (p.minutes > prev.minutes) {
        byName.set(key, {
          name: p.name,
          positions,
          season,
          stats: { ...p.stats },
          games: p.games,
          mpg: p.mpg,
          minutes: p.minutes,
        });
      } else {
        byName.set(key, { ...prev, positions });
      }
    }
  }

  return [...byName.values()].sort((a, b) => {
    const ra = basketballRating(a.stats);
    const rb = basketballRating(b.stats);
    return rb - ra;
  });
}

export const POOL_MIN = 52;

export function requiredPoolMin(club, era) {
  const key = `${club}|${era}`;
  if (key in POOL_MIN_EXCEPTIONS) return POOL_MIN_EXCEPTIONS[key];

  const entry = FRANCHISE_MAP[club];
  const decade = parseInt(era, 10);
  if (entry?.firstSeasonStart != null && entry.firstSeasonStart >= decade + 10) {
    return 0;
  }

  return POOL_MIN;
}

export function allFranchises() {
  return Object.keys(FRANCHISE_MAP);
}
