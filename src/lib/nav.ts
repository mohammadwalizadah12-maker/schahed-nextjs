/**
 * Zentrale Navigations-Definition. Labels kommen aus i18n (MESSAGES).
 *
 * Reihenfolge = Nutzer-Reise einer Hilfsorganisation:
 *   Wer sind wir -> Was tun wir -> Was passiert gerade -> Wie helfe ich -> Kontakt
 * "Jetzt spenden" ist der Haupt-CTA (separat, hervorgehoben).
 * Sekundaeres (Feedback, Impressum, Datenschutz, Verwaltung) steht im Footer.
 */
export const NAV_ITEMS: { key: string; path: string }[] = [
  { key: "nav.home", path: "" },
  { key: "nav.about", path: "/about" },
  { key: "nav.projects", path: "/projects" },
  { key: "nav.news", path: "/news" },
  { key: "nav.membership", path: "/membership" },
  { key: "nav.contact", path: "/contact" },
];

export const DONATE_PATH = "/donate";
