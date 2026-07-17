import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/lib/member-auth";
import { commitFile } from "@/lib/github";

/**
 * Speichert die komplette Linkliste nach data/links.json (per GitHub-API).
 * Der Commit löst via Vercel-Git-Integration ein Redeploy aus.
 *
 * Auth: signierter Cookie (Shared-Login). Zusätzlich zur Middleware,
 * damit der Endpoint auch bei direktem Aufruf geschützt ist.
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

  let links: unknown;
  try {
    const body = await req.json();
    links = body?.links;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  if (!Array.isArray(links)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Minimale Validierung: jeder Link braucht eine URL
  for (const l of links as Record<string, unknown>[]) {
    if (!l || typeof l.url !== "string" || !l.url.trim()) {
      return NextResponse.json({ ok: false, error: "missing_url" }, { status: 400 });
    }
  }

  const content = JSON.stringify(links, null, 2) + "\n";

  try {
    await commitFile(
      "data/links.json",
      content,
      `CMS: Nützliche Links aktualisiert (${links.length} Einträge)`
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "commit_failed", detail: String(e) },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
