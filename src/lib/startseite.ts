import SETTINGS from "@/../data/startseite.json";

/**
 * Einstellungen der Startseite, die die Redaktion unter /admin/startseite
 * pflegt. Gespeichert in data/startseite.json (per GitHub-API, wie die Texte).
 *
 * Zurzeit nur das grosse Foto oben (Hero): Pfad unter public/images,
 * Abmessungen fuer next/image und der vertikale Bildausschnitt (focusY in
 * Prozent), der auf grossen Bildschirmen sichtbar bleibt.
 */
export type HeroSettings = { image: string; width: number; height: number; focusY: number };

/** Standard: Kindergruppe aus dem Vereinsflyer. */
export const HERO_DEFAULT: HeroSettings = {
  image: "/images/schahed/kinder_gruppe_flyer.jpg",
  width: 2440,
  height: 1520,
  focusY: 28,
};

/** Nur eigene Bilder unter public/images, keine fremden URLs. */
export const HERO_IMAGE_RE = /^\/images\/[a-z0-9][a-z0-9/_.-]{0,200}\.(jpe?g|png|webp)$/i;

export const HERO_LIMITS = {
  maxBytes: 3 * 1024 * 1024, // Vercel nimmt Anfragen bis 4,5 MB an; base64 wiegt 4/3
  minWidth: 800,
  minHeight: 450,
  maxSide: 8000,
} as const;

export function isHeroImagePath(s: unknown): s is string {
  return typeof s === "string" && HERO_IMAGE_RE.test(s) && !s.includes("..");
}

export function isHeroSettings(o: unknown): o is HeroSettings {
  if (!o || typeof o !== "object") return false;
  const h = o as Record<string, unknown>;
  const dim = (n: unknown) => Number.isInteger(n) && (n as number) >= 1 && (n as number) <= HERO_LIMITS.maxSide;
  return (
    isHeroImagePath(h.image) &&
    dim(h.width) &&
    dim(h.height) &&
    Number.isInteger(h.focusY) &&
    (h.focusY as number) >= 0 &&
    (h.focusY as number) <= 100
  );
}

/** Wirksame Hero-Einstellung: gespeicherte Werte, sonst Standard. */
export function getHero(): HeroSettings {
  const raw = (SETTINGS as { hero?: unknown }).hero;
  return isHeroSettings(raw) ? raw : HERO_DEFAULT;
}
