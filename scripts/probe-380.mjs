import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHUNK_DIR = join(__dirname, ".380-chunks");

function chunksFromHtml(file) {
  const html = readFileSync(join(CHUNK_DIR, file), "utf8");
  return [
    ...new Set(
      [...html.matchAll(/\/_next\/static\/chunks\/([^"'?]+\.js)/g)].map(
        (m) => m[1],
      ),
    ),
  ];
}

for (const f of ["app-_game.html", "org-_draft.html"]) {
  try {
    console.log(f, chunksFromHtml(f));
  } catch (e) {
    console.log(f, "missing", e.message);
  }
}

for (const file of readdirSync(CHUNK_DIR).filter((f) => f.endsWith(".js"))) {
  const s = readFileSync(join(CHUNK_DIR, file), "utf8");
  const hits = [];
  for (const k of [
    "JSON.parse('",
    "goals:",
    "assists:",
    "decade",
    "let m=[",
    "PLAYER_DB",
    "playerPool",
    "getPool",
    "Henry",
    "Messi",
  ]) {
    if (s.includes(k)) hits.push(k);
  }
  if (hits.length) console.log(file, s.length, hits.join(", "));
}
