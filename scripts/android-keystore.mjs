/**
 * Creates android/keystore/release.keystore + android/keystore.properties if missing.
 * Usage: node scripts/android-keystore.mjs
 *
 * Passwords default for local/CI smoke builds — change before Play production upload.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "android", "keystore");
const store = join(dir, "release.keystore");
const props = join(root, "android", "keystore.properties");

const storePass = process.env.PSH_KEYSTORE_PASS ?? "perfectseason-dev";
const keyPass = process.env.PSH_KEY_PASS ?? storePass;
const alias = process.env.PSH_KEY_ALIAS ?? "perfectseason";

mkdirSync(dir, { recursive: true });

if (!existsSync(store)) {
  execFileSync(
    "keytool",
    [
      "-genkeypair",
      "-v",
      "-storetype",
      "PKCS12",
      "-keystore",
      store,
      "-alias",
      alias,
      "-keyalg",
      "RSA",
      "-keysize",
      "2048",
      "-validity",
      "10000",
      "-storepass",
      storePass,
      "-keypass",
      keyPass,
      "-dname",
      "CN=Perfect Season Hub, OU=Mobile, O=PerfectSeason, L=Internet, ST=NA, C=US",
    ],
    { stdio: "inherit" },
  );
  console.log("created", store);
} else {
  console.log("keystore exists:", store);
}

writeFileSync(
  props,
  [
    `storeFile=keystore/release.keystore`,
    `storePassword=${storePass}`,
    `keyAlias=${alias}`,
    `keyPassword=${keyPass}`,
    "",
  ].join("\n"),
  "utf8",
);
console.log("wrote", props);
