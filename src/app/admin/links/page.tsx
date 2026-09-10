import { allLinks } from "@/lib/links";
import AdminShell from "../_ui/AdminShell";
import LinksEditor from "./LinksEditor";

export const metadata = { title: "Nützliche Links" };

/**
 * Redaktion: Nuetzliche Links. Laedt die aktuelle Liste aus der
 * ausgelieferten JSON und uebergibt sie dem Client-Editor.
 * Gespeichert wird per GitHub-API (POST /api/admin/links).
 */
export default function AdminLinksPage() {
  return (
    <AdminShell>
      <LinksEditor initialLinks={allLinks()} />
    </AdminShell>
  );
}
