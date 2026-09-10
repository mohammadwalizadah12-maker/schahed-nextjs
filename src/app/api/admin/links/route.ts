import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, commitFailed } from "@/lib/admin-guard";
import { commitFile } from "@/lib/github";
import { LIMITS, isBi, isHttpUrl, isImageRef, isStr } from "@/lib/validate";

/**
 * Speichert die komplette Linkliste nach data/links.json (per GitHub-API).
 * Der Commit löst via Vercel-Git-Integration ein Redeploy aus.
 *
 * Auth + CSRF: requireAdmin (Cookie und Origin).
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  let links: unknown;
  try {
    const body = await req.json();
    links = body?.links;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  if (!Array.isArray(links) || links.length > LIMITS.links) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const seen = new Set<string>();
  const clean: unknown[] = [];
  for (const raw of links as Record<string, unknown>[]) {
    const l = raw ?? {};
    // Nur http(s): verhindert javascript:-Links, die als href ausgeliefert wuerden.
    if (!isHttpUrl(l.url)) {
      return NextResponse.json({ ok: false, error: "invalid_url", url: String(l.url ?? "") }, { status: 400 });
    }
    if (!isStr(l.id, 60) || !/^[a-z0-9-]+$/.test(l.id) || seen.has(l.id)) {
      return NextResponse.json({ ok: false, error: "invalid_id", url: l.url }, { status: 400 });
    }
    seen.add(l.id);
    if (!isImageRef(l.image)) {
      return NextResponse.json({ ok: false, error: "invalid_image", url: l.url }, { status: 400 });
    }
    if (
      !isBi(l.title, LIMITS.title) ||
      !isBi(l.description, LIMITS.description) ||
      (l.heading !== undefined && !isBi(l.heading, LIMITS.heading))
    ) {
      return NextResponse.json({ ok: false, error: "invalid_fields", url: l.url }, { status: 400 });
    }
    clean.push({
      id: l.id,
      url: l.url,
      ...(l.heading ? { heading: l.heading } : {}),
      image: typeof l.image === "string" ? l.image : "",
      title: l.title,
      description: l.description,
    });
  }

  const content = JSON.stringify(clean, null, 2) + "\n";

  try {
    await commitFile("data/links.json", content, `CMS: Nützliche Links aktualisiert (${clean.length} Einträge)`);
  } catch (e) {
    return commitFailed("links", e);
  }

  return NextResponse.json({ ok: true, count: clean.length });
}
