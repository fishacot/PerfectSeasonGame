/**
 * Generates Play/PWA PNG icons (192 + 512, any + maskable).
 * Run: node scripts/generate-pwa-icons.mjs
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "icons");
mkdirSync(outDir, { recursive: true });

const BG = "#0B0F14";
const ACCENT = "#00C853";

function svg(size, { maskable }) {
  const pad = maskable ? size * 0.18 : size * 0.12;
  const inner = size - pad * 2;
  const r = inner * 0.18;
  const cx = size / 2;
  const cy = size / 2;
  const font = Math.round(inner * 0.28);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${r}" fill="${ACCENT}"/>
  <text x="${cx}" y="${cy + font * 0.35}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="${font}" font-weight="700" fill="${BG}">PS</text>
</svg>`);
}

async function write(name, size, maskable) {
  const path = join(outDir, name);
  await sharp(svg(size, { maskable })).png().toFile(path);
  console.log("wrote", path);
}

await write("icon-192.png", 192, false);
await write("icon-512.png", 512, false);
await write("icon-maskable-192.png", 192, true);
await write("icon-maskable-512.png", 512, true);
console.log("PWA icons OK");
