import { allLinks } from "@/lib/links";
import LinksEditor from "./LinksEditor";

/**
 * Admin: Nützliche Links verwalten. Lädt die aktuelle Liste aus der
 * ausgelieferten JSON und übergibt sie dem Client-Editor.
 * Gespeichert wird per GitHub-API (POST /api/admin/links).
 */
export default function AdminLinksPage() {
  return <LinksEditor initialLinks={allLinks()} />;
}
