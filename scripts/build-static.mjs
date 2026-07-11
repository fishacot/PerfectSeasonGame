/**
 * Static export for Capacitor APK (game packaged inside the app).
 * Temporarily parks middleware (unsupported with output: 'export').
 *
 * Usage: node scripts/build-static.mjs
 */
import { execSync } from "node:child_process";
import { existsSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mw = join(root, "src", "middleware.ts");
const mwParked = join(root, "src", "middleware.ts.capacitor-park");

function run(cmd) {
  console.log(">", cmd);
  execSync(cmd, {
    stdio: "inherit",
    cwd: root,
    env: { ...process.env, CAPACITOR: "1" },
    shell: true,
  });
}

let parked = false;
try {
  run("node scripts/sync-public-data.mjs");
  run("node scripts/generate-pwa-icons.mjs");
  if (existsSync(mw)) {
    renameSync(mw, mwParked);
    parked = true;
    console.log("parked middleware for static export");
  }
  run("npx next build --webpack");
  if (!existsSync(join(root, "out", "index.html")) && !existsSync(join(root, "out", "en", "index.html"))) {
    throw new Error("static export missing out/ — build failed");
  }
  console.log("static export OK → out/");
} finally {
  if (parked && existsSync(mwParked)) {
    renameSync(mwParked, mw);
    console.log("restored middleware");
  }
}
