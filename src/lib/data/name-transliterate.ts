/**
 * Background Latin ↔ Cyrillic for sandbox search (never shown in UI).
 * Practical sports-media style — fold common EN↔RU spelling drift.
 */

const LATIN_DIGRAPHS: readonly [string, string][] = [
  ["sch", "щ"],
  ["sh", "ш"],
  ["ch", "ч"],
  ["th", "т"],
  ["ph", "ф"],
  ["kh", "х"],
  ["zh", "ж"],
  ["yo", "ё"],
  ["yu", "ю"],
  ["ya", "я"],
  ["ye", "е"],
  ["je", "дже"],
  ["jo", "джо"],
  ["ju", "джу"],
  ["ja", "джа"],
  ["qu", "ку"],
  ["ck", "к"],
  ["oo", "у"],
  ["ee", "и"],
  ["ea", "и"],
  ["ow", "оу"],
  ["ay", "ей"],
  ["ey", "ей"],
  ["ai", "ай"],
  ["oi", "ой"],
  ["ui", "уи"],
  ["ie", "и"],
  ["ue", "ю"],
];

const LATIN_CHAR: Record<string, string> = {
  a: "а",
  b: "б",
  c: "к",
  d: "д",
  e: "е",
  f: "ф",
  g: "г",
  h: "х",
  i: "и",
  j: "дж",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  q: "к",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  v: "в",
  w: "в",
  x: "кс",
  y: "й",
  z: "з",
};

function softStartLatin(word: string): string {
  if (word.startsWith("a") && word.length > 1) return `e${word.slice(1)}`;
  return word;
}

function latinWordToCyrillic(raw: string, softA: boolean): string {
  const s = softA ? softStartLatin(raw) : raw;
  let out = "";
  let i = 0;
  while (i < s.length) {
    let hit = false;
    for (const [lat, cyr] of LATIN_DIGRAPHS) {
      if (s.startsWith(lat, i)) {
        out += cyr;
        i += lat.length;
        hit = true;
        break;
      }
    }
    if (hit) continue;
    const ch = s[i]!;
    if (ch === "c") {
      const next = s[i + 1];
      out += next && "eiy".includes(next) ? "с" : "к";
      i += 1;
      continue;
    }
    if (ch === "y") {
      const prev = s[i - 1];
      out += !prev || prev === " " ? "й" : "и";
      i += 1;
      continue;
    }
    out += LATIN_CHAR[ch] ?? ch;
    i += 1;
  }
  return out;
}

function latinTokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/[\s'-]+/)
    .filter(Boolean);
}

/** English/Latin display name → primary Cyrillic search form. */
export function latinToCyrillic(text: string): string {
  return latinTokens(text)
    .map((w) => latinWordToCyrillic(w, true))
    .join(" ");
}

/** Cyrillic forms to try (soft A on/off). */
export function latinToCyrillicVariants(text: string): string[] {
  const tokens = latinTokens(text);
  const soft = tokens.map((w) => latinWordToCyrillic(w, true)).join(" ");
  const hard = tokens.map((w) => latinWordToCyrillic(w, false)).join(" ");
  return soft === hard ? [soft] : [soft, hard];
}

const CYR_DIGRAPHS: readonly [string, string][] = [
  ["дж", "j"],
  ["кс", "x"],
  ["щ", "sch"],
  ["ш", "sh"],
  ["ч", "ch"],
  ["ж", "zh"],
  ["ей", "ey"],
  ["ай", "ay"],
  ["ой", "oy"],
  ["уй", "uy"],
  ["ё", "yo"],
  ["ю", "yu"],
  ["я", "ya"],
  ["ы", "y"],
  ["й", "y"],
  ["ц", "ts"],
  ["х", "h"],
  ["э", "e"],
  ["ъ", ""],
  ["ь", ""],
];

const CYR_CHAR: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ы: "y",
  э: "e",
  ю: "yu",
  я: "ya",
};

/** Cyrillic query → Latin base form. */
export function cyrillicToLatin(text: string): string {
  const s = text.toLowerCase();
  let out = "";
  let i = 0;
  while (i < s.length) {
    let hit = false;
    for (const [cyr, lat] of CYR_DIGRAPHS) {
      if (s.startsWith(cyr, i)) {
        out += lat;
        i += cyr.length;
        hit = true;
        break;
      }
    }
    if (hit) continue;
    const ch = s[i]!;
    out += CYR_CHAR[ch] ?? ch;
    i += 1;
  }
  return out;
}

/** Expand Latin candidates for EN spelling drift (w/v, ey/a, u/a). */
export function latinMatchVariants(latin: string): string[] {
  const base = latin.toLowerCase();
  const out = new Set<string>([base]);
  out.add(base.replace(/w/g, "v"));
  out.add(base.replace(/v/g, "w"));
  out.add(base.replace(/ey/g, "a"));
  out.add(base.replace(/ey/g, "ay"));
  out.add(base.replace(/ey/g, "ai"));
  out.add(base.replace(/ey/g, "ame")); // джеймс → james
  out.add(base.replace(/ay/g, "ey"));
  out.add(base.replace(/u/g, "a")); // карри ↔ curry (approx)
  out.add(base.replace(/a/g, "u"));
  out.add(base.replace(/ch/g, "k")); // банкеро ↔ banchero
  out.add(base.replace(/k/g, "ch"));
  return [...out].filter((s) => s.length >= 2);
}

/** Fold Cyrillic lookalikes before compare. */
export function foldCyrillic(text: string): string {
  return text
    .toLowerCase()
    .replace(/э/g, "е")
    .replace(/ё/g, "е")
    .replace(/ч/g, "к"); // банчеро ↔ банкеро
}

export function hasCyrillic(text: string): boolean {
  return /[\u0400-\u04FF]/.test(text);
}

function foldLatin(text: string): string {
  return text.toLowerCase().replace(/w/g, "v");
}

/** True if query matches Latin name via either transliteration direction. */
export function matchesTransliteratedName(latinName: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return false;

  const qCyr = foldCyrillic(q);
  for (const cyr of latinToCyrillicVariants(latinName)) {
    if (foldCyrillic(cyr).includes(qCyr)) return true;
  }

  if (!hasCyrillic(q)) return false;

  const normName = foldLatin(
    latinName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
  );
  for (const cand of latinMatchVariants(cyrillicToLatin(q))) {
    if (normName.includes(foldLatin(cand))) return true;
  }
  return false;
}

if (typeof require !== "undefined" && require.main === module) {
  const samples: [string, string][] = [
    ["Anthony Edwards", "энтони эдвардс"],
    ["Anthony Edwards", "эдвардс"],
    ["LeBron James", "леброн"],
    ["Bench Guy", "бенч"],
    ["Paolo Banchero", "банкеро"],
    ["Stephen Curry", "стефен"],
  ];
  for (const [name, q] of samples) {
    if (!matchesTransliteratedName(name, q)) {
      throw new Error(`translit miss: ${name} / ${q} (cyr=${latinToCyrillic(name)})`);
    }
  }
  console.log("name-transliterate self-check ok");
}
