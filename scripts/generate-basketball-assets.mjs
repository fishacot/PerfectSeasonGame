#!/usr/bin/env node
/** Generate basketball broadcast assets (no network). */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");

function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function writeSvgWebp(svg, dest) {
  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(dest);
}

async function main() {
  ensure(path.join(PUBLIC, "backgrounds"));
  ensure(path.join(PUBLIC, "textures"));
  ensure(path.join(PUBLIC, "decor"));

  const arena = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
    <defs>
      <radialGradient id="g" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stop-color="#1a0f2e"/>
        <stop offset="45%" stop-color="#0d1528"/>
        <stop offset="100%" stop-color="#050810"/>
      </radialGradient>
      <linearGradient id="court" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ff9100" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#651fff" stop-opacity="0.04"/>
      </linearGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#g)"/>
    <ellipse cx="640" cy="520" rx="420" ry="180" fill="url(#court)"/>
    <rect x="0" y="0" width="1280" height="120" fill="#000" opacity="0.35"/>
    <rect x="0" y="600" width="1280" height="120" fill="#000" opacity="0.45"/>
  </svg>`;

  const parquet = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <defs>
      <pattern id="p" width="64" height="64" patternUnits="userSpaceOnUse">
        <rect width="64" height="64" fill="#c8860a"/>
        <rect x="0" y="0" width="32" height="64" fill="#a86f08"/>
        <rect x="32" y="0" width="32" height="64" fill="#d49412"/>
        <line x1="0" y1="0" x2="64" y2="64" stroke="#8a5a06" stroke-width="0.5" opacity="0.3"/>
      </pattern>
    </defs>
    <rect width="512" height="512" fill="url(#p)" opacity="0.9"/>
  </svg>`;

  const decor = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <circle cx="128" cy="128" r="100" fill="none" stroke="#ff9100" stroke-width="6" opacity="0.85"/>
    <path d="M128 28 L128 228 M28 128 L228 128" stroke="#ff9100" stroke-width="4" opacity="0.5"/>
    <circle cx="128" cy="128" r="28" fill="none" stroke="#651fff" stroke-width="3"/>
  </svg>`;

  await writeSvgWebp(arena, path.join(PUBLIC, "backgrounds", "basketball-arena.webp"));
  await writeSvgWebp(parquet, path.join(PUBLIC, "textures", "parquet.webp"));
  await writeSvgWebp(decor, path.join(PUBLIC, "decor", "basketball.webp"));
  console.log("Basketball assets written to public/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
