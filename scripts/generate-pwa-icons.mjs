/**
 * Generates PWA + Android launcher PNGs from docs/store-assets/icon_master.png.
 * Run: node scripts/generate-pwa-icons.mjs
 */
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const master = join(root, "docs", "store-assets", "icon_master.png");
const outDir = join(root, "public", "icons");
const androidRes = join(root, "android", "app", "src", "main", "res");
const BG = "#0B0F14";

if (!existsSync(master)) {
  console.error("Missing master icon:", master);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

async function writePwa(name, size, maskable) {
  const path = join(outDir, name);
  let pipeline = sharp(master).resize(size, size);
  if (maskable) {
    const pad = Math.round(size * 0.18);
    pipeline = sharp(master)
      .resize(size - pad * 2, size - pad * 2)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: BG })
      .resize(size, size);
  }
  await pipeline.png().toFile(path);
  console.log("wrote", path);
}

async function writeAndroidMipmaps() {
  const mipmaps = [
    { name: "mdpi", size: 48, adaptive: 108 },
    { name: "hdpi", size: 72, adaptive: 162 },
    { name: "xhdpi", size: 96, adaptive: 216 },
    { name: "xxhdpi", size: 144, adaptive: 324 },
    { name: "xxxhdpi", size: 192, adaptive: 432 },
  ];

  for (const mm of mipmaps) {
    const dir = join(androidRes, `mipmap-${mm.name}`);
    mkdirSync(dir, { recursive: true });

    await sharp(master).resize(mm.size, mm.size).png().toFile(join(dir, "ic_launcher.png"));

    const radius = mm.size / 2;
    const circleSvg = `<svg><circle cx="${radius}" cy="${radius}" r="${radius}" /></svg>`;
    await sharp(master)
      .resize(mm.size, mm.size)
      .composite([{ input: Buffer.from(circleSvg), blend: "dest-in" }])
      .png()
      .toFile(join(dir, "ic_launcher_round.png"));

    const contentSize = Math.round(mm.adaptive * 0.66);
    const pad = Math.floor((mm.adaptive - contentSize) / 2);
    await sharp(master)
      .resize(contentSize, contentSize)
      .extend({
        top: pad,
        bottom: mm.adaptive - contentSize - pad,
        left: pad,
        right: mm.adaptive - contentSize - pad,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(join(dir, "ic_launcher_foreground.png"));
  }
  console.log("wrote Android mipmap icons");
}

await writePwa("icon-192.png", 192, false);
await writePwa("icon-512.png", 512, false);
await writePwa("icon-maskable-192.png", 192, true);
await writePwa("icon-maskable-512.png", 512, true);
await writeAndroidMipmaps();
console.log("Icons OK");
