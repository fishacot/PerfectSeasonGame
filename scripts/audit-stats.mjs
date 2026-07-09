import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fb = JSON.parse(readFileSync(join(root, "data/football/all.json"), "utf8"));
const hk = JSON.parse(readFileSync(join(root, "data/hockey/nhl.json"), "utf8"));
const nba = JSON.parse(readFileSync(join(root, "data/basketball/nba.json"), "utf8"));

function stats(players, label, eplClubs) {
  const map = new Map();
  for (const p of players) {
    const k = `${p.club}|${p.era}`;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  const counts = [...map.values()];
  const thin = counts.filter((n) => n > 0 && n < 6).length;
  const pools = counts.length;
  const avg = counts.reduce((a, b) => a + b, 0) / pools;
  console.log(`${label}: ${players.length} players, ${pools} pools, avg ${avg.toFixed(2)}, thin<6=${thin}`);
  if (eplClubs) {
    let eplPools = 0, eplThin = 0, eplTotal = 0;
    for (const [k, n] of map) {
      const club = k.split("|")[0];
      if (eplClubs.includes(club)) { eplPools++; eplTotal += n; if (n < 6) eplThin++; }
    }
    console.log(`  EPL subset: ${eplPools} pools, avg ${(eplTotal/eplPools).toFixed(2)}, thin=${eplThin}`);
  }
}

const epl = ["Arsenal","Chelsea","Liverpool","Manchester City","Manchester United","Tottenham","Newcastle","Aston Villa","Leeds United","Everton","West Ham","Brighton","Wolves","Crystal Palace","Fulham","Bournemouth","Nottingham Forest","Leicester City","Southampton","Ipswich Town","Sunderland"];
stats(fb, "football", epl);
stats(hk, "hockey");
stats(nba, "nba");
