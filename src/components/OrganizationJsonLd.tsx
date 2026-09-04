import {
  SITE_URL,
  SITE_NAME,
  SITE_NAME_FULL,
  SITE_NAME_EN,
  SITE_NAME_FA,
  SITE_LOGO_URL,
  ORG,
  CONTACT,
  DONATE,
  SOCIAL,
} from "@/lib/site-config";
import type { Locale } from "@/lib/i18n";

/**
 * Structured Data (schema.org / JSON-LD) fuer die Schahed-Website.
 *
 * Zweck: Suchmaschinen erkennen den Verein als gemeinnuetzige Organisation
 * (NGO) inkl. Logo, Anschrift, Kontakt und Spendenmoeglichkeit — Voraussetzung
 * fuer Knowledge-Panel und Rich Results.
 *
 * Alle Werte stammen aus site-config.ts (Single Source of Truth) —
 * hier werden KEINE Daten dupliziert oder erfunden.
 */
export default function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const sameAs = Object.values(SOCIAL).filter((u) => u.trim().length > 0);

  const organization = {
    "@type": ["NGO", "NonprofitOrganization"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME_FULL,
    alternateName: [SITE_NAME, SITE_NAME_EN, SITE_NAME_FA],
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: SITE_LOGO_URL },
    image: SITE_LOGO_URL,
    foundingDate: String(ORG.foundedYear),
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: CONTACT.city,
        addressCountry: CONTACT.country,
      },
    },
    slogan: locale === "fa" ? ORG.claimFa : ORG.claimDe,
    description: locale === "fa" ? ORG.mottoFa : ORG.mottoDe,
    taxID: ORG.taxNumber,
    // Google bewertet eine echte Strassenanschrift hoeher als ein Postfach;
    // das Postfach bleibt als zusaetzliche Postanschrift erhalten.
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.street,
      postalCode: CONTACT.streetZip,
      addressLocality: CONTACT.city,
      addressCountry: CONTACT.country,
    },
    email: CONTACT.email,
    telephone: CONTACT.phone,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT.email,
      telephone: CONTACT.phone,
      availableLanguage: ["de", "fa"],
    },
    founder: { "@type": "Person", name: ORG.founderCeo },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/${locale}`,
    name: SITE_NAME_FULL,
    inLanguage: locale,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const donate = {
    "@type": "DonateAction",
    name: locale === "fa" ? "کمک مالی" : "Jetzt spenden",
    target: `${SITE_URL}/${locale}/donate`,
    recipient: { "@id": `${SITE_URL}/#organization` },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": DONATE.taxDeductible
      ? [organization, website, donate]
      : [organization, website],
  };

  return (
    <script
      type="application/ld+json"
      // Sicher: alle Werte stammen aus site-config.ts. "<" wird escaped,
      // damit kein </script> aus den Daten den Block schliessen kann.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
