import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, verifyToken } from "@/lib/member-auth";

/**
 * Gemeinsamer Schutz fuer alle schreibenden Admin-Endpunkte (/api/admin/*).
 *
 *  1. Session-Cookie pruefen (HMAC-signiert, siehe member-auth.ts).
 *  2. Herkunft pruefen (CSRF): Browser senden bei POST immer einen Origin-
 *     Header. Er muss zum eigenen Host passen, sonst wird die Anfrage
 *     abgelehnt, auch wenn der Cookie gueltig ist. Damit kann eine fremde
 *     Seite den eingeloggten Redakteur nicht unbemerkt Inhalte schreiben lassen.
 *
 * Gibt null zurueck, wenn alles in Ordnung ist, sonst die fertige
 * Fehlerantwort.
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const ok = await verifyToken(
    req.cookies.get(AUTH_COOKIE)?.value,
    process.env.MEMBER_AUTH_SECRET || ""
  );
  if (!ok) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!sameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "bad_origin" }, { status: 403 });
  }
  return null;
}

/** Origin (Fallback: Referer) muss zum Host der Anfrage passen. */
export function sameOrigin(req: NextRequest): boolean {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!host) return false;
  const src = req.headers.get("origin") || req.headers.get("referer");
  if (!src) return false;
  try {
    return new URL(src).host === host;
  } catch {
    return false;
  }
}

/**
 * Einheitliche Fehlerantwort fuer fehlgeschlagene GitHub-Commits.
 * Die Details (Repo, Branch, API-Text) landen nur im Server-Log,
 * nie beim Client.
 */
export function commitFailed(scope: string, e: unknown): NextResponse {
  console.error(`[admin/${scope}] commit failed:`, e);
  return NextResponse.json({ ok: false, error: "commit_failed" }, { status: 502 });
}
