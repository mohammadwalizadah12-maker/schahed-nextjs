import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, commitFailed } from "@/lib/admin-guard";
import { commitFile } from "@/lib/github";
import { LIMITS, isBi, isImageRef, isIsoDate, isSlug, isStrArray } from "@/lib/validate";

/**
 * Speichert die komplette Beitragsliste nach data/posts.json (per GitHub-API).
 * Der Commit loest via Vercel-Git-Integration ein Redeploy aus.
 *
 * Auth + CSRF: requireAdmin (Cookie und Origin). Zusaetzlich zur Middleware,
 * damit der Endpoint auch bei direktem Aufruf geschuetzt ist.
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  let posts: unknown;
  try {
    const body = await req.json();
    posts = body?.posts;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  if (!Array.isArray(posts) || posts.length > LIMITS.posts) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Jeden Beitrag pruefen: Slug-Form, Eindeutigkeit, Datum, Bild, Feldlaengen.
  const seen = new Set<string>();
  const clean: unknown[] = [];
  for (const raw of posts as Record<string, unknown>[]) {
    const p = raw ?? {};
    if (!isSlug(p.slug)) {
      return NextResponse.json({ ok: false, error: "invalid_slug", slug: String(p.slug ?? "") }, { status: 400 });
    }
    if (seen.has(p.slug)) {
      return NextResponse.json({ ok: false, error: "duplicate_slug", slug: p.slug }, { status: 400 });
    }
    seen.add(p.slug);
    if (!isIsoDate(p.date)) {
      return NextResponse.json({ ok: false, error: "invalid_date", slug: p.slug }, { status: 400 });
    }
    if (p.category !== "news" && p.category !== "article") {
      return NextResponse.json({ ok: false, error: "invalid_category", slug: p.slug }, { status: 400 });
    }
    if (!isImageRef(p.image)) {
      return NextResponse.json({ ok: false, error: "invalid_image", slug: p.slug }, { status: 400 });
    }
    const body = p.body as Record<string, unknown> | undefined;
    const tags = p.tags as Record<string, unknown> | undefined;
    if (
      !isBi(p.title, LIMITS.title) ||
      !isBi(p.teaser, LIMITS.teaser) ||
      !body || !isStrArray(body.de, LIMITS.bodyLines, LIMITS.bodyLine) || !isStrArray(body.fa, LIMITS.bodyLines, LIMITS.bodyLine) ||
      !tags || !isStrArray(tags.de, LIMITS.tags, LIMITS.tag) || !isStrArray(tags.fa, LIMITS.tags, LIMITS.tag)
    ) {
      return NextResponse.json({ ok: false, error: "invalid_fields", slug: p.slug }, { status: 400 });
    }
    // Nur bekannte Felder uebernehmen (keine Fremdschluessel in die JSON).
    clean.push({
      slug: p.slug,
      date: p.date,
      category: p.category,
      image: typeof p.image === "string" ? p.image : "",
      title: p.title,
      teaser: p.teaser,
      body: { de: body.de, fa: body.fa },
      tags: { de: tags.de, fa: tags.fa },
    });
  }

  const content = JSON.stringify(clean, null, 2) + "\n";

  try {
    await commitFile("data/posts.json", content, `CMS: Beiträge aktualisiert (${clean.length} Einträge)`);
  } catch (e) {
    return commitFailed("posts", e);
  }

  return NextResponse.json({ ok: true, count: clean.length });
}
