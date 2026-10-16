import fs from "node:fs";
import path from "node:path";
import { getHero, HERO_LIMITS } from "@/lib/startseite";
import { readImageInfo } from "@/lib/image-dims";
import AdminShell from "../_ui/AdminShell";
import HeroEditor, { type ImageOption } from "./HeroEditor";

export const metadata = { title: "Startseite" };

/**
 * Eigene Bilder unter public/images mit Abmessungen (fuer die Auswahl).
 * Laeuft beim Build; neu hochgeladene Fotos erscheinen nach dem Redeploy.
 * Angeboten werden nur Fotos, die fuer die grosse Flaeche gross genug sind;
 * kleine Vorschaubilder der Beitraege wuerden dort unscharf.
 */
function listImages(): ImageOption[] {
  const root = path.join(process.cwd(), "public", "images");
  const out: ImageOption[] = [];
  const walk = (dir: string, rel: string) => {
    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) {
        // links/: Vorschaubilder und Logos der "Nuetzlichen Links", keine Fotos
        if (r !== "/links") walk(path.join(dir, e.name), r);
        continue;
      }
      if (!/\.(jpe?g|png|webp)$/i.test(e.name)) continue;
      try {
        const info = readImageInfo(new Uint8Array(fs.readFileSync(path.join(dir, e.name))));
        if (info && info.width >= HERO_LIMITS.minWidth && info.height >= HERO_LIMITS.minHeight) {
          out.push({ src: `/images${r}`, width: info.width, height: info.height });
        }
      } catch {
        // unlesbare Datei: nicht anbieten
      }
    }
  };
  walk(root, "");
  return out.sort((a, b) => a.src.localeCompare(b.src));
}

/**
 * Redaktion: Startseite. Zurzeit das grosse Foto oben (Hero).
 * Gespeichert wird per GitHub-API (POST /api/admin/startseite).
 */
export default function AdminStartseitePage() {
  return (
    <AdminShell>
      <HeroEditor initial={getHero()} images={listImages()} />
    </AdminShell>
  );
}
