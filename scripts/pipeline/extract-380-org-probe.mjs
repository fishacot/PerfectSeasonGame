import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHUNK =
  process.argv[2] ??
  join(
    process.env.USERPROFILE ?? "",
    ".cursor/projects/c-Users-user-Desktop-3/agent-tools/22f14376-b906-4dd8-ba83-e75173d2fa04.txt",
  );

const s = readFileSync(CHUNK, "utf8");

// Player factory calls: l("id","Name","Club","2020s",[...],"ST",{attack:...})
const re =
  /l\("([^"]+)","([^"]+)","([^"]+)","(\d{4}s)",(\[[^\]]*\]),"([^"]*)",(\{[^}]+\})\)/g;

const players = [];
let m;
while ((m = re.exec(s))) {
  const [, id, name, club, decade, posJson, primary, statsJson] = m;
  let positions, stats;
  try {
    positions = JSON.parse(posJson.replace(/'/g, '"'));
    stats = (0, eval)(`(${statsJson})`);
  } catch {
    continue;
  }
  players.push({ id, name, club, decade, positions, primary, stats });
}

console.log("players", players.length);
const pools = new Map();
for (const p of players) {
  const k = `${p.club}|${p.decade}`;
  pools.set(k, (pools.get(k) ?? 0) + 1);
}
const sizes = [...pools.values()];
console.log("pools", pools.size, "min", Math.min(...sizes), "max", Math.max(...sizes));
console.log("clubs", [...new Set(players.map((p) => p.club))].sort().join(", "));
console.log("eras", [...new Set(players.map((p) => p.decade))].sort().join(", "));
console.log(
  "henry",
  players.filter((p) => p.name.includes("Henry")).map((p) => p.name),
);
console.log("sample", players[0]);

for (const k of ["TEAMS", "PLAYERS", "ovr", "computeOvr", "overallRating", "league"]) {
  const i = s.indexOf(k);
  if (i >= 0) console.log(k, "@", i, s.slice(i, i + 120));
}
