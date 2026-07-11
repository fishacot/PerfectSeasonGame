/** Copy minified player DB to public/ for fast static fetch (dev + prod). */
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function syncBasketball() {
  const src = join(root, "data/basketball/nba.json");
  const dest = join(root, "public/data/basketball/nba.json");
  const players = JSON.parse(readFileSync(src, "utf8"));
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, JSON.stringify(players));
  console.log(`synced basketball: ${players.length} players → public/data/basketball/nba.json`);
}

function syncCopy(relSrc, relDest) {
  const src = join(root, relSrc);
  const dest = join(root, relDest);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, readFileSync(src));
  console.log(`synced ${relSrc} → ${relDest}`);
}

syncBasketball();
syncCopy("data/football/all.json", "public/data/football/all.json");
syncCopy("data/hockey/nhl.json", "public/data/hockey/nhl.json");
