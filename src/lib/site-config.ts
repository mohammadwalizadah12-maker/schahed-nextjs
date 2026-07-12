/**
 * Single Source of Truth fuer die Schahed-Website.
 * Vercel-Build: NEXT_PUBLIC_SITE_URL ueberschreibt den Default.
 *
 * Alle Daten aus dem offiziellen Flyer (Afghanisches Hilfswerk Schahed e.V.)
 * und der Original-Website uebernommen. Stand: Juli 2026.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://schahed.com";

export const SITE_HOSTNAME = SITE_URL.replace(/^https?:\/\//, "");

export const SITE_NAME = "Schahed";
export const SITE_NAME_FULL = "Afghanisches Hilfswerk Schahed e.V.";
export const SITE_NAME_EN = "Afghan Aid Foundation Shahed e.V.";
export const SITE_NAME_FA = "موسسه خیریه شاهد";
export const SITE_LOGO_URL = `${SITE_URL}/schahed-logo.png`;

/** Gruendung / Rechtliches (Flyer + "تاریخچه و نحوه تاسیس") */
export const ORG = {
  foundedYear: 2012,
  register: "VR 21688 (Amtsgericht Hamburg)",
  taxNumber: "12/422/14431", // Steuernummer (Flyer/Mohammad, 2026)
  founderCeo: "Mohammad Zargarpour",
  deputyFinance: "Seyed Toufigh Hosseini",
  deputyAdmin: "Mohammad Bagher Sabouri",
  // Leitsaetze (dreisprachig, aus dem Flyer)
  claimDe: "Jedes Kind verdient eine Zukunft.",
  claimFa: "ما باور داریم که باهم میتوانیم جهان بهتری بسازیم.",
  mottoDe: "Wird ein Kind gebildet, wird eine Familie aus der Armut gerettet.",
  mottoFa: "هرگاه طفلی باسواد بشود، یک خانواده از فقر نجات پیدا خواهد کرد.",
  // "Bildung = Beseitigung von Armut und Not"
  eduMottoFa: "سواد = رفع فقر و تنگدستی",
  eduMottoDe: "Bildung = das Ende von Armut und Not",
} as const;

/** Kontakt- und Vereinsdaten (Flyer) */
export const CONTACT = {
  orgName: SITE_NAME_FULL,
  orgNameFa: "موسسه خیریه شاهد",
  poBox: "Postfach 740 343",
  zip: "22113",
  city: "Hamburg",
  country: "DE",
  phone: "+4917628282627",
  phoneDisplay: "+49 (0)176 28 28 26 27",
  email: "info@schahed.com",
  hours: "Mo – Fr, 10 – 18 Uhr",
  hoursFa: "دوشنبه تا جمعه، ساعت ۱۰ الی ۱۸",
  street: "", // Verein nutzt Postfach
  register: "VR 21688 (Amtsgericht Hamburg)",
} as const;

/** Spenden-/Bankdaten (Flyer) */
export const DONATE = {
  paypalUrl: "", // >>> PRUEFEN <<< falls PayPal vorhanden
  bank: {
    accountHolder: "Afghanisches Hilfswerk Schahed e.V.",
    bankName: "Haspa – Hamburger Sparkasse",
    iban: "DE40 2005 0550 1261 1857 46",
    bic: "HASPDEHHXXX",
  },
  // In Deutschland als gemeinnuetzig gefuehrt (Steuernummer vorhanden).
  taxDeductible: true,
} as const;

/** UN-Zahlen zur Lage in Afghanistan (Flyer). label wird via i18n uebersetzt. */
export const AFG_STATS = [
  { value: "22,9 Mio.", valueFa: "۲۲٫۹ میلیون", key: "stat.needAid" },
  { value: "17,4 Mio.", valueFa: "۱۷٫۴ میلیون", key: "stat.hunger" },
  { value: "2 Mio.+", valueFa: "۲ میلیون+", key: "stat.noSchool" },
  { value: "661.000", valueFa: "۶۶۱ هزار", key: "stat.malnutrition" },
  { value: "944.000", valueFa: "۹۴۴ هزار", key: "stat.women" },
  { value: "90 %", valueFa: "۹۰٪", key: "stat.illiterate" },
] as const;

/** Soziale Kanaele. Leere Werte werden nicht angezeigt. >>> PRUEFEN <<< */
export const SOCIAL = {
  instagram: "",
  facebook: "",
  youtube: "",
  whatsapp: "",
  telegram: "",
} as const;
