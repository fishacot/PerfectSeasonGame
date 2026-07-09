import type { SportId } from "@/lib/types";
import manifest from "@/lib/assets/player-photo-manifest.json";

type PhotoManifest = Record<SportId, string[]>;

const PHOTO_MANIFEST = manifest as PhotoManifest;

/**
 * Normalizes a player name to a URL-friendly slug.
 * "LeBron James" -> "lebron-james"
 */
export function playerPhotoSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function hasPlayerPhoto(sport: SportId, name: string): boolean {
  const slug = playerPhotoSlug(name);
  return PHOTO_MANIFEST[sport]?.includes(slug) ?? false;
}

export function getPlayerPhotoUrl(
  sport: SportId,
  name: string,
  blind = false,
): string | null {
  if (blind) return "/players/_blind.webp";
  if (!hasPlayerPhoto(sport, name)) return null;
  return `/players/${sport}/${playerPhotoSlug(name)}.webp`;
}

export function getSportFallbackPhoto(sport: SportId): string {
  return `/players/${sport}/_default.webp`;
}
