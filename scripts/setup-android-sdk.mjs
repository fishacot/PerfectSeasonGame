/**
 * Install Android command-line tools + platform/build-tools into %LOCALAPPDATA%\Android\Sdk
 * Usage: node scripts/setup-android-sdk.mjs
 */
import { execSync } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import http from "node:http";
import https from "node:https";

const sdkRoot =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  join(process.env.LOCALAPPDATA || "", "Android", "Sdk");

const cmdlineZip =
  "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip";

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, (res) => {
      if (
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        file.close();
        download(res.headers.location, dest).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`download ${url} -> ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
    });
    req.on("error", reject);
  });
}

function run(cmd, env) {
  console.log(">", cmd);
  execSync(cmd, { stdio: "inherit", shell: true, env });
}

mkdirSync(sdkRoot, { recursive: true });
const cmdlineHome = join(sdkRoot, "cmdline-tools");
const latest = join(cmdlineHome, "latest");
const sdkmanager = join(latest, "bin", "sdkmanager.bat");

const env = {
  ...process.env,
  ANDROID_HOME: sdkRoot,
  ANDROID_SDK_ROOT: sdkRoot,
};

if (!existsSync(sdkmanager)) {
  const tmp = join(sdkRoot, "_cmdline.zip");
  const extractRoot = join(sdkRoot, "_cmdline_extract");
  console.log("Downloading Android cmdline-tools...");
  await download(cmdlineZip, tmp);
  mkdirSync(cmdlineHome, { recursive: true });
  if (existsSync(extractRoot)) rmSync(extractRoot, { recursive: true, force: true });
  run(
    `powershell -NoProfile -Command "Expand-Archive -Force '${tmp}' '${extractRoot}'"`,
    env,
  );
  const extracted = join(extractRoot, "cmdline-tools");
  if (existsSync(latest)) rmSync(latest, { recursive: true, force: true });
  run(
    `powershell -NoProfile -Command "Move-Item -Force '${extracted}' '${latest}'"`,
    env,
  );
  rmSync(tmp, { force: true });
  rmSync(extractRoot, { recursive: true, force: true });
}

const packages = [
  "platform-tools",
  "platforms;android-36",
  "build-tools;36.0.0",
];

const yesFile = join(sdkRoot, "_yes.txt");
writeFileSync(yesFile, "y\n".repeat(40), "utf8");

for (const pkg of packages) {
  console.log("> sdkmanager install", pkg);
  execSync(`"${sdkmanager}" --sdk_root="${sdkRoot}" --install "${pkg}"`, {
    stdio: ["pipe", "inherit", "inherit"],
    env,
    input: "y\n".repeat(20),
    shell: true,
  });
}

console.log("> sdkmanager licenses");
execSync(`"${sdkmanager}" --sdk_root="${sdkRoot}" --licenses`, {
  stdio: ["pipe", "inherit", "inherit"],
  env,
  input: "y\n".repeat(40),
  shell: true,
});

rmSync(yesFile, { force: true });
console.log("ANDROID_HOME=", sdkRoot);
console.log("SDK setup OK");
