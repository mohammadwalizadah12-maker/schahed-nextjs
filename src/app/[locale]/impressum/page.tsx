import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n";
import { CONTACT, ORG, SITE_NAME_FULL, SITE_URL } from "@/lib/site-config";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const fa = raw === "fa";
  return {
    title: fa ? "اطلاعات ناشر (Impressum)" : "Impressum",
    alternates: {
      canonical: `${SITE_URL}/${fa ? "fa" : "de"}/impressum`,
      languages: {
        de: `${SITE_URL}/de/impressum`,
        fa: `${SITE_URL}/fa/impressum`,
        "x-default": `${SITE_URL}/de/impressum`,
      },
    },
  };
}

/**
 * Impressum nach § 5 DDG (ehem. § 5 TMG) und § 18 Abs. 2 MStV, zweisprachig.
 * Daten aus site-config.ts (Flyer, Vereinsregister).
 */
export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const fa = locale === "fa";

  const addr = (
    <span dir="ltr">
      {CONTACT.street}, {CONTACT.streetZip} {CONTACT.city}
    </span>
  );
  const pobox = (
    <span dir="ltr">
      {CONTACT.poBox}, {CONTACT.poBoxZip} {CONTACT.city}
    </span>
  );

  const sections: LegalSection[] = fa
    ? [
        {
          id: "anbieter",
          title: "اطلاعات مطابق بند ۵ قانون خدمات دیجیتال آلمان (DDG)",
          paragraphs: [
            <>
              {SITE_NAME_FULL} ({CONTACT.orgNameFa})<br />
              {addr}، آلمان<br />
              نشانی پستی: {pobox}
            </>,
          ],
        },
        {
          id: "vertretung",
          title: "نمایندگی قانونی",
          paragraphs: [
            <>
              {ORG.founderCeo} (رئیس هیئت مدیره)<br />
              {ORG.deputyFinance} (معاون مالی)<br />
              {ORG.deputyAdmin} (معاون اداری)
            </>,
          ],
        },
        {
          id: "kontakt",
          title: "تماس",
          paragraphs: [
            <>
              تلفن: <a href={`tel:${CONTACT.phone}`} className="underline" dir="ltr">{CONTACT.phoneDisplay}</a><br />
              ایمیل: <a href={`mailto:${CONTACT.email}`} className="underline" dir="ltr">{CONTACT.email}</a>
            </>,
          ],
        },
        {
          id: "register",
          title: "ثبت و شماره مالیاتی",
          paragraphs: [
            <>
              ثبت‌شده در دفتر ثبت انجمن‌ها.<br />
              دادگاه و شماره ثبت: <span dir="ltr">{ORG.register}</span><br />
              شماره مالیاتی: <span dir="ltr">{ORG.taxNumber}</span>
            </>,
            <>
              این مؤسسه از سوی ادارهٴ مالیات هامبورگ به‌عنوان نهاد خیریه (gemeinnützig) شناخته شده است؛ کمک‌های مالی
              در آلمان قابل کسر از مالیات هستند.
            </>,
          ],
        },
        {
          id: "inhalt",
          title: "مسئول محتوا مطابق بند ۱۸ (۲) قانون رسانه‌های آلمان (MStV)",
          paragraphs: [<>{ORG.founderCeo}، {addr}</>],
        },
        {
          id: "haftung",
          title: "سلب مسئولیت",
          paragraphs: [
            <>
              با وجود بررسی دقیق محتوا، هیچ مسئولیتی در قبال محتوای لینک‌های خارجی نمی‌پذیریم. مسئولیت محتوای صفحات
              لینک‌شده تنها بر عهدهٴ گردانندگان آن‌هاست.
            </>,
            <>
              محتوای این وب‌سایت با دقت تهیه شده است؛ با این حال برای درستی، کامل بودن و به‌روز بودن آن ضمانتی داده
              نمی‌شود. مطالب و تصاویر مشمول حق نشر آلمان هستند و استفاده از آن‌ها خارج از حدود قانون به اجازهٴ کتبی ما
              نیاز دارد.
            </>,
          ],
        },
        {
          id: "streit",
          title: "حل اختلاف مصرف‌کننده",
          paragraphs: [
            <>
              ما مایل و مکلف به شرکت در روند حل اختلاف نزد مرجع داوری مصرف‌کنندگان نیستیم.
            </>,
          ],
        },
        {
          id: "datenschutz",
          title: "حریم خصوصی",
          paragraphs: [
            <>
              اطلاعات مربوط به پردازش داده‌های شخصی در{" "}
              <Link href="/fa/datenschutz" className="font-semibold underline">بیانیهٴ حریم خصوصی</Link> آمده است.
            </>,
          ],
        },
      ]
    : [
        {
          id: "anbieter",
          title: "Angaben gemäß § 5 DDG",
          paragraphs: [
            <>
              {SITE_NAME_FULL}<br />
              {CONTACT.street}<br />
              {CONTACT.streetZip} {CONTACT.city}<br />
              Postanschrift: {pobox}
            </>,
          ],
        },
        {
          id: "vertretung",
          title: "Vertreten durch",
          paragraphs: [
            <>
              {ORG.founderCeo} (Vorstandsvorsitzender)<br />
              {ORG.deputyFinance} (stellvertretender Vorsitzender, Finanzen)<br />
              {ORG.deputyAdmin} (stellvertretender Vorsitzender, Verwaltung)
            </>,
          ],
        },
        {
          id: "kontakt",
          title: "Kontakt",
          paragraphs: [
            <>
              Telefon: <a href={`tel:${CONTACT.phone}`} className="underline" dir="ltr">{CONTACT.phoneDisplay}</a><br />
              E-Mail: <a href={`mailto:${CONTACT.email}`} className="underline">{CONTACT.email}</a>
            </>,
          ],
        },
        {
          id: "register",
          title: "Registereintrag und Steuernummer",
          paragraphs: [
            <>
              Eintragung im Vereinsregister.<br />
              Registergericht und Registernummer: {ORG.register}<br />
              Steuernummer: {ORG.taxNumber}
            </>,
            <>
              Der Verein ist vom Finanzamt Hamburg als gemeinnützig anerkannt; Spenden sind in Deutschland steuerlich
              abzugsfähig.
            </>,
          ],
        },
        {
          id: "inhalt",
          title: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
          paragraphs: [<>{ORG.founderCeo}, {CONTACT.street}, {CONTACT.streetZip} {CONTACT.city}</>],
        },
        {
          id: "haftung",
          title: "Haftungsausschluss und Urheberrecht",
          paragraphs: [
            <>
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
              Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
            </>,
            <>
              Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt; für Richtigkeit, Vollständigkeit und
              Aktualität können wir jedoch keine Gewähr übernehmen. Texte und Bilder unterliegen dem deutschen
              Urheberrecht; jede Verwendung außerhalb der gesetzlichen Schranken bedarf unserer schriftlichen Zustimmung.
            </>,
          ],
        },
        {
          id: "streit",
          title: "Verbraucherstreitbeilegung",
          paragraphs: [
            <>
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </>,
          ],
        },
        {
          id: "datenschutz",
          title: "Datenschutz",
          paragraphs: [
            <>
              Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer{" "}
              <Link href="/de/datenschutz" className="font-semibold underline">Datenschutzerklärung</Link>.
            </>,
          ],
        },
      ];

  return (
    <LegalPage
      locale={locale}
      title={fa ? "اطلاعات ناشر (Impressum)" : "Impressum"}
      updated={fa ? "مطابق قانون آلمان؛ نسخهٴ آلمانی معتبر است" : "Angaben nach deutschem Recht"}
      note={
        fa ? (
          <>
            این ترجمه برای آسانی فهم شماست. از نظر حقوقی،{" "}
            <Link href="/de/impressum" className="font-semibold underline">نسخهٴ آلمانی</Link> معتبر است.
          </>
        ) : undefined
      }
      sections={sections}
    />
  );
}
