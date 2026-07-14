/**
 * Sync Capacitor → Android and build release APK + AAB via Gradle.
 * Packages the game INTO the APK (static export → out/ → native assets).
 *
 * Usage: node scripts/build-android.mjs
 */
import { execSync } from "node:child_process";
import { existsSync, writeFileSync, copyFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const androidDir = join(root, "android");

function run(cmd, opts = {}) {
  console.log(">", cmd);
  execSync(cmd, {
    stdio: "inherit",
    cwd: opts.cwd ?? root,
    env: opts.env ?? process.env,
    shell: true,
  });
}

if (!existsSync(androidDir)) {
  run("npx cap add android");
}

const env = { ...process.env };
if (!env.JAVA_HOME) {
  const jdkCandidates = [
    "C:\\Program Files\\Microsoft\\jdk-21.0.11.10-hotspot",
    "C:\\Program Files\\Microsoft\\jdk-17.0.19.10-hotspot",
  ];
  for (const jdk of jdkCandidates) {
    if (existsSync(jdk)) {
      env.JAVA_HOME = jdk;
      env.PATH = `${join(jdk, "bin")};${env.PATH ?? ""}`;
      console.log("using JAVA_HOME=", jdk);
      break;
    }
  }
}
if (!env.ANDROID_HOME && !env.ANDROID_SDK_ROOT) {
  const guess = join(process.env.LOCALAPPDATA ?? "", "Android", "Sdk");
  if (existsSync(guess)) {
    env.ANDROID_HOME = guess;
    env.ANDROID_SDK_ROOT = guess;
    console.log("using ANDROID_HOME=", guess);
  }
}

const sdk = env.ANDROID_HOME || env.ANDROID_SDK_ROOT;
if (sdk) {
  writeFileSync(
    join(androidDir, "local.properties"),
    `sdk.dir=${sdk.replace(/\\/g, "\\\\")}\n`,
    "utf8",
  );
}

run("node scripts/build-static.mjs", { env: { ...env, CAPACITOR: "1" } });
run("node scripts/android-keystore.mjs", { env });
run("npx cap sync android", { env });

const isWin = process.platform === "win32";
const gradlew = join(androidDir, isWin ? "gradlew.bat" : "gradlew");
if (!existsSync(gradlew)) {
  console.error("gradlew missing in android/");
  process.exit(1);
}

const gradleCmd = isWin ? `"${gradlew}"` : gradlew;
run(`${gradleCmd} bundleRelease assembleRelease`, { cwd: androidDir, env });

const aab = join(
  androidDir,
  "app",
  "build",
  "outputs",
  "bundle",
  "release",
  "app-release.aab",
);
const apk = join(
  androidDir,
  "app",
  "build",
  "outputs",
  "apk",
  "release",
  "app-release.apk",
);

console.log("\nBuild outputs:");
console.log("  AAB:", existsSync(aab) ? aab : "(missing)");
console.log("  APK:", existsSync(apk) ? apk : "(missing)");
if (!existsSync(aab) && !existsSync(apk)) process.exit(1);

// ponytail: copy for easy sharing; friend should verify exact byte size if install hangs.
if (existsSync(apk)) {
  const desktop = join(process.env.USERPROFILE ?? "", "Desktop", "PerfectSeason-app-release.apk");
  copyFileSync(apk, desktop);
  const bytes = statSync(apk).size;
  console.log(`\nCopied APK → ${desktop}`);
  console.log(`Exact size: ${bytes} bytes (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
  console.log("If install hangs: friend must have EXACT same byte size after download.");
}
