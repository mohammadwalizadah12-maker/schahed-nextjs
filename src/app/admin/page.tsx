import fs from "node:fs";
import path from "node:path";
import { allPosts } from "@/lib/posts";
import AdminShell from "./_ui/AdminShell";
import PostsEditor from "./PostsEditor";

export const metadata = { title: "Beiträge" };

/** Liste der eigenen Bilder unter public/images (fuer die Bildauswahl). */
function listImages(): string[] {
  const root = path.join(process.cwd(), "public", "images");
  const out: string[] = [];
  const walk = (dir: string, rel: string) => {
    let entries: fs.Dirent[] = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) walk(path.join(dir, e.name), r);
      else if (/\.(jpe?g|png|webp|avif)$/i.test(e.name)) out.push(`/images${r}`);
    }
  };
  walk(root, "");
  return out.sort();
}

/**
 * Redaktion: Beitraege. Laedt die aktuellen Beitraege aus der ausgelieferten
 * JSON (kein GitHub-Call beim Laden) und uebergibt sie dem Client-Editor.
 * Gespeichert wird per GitHub-API (POST /api/admin/posts).
 */
export default function AdminPage() {
  return (
    <AdminShell>
      <PostsEditor initialPosts={allPosts()} images={listImages()} />
    </AdminShell>
  );
}
