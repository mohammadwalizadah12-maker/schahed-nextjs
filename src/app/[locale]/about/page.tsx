import Image from "next/image";
import Link from "next/link";
import { isLocale, t as translate, type Locale } from "@/lib/i18n";
import { ORG } from "@/lib/site-config";
import { DONATE_PATH } from "@/lib/nav";
import PageHero from "@/components/PageHero";
import ImpactSection from "@/components/home/ImpactSection";
import DonateCta from "@/components/home/DonateCta";
import { IconArrow, IconBook, IconHandHeart, IconUsers } from "@/components/Icons";

/**
 * Über uns.
 *
 * Alle Texte liegen in i18n (about.*) und sind über das CMS (/admin/texte)
 * pflegbar. Die Seite wechselt den Rhythmus: Vorstellung mit Foto, Fakten als
 * Kacheln, Geschichte und Vision als Text-Bild-Paare, die Botschaft des
 * Geschäftsführers als Zitat, der Vorstand als Karten.
 *
 * Fotos: Iftar-Küche der Partnerorganisation (bisher ungenutzt im Repo).
 */
const PHOTOS = {
  /** Reihe von Freiwilligen beim Abfuellen — zeigt die Menschen. */
  intro: { src: "/images/schahed/editor_64509e.jpg", w: 700, h: 393, ratio: "aspect-[16/10]" },
  /** Grosskessel der Kueche — zeigt den Umfang. */
  history: { src: "/images/schahed/editor_ea1c60.jpg", w: 700, h: 525, ratio: "aspect-[4/3]" },
  /** Gang mit fertig gepackten Waren — zeigt die Ausgabe. */
  vision: { src: "/images/schahed/editor_a80283.jpg", w: 700, h: 393, ratio: "aspect-[16/10]" },
};

/** Ersten Satz als Vorspann abtrennen (funktioniert für DE und FA). */
function splitLead(text: string): [string, string] {
  const m = text.match(/^(.+?[.!?؟])\s+([\s\S]+)$/);
  return m ? [m[1], m[2]] : [text, ""];
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);
  const href = (p: string) => `/${locale}${p}`;
  const motto = locale === "fa" ? ORG.mottoFa : ORG.mottoDe;
  const fa = locale === "fa";
  // Ziffern für Farsi (۰..۹), Deutsch unverändert.
  const num = (n: number) => (fa ? String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]) : String(n));

  const [introLead, introRest] = splitLead(tr("about.introBody"));
  const [ceoLead, ceoRest] = splitLead(tr("about.ceoBody"));
  // Lange erste Saetze eine Stufe kleiner setzen, damit der Vorspann nicht
  // zur Textwand wird (DE ist hier deutlich laenger als FA).
  const leadSize = (t: string) =>
    t.length > 190 ? "text-xl sm:text-[1.35rem]" : "text-2xl sm:text-[1.7rem]";

  const facts = [
    { k: tr("about.factSince"), v: tr("about.factSinceVal"), big: num(ORG.foundedYear) },
    { k: tr("about.factRegister"), v: tr("about.factRegisterVal"), big: "VR" },
    { k: tr("about.factProjects"), v: tr("about.factProjectsVal"), big: num(25) },
    { k: tr("about.factFounders"), v: tr("about.factFoundersVal"), big: num(11) },
  ];

  const board = [
    { name: tr("about.factCeoVal"), role: tr("about.factCeo"), Icon: IconUsers },
    { name: tr("about.factDeputyFinVal"), role: tr("about.factDeputyFin"), Icon: IconHandHeart },
    { name: tr("about.factDeputyAdminVal"), role: tr("about.factDeputyAdmin"), Icon: IconBook },
  ];

  const initials = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("");

  return (
    <>
      <PageHero eyebrow={tr("mission.eyebrow")} title={tr("nav.about")} subtitle={motto} />

      {/* 1. Vorstellung: Text links, rechts Foto und Fakten uebereinander.
             Die Kacheln fuellen die Spalte, damit unter dem Foto keine leere
             Flaeche stehen bleibt. */}
      <section className="mx-auto max-w-[1180px] px-5 pt-16 sm:pt-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div data-reveal>
            <Eyebrow>{tr("about.introTitle")}</Eyebrow>
            <p className={`mt-4 font-semibold leading-snug text-brand-900 ${leadSize(introLead)}`}>
              {introLead}
            </p>
            {introRest && (
              <p className="mt-5 leading-relaxed text-brand-800/85">{introRest}</p>
            )}
          </div>

          <div className="space-y-4">
            <figure className="relative" data-reveal>
              <div className="absolute -end-3 -top-3 h-full w-full rounded-3xl bg-accent-100/70" aria-hidden />
              <div className={`relative overflow-hidden rounded-3xl shadow-lg shadow-brand-900/10 ${PHOTOS.intro.ratio}`}>
                <Image
                  src={PHOTOS.intro.src}
                  alt={tr("about.photoIntro")}
                  width={PHOTOS.intro.w}
                  height={PHOTOS.intro.h}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  quality={75}
                  className="h-full w-full object-cover"
                />
              </div>
            </figure>

            <div className="grid grid-cols-2 gap-4" data-reveal-stagger>
              {facts.map((f) => (
                <div key={f.k} className="rounded-2xl border border-sand-200 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-extrabold tracking-tight text-accent-600 sm:text-3xl">{f.big}</p>
                  <p className="mt-1.5 text-sm font-semibold text-brand-900">{f.k}</p>
                  <p className="mt-0.5 text-xs leading-snug text-brand-700">{f.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Geschichte: Bild links, Text rechts (in RTL gespiegelt) */}
      <section className="mx-auto max-w-[1180px] px-5 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <figure className="relative order-2 lg:order-1" data-reveal>
            <div className="absolute -bottom-3 -start-3 h-full w-full rounded-3xl bg-sand-200/80" aria-hidden />
            <div className={`relative overflow-hidden rounded-3xl shadow-lg shadow-brand-900/10 ${PHOTOS.history.ratio}`}>
              <Image
                src={PHOTOS.history.src}
                alt={tr("about.photoHistory")}
                width={PHOTOS.history.w}
                height={PHOTOS.history.h}
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={75}
                className="h-full w-full object-cover"
              />
            </div>
          </figure>
          <div className="order-1 lg:order-2" data-reveal>
            <Eyebrow>{tr("about.historyEyebrow")}</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">{tr("about.historyTitle")}</h2>
            <p className="mt-5 leading-relaxed text-brand-800/85">{tr("about.historyBody")}</p>
            <blockquote className="mt-6 border-s-4 border-accent-400 ps-4 text-lg font-semibold italic text-brand-700">
              „{motto}“
            </blockquote>
          </div>
        </div>
      </section>

      {/* 4. Vision: Text links, Bild rechts, auf Sand-Grund */}
      <section className="bg-gradient-to-b from-sand-100 to-sand-50 py-20">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div data-reveal>
              <Eyebrow>{tr("about.visionEyebrow")}</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">{tr("about.visionTitle")}</h2>
              <p className="mt-5 leading-relaxed text-brand-800/85">{tr("about.visionBody")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={href("/projects")}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
                >
                  {tr("projects.more")}
                  <IconArrow className="h-4 w-4 rtl-flip" />
                </Link>
                <Link
                  href={href(DONATE_PATH)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-800 ring-1 ring-sand-300 transition hover:bg-sand-100"
                >
                  {tr("nav.donateCta")}
                </Link>
              </div>
            </div>
            <figure className="relative" data-reveal>
              <div className="absolute -end-3 -top-3 h-full w-full rounded-3xl bg-brand-100/80" aria-hidden />
              <div className={`relative overflow-hidden rounded-3xl shadow-lg shadow-brand-900/10 ${PHOTOS.vision.ratio}`}>
                <Image
                  src={PHOTOS.vision.src}
                  alt={tr("about.photoVision")}
                  width={PHOTOS.vision.w}
                  height={PHOTOS.vision.h}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={75}
                  className="h-full w-full object-cover"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* 5. Botschaft des Geschäftsführers als Zitat + Vorstand */}
      <section className="mx-auto max-w-[1180px] px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <figure className="relative rounded-3xl border border-sand-200 bg-white p-8 shadow-sm sm:p-10" data-reveal>
            <span aria-hidden className="absolute -top-5 start-8 font-serif text-7xl leading-none text-accent-300">“</span>
            <Eyebrow>{tr("about.ceoTitle")}</Eyebrow>
            <blockquote className="mt-4">
              <p className={`font-semibold leading-snug text-brand-900 ${leadSize(ceoLead)}`}>{ceoLead}</p>
              {ceoRest && <p className="mt-4 leading-relaxed text-brand-800/85">{ceoRest}</p>}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-sand-200 pt-5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">
                {initials(ORG.founderCeo)}
              </span>
              <span>
                <span className="block font-semibold text-brand-900">{tr("about.factCeoVal")}</span>
                <span className="block text-sm text-brand-700">{tr("about.factCeo")}</span>
              </span>
            </figcaption>
          </figure>

          <div data-reveal>
            <Eyebrow>{tr("about.boardEyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-bold text-brand-900">
              {tr("about.boardTitle")}
            </h2>
            <ul className="mt-6 space-y-3" data-reveal-stagger>
              {board.map(({ name, role, Icon }) => (
                <li key={name} className="lift flex items-center gap-4 rounded-2xl border border-sand-200 bg-white p-4 shadow-sm">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon />
                  </span>
                  <span>
                    <span className="block font-semibold text-brand-900">{name}</span>
                    <span className="block text-sm text-brand-700">{role}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-brand-700">
              {tr("about.boardNote")}
            </p>
          </div>
        </div>
      </section>

      <ImpactSection locale={locale} />
      <div className="py-6" />
      <DonateCta locale={locale} />
    </>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-widest text-accent-500">{children}</p>
  );
}
