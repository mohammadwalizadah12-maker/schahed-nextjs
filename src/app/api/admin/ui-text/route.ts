import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/lib/member-auth";
import { commitFile } from "@/lib/github";

/**
 * Speichert alle UI-Texte (DE + FA) nach data/ui-text.json (per GitHub-API).
 * Der Commit löst via Vercel-Git-Integration ein Redeploy aus.
 *
 * WICHTIG: Der Versand läuft über die GitHub-API (fetch + base64/UTF-8),
 * NICHT über lokale Datei-Tools — dadurch bleiben persische Halbabstände
 * (ZWNJ / نیمفاصله) erhalten.
 *
 * Auth: signierter Cookie (Shared-Login), zusätzlich zur Middleware.
 */
export async function POST(req: NextRequest) {
  const jar = await cookies();
  const ok = await verifyToken(
    jar.get(AUTH_COOKIE)?.value,
    process.env.MEMBER_AUTH_SECRET || ""
  );
  if (!ok) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let de: unknown, fa: unknown;
  try {
    const body = await req.json();
    de = body?.de;
    fa = body?.fa;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const isStrMap = (o: unknown): o is Record<string, string> =>
    !!o && typeof o === "object" && !Array.isArray(o) &&
    Object.values(o as Record<string, unknown>).every((v) => typeof v === "string");

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
    return NextResponse.json(
      { ok: false, error: "commit_failed", detail: String(e) },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
