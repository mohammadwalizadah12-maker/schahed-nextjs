import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, commitFailed } from "@/lib/admin-guard";
import { commitFile } from "@/lib/github";
import { LIMITS } from "@/lib/validate";

/**
 * Speichert alle UI-Texte (DE + FA) nach data/ui-text.json (per GitHub-API).
 * Der Commit löst via Vercel-Git-Integration ein Redeploy aus.
 *
 * WICHTIG: Der Versand läuft über die GitHub-API (fetch + base64/UTF-8),
 * NICHT über lokale Datei-Tools — dadurch bleiben persische Halbabstände
 * (ZWNJ / نیم‌فاصله) erhalten.
 *
 * Auth + CSRF: requireAdmin (Cookie und Origin).
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  let de: unknown, fa: unknown;
  try {
    const body = await req.json();
    de = body?.de;
    fa = body?.fa;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const KEY_RE = /^[a-zA-Z0-9_.-]{1,80}$/;
  const isStrMap = (o: unknown): o is Record<string, string> =>
    !!o && typeof o === "object" && !Array.isArray(o) &&
    Object.keys(o).length <= LIMITS.uiKeys &&
    Object.entries(o as Record<string, unknown>).every(
      ([k, v]) => KEY_RE.test(k) && typeof v === "string" && v.length <= LIMITS.uiValue
    );

  if (!isStrMap(de) || !isStrMap(fa)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Schlüssel alphabetisch sortiert speichern (stabile, lesbare Diffs)
  const sortKeys = (o: Record<string, string>) =>
    Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));

  const content = JSON.stringify({ de: sortKeys(de), fa: sortKeys(fa) }, null, 2) + "\n";
  const count = Object.keys(de).length;

  try {
    await commitFile("data/ui-text.json", content, `CMS: Website-Texte aktualisiert (${count} Schlüssel)`);
  } catch (e) {
    return commitFailed("ui-text", e);
  }

  return NextResponse.json({ ok: true, count });
}
