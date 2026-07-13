import Link from "next/link";
import { t as translate, type Locale } from "@/lib/i18n";
import { ORG } from "@/lib/site-config";
import { DONATE_PATH } from "@/lib/nav";
import { IconArrow, IconHeart } from "@/components/Icons";

/** Hero-Hintergrundfoto — echtes Foto der Iftar-Verteilung (schahed.com-Archiv). */
const HERO_IMAGE = "/images/schahed/posts_558fec.jpg";

/**
 * Hero im Flyer-Look: warmes Terrakotta mit Hintergrundfoto + sanft "atmenden" Blobs.
 */
export default function Hero({ locale }: { locale: Locale }) {
  const tr = (k: string) => translate(locale, k);
  const href = (p: string) => `/${locale}${p}`;
  const motto = locale === "fa" ? ORG.eduMottoFa : ORG.eduMottoDe;

  return (
    <section className="relative overflow-hidden text-white">
      {/* Hintergrund: Foto + Terrakotta-Verlauf darueber */}
      <div className="absolute inset-0 bg-brand-800" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-800/95 via-brand-700/85 to-brand-900/95" />
      <div className="floaty pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent-500/25 blur-3xl" />
      <div className="floaty pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" style={{ animationDelay: "3s" }} />

      <div className="relative mx-auto max-w-[1180px] px-5 py-24 sm:py-32">
        <div className="max-w-2xl">
          <span className="reveal inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-100 ring-1 ring-white/15">
            <IconHeart className="h-4 w-4" />
            {tr("hero.tagline")}
          </span>
          <h1 className="reveal mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl" style={{ animationDelay: "80ms" }}>
            {tr("hero.title")}
          </h1>
          <p className="reveal mt-5 max-w-xl text-lg text-sand-100/90" style={{ animationDelay: "160ms" }}>
            {tr("hero.subtitle")}
          </p>
          <p className="reveal mt-4 text-base font-semibold text-brand-100" style={{ animationDelay: "200ms" }} dir={locale === "fa" ? "rtl" : "ltr"}>
            {motto}
          </p>
          <div className="reveal mt-9 flex flex-wrap gap-3" style={{ animationDelay: "260ms" }}>
            <Link
              href={href(DONATE_PATH)}
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-accent-900/30 transition hover:bg-accent-400 hover:scale-[1.03]"
            >
              {tr("hero.cta.donate")}
              <IconArrow />
            </Link>
            <Link
              href={href("/projects")}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3.5 font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              {tr("hero.cta.projects")}
            </Link>
          </div>
        </div>
      </div>

      <svg className="wave-divider relative text-sand-50" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path fill="currentColor" d="M0 60V20c240 30 480 30 720 15S1200-5 1440 20v40z" />
      </svg>
    </section>
  );
}
