import { CONTACT, SITE_NAME_FULL, SITE_HOSTNAME } from "@/lib/site-config";
import PageHero from "@/components/PageHero";

export const metadata = { title: "Datenschutz" };

/**
 * Datenschutzerklaerung (DSGVO-Grundgeruest).
 * >>> PLATZHALTER <<< — vor Livegang vervollstaendigen und rechtlich pruefen lassen.
 * Hinweise: Hosting (Vercel = US-Anbieter -> AVV/Standardvertragsklauseln),
 * Kontakt-/Mitgliedsformular, ggf. eingebettete Dienste (PayPal, Maps, YouTube).
 */
export default function DatenschutzPage() {
  return (
    <>
      <PageHero title="Datenschutzerklärung" />
      <section className="mx-auto max-w-3xl px-5 py-14 leading-relaxed text-brand-800">
        <h2 className="text-lg font-bold text-brand-900">1. Verantwortlicher</h2>
        <p className="mt-3">
          {SITE_NAME_FULL}<br />
          {CONTACT.street}, {CONTACT.zip} {CONTACT.city}<br />
          E-Mail: {CONTACT.email}
        </p>

        <h2 className="mt-8 text-lg font-bold text-brand-900">2. Erhebung beim Websitebesuch</h2>
        <p className="mt-3 text-sm text-brand-700/80">
          Beim Aufruf von {SITE_HOSTNAME} werden durch den Hosting-Anbieter (Vercel Inc.)
          technisch notwendige Server-Logs (IP-Adresse, Zeitpunkt, User-Agent) verarbeitet.
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Betrieb).
          Mit dem Anbieter besteht ein Auftragsverarbeitungsvertrag. {/* >>> PLATZHALTER: AVV bestätigen <<< */}
        </p>

        <h2 className="mt-8 text-lg font-bold text-brand-900">3. Kontakt- und Mitgliedsformular</h2>
        <p className="mt-3 text-sm text-brand-700/80">
          Wenn Sie uns über ein Formular kontaktieren, verarbeiten wir die angegebenen
          Daten (Name, E-Mail, Nachricht) zur Bearbeitung Ihrer Anfrage bzw. Ihres
          Mitgliedsantrags. Rechtsgrundlage: Art. 6 Abs. 1 lit. b und f DSGVO.
        </p>

        <h2 className="mt-8 text-lg font-bold text-brand-900">4. Spenden &amp; PayPal</h2>
        <p className="mt-3 text-sm text-brand-700/80">
          Bei Spenden über PayPal gelten zusätzlich die Datenschutzhinweise der
          PayPal (Europe) S.à r.l. et Cie, S.C.A. {/* >>> PLATZHALTER: prüfen ob PayPal eingebettet oder nur verlinkt <<< */}
        </p>

        <h2 className="mt-8 text-lg font-bold text-brand-900">5. Ihre Rechte</h2>
        <p className="mt-3 text-sm text-brand-700/80">
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung,
          Datenübertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer
          Aufsichtsbehörde.
        </p>

        <p className="mt-8 rounded-xl bg-sand-100 px-4 py-3 text-xs text-brand-600">
          Hinweis: Dieses Dokument ist eine Vorlage und ersetzt keine Rechtsberatung.
          Vor dem Livegang bitte vervollständigen und prüfen lassen.
        </p>
      </section>
    </>
  );
}
