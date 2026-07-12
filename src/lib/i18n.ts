/**
 * Zweisprachigkeit DE / FA (Farsi/Dari).
 *
 * Inhalte aus dem offiziellen Flyer (Afghanisches Hilfswerk Schahed e.V.)
 * und der Original-Website uebernommen. FA-Texte sind die Originale der Stiftung.
 *
 * QUALITAETS-UPGRADE ggue. belal-moschee: server-seitiges Locale-Routing
 * /[locale] (/de, /fa) statt client-only localStorage. Beide Sprachen sind
 * eigenstaendige, indexierbare URLs; <html lang/dir> server-gerendert (kein Flash).
 */

export type Locale = "de" | "fa";
export const LOCALES: Locale[] = ["de", "fa"];
export const DEFAULT_LOCALE: Locale = "de";
export const RTL_LOCALES: Locale[] = ["fa"];

export function isLocale(x: string | undefined | null): x is Locale {
  return x === "de" || x === "fa";
}
export function dirOf(locale: Locale): "ltr" | "rtl" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

export const LOCALE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  fa: "دری",
};

export type Dict = Record<string, string>;

export const MESSAGES: Record<Locale, Dict> = {
  de: {
    // --- Navigation ---
    "nav.home": "Startseite",
    "nav.about": "Über uns",
    "nav.projects": "Programme",
    "nav.donate": "Helfen & Spenden",
    "nav.membership": "Pate werden",
    "nav.news": "Aktuelles",
    "nav.contact": "Kontakt",
    "nav.donateCta": "Jetzt spenden",

    // --- Hero (Flyer-Claim) ---
    "hero.tagline": "Seit 2012 · Hamburg",
    "hero.title": "Jedes Kind verdient eine Zukunft.",
    "hero.subtitle":
      "Selbst die kleinste Spende kann den Bedürftigen in Afghanistan Hoffnung schenken. Das Afghanische Hilfswerk Schahed schlägt seit 2012 Brücken zwischen großzügigen Spendern und bedürftigen Familien.",
    "hero.cta.donate": "Jetzt spenden",
    "hero.cta.projects": "Unsere Programme",

    // --- Zitat (Flyer) ---
    "quote.text": "Der Duft von Rosen liegt auf den Händen derer, die geben.",

    // --- Aufruf: A Call for Humanity and Hope (Flyer) ---
    "appeal.eyebrow": "Ein Aufruf zu Menschlichkeit und Hoffnung",
    "appeal.title": "Augen warten auf Ihre Hilfe",
    "appeal.p1":
      "Jahrzehntelang haben Krieg, Armut und Ungerechtigkeit das Leben von Millionen Menschen geprägt und zu Hunger, Vertreibung, Krankheit und zahlreichen humanitären Herausforderungen geführt.",
    "appeal.p2":
      "Waisen, alleinstehende Frauen und bedürftige Familien sind mehr denn je auf Mitgefühl und Unterstützung angewiesen. Ihre Hilfe kann Leid lindern, ein hungerndes Kind ernähren, einem Kranken die Behandlung ermöglichen und gefährdeten Familien neue Hoffnung geben.",
    "appeal.p3":
      "Anhaltende Krisen und wirtschaftliche Unsicherheit haben die sozialen und wirtschaftlichen Grundlagen Afghanistans schwer erschüttert. Millionen Menschen kämpfen täglich ums Überleben — unzählige Waisen, Menschen mit Behinderungen, Flüchtlinge und bedürftige Familien warten auf helfende Hände.",
    "appeal.p4":
      "Das Afghanische Hilfswerk Schahed e.V. setzt sich dafür ein, Bedürftige zu unterstützen und Brücken zwischen großzügigen Spendern und bedürftigen Familien zu schlagen. Gemeinsam können wir eine bessere und hoffnungsvollere Zukunft gestalten.",
    "appeal.closing": "Dank Ihrer Unterstützung lebt die Hoffnung weiter.",

    // --- Statistiken (UN-Zahlen, Flyer) ---
    "stats.eyebrow": "Die Lage in Afghanistan",
    "stats.title": "Warum jede Spende zählt",
    "stats.source":
      "Quellen: Berichte der Vereinten Nationen, der unabhängigen Menschenrechtskommission, des Ministeriums für Arbeit und Soziales Afghanistans sowie des Kinderhilfsfonds.",
    "stat.needAid": "Menschen in Afghanistan sind auf humanitäre Hilfe angewiesen",
    "stat.hunger": "Menschen leiden unter akuter Ernährungsunsicherheit und Hunger",
    "stat.noSchool": "Kinder haben keinen Zugang zu Bildung",
    "stat.malnutrition": "Kinder wurden 2025 wegen Mangelernährung behandelt",
    "stat.women": "bedürftige Frauen erhielten Nahrungsmittelhilfe",
    "stat.illiterate": "der 10-jährigen Kinder können keinen einfachen Text lesen",

    // --- Mission ---
    "mission.eyebrow": "Wer wir sind",
    "mission.title": "Hilfe, die Zukunft schafft",
    "mission.text":
      "Das Afghanische Hilfswerk Schahed e.V. ist eine 2012 in Hamburg gegründete, gemeinnützige und regierungsunabhängige Organisation (VR 21688). In über zwölf Jahren ist es zu einer wichtigen Anlaufstelle für Afghaninnen und Afghanen im In- und Ausland geworden — getragen von Spenderinnen und Spendern sowie ehrenamtlich Engagierten.",
    "mission.value1.title": "Neutralität & Gleichheit",
    "mission.value1.text":
      "Wir helfen ohne Ansehen von Volk, Herkunft oder Sprache — mit voller Wahrung von Unparteilichkeit und Gleichbehandlung.",
    "mission.value2.title": "Bildung als Schlüssel",
    "mission.value2.text":
      "Unser Leitgedanke: Wird ein Kind gebildet, findet eine ganze Familie den Weg aus der Armut.",
    "mission.value3.title": "Nachhaltige Selbstständigkeit",
    "mission.value3.text":
      "Über Bildung und Beschäftigung führen wir Familien zur wirtschaftlichen Eigenständigkeit — das Ziel unserer Fünf-Jahres-Vision.",

    // --- Impact / Zahlen (Stand 2023/1402) ---
    "impact.eyebrow": "Unsere Wirkung",
    "impact.title": "Was wir gemeinsam erreichen",
    "impact.families": "Familien unter Patenschaft",
    "impact.people": "betreute Menschen",
    "impact.students": "geförderte Schüler pro Jahr",
    "impact.patrons": "Paten aus 13 Ländern",

    // --- Programme ---
    "projects.eyebrow": "Unsere Arbeit",
    "projects.title": "Vier Programme für ein Ziel",
    "projects.subtitle":
      "Auf Basis jahrelanger Bedarfsanalyse haben wir vier aufeinander abgestimmte Hilfsprogramme entwickelt.",
    "projects.more": "Alle Programme ansehen",
    "projects.support": "Dieses Programm unterstützen",

    "prog.hami.title": "Patenschafts-Programm (Hâmi)",
    "prog.hami.text":
      "Unser ältestes Programm: Paten übernehmen eine oder mehrere bedürftige Familien und sichern mit einem monatlichen Beitrag deren Lebensunterhalt — besonders alleinstehende Mütter und Familien mit erkranktem oder erwerbsunfähigem Ernährer.",
    "prog.hami.detail":
      "Gestartet 2011 mit 20 Familien, hat sich das Programm auf 527 Familien und 1.766 Menschen (Stand 2023) ausgeweitet, getragen von 493 Paten aus Deutschland, den Niederlanden, den USA, Kanada, Norwegen, Belgien, Frankreich, den VAE, der Schweiz, Schweden, dem Iran und Afghanistan. Betreut werden Familien in Herat, Kabul und Farah sowie afghanische Geflüchtete in Maschhad.",

    "prog.danesh.title": "Bildungs-Programm (Dânesh)",
    "prog.danesh.text":
      "Seit 2014 sichern wir Kindern und Jugendlichen den Schulbesuch, die sonst wegen Armut vom Lernen ausgeschlossen blieben — mit Schulgebühren, Lehrmitteln, Beratung und Stipendien.",
    "prog.danesh.detail":
      "Jährlich erreicht das Programm rund 3.000 afghanische Schülerinnen und Schüler in Maschhad, Torbat-e Dscham, Kerman, Isfahan, Kabul, Herat und Farah. Leistungen: (1) allgemeine Schulkosten (Anmeldung, Bücher, Versicherung, Uniform, Schulweg, Lernmaterial, Kleidung), (2) Workshops sowie Bildungs- und psychologische Beratung für Schüler und Eltern, (3) Wissens-Wettbewerbe, (4) Bildungs- und Erlebniscamps, (5) Motivations-Seminare, (6) Bildungsdarlehen für bedürftige Studierende, (7) Übernahme von Studien- und Abschlussarbeitskosten.",

    "prog.salamat.title": "Gesundheits-Programm (Salâmat)",
    "prog.salamat.text":
      "Medizinische Versorgung und Behandlungshilfe für erkrankte Menschen unter unserer Betreuung, die sich Untersuchungen, Medikamente oder Therapien nicht leisten können.",

    "prog.maluli.title": "Programm für Menschen mit Behinderung (Ma'lulin)",
    "prog.maluli.text":
      "Gezielte Unterstützung für Menschen mit Behinderung und ihre Familien — von Hilfsmitteln bis zur Begleitung im Alltag.",

    // --- Spenden ---
    "donate.eyebrow": "Ihre Spende wirkt",
    "donate.title": "Werden Sie Teil der Hilfe",
    "donate.subtitle":
      "Ob einmalig oder als Pate — jede Spende erreicht die Menschen, die sie am dringendsten brauchen.",
    "donate.paypal": "Mit PayPal spenden",
    "donate.paypalHint": "Schnell und sicher online spenden — einmalig oder regelmäßig.",
    "donate.paypalAccount": "PayPal-Konto",
    "donate.bankTitle": "Spende per Überweisung",
    "donate.accountHolder": "Kontoinhaber",
    "donate.iban": "IBAN",
    "donate.bic": "BIC",
    "donate.bank": "Bank",
    "donate.reference": "Verwendungszweck",
    "donate.referenceHint":
      "Bitte Programm (z. B. „Hâmi“ oder „Dânesh“) und ggf. Ihre Adresse für die Spendenquittung angeben.",
    "donate.taxNote":
      "Als in Deutschland anerkannte gemeinnützige Organisation stellen wir auf Wunsch eine Spendenbescheinigung aus. Steuer-Nr. 12/422/14431.",

    // --- Patenschaft ---
    "membership.eyebrow": "Mitmachen",
    "membership.title": "Pate werden",
    "membership.subtitle":
      "Übernehmen Sie eine Patenschaft und begleiten Sie eine Familie verlässlich auf ihrem Weg aus der Armut.",
    "membership.benefit1": "Sie unterstützen gezielt eine oder mehrere Familien",
    "membership.benefit2": "Regelmäßige Berichte über die Wirkung Ihrer Hilfe",
    "membership.benefit3": "Teil eines weltweiten Netzwerks von 493 Paten",
    "membership.form.name": "Vor- und Nachname",
    "membership.form.email": "E-Mail-Adresse",
    "membership.form.phone": "Telefon (optional)",
    "membership.form.type": "Ich interessiere mich für",
    "membership.form.typeActive": "Patenschaft (Hâmi)",
    "membership.form.typeSupport": "Einmalige/regelmäßige Spende",
    "membership.form.message": "Nachricht (optional)",
    "membership.form.submit": "Anfrage senden",
    "membership.form.privacy":
      "Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zu.",
    "membership.form.success": "Vielen Dank! Wir melden uns in Kürze bei Ihnen.",

    // --- Aktuelles ---
    "news.eyebrow": "Neuigkeiten",
    "news.title": "Aktuelles aus unserer Arbeit",
    "news.subtitle": "Berichte, Aktionen und Updates.",
    "news.more": "Alle Meldungen",
    "news.empty": "Zurzeit keine aktuellen Meldungen.",
    "news.readMore": "Weiterlesen",
    "news.cat.news": "Nachrichten & Medien",
    "news.cat.article": "Artikel",
    "news.back": "Zurück zu allen Beiträgen",
    "news.published": "Veröffentlicht am",
    "news.related": "Weitere Beiträge",

    // --- Kontakt ---
    "contact.eyebrow": "Kontakt",
    "contact.title": "Schreiben Sie uns",
    "contact.subtitle":
      "Sie können uns über das Formular schreiben oder direkt über die untenstehenden Wege erreichen.",
    "contact.address": "Anschrift",
    "contact.phone": "Telefon",
    "contact.email": "E-Mail",
    "contact.hours": "Erreichbarkeit",
    "contact.form.name": "Vor- und Nachname",
    "contact.form.email": "E-Mail",
    "contact.form.subject": "Betreff",
    "contact.form.message": "Nachricht",
    "contact.form.submit": "Nachricht senden",
    "contact.form.success": "Danke! Ihre Nachricht wurde gesendet.",

    // --- Footer ---
    "footer.about":
      "Das Afghanische Hilfswerk Schahed e.V. ist eine 2012 in Hamburg gegründete gemeinnützige Organisation für humanitäre Hilfe in Afghanistan und für afghanische Geflüchtete.",
    "footer.quicklinks": "Schnellzugriff",
    "footer.legal": "Rechtliches",
    "footer.contact": "Kontakt",
    "footer.rights": "Alle Rechte vorbehalten.",
    "footer.imprint": "Impressum",
    "footer.privacy": "Datenschutz",
    "footer.donateCta": "Jede Spende zählt.",

    // --- Allgemein ---
    "common.loading": "Wird geladen ...",
    "common.langSwitch": "زبان / Sprache",
    "common.backHome": "Zurück zur Startseite",
    "common.notFound": "Seite nicht gefunden",
    "common.copy": "Kopieren",
    "common.copied": "Kopiert!",
  },

  fa: {
    // --- Navigation ---
    "nav.home": "خانه",
    "nav.about": "درباره شاهد",
    "nav.projects": "طرحها",
    "nav.donate": "کمکرسانی",
    "nav.membership": "حامی شوید",
    "nav.news": "اطلاعیهها",
    "nav.contact": "تماس با ما",
    "nav.donateCta": "کمک میکنم",

    // --- Hero (Flyer-Claim) ---
    "hero.tagline": "از سال ۲۰۱۲ · هامبورگ",
    "hero.title": "هر کودک شایسته یک آینده است.",
    "hero.subtitle":
      "کمک شما، هر چند اندک، میتواند امیدی بزرگ در دل انسانهای نیازمند افغانستان روشن کند. موسسه خیریه شاهد از سال ۲۰۱۲ میان نیکوکاران و خانوادههای محروم پلی برقرار میکند.",
    "hero.cta.donate": "کمک میکنم",
    "hero.cta.projects": "طرحهای ما",

    // --- Zitat (Saadi, Flyer) ---
    "quote.text": "کسی نیک بیند به هر دو سرای / که نیکی رساند به خلق خدای",

    // --- Aufruf ---
    "appeal.eyebrow": "دعوت به انسانیت و امید",
    "appeal.title": "چشمان منتظر مهربانی تو",
    "appeal.p1":
      "دههها بحران و ناامنی، زیرساختهای اجتماعی و اقتصادی افغانستان را ویران کرده و میلیونها انسان را با مشکلات سخت زندگی روبهرو ساخته است.",
    "appeal.p2":
      "حمایت شما میتواند سهمی ارزشمند در کاهش درد و رنج این انسانها داشته باشد؛ میتواند کودکی را از گرسنگی نجات دهد، بیماری را درمان کند و امید را به خانوادهای بیپناه بازگرداند.",
    "appeal.p3":
      "امروز زنان بیسرپرست، کودکان یتیم، افراد معلول، آوارگان و خانوادههای نیازمند، بیش از هر زمان دیگری به حمایت و همدلی شما نیاز دارند.",
    "appeal.p4":
      "ما در «موسسه خیریه شاهد» با هدف یاریرساندن به نیازمندان و ایجاد پلی میان نیکوکاران و خانوادههای محروم فعالیت میکنیم تا بتوانیم در کنار یکدیگر، آیندهای روشنتر برای انسانهای نیازمند بسازیم.",
    "appeal.closing": "با همراهی شما، امید زنده میماند.",

    // --- Statistiken ---
    "stats.eyebrow": "وضعیت افغانستان",
    "stats.title": "چرا هر کمک اهمیت دارد",
    "stats.source":
      "منابع: گزارشهای سازمان ملل، کمیسیون مستقل حقوق بشر، وزارت کار و امور اجتماعی افغانستان و صندوق حمایت کودکان افغانستان.",
    "stat.needAid": "نفر در افغانستان نیازمند کمکهای بشردوستانه هستند",
    "stat.hunger": "نفر با ناامنی شدید غذایی و خطر گرسنگی روبهرو هستند",
    "stat.noSchool": "کودک از آموزش محروم هستند",
    "stat.malnutrition": "کودک در سال ۲۰۲۵ تحت درمان سوءتغذیه قرار گرفتهاند",
    "stat.women": "زن نیازمند حمایت تغذیهای بودهاند",
    "stat.illiterate": "کودکان ۱۰ ساله قادر به خواندن یک متن ساده نیستند",

    // --- Mission ---
    "mission.eyebrow": "ما که هستیم",
    "mission.title": "کمکی که آینده میسازد",
    "mission.text":
      "موسسه خیریه شاهد یک سازمان غیرانتفاعی و غیردولتی است که در سال ۲۰۱۲ در هامبورگ با شماره ثبت VR 21688 تأسیس شد. در طول بیش از دوازده سال فعالیت، به یکی از قطبهای حمایتی شهروندان مقیم و خارج از افغانستان تبدیل شده است.",
    "mission.value1.title": "بیطرفی و برابری",
    "mission.value1.text":
      "بدون در نظر گرفتن طایفه، نژاد و زبان مددجو و با رعایت کامل اصل بیطرفی و برابری به هموطنان خود کمک میکنیم.",
    "mission.value2.title": "دانش، کلید رهایی",
    "mission.value2.text":
      "باور ما این است: هرگاه فردی از یک خانواده نیازمند باسواد شود، آن خانواده به سوی موفقیت و تأمین معیشت حرکت میکند.",
    "mission.value3.title": "خودکفایی پایدار",
    "mission.value3.text":
      "با ابزار آگاهی، آموزش و اشتغالزایی، خانوادههای تحت پوشش را به خودکفایی میرسانیم؛ مهمترین هدف چشمانداز پنجساله ما.",

    // --- Impact ---
    "impact.eyebrow": "تأثیر ما",
    "impact.title": "دستاوردهای مشترک ما",
    "impact.families": "خانواده تحت پوشش طرح حامی",
    "impact.people": "نفر تحت حمایت",
    "impact.students": "دانشآموز در سال",
    "impact.patrons": "حامی از ۱۳ کشور",

    // --- Programme ---
    "projects.eyebrow": "کار ما",
    "projects.title": "چهار طرح برای یک هدف",
    "projects.subtitle":
      "بر اساس نیازسنجی چندینساله، چهار طرح حمایتی هماهنگ طراحی و تکمیل شده است.",
    "projects.more": "دیدن همه طرحها",
    "projects.support": "حمایت از این طرح",

    "prog.hami.title": "طرح حامی",
    "prog.hami.text":
      "قدیمیترین طرح ما: هر حامی یک یا چند خانواده نیازمند را تحت حمایت قرار داده و با پرداخت مبلغی به معیشت آنان کمک میکند — بهویژه زنان سرپرست خانوار و خانوادههایی که با بیماری یا از کار افتادگی نانآور مواجهاند.",
    "prog.hami.detail":
      "این طرح که در سال ۱۳۹۰ با ۲۰ خانواده آغاز شد، تا سال ۱۴۰۲ به ۵۲۷ خانواده و ۱۷۶۶ نفر گسترش یافته و توسط ۴۹۳ حامی از آلمان، هلند، آمریکا، کانادا، نروژ، بلژیک، فرانسه، امارات، سوئیس، سوئد، ایران و افغانستان پشتیبانی میشود. خانوادههای تحت پوشش در هرات، کابل، فراه و نیز مهاجران مقیم مشهد مقدس هستند.",

    "prog.danesh.title": "طرح دانش",
    "prog.danesh.text":
      "از سال ۱۳۹۳ برای تحصیل کودکانی تلاش میکنیم که ممکن است به دلیل فقر از آموزش بازبمانند — با تأمین هزینه تحصیل، لوازم، مشاوره و کمکهزینه.",
    "prog.danesh.detail":
      "خدمات این طرح سالانه به حدود ۳۰۰۰ دانشآموز افغانستانی در مشهد مقدس، تربت جام، کرمان، اصفهان، کابل، هرات و فراه ارائه میشود. خدمات: (۱) هزینههای عمومی تحصیل (ثبتنام، کتب، بیمه، لباس فرم، سرویس، لوازمالتحریر، کیف، کفش، لباس گرم)، (۲) کارگاهها و مشاوره تحصیلی و روانشناسی برای دانشآموزان و والدین، (۳) مسابقات علمی-انگیزشی، (۴) اردوهای علمی-تفریحی، (۵) همایشهای انگیزشی، (۶) وام تحصیلی به دانشجویان نیازمند، (۷) پرداخت شهریه دانشگاهی و هزینه پایاننامه.",

    "prog.salamat.title": "طرح سلامت",
    "prog.salamat.text":
      "خدمات درمانی و کمک به درمان برای بیماران تحت پوشش که توان پرداخت هزینه معاینه، دارو یا درمان را ندارند.",

    "prog.maluli.title": "طرح معلولین",
    "prog.maluli.text":
      "حمایت هدفمند از افراد دارای معلولیت و خانوادههای آنان — از تأمین وسایل کمکی تا همراهی در زندگی روزمره.",

    // --- Spenden ---
    "donate.eyebrow": "کمک شما اثر دارد",
    "donate.title": "بخشی از این کمک باشید",
    "donate.subtitle":
      "چه یکبار و چه بهعنوان حامی — هر کمک به دست کسانی میرسد که بیش از همه به آن نیاز دارند.",
    "donate.paypal": "کمک با پیپال",
    "donate.paypalHint": "کمک آنلاین، سریع و امن — یکباره یا منظم.",
    "donate.paypalAccount": "حساب پیپال",
    "donate.bankTitle": "کمک از طریق حواله بانکی",
    "donate.accountHolder": "صاحب حساب",
    "donate.iban": "شماره حساب (IBAN)",
    "donate.bic": "کد بانک (BIC)",
    "donate.bank": "بانک",
    "donate.reference": "موضوع پرداخت",
    "donate.referenceHint":
      "لطفاً نام طرح (مثلاً «حامی» یا «دانش») و در صورت نیاز آدرس خود را برای رسید کمک بنویسید.",
    "donate.taxNote":
      "بهعنوان سازمان خیریه بهرسمیتشناختهشده در آلمان، در صورت درخواست رسید کمک صادر میکنیم. شماره مالیاتی ۱۲/۴۲۲/۱۴۴۳۱.",

    // --- Patenschaft ---
    "membership.eyebrow": "همراهی",
    "membership.title": "حامی شوید",
    "membership.subtitle":
      "یک خانواده را تحت حمایت خود بگیرید و در مسیر رهایی از فقر همراه او باشید.",
    "membership.benefit1": "شما هدفمند از یک یا چند خانواده حمایت میکنید",
    "membership.benefit2": "گزارشهای منظم از اثر کمک شما",
    "membership.benefit3": "بخشی از شبکهای جهانی متشکل از ۴۹۳ حامی",
    "membership.form.name": "نام و تخلص",
    "membership.form.email": "آدرس ایمیل",
    "membership.form.phone": "شماره تماس (اختیاری)",
    "membership.form.type": "علاقهمندم به",
    "membership.form.typeActive": "حمایت (طرح حامی)",
    "membership.form.typeSupport": "کمک یکباره / منظم",
    "membership.form.message": "پیام (اختیاری)",
    "membership.form.submit": "ارسال درخواست",
    "membership.form.privacy":
      "سیاست حفظ حریم خصوصی را خواندهام و با پردازش اطلاعاتم موافقم.",
    "membership.form.success": "سپاسگزاریم! بهزودی با شما تماس میگیریم.",

    // --- Aktuelles ---
    "news.eyebrow": "تازهها",
    "news.title": "تازهترینهای کار ما",
    "news.subtitle": "گزارشها، برنامهها و بهروزرسانیها.",
    "news.more": "همه اطلاعیهها",
    "news.empty": "در حال حاضر اطلاعیهای موجود نیست.",
    "news.readMore": "ادامه مطلب",
    "news.cat.news": "اخبار و رسانه",
    "news.cat.article": "مقالات",
    "news.back": "بازگشت به همه مطالب",
    "news.published": "منتشرشده در",
    "news.related": "مطالب دیگر",

    // --- Kontakt ---
    "contact.eyebrow": "تماس",
    "contact.title": "با ما در تماس باشید",
    "contact.subtitle":
      "میتوانید با تکمیل فرم، پیام خود را برای ما ارسال کنید یا از طریق راههای ارتباطی زیر با ما تماس بگیرید.",
    "contact.address": "آدرس",
    "contact.phone": "تلفن",
    "contact.email": "ایمیل",
    "contact.hours": "ساعت کاری",
    "contact.form.name": "نام و تخلص",
    "contact.form.email": "ایمیل",
    "contact.form.subject": "موضوع",
    "contact.form.message": "پیام",
    "contact.form.submit": "ارسال پیام",
    "contact.form.success": "سپاس! پیام شما ارسال شد.",

    // --- Footer ---
    "footer.about":
      "موسسه خیریه شاهد سازمانی خیریه است که در سال ۲۰۱۲ در هامبورگ برای کمکهای بشردوستانه در افغانستان و به هموطنان مهاجر تأسیس شد.",
    "footer.quicklinks": "دسترسی سریع",
    "footer.legal": "حقوقی",
    "footer.contact": "تماس",
    "footer.rights": "تمام حقوق محفوظ است.",
    "footer.imprint": "اطلاعات ناشر (Impressum)",
    "footer.privacy": "حریم خصوصی",
    "footer.donateCta": "هر کمک ارزشمند است.",

    // --- Allgemein ---
    "common.loading": "در حال بارگذاری ...",
    "common.langSwitch": "زبان / Sprache",
    "common.backHome": "بازگشت به خانه",
    "common.notFound": "صفحه یافت نشد",
    "common.copy": "کپی",
    "common.copied": "کپی شد!",
  },
};

/** Server-seitiges Dictionary fuer eine Locale. */
export function getDict(locale: Locale): Dict {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
}

/** Uebersetzt einen Key; faellt auf DE und dann den Key selbst zurueck. */
export function t(locale: Locale, key: string): string {
  return MESSAGES[locale]?.[key] ?? MESSAGES[DEFAULT_LOCALE][key] ?? key;
}
