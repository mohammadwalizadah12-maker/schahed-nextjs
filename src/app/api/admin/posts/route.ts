import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/lib/member-auth";
import { commitFile } from "@/lib/github";

/**
 * Speichert die komplette Beitragsliste nach data/posts.json (per GitHub-API).
 * Der Commit loest via Vercel-Git-Integration ein Redeploy aus.
 *
 * Auth: signierter Cookie (Shared-Login). Zusaetzlich zur Middleware,
 * damit der Endpoint auch bei direktem Aufruf geschuetzt ist.
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

  let posts: unknown;
  try {
    const body = await req.json();
    posts = body?.posts;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  if (!Array.isArray(posts)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Minimale Validierung jedes Beitrags
  for (const p of posts as Record<string, unknown>[]) {
    if (!p || typeof p.slug !== "string" || !p.slug.trim()) {
      return NextResponse.json({ ok: false, error: "missing_slug" }, { status: 400 });
    }
  }

  const content = JSON.stringify(posts, null, 2) + "\n";

  try {
    await commitFile(
      "data/posts.json",
      content,
      `CMS: Beiträge aktualisiert (${posts.length} Einträge)`
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "github_failed", detail: String(e) },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, count: posts.length });
}
