import { getDict } from "@/lib/i18n";
import UI_OVERRIDES from "@/../data/ui-text.json";
import AdminShell from "../_ui/AdminShell";
import TextsEditor from "./TextsEditor";

export const metadata = { title: "Website-Texte" };

/**
 * Redaktion: Alle Website-Texte (DE + FA) bearbeiten.
 * Uebergibt die aktuell wirksamen Texte (Standard + gespeicherte Overrides)
 * an den Client-Editor, dazu die Schluessel, die in data/ui-text.json
 * einen eigenen Wert haben (fuer den Filter "nur angepasste").
 * Gespeichert wird per GitHub-API (POST /api/admin/ui-text).
 */
export default function AdminTextsPage() {
  const de = { ...getDict("de") };
  const fa = { ...getDict("fa") };
  const ov = UI_OVERRIDES as { de?: Record<string, string>; fa?: Record<string, string> };
  const overridden = new Set<string>();
  for (const loc of ["de", "fa"] as const) {
    for (const [k, v] of Object.entries(ov[loc] ?? {})) {
      if (v.trim() !== "") overridden.add(k);
    }
  }
  return (
    <AdminShell>
      <TextsEditor de={de} fa={fa} overridden={[...overridden]} />
    </AdminShell>
  );
}
