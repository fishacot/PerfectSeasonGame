/**
 * Pre-upload checks for Google Play. No secrets printed.
 * Usage: node scripts/play-store-preflight.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const aab = join(root, "android/app/build/outputs/bundle/release/app-release.aab");
const apk = join(root, "android/app/build/outputs/apk/release/app-release.apk");
const keystore = join(root, "android/keystore/release.keystore");
const props = join(root, "android/keystore.properties");
const buildGradle = join(root, "android/app/build.gradle");

let ok = true;
function check(cond, msg) {
  console.log(cond ? `✓ ${msg}` : `✗ ${msg}`);
  if (!cond) ok = false;
}

check(existsSync(aab), `AAB for Play: ${aab}`);
check(existsSync(apk), `APK for sideload: ${apk}`);
check(existsSync(keystore), "Release keystore (backup this file!)");
check(existsSync(props), "keystore.properties");

if (existsSync(buildGradle)) {
  const g = readFileSync(buildGradle, "utf8");
  const vc = g.match(/versionCode\s+(\d+)/)?.[1];
  const vn = g.match(/versionName\s+"([^"]+)"/)?.[1];
  console.log(`  versionCode=${vc ?? "?"} versionName=${vn ?? "?"}`);
}

console.log("\nPrivacy policy URLs for Play Console:");
console.log("  https://perfectseason.duckdns.org/ru/privacy");
console.log("  https://perfectseason.duckdns.org/en/privacy");
console.log("\nUpload to Play Console: the .aab file only.");
console.log("Internal testing → add friend Google emails → they install from Play.");

process.exit(ok ? 0 : 1);
