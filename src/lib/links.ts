/**
 * Nützliche Links (لینکهای مفید).
 *
 * Datenquelle: data/links.json (kanonisch, über das CMS unter /admin/links
 * editierbar, gespeichert per GitHub-API -> Vercel-Redeploy).
 */
import linksData from "@/../data/links.json";

export interface UsefulLink {
  id: string;
  url: string;
  title: { de: string; fa: string };
  description: { de: string; fa: string };
}

export const LINKS: UsefulLink[] = linksData as UsefulLink[];

export function allLinks(): UsefulLink[] {
  return LINKS;
}
