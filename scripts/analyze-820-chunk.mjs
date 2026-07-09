import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dir = join(dirname(fileURLToPath(import.meta.url)), ".820-chunks");
const s = readFileSync(join(dir, "9696-6c54a9d9869e047c.js"), "utf8");

for (const kw of [
  "getPlayers",
  "playerPool",
  "NBA_PLAYERS",
  "basketballPlayers",
  "/api/",
  "fetchPool",
  "ppg",
  "7977",
  "4496",
  "9814",
  "firebase",
  "supabase",
]) {
  const i = s.indexOf(kw);
  if (i >= 0) console.log("\n---", kw, "---\n", s.slice(Math.max(0, i - 80), i + 300));
}

const urls = [...new Set([...s.matchAll(/["'`](\/[^"'`]{3,80})["'`]/g)].map((m) => m[1]))];
console.log("\npaths:", urls.filter((u) => u.includes("api") || u.includes("data") || u.includes("nba")).join("\n"));
