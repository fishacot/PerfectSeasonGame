/**
 * Download real player portraits + sport backgrounds, process locally (crop/vignette/WebP).
 * Sources: Wikipedia REST → TheSportsDB → curated fallback URLs.
 * Run: npm run fetch:photos
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const UA = "PerfectSeasonHub/1.0 (fan project; +https://github.com/perfect-season-hub)";
const FETCH_TIMEOUT_MS = 60_000;

const SPORT_COLORS = {
  football: { primary: "#00e676", secondary: "#0a1f14" },
  basketball: { primary: "#ff9100", secondary: "#1a0f05" },
  hockey: { primary: "#00b0ff", secondary: "#051018" },
};

/** MVP legends — top 10 per sport (expand via PHOTO_CREDITS.md) */
const PLAYERS = {
  basketball: [
    "Michael Jordan", "LeBron James", "Magic Johnson", "Kobe Bryant",
    "Shaquille O'Neal", "Larry Bird", "Stephen Curry", "Kareem Abdul-Jabbar",
    "Tim Duncan", "Giannis Antetokounmpo", "Bill Russell", "Wilt Chamberlain",
    "Hakeem Olajuwon", "Kevin Durant", "Oscar Robertson", "Jerry West",
    "Karl Malone", "Moses Malone", "Dirk Nowitzki", "Kevin Garnett",
    "Charles Barkley", "Julius Erving", "Elgin Baylor", "David Robinson",
    "Isiah Thomas", "John Stockton", "Scottie Pippen", "Chris Paul",
    "Dwyane Wade", "Kawhi Leonard", "James Harden", "Russell Westbrook",
    "Allen Iverson", "Steve Nash", "Patrick Ewing", "Jason Kidd",
    "Gary Payton", "Reggie Miller", "Clyde Drexler", "Dominique Wilkins"
  ],
  football: [
    "Lamine Yamal",
    "Thierry Henry", "Lionel Messi", "Cristiano Ronaldo", "Zinedine Zidane",
    "Paolo Maldini", "David Beckham", "Erling Haaland", "Mohamed Salah",
    "Ronaldinho", "Kylian Mbappé", "Pelé", "Diego Maradona",
    "Johan Cruyff", "Franz Beckenbauer", "Alfredo Di Stéfano", "Ferenc Puskás",
    "George Best", "Eusébio", "Gerd Müller", "Lev Yashin",
    "Michel Platini", "Marco van Basten", "Roberto Baggio", "Ronaldo Nazário",
    "Romário", "Franco Baresi", "Lothar Matthäus", "Gianluigi Buffon",
    "Iker Casillas", "Xavi", "Andrés Iniesta", "Luka Modrić",
    "Robert Lewandowski", "Karim Benzema", "Neymar Jr", "Luis Suárez",
    "Sergio Ramos", "Carles Puyol", "Philipp Lahm", "Manuel Neuer"
  ],
  hockey: [
    "Wayne Gretzky", "Mario Lemieux", "Sidney Crosby", "Alexander Ovechkin",
    "Connor McDavid", "Martin Brodeur", "Patrick Roy", "Jaromir Jagr",
    "Bobby Orr", "Nicklas Lidstrom", "Gordie Howe", "Maurice Richard",
    "Jean Béliveau", "Doug Harvey", "Bobby Hull", "Stan Mikita",
    "Phil Esposito", "Guy Lafleur", "Mike Bossy", "Bryan Trottier",
    "Ray Bourque", "Paul Coffey", "Mark Messier", "Steve Yzerman",
    "Joe Sakic", "Brett Hull", "Dominik Hašek", "Chris Chelios",
    "Scott Stevens", "Teemu Selänne", "Jarome Iginla", "Evgeni Malkin",
    "Patrick Kane", "Nikita Kucherov", "Nathan MacKinnon", "Auston Matthews",
    "Leon Draisaitl", "Cale Makar", "Andrei Vasilevskiy", "Sergei Fedorov"
  ],
};

/** Hub SportCard heroes — curated portraits (override wiki auto-pick) */
const HERO_PORTRAIT_URLS = {
  football: {
    "Lamine Yamal":
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Lamine_Yamal_in_2025_%28cropped%29.jpg",
  },
};

/** Tier D — verified direct URLs when REST fails */
const FALLBACK_URLS = {
  basketball: {
    "Michael Jordan":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/330px-Michael_Jordan_in_2014.jpg",
  },
  football: {
    "Lionel Messi":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/330px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
  },
  hockey: {
    "Wayne Gretzky":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Wayne_Gretzky_%28cropped%29.jpg/330px-Wayne_Gretzky_%28cropped%29.jpg",
  },
};

const HERO_SLUGS = new Set(
  Object.entries(HERO_PORTRAIT_URLS).flatMap(([sport, names]) =>
    Object.keys(names).map((n) => `${sport}/${slugify(n)}`),
  ),
);

const BG_WIKI = {
  "football-stadium": "Wembley Stadium",
  "basketball-arena": "Madison Square Garden",
  "hockey-rink": "Bell Centre",
};

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, opts = {}, tries = 4) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        ...opts,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      lastErr = e;
      await sleep(800 * (i + 1));
    }
  }
  throw lastErr;
}

async function fetchBuffer(url, referer = "https://en.wikipedia.org/") {
  const res = await fetchWithRetry(url, {
    headers: {
      "User-Agent": UA,
      Accept: "image/*,*/*",
      Referer: referer,
    },
    redirect: "follow",
  });
  return Buffer.from(await res.arrayBuffer());
}

async function wikiSummary(name) {
  const title = encodeURIComponent(name.replace(/ /g, "_"));
  const res = await fetchWithRetry(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
    { headers: { "User-Agent": UA, Accept: "application/json" } },
  );
  const json = await res.json();
  const page = json.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${title}`;

  const orig = json.originalimage;
  const thumb = json.thumbnail;
  const url =
    orig?.width >= 300 && orig?.source
      ? orig.source
      : thumb?.source;
  if (!url) return null;

  return {
    url,
    license: "Wikipedia / Wikimedia Commons",
    source: page,
  };
}

async function sportsDb(name) {
  const res = await fetchWithRetry(
    `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`,
    { headers: { "User-Agent": UA, Accept: "application/json" } },
    2,
  );
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("json")) return null;
  const json = await res.json();
  const player = json.player?.[0];
  if (!player) return null;
  const url = player.strCutout || player.strThumb || player.strRender;
  if (!url || url === "null") return null;
  return { url, license: "TheSportsDB free tier", source: "https://www.thesportsdb.com" };
}

async function resolveSource(sport, name) {
  const hero = HERO_PORTRAIT_URLS[sport]?.[name];
  if (hero) {
    return { url: hero, license: "Wikimedia Commons", source: hero };
  }
  const wiki = await wikiSummary(name);
  if (wiki) return wiki;
  await sleep(400);
  const tsd = await sportsDb(name);
  if (tsd) return tsd;
  const fb = FALLBACK_URLS[sport]?.[name];
  if (fb) {
    return { url: fb, license: "Wikimedia Commons", source: fb };
  }
  return null;
}

/** Face-forward crop for hub SportCard cutouts */
async function processHeroPortrait(inputBuffer, destPath) {
  const w = 420;
  const h = 560;
  const vignetteSvg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="black" stop-opacity="0"/>
        <stop offset="70%" stop-color="black" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="black" stop-opacity="0.65"/>
      </linearGradient>
      <linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="black" stop-opacity="0.15"/>
        <stop offset="35%" stop-color="black" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#v)"/>
    <rect width="100%" height="100%" fill="url(#s)"/>
  </svg>`;

  const base = await sharp(inputBuffer)
    .rotate()
    .resize(w, h, { fit: "cover", position: "top" })
    .modulate({ saturation: 1.05, brightness: 1.02 })
    .toBuffer();

  const vignette = await sharp(Buffer.from(vignetteSvg)).png().toBuffer();

  await sharp(base)
    .composite([{ input: vignette, blend: "over" }])
    .webp({ quality: 88 })
    .toFile(destPath);
}

/** ponytail: broadcast vignette baked into portrait — CSS handles hover color */
async function processPortrait(inputBuffer, destPath, { hero = false } = {}) {
  if (hero) return processHeroPortrait(inputBuffer, destPath);
  const w = 400;
  const h = 500;
  const vignetteSvg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="black" stop-opacity="0"/>
        <stop offset="55%" stop-color="black" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="black" stop-opacity="0.55"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#v)"/>
  </svg>`;

  const base = await sharp(inputBuffer)
    .rotate()
    .resize(w, h, { fit: "cover", position: "top" })
    .modulate({ saturation: 0.92, brightness: 0.98 })
    .toBuffer();

  const vignette = await sharp(Buffer.from(vignetteSvg)).png().toBuffer();

  await sharp(base)
    .composite([{ input: vignette, blend: "over" }])
    .webp({ quality: 86 })
    .toFile(destPath);
}

async function makeSportDefault(sport, destPath) {
  const { primary, secondary } = SPORT_COLORS[sport];
  const svg = `<svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${secondary}"/>
        <stop offset="100%" stop-color="#05070a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="500" fill="url(#g)"/>
    <circle cx="200" cy="180" r="72" fill="${primary}" opacity="0.12"/>
    <text x="200" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="48" font-weight="700" fill="${primary}" opacity="0.35">?</text>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(destPath);
}

async function makeBlind(destPath) {
  const svg = `<svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="500" fill="#0f1218"/>
    <ellipse cx="200" cy="130" rx="55" ry="65" fill="#1f262e"/>
    <path d="M 90 280 Q 200 220 310 280 L 310 500 L 90 500 Z" fill="#1f262e"/>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(destPath);
}

async function makeEditorialBackground(name, sportKey, destPath) {
  const { primary, secondary } = SPORT_COLORS[sportKey];
  const svg = `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${secondary}"/>
        <stop offset="45%" stop-color="#05070a"/>
        <stop offset="100%" stop-color="#0a0e14"/>
      </linearGradient>
      <radialGradient id="spot" cx="70%" cy="30%" r="50%">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="${primary}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#bg)"/>
    <rect width="1280" height="720" fill="url(#spot)"/>
    <rect x="0" y="640" width="1280" height="80" fill="black" opacity="0.35"/>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(destPath);
  return {
    slug: name,
    sport: "background",
    url: "(generated editorial plate)",
    license: "Project asset",
    source: "sharp gradient",
  };
}

async function processBackground(name, sportKey, destPath) {
  const wikiTitle = BG_WIKI[name];
  if (wikiTitle) {
    try {
      const meta = await wikiSummary(wikiTitle);
      if (meta) {
        const buf = await fetchBuffer(meta.url);
        await sharp(buf)
          .resize(1280, 720, { fit: "cover", position: "center" })
          .modulate({ saturation: 0.85, brightness: 0.72 })
          .webp({ quality: 82 })
          .toFile(destPath);
        return { slug: name, sport: "background", ...meta };
      }
    } catch {
      /* fall through to editorial plate */
    }
  }
  return makeEditorialBackground(name, sportKey, destPath);
}

function ensureDirs() {
  for (const sub of ["backgrounds", "players/basketball", "players/football", "players/hockey"]) {
    fs.mkdirSync(path.join(PUBLIC, sub), { recursive: true });
  }
}

async function main() {
  ensureDirs();
  const manifest = { basketball: [], football: [], hockey: [] };
  const credits = [];

  console.log("=== Backgrounds ===");
  const bgSport = {
    "football-stadium": "football",
    "basketball-arena": "basketball",
    "hockey-rink": "hockey",
  };
  for (const [name, sportKey] of Object.entries(bgSport)) {
    const dest = path.join(PUBLIC, "backgrounds", `${name}.webp`);
    try {
      console.log(`  ${name}...`);
      const meta = await processBackground(name, sportKey, dest);
      credits.push(meta);
      console.log(`    ✓ ${name}.webp`);
    } catch (e) {
      console.warn(`  SKIP ${name}: ${e.message}`);
    }
  }

  console.log("=== Player portraits ===");
  for (const [sport, names] of Object.entries(PLAYERS)) {
    for (const name of names) {
      const slug = slugify(name);
      const dest = path.join(PUBLIC, "players", sport, `${slug}.webp`);
      const isHero = HERO_SLUGS.has(`${sport}/${slug}`);
      if (fs.existsSync(dest) && !isHero) {
        manifest[sport].push(slug);
        console.log(`  [${sport}] ${name} — cached`);
        continue;
      }
      if (isHero && fs.existsSync(dest)) {
        console.log(`  [${sport}] ${name} — hero refresh`);
      }
      try {
        console.log(`  [${sport}] ${name}...`);
        const meta = await resolveSource(sport, name);
        if (!meta) throw new Error("no source");
        const buf = await fetchBuffer(meta.url);
        await processPortrait(buf, dest, { hero: isHero });
        manifest[sport].push(slug);
        credits.push({ slug, sport, name, ...meta });
        console.log(`    ✓ ${slug}.webp`);
      } catch (e) {
        console.warn(`    ✗ ${name}: ${e.message}`);
      }
      await sleep(500);
    }
  }

  console.log("=== Fallback plates ===");
  for (const sport of Object.keys(SPORT_COLORS)) {
    await makeSportDefault(sport, path.join(PUBLIC, "players", sport, "_default.webp"));
  }
  await makeBlind(path.join(PUBLIC, "players", "_blind.webp"));

  const manifestPath = path.join(ROOT, "src/lib/assets/player-photo-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const creditsMd = [
    "# Photo Credits & Licensing",
    "",
    "Fan project — photos for identification/commentary only.",
    "",
    "| Slug | Sport | Name | Source | License |",
    "|------|-------|------|--------|---------|",
    ...credits.map(
      (c) =>
        `| ${c.slug} | ${c.sport} | ${c.name ?? "—"} | [link](${c.source}) | ${c.license} |`,
    ),
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Counts: basketball ${manifest.basketball.length}, football ${manifest.football.length}, hockey ${manifest.hockey.length}`,
  ].join("\n");
  fs.writeFileSync(path.join(ROOT, "docs/PHOTO_CREDITS.md"), creditsMd);

  const counts = Object.fromEntries(Object.entries(manifest).map(([k, v]) => [k, v.length]));
  console.log("\n=== Done ===");
  console.log("Photos per sport:", counts);
  console.log("Manifest:", manifestPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
