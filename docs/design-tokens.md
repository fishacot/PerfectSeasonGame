# Perfect Season Hub — Design Tokens

## Base (Stadium Night)

| Token | Value |
|-------|-------|
| `--bg` | `#05070a` |
| `--surface` | `#0f1218` |
| `--border` | `#1f262e` |
| `--text` | `#f8fafc` |
| `--muted` | `#94a3b8` |

## Sport themes

| Sport | Primary | Secondary | Background asset |
|-------|---------|-----------|------------------|
| Football | `#00e676` | `#ffea00` | `/backgrounds/football-stadium.webp` |
| Basketball | `#ff9100` | `#651fff` | `/backgrounds/basketball-arena.webp` |
| Hockey | `#00b0ff` | `#f5f5f5` | `/backgrounds/hockey-rink.webp` |

## Photoshop & Broadcast Effects

| Effect | Implementation | Description |
|--------|----------------|-------------|
| Noise Texture | `.noise-texture` | Fractal noise SVG overlay (opacity 0.035) |
| Glass Glint | `.animate-glint` | Shimmering light sweep across high-rated elements |
| Motion Blur | `.animate-motion-blur` | CSS filter blur during drum spins |
| Parallax | Framer Motion | Slight scale/move on hover for player cards |
| Lower-Third | `.lower-third-enter` | Animated editorial label for pick notifications |
| Gold Foil | `.gold-foil-border` | Realistic physical card border for 90+ OVR |

## Player portraits

- Path: `/players/{sport}/{slug}.webp` (400×500 WebP, top-center crop, vignette baked in)
- Manifest: `src/lib/assets/player-photo-manifest.json` (no 404 spam)
- Fallbacks: `/players/{sport}/_default.webp`, `/players/_blind.webp`
- Legends: 30-40 per sport (100+ total) — see `docs/PHOTO_CREDITS.md`
- Visual Pipeline: sharp local processing (rotate, resize, vignette, modulate, webp)

## Typography

- Headings: Bebas Neue
- Body: Inter

## Spacing

- Card padding: 16px mobile, 24px desktop
- Touch target min: 44px
