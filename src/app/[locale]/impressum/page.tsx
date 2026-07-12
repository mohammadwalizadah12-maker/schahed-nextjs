import { CONTACT, ORG, SITE_NAME_FULL } from "@/lib/site-config";
import PageHero from "@/components/PageHero";

export const metadata = { title: "Impressum" };

/**
 * Impressum nach § 5 DDG (ehem. § 5 TMG). Daten aus dem offiziellen Flyer.
 * >>> PRUEFEN <<< nur: Name der vertretungsberechtigten Person.
 */
export default function ImpressumPage() {
  return (
    <>
      <PageHero title="Impressum" />
      <section className="mx-auto max-w-3xl px-5 py-14 leading-relaxed text-brand-800">
        <h2 className="text-lg font-bold text-brand-900">Angaben gemäß § 5 DDG</h2>
        <p className="mt-3">
          {SITE_NAME_FULL}<br />
          {CONTACT.poBox}<br />
          {CONTACT.zip} {CONTACT.city}
        </p>

        <h2 className="mt-8 text-lg font-bold text-brand-900">Vertreten durch</h2>
        <p className="mt-3">
          {ORG.founderCeo} (Vorstand){/* >>> PRUEFEN <<< genaue Vorstandsbezeichnung */}
        </p>

        <h2 className="mt-8 text-lg font-bold text-brand-900">Kontakt</h2>
        <p className="mt-3">
          Telefon: <span dir="ltr">{CONTACT.phoneDisplay}</span><br />
          E-Mail: {CONTACT.email}
        </p>

        <h2 className="mt-8 text-lg font-bold text-brand-900">Registereintrag</h2>
        <p className="mt-3">
          Eintragung im Vereinsregister.<br />
          Registergericht &amp; Registernummer: {ORG.register}
        </p>

        <h2 className="mt-8 text-lg font-bold text-brand-900">Steuernummer</h2>
        <p className="mt-3">{ORG.taxNumber}</p>

        <h2 className="mt-8 text-lg font-bold text-brand-900">
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p className="mt-3">
          {ORG.founderCeo}, {CONTACT.poBox}, {CONTACT.zip} {CONTACT.city}
        </p>

        <h2 className="mt-8 text-lg font-bold text-brand-900">Haftungsausschluss</h2>
        <p className="mt-3 text-sm text-brand-700/80">
          Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für
          die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind
          ausschließlich deren Betreiber verantwortlich.
        </p>
      </section>
    </>
  );
}
