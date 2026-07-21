import { isLocale, t as translate, type Locale } from "@/lib/i18n";
import { ORG } from "@/lib/site-config";
import PageHero from "@/components/PageHero";
import ImpactSection from "@/components/home/ImpactSection";
import DonateCta from "@/components/home/DonateCta";

/**
 * Ueber uns — echte Gruendungsgeschichte (aus schahed.com "درباره شاهد").
 * Narrativer, seitenspezifischer Inhalt inline (haelt i18n.ts schlank).
 */
const STORY: Record<Locale, {
  introTitle: string; introBody: string;
  historyTitle: string; historyBody: string;
  visionTitle: string; visionBody: string;
  ceoTitle: string; ceoBody: string;
  factsTitle: string;
}> = {
  de: {
    introTitle: "Vorstellung",
    introBody:
      "Die Stiftung Schahed nahm 2012 unter der Registernummer VR 21688 als gemeinnützige, regierungsunabhängige Organisation ihre Arbeit auf — mit dem Ziel, arme, schutzbedürftige und obdachlose Kinder in Afghanistan zu fördern und zu unterstützen. In über elf Jahren ist Schahed durch die humanitären Beiträge wohltätiger Menschen und den unermüdlichen Einsatz freiwilliger und angestellter Kräfte zu einer wichtigen Anlaufstelle für Afghaninnen und Afghanen im In- und Ausland geworden. Bis Ende 2022 wurden über 200 bedürftige Familien und 700 Schülerinnen und Schüler zeitweise oder langfristig unterstützt — durch soziale, medizinische, finanzielle, schulische und berufliche Hilfen sowie Sachspenden.",
    historyTitle: "Geschichte & Gründung",
    historyBody:
      "Schahed wurde 2012 in Hamburg registriert. Die Gründungsidee stammt von Herrn Mohammad Zargarpour; gemeinsam mit einem elfköpfigen Kuratorium wurde die Organisation ins Leben gerufen — neun der Gründungsmitglieder sind bis heute aktiv. Von Beginn an galt der Grundsatz, dass eine Stiftung nicht allein auf einzelne Personen bauen darf, sondern auf eine breite Gemeinschaft von Unterstützern. Unter dem Leitsatz „Wird ein Kind gebildet, wird eine Familie aus der Armut gerettet“ trat Schahed an, die umfassende Hilfe für die benachteiligten Menschen Afghanistans stetig auszuweiten.",
    visionTitle: "Unsere Vision",
    visionBody:
      "Unsere feste Überzeugung: Erreicht ein Mensch ein höheres Maß an Bildung und Wissen, wird zuallererst seine Familie wirtschaftlich abgesichert. Deshalb schaffen wir in Afghanistan Bildungs- und Ausbildungsangebote — Koranschulen, private und öffentliche Schulen, Waisenhäuser. Bis heute wurden 25 Projekte auf den Weg gebracht, mehrere davon sind bereits in Betrieb. Der zweite Schritt ist die Schaffung von Beschäftigung: In verschiedenen Provinzen entstehen Grundlagen für Arbeit, und wir arbeiten am Aufbau von Werkstätten und Produktionsstätten. Ziel unserer Fünf-Jahres-Vision ist die Selbstständigkeit der betreuten Familien durch Bildung und Beschäftigung.",
    ceoTitle: "Botschaft des Geschäftsführers",
    ceoBody:
      "Seit der Gründung sind Gleichheit und die Vermeidung jeder Form von Diskriminierung ein Grundprinzip für unser Gründungsteam. Schahed hilft in den verschiedenen Provinzen Afghanistans ohne Ausnahme — ohne Bevorzugung einzelner Personen oder Regionen und ohne Ansehen von Volkszugehörigkeit, Herkunft oder Sprache, unter voller Wahrung von Unparteilichkeit und Gleichbehandlung. Dass die deutschen Behörden Schahed nach eingehender Prüfung der Tätigkeit in Afghanistan anerkannt haben, bestätigt die Einhaltung dieser grundlegenden, unparteiischen Prinzipien.",
    factsTitle: "Auf einen Blick",
  },
  fa: {
    introTitle: "معرفی شاهد",
    introBody:
      "مؤسسه خیریه شاهد از سال ۲۰۱۲ و با شماره ثبت VR 21688 در قالب یک سازمان غیرانتفاعی-غیردولتی با انگیزه تقویت و حمایت کودکان فقیر، آسیب‌پذیر و بی‌خانمان در افغانستان کار خود را آغاز کرده است. در طول یازده سال فعالیت، شاهد با بهره‌گیری از کمک‌های انسان‌دوستانه مردم نیکوکار و تلاش پیگیر نیروهای داوطلب و موظف به موفقیت‌های چشمگیری دست یافته و به یکی از قطب‌های حمایتی هموطنان داخل و خارج از کشور تبدیل شده است. شاهد تا پایان سال ۲۰۲۲ بیش از ۲۰۰ خانواده نیازمند و ۷۰۰ دانش‌آموز دختر و پسر را تحت حمایت موقت یا طولانی‌مدت خود قرار داده است.",
    historyTitle: "تاریخچه و نحوه تأسیس",
    historyBody:
      "موسسه خیریه شاهد در سال ۲۰۱۲ در شهر هامبورگ آلمان به ثبت رسید. ایده اولیه تأسیس توسط آقای محمد زرگرپور مطرح شد و اعضای هیئت امنا با ۱۱ عضو اقدام به تأسیس این مجموعه کردند که از این جمع، ۹ نفر همچنان به فعالیت خیرخواهانه خود ادامه می‌دهند. بنیان‌گذاران بر این باور بودند که یک مؤسسه نمی‌تواند تنها با اتکا به شخص یا گروه محدودی این راه را طی کند؛ از این‌رو شاهد با شعار «هرگاه طفلی باسواد بشود، یک خانواده از فقر نجات پیدا خواهد کرد» به ثبت رسید.",
    visionTitle: "بیانیه چشم‌انداز",
    visionBody:
      "باور ما این است که هرگاه فردی از یک خانواده نیازمند باسواد شود، آن خانواده به سوی سعادت و تأمین معیشت خود حرکت خواهد کرد. در همین راستا تا امروز ۲۵ پروژه در دست کار قرار گرفته که تعدادی به بهره‌برداری رسیده‌اند؛ با عناوین دارالقران، مدارس خصوصی و عمومی، یتیم‌خانه و مانند آن. قدم دوم، ایجاد زمینه‌های کاری و اشتغال‌زایی است. در نتیجه، خودکفایی خانواده‌های تحت پوشش با ابزار آگاهی و سوادآموزی، مهم‌ترین هدف چشم‌انداز پنج‌ساله موسسه خیریه شاهد است.",
    ceoTitle: "پیام مدیرعامل",
    ceoBody:
      "از بدو تأسیس، برابری و جلوگیری از هرگونه تبعیض برای هیئت مؤسس یک اصل اساسی بوده است. شاهد تا امروز در ولایات مختلف افغانستان، بدون هیچ استثنائی، بدون اعطای امتیاز به فرد یا ناحیه‌ای خاص و بدون در نظر گرفتن قوم، نژاد و زبان مددجو و با رعایت کامل اصل بیطرفی و برابری، به هموطنان خود مدد‌رسانی کرده است. موافقت دولت آلمان با شاهد پس از نظارت دقیق بر فعالیت‌های آن، مهر تأییدی بر رعایت این اصول است.",
    factsTitle: "در یک نگاه",
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);
  const s = STORY[locale];
  const motto = locale === "fa" ? ORG.mottoFa : ORG.mottoDe;

  const facts = locale === "fa"
    ? [
        ["سال تأسیس", "۲۰۱۲ · هامبورگ"],
        ["شماره ثبت", "VR 21688"],
        ["مدیرعامل", "محمد زرگرپور"],
        ["معاون مالی", "سید توفیق حسینی"],
        ["معاون اداری", "محمد باقر صبوری"],
      ]
    : [
        ["Gegründet", "2012 · Hamburg"],
        ["Registernummer", "VR 21688"],
        ["Geschäftsführer", "Mohammad Zargarpour"],
        ["Stv. Finanzen", "Seyed Toufigh Hosseini"],
        ["Stv. Verwaltung", "Mohammad Bagher Sabouri"],
      ];

  const Block = ({ title, body }: { title: string; body: string }) => (
    <div>
      <h2 className="text-2xl font-bold text-brand-900">{title}</h2>
      <p className="mt-3 leading-relaxed text-brand-700/85">{body}</p>
    </div>
  );

  return (
    <>
      <PageHero eyebrow={tr("mission.eyebrow")} title={tr("nav.about")} subtitle={motto} />

      <section className="mx-auto max-w-3xl px-5 py-16 space-y-12">
        <Block title={s.introTitle} body={s.introBody} />

        {/* Fakten-Box */}
        <div className="rounded-2xl border border-sand-200 bg-white p-7 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-accent-500">{s.factsTitle}</h3>
          <dl className="mt-4 divide-y divide-sand-200">
            {facts.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-sm text-brand-600">{k}</dt>
                <dd className="text-sm font-medium text-brand-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Block title={s.historyTitle} body={s.historyBody} />
        <Block title={s.visionTitle} body={s.visionBody} />
        <Block title={s.ceoTitle} body={s.ceoBody} />
      </section>

      <ImpactSection locale={locale} />
      <div className="py-6" />
      <DonateCta locale={locale} />
    </>
  );
}
