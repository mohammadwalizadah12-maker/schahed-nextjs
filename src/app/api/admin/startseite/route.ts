import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, commitFailed } from "@/lib/admin-guard";
import { commitBinaryFile, commitFile, fileExists } from "@/lib/github";
import { readImageInfo } from "@/lib/image-dims";
import { HERO_LIMITS, isHeroImagePath, type HeroSettings } from "@/lib/startseite";

/**
 * Startseite: grosses Foto oben (Hero) tauschen.
 *
 * Body (JSON), immer mit focusY (0-100):
 *   { image, width, height }          vorhandenes Bild unter public/images
 *   { upload: { name, data } }        neue Datei, data = base64 (JPEG/PNG/WebP)
 *
 * Eine hochgeladene Datei wird per GitHub-API nach public/images/startseite/
 * committet, danach die Einstellung nach data/startseite.json. Jeder Commit
 * loest ueber die Vercel-Git-Integration ein Redeploy aus; massgeblich ist
 * der zweite, der beide Dateien kennt.
 *
 * Abmessungen und Dateityp werden hier aus den Bytes gelesen, nicht dem
 * Client geglaubt. Auth + CSRF: requireAdmin (Cookie und Origin).
 */
export const maxDuration = 60;

type Body = {
  focusY?: unknown;
  image?: unknown;
  width?: unknown;
  height?: unknown;
  upload?: { name?: unknown; data?: unknown };
};

const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/** Dateiname -> kurzer, sicherer Slug (ohne Endung). */
function slugify(name: string): string {
  const s = name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return s || "startseite";
}

/** Zeitstempel JJJJMMTT-HHMM (UTC), macht Dateinamen eindeutig. */
function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}-${p(d.getUTCHours())}${p(d.getUTCMinutes())}`;
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  // Groesse vor dem Einlesen pruefen: 3 MB Foto wiegen als base64 rund 4 MB.
  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > HERO_LIMITS.maxBytes * 1.4 + 4096) return bad("too_large", 413);

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return bad("bad_request");
  }

  const focusY = Number(body.focusY);
  if (!Number.isInteger(focusY) || focusY < 0 || focusY > 100) return bad("invalid_fields");

  let hero: HeroSettings;

  if (body.upload) {
    const { name, data } = body.upload;
    // base64 wiegt 4/3 der Datei; alles darueber ist sicher zu gross.
    if (typeof data !== "string" || data.length > HERO_LIMITS.maxBytes * 1.4) return bad("invalid_upload");
    const bytes = new Uint8Array(Buffer.from(data, "base64"));
    if (bytes.length === 0 || bytes.length > HERO_LIMITS.maxBytes) return bad("invalid_upload");

    let info: ReturnType<typeof readImageInfo> = null;
    try {
      info = readImageInfo(bytes);
    } catch {
      info = null;
    }
    if (
      !info ||
      info.width < HERO_LIMITS.minWidth ||
      info.height < HERO_LIMITS.minHeight ||
      info.width > HERO_LIMITS.maxSide ||
      info.height > HERO_LIMITS.maxSide
    ) {
      return bad("invalid_upload");
    }

    const ext = info.type === "jpeg" ? "jpg" : info.type;
    const file = `${slugify(typeof name === "string" ? name : "")}-${stamp()}.${ext}`;
    const image = `/images/startseite/${file}`;
    try {
      await commitBinaryFile(`public${image}`, bytes, `CMS: Startseitenbild hochgeladen (${file})`);
    } catch (e) {
      return commitFailed("startseite", e);
    }
    hero = { image, width: info.width, height: info.height, focusY };
  } else {
    const { image } = body;
    if (!isHeroImagePath(image)) return bad("invalid_image");
    const width = Number(body.width);
    const height = Number(body.height);
    const dim = (n: number) => Number.isInteger(n) && n >= 1 && n <= HERO_LIMITS.maxSide;
    if (!dim(width) || !dim(height)) return bad("invalid_fields");

    let exists = false;
    try {
      exists = await fileExists(`public${image}`);
    } catch (e) {
      return commitFailed("startseite", e);
    }
    if (!exists) return bad("image_not_found", 404);
    hero = { image, width, height, focusY };
  }

  const content = JSON.stringify({ hero }, null, 2) + "\n";
  try {
    await commitFile("data/startseite.json", content, `CMS: Startseitenbild geändert (${hero.image})`);
  } catch (e) {
    // Bei einem Upload liegt das Foto jetzt schon im Repo; nach dem naechsten
    // Neuaufbau steht es in der Auswahl und kann ohne erneuten Upload gesetzt werden.
    console.error("[admin/startseite] commit failed:", e);
    return NextResponse.json(
      { ok: false, error: body.upload ? "settings_failed_after_upload" : "commit_failed", image: hero.image },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, hero });
}
