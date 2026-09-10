/**
 * Eingabepruefung fuer CMS- und Formular-Endpunkte.
 * Bewusst klein und ohne Abhaengigkeiten.
 */

/** Slug: nur Kleinbuchstaben, Ziffern und Bindestrich, 1 bis 80 Zeichen. */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function isSlug(s: unknown): s is string {
  return typeof s === "string" && s.length <= 80 && SLUG_RE.test(s);
}

/** Erzeugt einen Slug aus einem Titel (fuer den Editor). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Nur http(s)-URLs, keine javascript:/data:-Schemata. */
export function isHttpUrl(s: unknown): s is string {
  if (typeof s !== "string" || s.length > 2000) return false;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Bildquelle: leer, eigener Pfad unter /images/ oder https-URL. */
export function isImageRef(s: unknown): boolean {
  if (s === undefined || s === null || s === "") return true;
  if (typeof s !== "string" || s.length > 500) return false;
  if (s.startsWith("/images/")) return !s.includes("..");
  return isHttpUrl(s) && s.startsWith("https:");
}

/** ISO-Datum JJJJ-MM-TT. */
export function isIsoDate(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));
}

export function isStr(v: unknown, max: number): v is string {
  return typeof v === "string" && v.length <= max;
}

export function isStrArray(v: unknown, maxItems: number, maxLen: number): v is string[] {
  return Array.isArray(v) && v.length <= maxItems && v.every((x) => isStr(x, maxLen));
}

/** Zweisprachiges Feld { de, fa }. */
export function isBi(v: unknown, max: number): v is { de: string; fa: string } {
  return !!v && typeof v === "object" &&
    isStr((v as Record<string, unknown>).de, max) &&
    isStr((v as Record<string, unknown>).fa, max);
}

/** Einfache, aber strenge E-Mail-Pruefung fuer Formulare. */
export const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
export function isEmail(s: string): boolean {
  return s.length <= 254 && EMAIL_RE.test(s);
}

/** Schneidet Formularfelder auf eine Hoechstlaenge und trimmt. */
export function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Grenzen fuer die CMS-Inhalte (grosszuegig, aber endlich). */
export const LIMITS = {
  posts: 500,
  links: 300,
  uiKeys: 1000,
  uiValue: 5000,
  title: 300,
  teaser: 1000,
  bodyLines: 400,
  bodyLine: 5000,
  tags: 30,
  tag: 60,
  heading: 120,
  description: 1500,
} as const;
