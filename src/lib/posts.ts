/**
 * Beiträge / Blog (مقالهها).
 *
 * Datenquelle: data/posts.json (kanonisch, ueber das CMS unter /admin editierbar,
 * gespeichert per GitHub-API -> Vercel-Redeploy). Diese Datei liefert nur noch
 * Typen + Zugriffs-Helfer und importiert die JSON zur Build-Zeit.
 *
 * Body-Konvention (vom Detail-Renderer PostBody interpretiert):
 *   "## Titel" -> Zwischenueberschrift
 *   "- Punkt"  -> Aufzaehlungspunkt
 *   "> Zitat"  -> Zitat
 *   sonst       -> Absatz
 */
import postsData from "@/../data/posts.json";

export type PostCategory = "news" | "article";

export interface Post {
  slug: string;
  date: string; // ISO
  category: PostCategory;
  image?: string;
  title: { de: string; fa: string };
  teaser: { de: string; fa: string };
  body: { de: string[]; fa: string[] };
  tags: { de: string[]; fa: string[] };
}

export const POSTS: Post[] = postsData as Post[];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Neueste zuerst. */
export function allPosts(): Post[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}
