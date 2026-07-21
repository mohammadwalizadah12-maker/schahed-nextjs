import { CONTACT, ORG, SITE_NAME_FULL, SITE_HOSTNAME } from "@/lib/site-config";
import PageHero from "@/components/PageHero";

export const metadata = { title: "Datenschutz" };

/**
 * Datenschutzerklaerung (DSGVO).
 * Faktenbasiert auf dem tatsaechlichen Technik-Stack:
 *  - Hosting: Vercel Inc. (USA -> Drittland, Standardvertragsklauseln)
 *  - Formulare: Versand per SMTP (nodemailer) an das Vereinspostfach
 *  - Admin-Login: ein funktionaler, httpOnly Cookie (nur /admin) - KEIN Tracking
 *  - KEINE Analyse-/Marketing-Cookies, KEINE YouTube/Maps-Embeds
 * >>> VOR LIVEGANG BESTAETIGEN <<< (mit [ ] markiert): ladungsfaehige Anschrift,
 *     SMTP-Anbieter + AVV, Vercel-AVV, exakte Loeschfristen, ggf. Datenschutzbeauftragter.
 */
export default function DatenschutzPage() {
  const H = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mt-8 text-lg font-bold text-brand-900">{children}</h2>
  );
  const P = ({ children }: { children: React.ReactNode }) => (
    <p className="mt-3 text-sm text-brand-700/85">{children}</p>
  );

  return (
    <>
      <PageHero title="Datenschutzerklärung" />
      <section className="mx-auto max-w-3xl px-5 py-14 leading-relaxed text-brand-800">
        <p className="text-sm text-brand-700/85">
          Wir freuen uns über Ihr Interesse an unserer Arbeit. Der Schutz Ihrer
          personenbezogenen Daten ist uns ein wichtiges Anliegen. Nachfolgend
          informieren wir Sie gemäß Art. 13 und 14 DSGVO über die Verarbeitung
          personenbezogener Daten beim Besuch dieser Website.
        </p>

        <H>1. Verantwortlicher</H>
        <P>
          Verantwortlich im Sinne der DSGVO ist:<br />
          {SITE_NAME_FULL}<br />
          {CONTACT.poBox}<br />
          {CONTACT.zip} {CONTACT.city}, Deutschland<br />
          Vertretungsberechtigter Vorstand: {ORG.founderCeo}<br />
          E-Mail: {CONTACT.email}<br />
          Telefon: <span dir="ltr">{CONTACT.phoneDisplay}</span>
        </P>
        <P>
          Ein Datenschutzbeauftragter ist gesetzlich nicht bestellt, da die
          Voraussetzungen des Art. 37 DSGVO / § 38 BDSG nicht vorliegen. Bei Fragen
          zum Datenschutz erreichen Sie uns unter den oben genannten Kontaktdaten.
        </P>

        <H>2. Verschlüsselung (SSL/TLS)</H>
        <P>
          Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
          vertraulicher Inhalte eine TLS-Verschlüsselung (erkennbar an „https://" in
          der Adresszeile). Bei aktiver Verschlüsselung können die Daten, die Sie an
          uns übermitteln, nicht von Dritten mitgelesen werden.
        </P>

        <H>3. Hosting und Server-Logfiles</H>
        <P>
          Diese Website wird bei der Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
          91789, USA, gehostet. Beim Aufruf von {SITE_HOSTNAME} werden automatisch
          technisch notwendige Zugriffsdaten in Server-Logfiles verarbeitet:
          IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, übertragene
          Datenmenge, Referrer-URL sowie Browser- und Betriebssystem-Kennung
          (User-Agent). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser
          berechtigtes Interesse liegt im sicheren und stabilen Betrieb der Website.
        </P>
        <P>
          Da Vercel Inc. ihren Sitz in den USA (Drittland) hat, erfolgt eine
          Übermittlung in ein Drittland. Die Übermittlung wird auf die
          EU-Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO gestützt.
          Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung nach
          Art. 28 DSGVO. {"[ vor Livegang bestätigen: AVV + SCC mit Vercel ]"}
        </P>

        <H>4. Kontakt-, Feedback- und Mitgliedsformular</H>
        <P>
          Wenn Sie uns über eines unserer Formulare (Kontakt, Feedback, Patenschaft/
          Mitgliedschaft) kontaktieren, verarbeiten wir die von Ihnen angegebenen
          Daten – je nach Formular Name, E-Mail-Adresse, Telefonnummer und Ihre
          Nachricht – ausschließlich zur Bearbeitung Ihres Anliegens. Die Angabe
          erfolgt freiwillig; Pflichtfelder sind entsprechend gekennzeichnet.
        </P>
        <P>
          Der Versand erfolgt technisch per E-Mail (SMTP) an unser Vereinspostfach.
          Rechtsgrundlage ist bei vertragsbezogenen Anliegen (z. B. Patenschaft)
          Art. 6 Abs. 1 lit. b DSGVO, im Übrigen Art. 6 Abs. 1 lit. f DSGVO
          (Bearbeitung Ihrer Anfrage). Wir speichern die Daten, bis Ihr Anliegen
          abschließend bearbeitet ist, und löschen sie anschließend, sofern keine
          gesetzlichen Aufbewahrungspflichten entgegenstehen.
          {" [ SMTP-Anbieter + AVV vor Livegang bestätigen ]"}
        </P>

        <H>5. Cookies</H>
        <P>
          Diese Website setzt <strong>keine</strong> Analyse-, Tracking- oder
          Marketing-Cookies ein und bindet keine Dienste zur Reichweitenmessung
          (z. B. Google Analytics) ein. Lediglich im nicht-öffentlichen
          Verwaltungsbereich (/admin) wird nach dem Login ein technisch notwendiger,
          verschlüsselter Sitzungs-Cookie gesetzt, der ausschließlich der
          Anmeldung der Redaktion dient (Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO).
          Für normale Besucherinnen und Besucher werden keine Cookies gesetzt.
        </P>

        <H>6. Spenden über PayPal</H>
        <P>
          Für Online-Spenden verlinken wir auf PayPal. Beim Anklicken werden Sie auf
          die Seiten der PayPal (Europe) S.à r.l. et Cie, S.C.A., 22–24 Boulevard
          Royal, L-2449 Luxemburg, weitergeleitet; PayPal ist dann eigenständig
          Verantwortlicher. Es findet keine Einbettung von PayPal in unsere Website
          statt. Es gelten die Datenschutzhinweise von PayPal.
        </P>

        <H>7. Externe Links</H>
        <P>
          Unsere Seite „Nützliche Links" verweist auf Websites Dritter. Auf deren
          Inhalte und Datenverarbeitung haben wir keinen Einfluss; es gelten die
          Datenschutzerklärungen der jeweiligen Anbieter.
        </P>

        <H>8. Ihre Rechte</H>
        <P>
          Sie haben nach der DSGVO das Recht auf Auskunft (Art. 15), Berichtigung
          (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
          Datenübertragbarkeit (Art. 20) sowie ein Widerspruchsrecht gegen
          Verarbeitungen, die auf einem berechtigten Interesse beruhen (Art. 21).
          Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die
          Zukunft widerrufen.
        </P>
        <P>
          Ihnen steht zudem ein Beschwerderecht bei einer Datenschutz-Aufsichts&shy;behörde
          zu. Für uns zuständig ist: Der Hamburgische Beauftragte für Datenschutz und
          Informationsfreiheit, Ludwig-Erhard-Straße 22, 20459 Hamburg.
        </P>

        <H>9. Aktualität</H>
        <P>Stand: Juli 2026. Wir passen diese Datenschutzerklärung an, sobald sich
          die Datenverarbeitung oder die Rechtslage ändert.</P>

        <p className="mt-8 rounded-xl bg-sand-100 px-4 py-3 text-xs text-brand-600">
          Hinweis: Die mit „[ ... ]" markierten Punkte sind vor dem endgültigen
          Livegang durch die tatsächlichen Angaben zu ersetzen (Auftrags&shy;verarbeitungs&shy;verträge,
          SMTP-Anbieter, ladungsfähige Anschrift). Diese Erklärung ersetzt keine
          individuelle Rechtsberatung.
        </p>
      </section>
    </>
  );
}
