/**
 * Build release AAB and print Google Play upload checklist.
 * Automated API upload: add service account JSON (see docs/STORE_RELEASE.md).
 *
 * Usage:
 *   npm run play:deploy
 *   SKIP_UPLOAD=1 npm run play:deploy   # same, explicit
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const aab = join(root, "android/app/build/outputs/bundle/release/app-release.aab");
const buildGradle = join(root, "android/app/build.gradle");
const jsonPath = process.env.GOOGLE_PLAY_JSON ?? join(homedir(), ".perfect-season-play.json");

function run(cmd) {
  console.log(">", cmd);
  execSync(cmd, { stdio: "inherit", cwd: root, shell: true });
}

console.log("=== Perfect Season — Google Play release build ===\n");
run("node scripts/build-android.mjs");
run("node scripts/play-store-preflight.mjs");

let versionCode = "?";
let versionName = "?";
if (existsSync(buildGradle)) {
  const g = readFileSync(buildGradle, "utf8");
  versionCode = g.match(/versionCode\s+(\d+)/)?.[1] ?? versionCode;
  versionName = g.match(/versionName\s+"([^"]+)"/)?.[1] ?? versionName;
}

console.log("\n--- Next: Google Play Console ---");
console.log("Package: com.perfectseasonhub.app");
console.log(`Version: ${versionName} (${versionCode})`);
console.log("AAB file:\n ", aab);
console.log("\nPrivacy: https://perfectseason.duckdns.org/ru/privacy");
console.log("\nConsole: Testing → Internal testing → Create release → Upload AAB");
console.log("Full checklist: docs/STORE_RELEASE.md");

if (existsSync(jsonPath)) {
  console.log("\nService account JSON found:", jsonPath);
  console.log("API upload: install googleapis and wire play-store-deploy (manual upload OK for v1).");
} else {
  console.log("\nOptional automation: save service account JSON to");
  console.log(" ", jsonPath);
}
