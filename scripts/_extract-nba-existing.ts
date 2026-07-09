import { NBA_POOL } from "./seeds/nba";
import { NBA_EXTRA_POOL } from "./seeds/nba-extra";
import { NBA_CORE_BOOST } from "./seeds/nba-core-boost";

const teams = [...new Set([...Object.keys(NBA_POOL), ...Object.keys(NBA_EXTRA_POOL)])];
const existing = new Map<string, Set<string>>();

function add(pool: typeof NBA_POOL) {
  for (const [club, eras] of Object.entries(pool)) {
    for (const [era, seeds] of Object.entries(eras)) {
      const key = `${club}|${era}`;
      if (!existing.has(key)) existing.set(key, new Set());
      for (const s of seeds ?? []) existing.get(key)!.add(s.name.toLowerCase());
    }
  }
}
add(NBA_POOL);
add(NBA_EXTRA_POOL);
add(NBA_CORE_BOOST);

for (const club of teams.sort()) {
  const eras = new Set([
    ...Object.keys(NBA_POOL[club] ?? {}),
    ...Object.keys(NBA_EXTRA_POOL[club] ?? {}),
  ]);
  console.log(`${club}: ${[...eras].sort().join(", ")}`);
}
console.log("---");
for (const [k, v] of [...existing.entries()].sort()) {
  console.log(`${k}: ${[...v].join("; ")}`);
}
