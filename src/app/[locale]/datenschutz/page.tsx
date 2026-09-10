import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n";
import { CONTACT, ORG, SITE_NAME_FULL, SITE_HOSTNAME, SITE_URL } from "@/lib/site-config";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const fa = raw === "fa";
  return {
    title: fa ? "حریم خصوصی" : "Datenschutz",
    alternates: {
      canonical: `${SITE_URL}/${fa ? "fa" : "de"}/datenschutz`,
      languages: {
        de: `${SITE_URL}/de/datenschutz`,
        fa: `${SITE_URL}/fa/datenschutz`,
        "x-default": `${SITE_URL}/de/datenschutz`,
      },
    },
  };
}

/** Stand der Erklaerung (in beiden Sprachen angezeigt). */
const UPDATED = { de: "Stand: 10. September 2026", fa: "آخرین به‌روزرسانی: ۱۹ سنبله ۱۴۰۵ (۱۰ سپتامبر ۲۰۲۶)" };

/**
 * Datenschutzerklaerung (DSGVO), zweisprachig.
 * Faktenbasiert auf dem tatsaechlichen Technik-Stand (September 2026):
 *  - Hosting: Vercel Inc. (USA), Region der Funktionen: Frankfurt (fra1)
 *  - Schriften: self-hosted ueber next/font (kein Aufruf bei Google)
 *  - Formulare: Versand per SMTP an das Vereinspostfach, Honeypot, Rate-Limit
 *    (IP-Adresse fuer hoechstens 60 Minuten im Arbeitsspeicher)
 *  - Admin-Login: ein funktionaler, httpOnly Cookie (nur Redaktion)
 *  - "Nuetzliche Links": Vorschaubilder werden direkt vom Zielserver geladen
 *  - Kein Google-Favicon-Dienst mehr, keine Analyse-/Marketing-Cookies,
 *    keine Embeds (YouTube, Maps, PayPal-Widget)
 * Die deutsche Fassung ist rechtlich massgeblich; die persische dient der
 * Verstaendlichkeit fuer die Zielgruppe.
 */
export default async function DatenschutzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const sections = locale === "fa" ? sectionsFa() : sectionsDe();

  return (
    <LegalPage
      locale={locale}
      title={locale === "fa" ? "حریم خصوصی" : "Datenschutzerklärung"}
      updated={UPDATED[locale]}
      note={
        locale === "fa" ? (
          <>
            این ترجمه برای آسانی فهم شماست. از نظر حقوقی،{" "}
            <Link href="/de/datenschutz" className="font-semibold underline">نسخهٴ آلمانی</Link> معتبر است.
          </>
        ) : undefined
      }
      intro={
        locale === "fa" ? (
          <p>
            از توجه شما به کار ما سپاسگزاریم. حفاظت از اطلاعات شخصی شما برای ما مهم است. در ادامه، مطابق مادهٴ ۱۳ و ۱۴ مقررات عمومی
            حفاظت از داده‌های اتحادیهٴ اروپا (DSGVO/GDPR)، توضیح می‌دهیم که هنگام بازدید از این وب‌سایت چه اطلاعاتی پردازش می‌شود.
          </p>
        ) : (
          <p>
            Wir freuen uns über Ihr Interesse an unserer Arbeit. Der Schutz Ihrer personenbezogenen Daten ist uns
            ein wichtiges Anliegen. Nachfolgend informieren wir Sie gemäß Art. 13 und 14 DSGVO darüber, welche Daten
            beim Besuch dieser Website verarbeitet werden, wofür und wie lange.
          </p>
        )
      }
      sections={sections}
    />
  );
}

/* ---------------------------------------------------------------- DE */
function sectionsDe(): LegalSection[] {
  return [
    {
      id: "verantwortlicher",
      title: "Verantwortlicher",
      paragraphs: [
        <>
          Verantwortlich im Sinne der DSGVO ist:<br />
          {SITE_NAME_FULL}<br />
          {CONTACT.street}, {CONTACT.streetZip} {CONTACT.city}, Deutschland<br />
          Postanschrift: {CONTACT.poBox}, {CONTACT.poBoxZip} {CONTACT.city}<br />
          Vertretungsberechtigter Vorstand: {ORG.founderCeo}<br />
          E-Mail: <a href={`mailto:${CONTACT.email}`} className="underline">{CONTACT.email}</a><br />
          Telefon: <span dir="ltr">{CONTACT.phoneDisplay}</span>
        </>,
        <>
          Ein Datenschutzbeauftragter ist nicht bestellt, da die Voraussetzungen des Art. 37 DSGVO und § 38 BDSG
          (insbesondere die Mindestzahl ständig mit Datenverarbeitung beschäftigter Personen) nicht vorliegen. Bei
          Fragen zum Datenschutz erreichen Sie uns unter den oben genannten Kontaktdaten.
        </>,
      ],
    },
    {
      id: "grundsaetze",
      title: "Grundsätze und Ihre Sicherheit",
      paragraphs: [
        <>
          Diese Website verwendet <strong>keine</strong> Analyse-, Tracking- oder Marketing-Werkzeuge, keine
          Werbenetzwerke, keine Social-Media-Plugins und keine eingebetteten Fremdinhalte (z. B. YouTube-Videos oder
          Landkarten). Für normale Besucherinnen und Besucher wird <strong>kein Cookie</strong> gesetzt.
        </>,
        <>
          Die verwendeten Schriftarten (Inter, Vazirmatn) werden von unserem eigenen Server ausgeliefert; es findet
          kein Abruf bei Google Fonts oder anderen Schriftdiensten statt.
        </>,
        <>
          Die Übertragung erfolgt durchgehend TLS-verschlüsselt (erkennbar an „https://“ in der Adresszeile). Zusätzlich
          setzen wir technische Schutzmaßnahmen ein (u. a. Content-Security-Policy, HSTS, Begrenzung von
          Anfragehäufigkeit), um Missbrauch der Website und der Formulare zu verhindern.
        </>,
      ],
    },
    {
      id: "hosting",
      title: "Hosting und Server-Logfiles",
      paragraphs: [
        <>
          Diese Website wird bei der Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Die
          Serverfunktionen (z. B. Formularversand) werden in der Region Frankfurt am Main ausgeführt; die statischen
          Inhalte werden über das weltweite Auslieferungsnetz (CDN) von Vercel bereitgestellt.
        </>,
        <>
          Beim Aufruf von {SITE_HOSTNAME} verarbeitet der Hoster automatisch technisch notwendige Zugriffsdaten in
          Server-Logfiles: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, übertragene Datenmenge, Referrer-URL
          sowie Browser- und Betriebssystemkennung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes
          Interesse liegt im sicheren und stabilen Betrieb der Website. Die Logfiles werden vom Hoster je nach Tarif nach
          wenigen Stunden bis höchstens 30 Tagen gelöscht; wir selbst werten sie nicht aus.
        </>,
        <>
          Vercel Inc. hat ihren Sitz in den USA. Die Übermittlung stützt sich auf den Angemessenheitsbeschluss der
          EU-Kommission zum EU-US Data Privacy Framework (Vercel ist dort zertifiziert) sowie ergänzend auf die
          EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO). Mit Vercel besteht ein Vertrag zur
          Auftragsverarbeitung nach Art. 28 DSGVO.
        </>,
      ],
    },
    {
      id: "formulare",
      title: "Kontakt-, Feedback- und Patenschaftsformular",
      paragraphs: [
        <>
          Wenn Sie uns über eines unserer Formulare kontaktieren, verarbeiten wir die von Ihnen eingegebenen Daten:
          beim <strong>Kontaktformular</strong> Name, E-Mail-Adresse, Betreff und Nachricht; beim{" "}
          <strong>Feedbackformular</strong> Ihre Nachricht, Thema und Bewertung sowie optional Name und E-Mail; beim{" "}
          <strong>Patenschafts-/Mitgliedsformular</strong> Name, E-Mail-Adresse, optional Telefonnummer, Ihr Interesse
          und Ihre Nachricht. Pflichtfelder sind gekennzeichnet; alle weiteren Angaben sind freiwillig.
        </>,
        <>
          Die Daten werden per E-Mail (SMTP, verschlüsselte Verbindung) an unser Vereinspostfach übermittelt und dort
          ausschließlich zur Bearbeitung Ihres Anliegens verwendet. Es findet keine Speicherung in einer Datenbank auf
          dem Webserver statt. Rechtsgrundlage ist bei Anfragen zu Patenschaft oder Mitgliedschaft Art. 6 Abs. 1
          lit. b DSGVO (Anbahnung eines Vertrags- bzw. Mitgliedschaftsverhältnisses), im Übrigen Art. 6 Abs. 1 lit. f
          DSGVO (Beantwortung Ihrer Anfrage).
        </>,
        <>
          Zum Schutz vor automatisierten Massensendungen enthalten die Formulare ein für Menschen unsichtbares
          Kontrollfeld, und die Anzahl der Absendungen je IP-Adresse ist begrenzt. Dazu wird Ihre IP-Adresse für
          höchstens 60 Minuten im Arbeitsspeicher des Servers vorgehalten und danach automatisch verworfen
          (Art. 6 Abs. 1 lit. f DSGVO, Schutz des Vereinspostfachs).
        </>,
        <>
          Wir löschen Ihre Anfrage, sobald Ihr Anliegen abschließend bearbeitet ist, spätestens jedoch zwölf Monate
          nach dem letzten Kontakt, sofern nicht ein Patenschafts- oder Mitgliedschaftsverhältnis zustande kommt oder
          gesetzliche Aufbewahrungspflichten entgegenstehen.
        </>,
      ],
    },
    {
      id: "spenden",
      title: "Spenden, Patenschaften und Zuwendungsbestätigungen",
      paragraphs: [
        <>
          Bei Spenden per <strong>Banküberweisung</strong> erhalten wir über unser Konto Ihren Namen, Ihre IBAN, den
          Betrag und den Verwendungszweck. Diese Daten verarbeiten wir zur Verbuchung der Spende, zur Ausstellung einer
          Zuwendungsbestätigung (Spendenquittung) und zur Erfüllung unserer steuer- und vereinsrechtlichen Pflichten
          (Art. 6 Abs. 1 lit. b und lit. c DSGVO). Buchungsbelege bewahren wir nach § 147 AO zehn Jahre auf.
        </>,
        <>
          Bei <strong>Patenschaften</strong> (Programm Hâmi) speichern wir zusätzlich Ihre Kontaktdaten und die
          Zuordnung zur unterstützten Familie, um Sie über den Verlauf zu informieren. Die Daten der unterstützten
          Familien geben wir nicht an Paten weiter, sofern die Betroffenen nicht ausdrücklich zustimmen.
        </>,
        <>
          Für Online-Spenden verlinken wir auf <strong>PayPal</strong>. Beim Anklicken werden Sie auf die Seiten der
          PayPal (Europe) S.à r.l. et Cie, S.C.A., 22–24 Boulevard Royal, L-2449 Luxemburg, weitergeleitet. PayPal ist
          dann eigenständig Verantwortlicher; es gelten die Datenschutzhinweise von PayPal. Auf unserer Website ist
          kein PayPal-Skript eingebunden. Von PayPal erhalten wir Name, E-Mail-Adresse und Betrag der Spende, die wir
          wie oben beschrieben verarbeiten.
        </>,
      ],
    },
    {
      id: "links",
      title: "Externe Links und Vorschaubilder",
      paragraphs: [
        <>
          Unsere Seite „Nützliche Links“ verweist auf Websites Dritter. Damit Sie erkennen, wohin ein Link führt,
          zeigen wir ein Vorschaubild. Dieses stammt entweder aus unserem eigenen Bestand oder wird beim Laden der
          Seite <strong>direkt vom Server der verlinkten Website</strong> in Ihren Browser geladen. Dabei erhält der
          jeweilige Anbieter Ihre IP-Adresse und Browserkennung; die Adresse unserer Seite wird nicht übermittelt
          (Referrer-Policy „no-referrer“). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (verständliche Darstellung
          der Empfehlungen). Wenn Sie das nicht möchten, können Sie das Laden von Fremdbildern in Ihrem Browser
          unterbinden; die Seite bleibt vollständig nutzbar.
        </>,
        <>
          Auf Inhalte und Datenverarbeitung der verlinkten Websites haben wir keinen Einfluss; es gelten die
          Datenschutzerklärungen der jeweiligen Anbieter.
        </>,
      ],
    },
    {
      id: "cookies",
      title: "Cookies und Verwaltungsbereich",
      paragraphs: [
        <>
          Für Besucherinnen und Besucher werden keine Cookies gesetzt und keine Informationen im Speicher Ihres
          Endgeräts abgelegt. Lediglich im nicht öffentlichen Verwaltungsbereich (/admin) wird nach dem Login ein
          technisch notwendiger, signierter Sitzungs-Cookie („schahed_admin“, Laufzeit 12 Stunden, nur über HTTPS und
          nicht per Skript auslesbar) gesetzt. Er dient ausschließlich der Anmeldung der Redaktion (Art. 6 Abs. 1
          lit. f DSGVO) und enthält keine personenbezogenen Daten.
        </>,
      ],
    },
    {
      id: "kinder",
      title: "Bilder und Berichte über unterstützte Personen",
      paragraphs: [
        <>
          Auf unserer Website berichten wir über unsere Arbeit und zeigen Fotos aus Projekten, auch von Kindern.
          Diese Aufnahmen veröffentlichen wir nur mit Einwilligung der abgebildeten Personen bzw. ihrer
          Erziehungsberechtigten (Art. 6 Abs. 1 lit. a DSGVO) und ohne Namen oder Angaben, die eine Identifizierung
          erlauben. Eine Einwilligung kann jederzeit mit Wirkung für die Zukunft widerrufen werden; das Bild wird dann
          entfernt.
        </>,
      ],
    },
    {
      id: "empfaenger",
      title: "Empfänger und Drittlandübermittlung",
      paragraphs: [
        <>
          Innerhalb des Vereins erhalten nur die Personen Zugriff auf Ihre Daten, die mit der Bearbeitung Ihres
          Anliegens, der Buchhaltung oder der Betreuung von Patenschaften befasst sind. Als Auftragsverarbeiter setzen
          wir den Hoster Vercel (siehe oben) und unseren E-Mail-Anbieter ein. Eine Weitergabe an Dritte zu
          Werbezwecken erfolgt nicht.
        </>,
        <>
          Über die Übermittlung an Vercel (USA) hinaus findet keine Übermittlung in Drittländer statt. Soweit wir
          Hilfsprojekte in Afghanistan und Iran durchführen, werden Spenderdaten dorthin nicht weitergegeben.
        </>,
      ],
    },
    {
      id: "rechte",
      title: "Ihre Rechte",
      paragraphs: [
        <>
          Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung
          der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie ein Widerspruchsrecht gegen Verarbeitungen,
          die auf einem berechtigten Interesse beruhen (Art. 21). Eine erteilte Einwilligung können Sie jederzeit mit
          Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3). Wenden Sie sich dazu formlos an die unter 1. genannten
          Kontaktdaten.
        </>,
        <>
          Ihnen steht zudem ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu (Art. 77 DSGVO). Für uns
          zuständig ist: Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit, Ludwig-Erhard-Straße 22,
          20459 Hamburg, <a href="https://datenschutz-hamburg.de" className="underline" rel="noopener noreferrer" target="_blank">datenschutz-hamburg.de</a>.
        </>,
      ],
    },
    {
      id: "aktualitaet",
      title: "Aktualität und Änderungen",
      paragraphs: [
        <>
          {UPDATED.de}. Wir passen diese Datenschutzerklärung an, sobald sich die Datenverarbeitung oder die
          Rechtslage ändert. Die jeweils aktuelle Fassung finden Sie unter {SITE_HOSTNAME}/de/datenschutz.
        </>,
      ],
    },
  ];
}

/* ---------------------------------------------------------------- FA */
function sectionsFa(): LegalSection[] {
  return [
    {
      id: "verantwortlicher",
      title: "مسئول پردازش داده‌ها",
      paragraphs: [
        <>
          مسئول پردازش داده‌ها به مفهوم DSGVO:<br />
          {SITE_NAME_FULL} ({CONTACT.orgNameFa})<br />
          <span dir="ltr">{CONTACT.street}, {CONTACT.streetZip} {CONTACT.city}</span>، آلمان<br />
          نشانی پستی: <span dir="ltr">{CONTACT.poBox}, {CONTACT.poBoxZip} {CONTACT.city}</span><br />
          نمایندهٴ قانونی (هیئت مدیره): {ORG.founderCeo}<br />
          ایمیل: <a href={`mailto:${CONTACT.email}`} className="underline" dir="ltr">{CONTACT.email}</a><br />
          تلفن: <span dir="ltr">{CONTACT.phoneDisplay}</span>
        </>,
        <>
          مأمور حفاظت از داده‌ها تعیین نشده است، زیرا شرایط مادهٴ ۳۷ DSGVO و بند ۳۸ قانون فدرال حفاظت از داده‌های آلمان
          (BDSG) در مورد ما صدق نمی‌کند. برای پرسش‌های مربوط به حریم خصوصی از راه‌های تماس بالا با ما در ارتباط باشید.
        </>,
      ],
    },
    {
      id: "grundsaetze",
      title: "اصول و امنیت شما",
      paragraphs: [
        <>
          این وب‌سایت <strong>هیچ</strong> ابزار تحلیل، ردیابی یا بازاریابی، شبکهٴ تبلیغاتی، افزونهٴ شبکه‌های اجتماعی یا
          محتوای جاسازی‌شدهٴ خارجی (مانند ویدیوهای یوتیوب یا نقشه) به کار نمی‌برد. برای بازدیدکنندگان عادی <strong>هیچ کوکی‌ای</strong>
          ذخیره نمی‌شود.
        </>,
        <>
          فونت‌های استفاده‌شده (Inter و Vazirmatn) از سرور خود ما ارائه می‌شوند؛ هیچ درخواستی به Google Fonts یا سرویس‌های
          فونت دیگر ارسال نمی‌شود.
        </>,
        <>
          انتقال داده‌ها به‌طور کامل با رمزگذاری TLS انجام می‌شود (با «https://» در نوار نشانی مشخص است). همچنین از تدابیر
          فنی حفاظتی (از جمله Content-Security-Policy، HSTS و محدودیت تعداد درخواست‌ها) برای جلوگیری از سوءاستفاده از
          وب‌سایت و فرم‌ها استفاده می‌کنیم.
        </>,
      ],
    },
    {
      id: "hosting",
      title: "میزبانی و فایل‌های لاگ سرور",
      paragraphs: [
        <>
          این وب‌سایت توسط شرکت Vercel Inc.، به نشانی <span dir="ltr">440 N Barranca Ave #4133, Covina, CA 91723, USA</span>
          میزبانی می‌شود. عملکردهای سرور (مانند ارسال فرم‌ها) در منطقهٴ فرانکفورت اجرا می‌شوند؛ محتوای ثابت از طریق شبکهٴ
          توزیع محتوای (CDN) جهانی Vercel ارائه می‌شود.
        </>,
        <>
          هنگام بازدید از {SITE_HOSTNAME}، میزبان به‌صورت خودکار داده‌های دسترسی ضروری فنی را در فایل‌های لاگ ذخیره می‌کند:
          نشانی IP، تاریخ و ساعت، صفحهٴ بازدیدشده، حجم داده‌های منتقل‌شده، نشانی ارجاع‌دهنده و مشخصات مرورگر و سیستم عامل.
          مبنای حقوقی، مادهٴ ۶ بند ۱ حرف f DSGVO است؛ منفعت مشروع ما بهره‌برداری امن و پایدار از وب‌سایت است. این لاگ‌ها
          بسته به تعرفه، پس از چند ساعت و حداکثر ۳۰ روز توسط میزبان حذف می‌شوند؛ ما خود آن‌ها را تحلیل نمی‌کنیم.
        </>,
        <>
          مقر Vercel Inc. در ایالات متحده است. انتقال داده‌ها بر اساس تصمیم کفایت کمیسیون اروپا در چارچوب EU-US Data Privacy
          Framework (که Vercel در آن گواهی شده است) و همچنین بندهای قراردادی استاندارد اتحادیهٴ اروپا (مادهٴ ۴۶ بند ۲ حرف c)
          انجام می‌شود. با Vercel قرارداد پردازش داده به نمایندگی (مادهٴ ۲۸ DSGVO) منعقد شده است.
        </>,
      ],
    },
    {
      id: "formulare",
      title: "فرم‌های تماس، بازخورد و حمایت",
      paragraphs: [
        <>
          اگر از طریق یکی از فرم‌های ما با ما تماس بگیرید، داده‌های واردشده را پردازش می‌کنیم: در <strong>فرم تماس</strong>
          نام، ایمیل، موضوع و پیام؛ در <strong>فرم بازخورد</strong> پیام، موضوع و امتیاز شما و به‌صورت اختیاری نام و ایمیل؛
          در <strong>فرم حمایت/عضویت</strong> نام، ایمیل، شماره تلفن (اختیاری)، نوع علاقه‌مندی و پیام شما. فیلدهای الزامی
          مشخص شده‌اند؛ سایر اطلاعات اختیاری است.
        </>,
        <>
          داده‌ها از طریق ایمیل (SMTP با اتصال رمزگذاری‌شده) به صندوق پستی مؤسسه ارسال و تنها برای رسیدگی به درخواست شما
          استفاده می‌شوند. هیچ داده‌ای در پایگاه دادهٴ سرور وب ذخیره نمی‌شود. مبنای حقوقی برای درخواست‌های حمایت یا عضویت،
          مادهٴ ۶ بند ۱ حرف b (مقدمات قرارداد یا عضویت) و در سایر موارد مادهٴ ۶ بند ۱ حرف f (پاسخ به درخواست شما) است.
        </>,
        <>
          برای جلوگیری از ارسال خودکار انبوه، فرم‌ها یک فیلد کنترلی نامرئی دارند و تعداد ارسال از هر نشانی IP محدود است.
          برای این منظور، نشانی IP شما حداکثر ۶۰ دقیقه در حافظهٴ موقت سرور نگهداری و سپس به‌صورت خودکار پاک می‌شود
          (مادهٴ ۶ بند ۱ حرف f، حفاظت از صندوق پستی مؤسسه).
        </>,
        <>
          درخواست شما پس از رسیدگی نهایی، و حداکثر دوازده ماه پس از آخرین تماس، حذف می‌شود؛ مگر اینکه رابطهٴ حمایت یا
          عضویت برقرار شود یا الزامات قانونی نگهداری مانع حذف باشند.
        </>,
      ],
    },
    {
      id: "spenden",
      title: "کمک‌های مالی، حمایت و رسید کمک",
      paragraphs: [
        <>
          در کمک‌های مالی از طریق <strong>انتقال بانکی</strong>، از طریق حساب خود نام، شماره IBAN، مبلغ و توضیح پرداخت شما را
          دریافت می‌کنیم. این داده‌ها را برای ثبت کمک، صدور رسید کمک مالی (Zuwendungsbestätigung) و انجام تکالیف مالیاتی
          و قانونی مؤسسه پردازش می‌کنیم (مادهٴ ۶ بند ۱ حرف b و c). اسناد حسابداری مطابق بند ۱۴۷ قانون مالیات آلمان (AO)
          ده سال نگهداری می‌شوند.
        </>,
        <>
          در <strong>طرح حامی</strong> علاوه بر این، اطلاعات تماس شما و انتساب به خانوادهٴ تحت حمایت را ذخیره می‌کنیم تا شما را
          از روند کار مطلع کنیم. اطلاعات خانواده‌های تحت حمایت بدون رضایت صریح آنان در اختیار حامیان قرار نمی‌گیرد.
        </>,
        <>
          برای کمک آنلاین به <strong>PayPal</strong> لینک می‌دهیم. با کلیک، به صفحات PayPal (Europe) S.à r.l. et Cie, S.C.A.،
          به نشانی <span dir="ltr">22–24 Boulevard Royal, L-2449 Luxembourg</span> هدایت می‌شوید. در آن مرحله PayPal خود
          مسئول پردازش است و سیاست حریم خصوصی PayPal اعمال می‌شود. در وب‌سایت ما هیچ اسکریپت PayPal جاسازی نشده است. از
          PayPal نام، ایمیل و مبلغ کمک را دریافت می‌کنیم و آن را مطابق توضیح بالا پردازش می‌کنیم.
        </>,
      ],
    },
    {
      id: "links",
      title: "لینک‌های خارجی و تصاویر پیش‌نمایش",
      paragraphs: [
        <>
          صفحهٴ «لینک‌های مفید» به وب‌سایت‌های دیگران ارجاع می‌دهد. برای اینکه بدانید هر لینک به کجا می‌رود، یک تصویر پیش‌نمایش
          نشان می‌دهیم. این تصویر یا از آرشیو خود ماست یا هنگام بارگذاری صفحه <strong>مستقیماً از سرور وب‌سایت مقصد</strong>
          در مرورگر شما بارگذاری می‌شود. در این حالت، آن ارائه‌دهنده نشانی IP و مشخصات مرورگر شما را دریافت می‌کند؛ نشانی
          صفحهٴ ما ارسال نمی‌شود (Referrer-Policy «no-referrer»). مبنای حقوقی، مادهٴ ۶ بند ۱ حرف f (نمایش قابل فهم
          پیشنهادها) است. اگر مایل نیستید، می‌توانید بارگذاری تصاویر خارجی را در مرورگر خود مسدود کنید؛ صفحه کاملاً قابل
          استفاده باقی می‌ماند.
        </>,
        <>
          بر محتوا و پردازش داده‌های وب‌سایت‌های لینک‌شده هیچ کنترلی نداریم؛ سیاست حریم خصوصی همان ارائه‌دهندگان اعمال می‌شود.
        </>,
      ],
    },
    {
      id: "cookies",
      title: "کوکی‌ها و بخش مدیریت",
      paragraphs: [
        <>
          برای بازدیدکنندگان هیچ کوکی‌ای ذخیره و هیچ اطلاعاتی در حافظهٴ دستگاه شما نگهداری نمی‌شود. تنها در بخش غیرعمومی
          مدیریت (/admin) پس از ورود، یک کوکی نشست فنی و امضاشده («schahed_admin»، اعتبار ۱۲ ساعت، فقط از طریق HTTPS و
          غیرقابل خواندن با اسکریپت) ذخیره می‌شود. این کوکی فقط برای ورود هیئت تحریریه است (مادهٴ ۶ بند ۱ حرف f) و
          هیچ دادهٴ شخصی در آن نیست.
        </>,
      ],
    },
    {
      id: "kinder",
      title: "تصاویر و گزارش‌های افراد تحت حمایت",
      paragraphs: [
        <>
          در وب‌سایت خود از کار خود گزارش می‌دهیم و تصاویری از پروژه‌ها، از جمله از کودکان، نشان می‌دهیم. این تصاویر را تنها
          با رضایت افراد یا سرپرستان قانونی آنان (مادهٴ ۶ بند ۱ حرف a) و بدون نام یا مشخصاتی که شناسایی را ممکن کند منتشر
          می‌کنیم. رضایت را می‌توان در هر زمان برای آینده پس گرفت؛ در آن صورت تصویر حذف می‌شود.
        </>,
      ],
    },
    {
      id: "empfaenger",
      title: "دریافت‌کنندگان و انتقال به کشورهای ثالث",
      paragraphs: [
        <>
          در داخل مؤسسه، تنها افرادی که به درخواست شما، حسابداری یا پیگیری حمایت‌ها رسیدگی می‌کنند به داده‌های شما دسترسی
          دارند. به‌عنوان پردازشگر به نمایندگی، از میزبان Vercel (بالا) و ارائه‌دهندهٴ ایمیل خود استفاده می‌کنیم. داده‌ها برای
          مقاصد تبلیغاتی به اشخاص ثالث داده نمی‌شود.
        </>,
        <>
          جز انتقال به Vercel (ایالات متحده)، هیچ انتقالی به کشورهای ثالث انجام نمی‌شود. اطلاعات کمک‌کنندگان برای پروژه‌های
          امدادی در افغانستان و ایران به آن کشورها منتقل نمی‌شود.
        </>,
      ],
    },
    {
      id: "rechte",
      title: "حقوق شما",
      paragraphs: [
        <>
          شما حق دسترسی (مادهٴ ۱۵)، اصلاح (۱۶)، حذف (۱۷)، محدودسازی پردازش (۱۸)، انتقال داده‌ها (۲۰) و اعتراض به
          پردازش‌های مبتنی بر منفعت مشروع (۲۱) را دارید. رضایت داده‌شده را می‌توانید هر زمان برای آینده پس بگیرید (مادهٴ ۷
          بند ۳). برای این کار به‌صورت غیررسمی از راه‌های تماس بند ۱ با ما در ارتباط باشید.
        </>,
        <>
          همچنین حق شکایت نزد یک مرجع نظارتی حفاظت از داده‌ها را دارید (مادهٴ ۷۷). مرجع مسئول ما: کمیسر حفاظت از داده‌ها و
          آزادی اطلاعات هامبورگ، <span dir="ltr">Ludwig-Erhard-Straße 22, 20459 Hamburg</span>،{" "}
          <a href="https://datenschutz-hamburg.de" className="underline" dir="ltr" rel="noopener noreferrer" target="_blank">datenschutz-hamburg.de</a>.
        </>,
      ],
    },
    {
      id: "aktualitaet",
      title: "به‌روزرسانی و تغییرات",
      paragraphs: [
        <>
          {UPDATED.fa}. هرگاه پردازش داده‌ها یا وضعیت حقوقی تغییر کند، این بیانیه را به‌روز می‌کنیم. نسخهٴ فعلی همیشه در
          <span dir="ltr"> {SITE_HOSTNAME}/fa/datenschutz </span>در دسترس است.
        </>,
      ],
    },
  ];
}
