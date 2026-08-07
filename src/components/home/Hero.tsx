import Image from "next/image";
import Link from "next/link";
import { t as translate, type Locale } from "@/lib/i18n";
import { ORG, CONTACT } from "@/lib/site-config";
import { DONATE_PATH } from "@/lib/nav";
import { IconArrow, IconHeart } from "@/components/Icons";

/**
 * Hero-Hintergrundfoto — Kindergruppe aus dem Vereinsflyer.
 *
 * Kinder mit Spielzeug und Schulbuechern tragen die Kernbotschaft des Vereins
 * ("Jedes Kind verdient eine Zukunft") unmittelbarer als die vorherige
 * Iftar-Verteilung. Zuschnitt aus der Flyerseite: Vereinslogo, Schriftbloecke
 * und der orange Flyer-Keil sind entfernt, alle Gesichter bleiben erhalten.
 */
const HERO_IMAGE = "/images/schahed/kinder_gruppe_flyer.jpg";

/**
 * Akzentwort der Headline pro Sprache. Wird farbig hervorgehoben, sofern es
 * im uebersetzten Titel vorkommt — andernfalls bleibt der Titel unveraendert.
 * So bleibt der Text komplett im CMS pflegbar (data/ui-text.json).
 */
const ACCENT_WORD: Record<Locale, string> = {
  de: "Zukunft",
  fa: "آینده",
};

/**
 * Hebt das Akzentwort im Titel hervor, ohne den restlichen Text anzutasten.
 * Faellt sauber auf den unveraenderten Titel zurueck, wenn das Wort fehlt.
 */
function AccentTitle({ title, accent }: { title: string; accent: string }) {
  const i = accent ? title.indexOf(accent) : -1;
  if (i === -1) return <>{title}</>;

  return (
    <>
      {title.slice(0, i)}
      <span className="relative whitespace-nowrap text-accent-300">
        {accent}
        {/* Zarter Unterstrich als eleganter Akzent statt harter Farbflaeche */}
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-accent-400/70"
        />
      </span>
      {title.slice(i + accent.length)}
    </>
  );
}

/**
 * Intro / Hero der Startseite — bildschirmfuellend, zentriert.
 *
 * Gestaltungsprinzip (wie bei etablierten Hilfsorganisationen): ein echtes,
 * gut sichtbares Foto schafft sofort emotionale Verbindung, darueber eine
 * grosse, ruhige Headline und ein klarer Handlungsaufruf. Der Vertrauensbalken
 * (Telefon, Zeiten, Gruendungsjahr) macht die Organisation sofort greifbar.
 */
export default function Hero({ locale }: { locale: Locale }) {
  const tr = (k: string) => translate(locale, k);
  const href = (p: string) => `/${locale}${p}`;
  const motto = locale === "fa" ? ORG.eduMottoFa : ORG.eduMottoDe;
  const isFa = locale === "fa";

  return (
    <section className="relative flex min-h-[88svh] items-center overflow-hidden text-white">
      {/* --- Hintergrund --- */}
      <div className="absolute inset-0 bg-brand-900" />

      {/*
        Foto via next/image statt CSS-background: liefert AVIF/WebP,
        responsive Groessen und laedt als LCP-Element mit Prioritaet.

        sizes auf dem Handy bewusst 340vw und nicht 100vw: das Bild ist
        Querformat (1.6), der Viewport hochkant. object-cover skaliert deshalb
        nach der HOEHE — bei 684 px Viewportbreite wird das Bild rund 2250 px
        breit dargestellt, also gut das Dreifache der Viewportbreite. Mit
        100vw laedt Next.js nur eine ~750-px-Variante, die der Browser dann
        dreifach hochskaliert; genau das sah unscharf aus.
      */}
      <Image
        src={HERO_IMAGE}
        alt=""
        aria-hidden
        fill
        priority
        sizes="(max-width: 640px) 340vw, 100vw"
        quality={90}
        className="absolute inset-0 object-cover object-[50%_16%] sm:object-[50%_28%]"
      />

      {/*
        Lesbarkeits-Overlay: bewusst zurueckhaltend, damit die Gesichter der
        Kinder klar erkennbar bleiben. Oben und in der Bildmitte sehr leicht,
        nach unten dichter — dort stehen Headline, Buttons und Vertrauensbalken
        und brauchen ausreichenden Kontrast gegen die weisse Schrift.
      */}
      {/*
        Handy: das Bild ist Querformat (1.61), der Viewport hochkant (~0.46).
        object-cover muss also stark hineinzoomen — zentrierter Text landet
        zwangslaeufig auf den Gesichtern. Darum hier ein steiler Verlauf:
        oberes Drittel fast klar (Gesichter frei), ab 52 % dicht, damit der
        nach unten geschobene Text auf ruhigem Grund steht.
      */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(95,44,20,0.12)_0%,rgba(95,44,20,0.18)_30%,rgba(95,44,20,0.72)_52%,rgba(95,44,20,0.93)_72%,rgba(95,44,20,0.96)_100%)] sm:hidden" />

      {/* Ab Tablet bleibt der sanfte Verlauf: dort ist genug Breite, der Text
          sitzt neben statt auf den Gesichtern. */}
      <div className="absolute inset-0 hidden bg-gradient-to-b from-brand-900/45 via-brand-900/25 to-brand-900/80 sm:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-brand-900/35 to-transparent sm:block" />

      {/* Sanft atmende Farbakzente (dezent) */}
      <div className="floaty pointer-events-none absolute -end-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-accent-500/20 blur-3xl" />
      <div
        className="floaty pointer-events-none absolute -bottom-32 -start-24 h-96 w-96 rounded-full bg-brand-400/15 blur-3xl"
        style={{ animationDelay: "3s" }}
      />

      {/* --- Inhalt --- */}
      {/*
        pb reserviert Platz fuer die absolut positionierte Wellen-Trennlinie
        (48px) — sonst verdeckt sie auf schmalen Schirmen den Vertrauensbalken.
      */}
      {/*
        pt auf dem Handy bewusst gross: schiebt den Inhalt unter die
        Kindergesichter, statt sie zu ueberdecken. Ab Tablet normaler Abstand.
      */}
      <div className="relative mx-auto w-full max-w-[1180px] px-5 pb-32 pt-[40svh] text-center sm:pb-36 sm:pt-28">
        <div className="mx-auto max-w-4xl">
          <span className="reveal inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-100 ring-1 ring-white/20 backdrop-blur-sm">
            <IconHeart className="h-4 w-4" />
            {tr("hero.tagline")}
          </span>

          <h1
            className="reveal mt-7 text-[2.6rem] font-extrabold leading-[1.1] tracking-tight drop-shadow-sm sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            <AccentTitle title={tr("hero.title")} accent={ACCENT_WORD[locale]} />
          </h1>

          <p
            className="reveal mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-sand-100/90"
            style={{ animationDelay: "160ms" }}
          >
            {tr("hero.subtitle")}
          </p>

          <p
            className="reveal mt-5 text-base font-semibold text-accent-200"
            style={{ animationDelay: "200ms" }}
            dir={isFa ? "rtl" : "ltr"}
          >
            {motto}
          </p>

          {/* Handlungsaufrufe */}
          <div
            className="reveal mt-10 flex flex-wrap justify-center gap-3"
            style={{ animationDelay: "260ms" }}
          >
            <Link
              href={href(DONATE_PATH)}
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-accent-900/30 transition hover:bg-accent-400 hover:scale-[1.03]"
            >
              {tr("hero.cta.donate")}
              <IconArrow className="h-4 w-4 rtl-flip" />
            </Link>
            <Link
              href={href("/projects")}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-4 text-base font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/20"
            >
              {tr("hero.cta.projects")}
            </Link>
          </div>

          {/* Vertrauensbalken: direkt erreichbar, ohne Suchen */}
          <div
            className="reveal mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/15 pt-7 text-sm text-sand-100/85"
            style={{ animationDelay: "320ms" }}
          >
            <a
              href={`tel:${CONTACT.phone}`}
              className="font-semibold text-white transition hover:text-accent-300"
              dir="ltr"
            >
              {CONTACT.phoneDisplay}
            </a>
            <span dir={isFa ? "rtl" : "ltr"}>{isFa ? CONTACT.hoursFa : CONTACT.hours}</span>
            <span>
              {isFa ? "ثبتشده در هامبورگ" : "Eingetragener Verein in Hamburg"} · {ORG.foundedYear}
            </span>
          </div>
        </div>
      </div>

      <svg
        className="wave-divider absolute inset-x-0 bottom-0 text-sand-50"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path fill="currentColor" d="M0 60V20c240 30 480 30 720 15S1200-5 1440 20v40z" />
      </svg>
    </section>
  );
}
