import { getDict } from "@/lib/i18n";
import TextsEditor from "./TextsEditor";

/**
 * Admin: Alle Website-Texte (DE + FA) bearbeiten.
 * Übergibt die aktuell wirksamen Texte (Standard + bereits gespeicherte
 * Overrides) an den Client-Editor. Gespeichert wird per GitHub-API
 * (POST /api/admin/ui-text) -> data/ui-text.json -> Vercel-Redeploy.
 */
export default function AdminTextsPage() {
  // Kopien, damit der Editor den Live-Dict nicht mutiert.
  const de = { ...getDict("de") };
  const fa = { ...getDict("fa") };
  return <TextsEditor de={de} fa={fa} />;
}
