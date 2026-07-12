/**
 * Die vier Hilfsprogramme (طرحهای چهارگانه) der Schahed-Stiftung.
 * Texte/Titel kommen aus i18n (MESSAGES). Reihenfolge = Original.
 */
export interface ProjectDef {
  id: string;
  titleKey: string;
  textKey: string;
  icon: string; // Schluessel in PROJECT_ICONS
}

export const PROJECTS: ProjectDef[] = [
  // طرح حامی — Patenschaft (aeltestes Programm, Familienhilfe)
  { id: "hami", titleKey: "prog.hami.title", textKey: "prog.hami.text", icon: "heart" },
  // طرح دانش — Bildung
  { id: "danesh", titleKey: "prog.danesh.title", textKey: "prog.danesh.text", icon: "book" },
  // طرح سلامت — Gesundheit
  { id: "salamat", titleKey: "prog.salamat.title", textKey: "prog.salamat.text", icon: "cross" },
  // طرح معلولین — Menschen mit Behinderung
  { id: "maluli", titleKey: "prog.maluli.title", textKey: "prog.maluli.text", icon: "hand" },
];
