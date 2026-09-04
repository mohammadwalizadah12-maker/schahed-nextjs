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
      {/*
        brand-200 (warmes Gold) statt accent-200 (Lachsrot): das Akzentwort steht
        auf dem hellsten Teil des Fotos und ging im Rotton darin unter. Gold
        hebt sich sowohl vom Foto als auch von der weissen Schrift klar ab.
      */}
      <span className="relative whitespace-nowrap text-brand-200">
        {accent}
        {/* Zarter Unterstrich als eleganter Akzent statt harter Farbflaeche */}
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-accent-300"
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
    <section className="relative overflow-hidden bg-brand-900 text-white sm:flex sm:min-h-[88svh] sm:items-center">

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
        width={2440}
        height={1520}
        priority
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 220vw, 100vw"
        quality={90}
        className="w-full object-cover sm:absolute sm:inset-0 sm:h-full sm:object-[50%_28%]"
      />

      {/*
        Handy: das Foto laeuft unten in die Textflaeche aus, statt mit harter
        Kante zu enden. Der Verlauf setzt erst bei 46 Prozent ein — die
        Gesichter beider Reihen bleiben unberuehrt, verdeckt wird nur der
        Streifen mit Spielzeug und Boden.
        63vw entspricht der Bildhoehe (100vw / Seitenverhaeltnis 1.6).
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[63vw] bg-[linear-gradient(to_bottom,transparent_46%,rgba(95,44,20,0.5)_68%,rgba(95,44,20,0.9)_87%,#5f2c14_100%)] sm:hidden"
      />

      {/*
        Lesbarkeits-Overlay: bewusst zurueckhaltend, damit die Gesichter der
        Kinder klar erkennbar bleiben. Oben und in der Bildmitte sehr leicht,
        nach unten dichter — dort stehen Headline, Buttons und Vertrauensbalken
        und brauchen ausreichenden Kontrast gegen die weisse Schrift.
      */}
      {/* Ab Tablet liegt das Foto als Hintergrund hinter dem Text und braucht
          ein Lesbarkeits-Overlay. Auf dem Handy nicht — dort steht der Text
          unter dem Foto auf eigener Flaeche. */}
      <div className="absolute inset-0 hidden bg-gradient-to-b from-brand-900/70 via-brand-900/60 to-brand-900/88 sm:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-brand-900/35 to-transparent sm:block" />
      {/*
        Zusaetzlicher weicher Schleier hinter dem Textblock: das Foto ist in
        der Mitte hell (Sand, helle Kleidung), dort verlor die Schrift ihren
        Kontrast. Der Schleier liegt nur unter dem Text, die Gesichter am
        Bildrand bleiben unangetastet.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_72%_60%_at_50%_52%,rgba(95,44,20,0.78)_35%,rgba(95,44,20,0.45)_65%,transparent_85%)] sm:block"
      />

      {/* Sanft atmende Farbakzente (dezent) */}
      <div className="floaty pointer-events-none absolute -end-32 -top-32 hidden h-[28rem] w-[28rem] rounded-full bg-accent-500/20 blur-3xl sm:block" />
      <div
        className="floaty pointer-events-none absolute -bottom-32 -start-24 hidden h-96 w-96 rounded-full bg-brand-400/15 blur-3xl sm:block"
        style={{ animationDelay: "3s" }}
      />

      {/* --- Inhalt --- */}
      {/*
        pb reserviert Platz fuer die absolut positionierte Wellen-Trennlinie
        (48px) — sonst verdeckt sie auf schmalen Schirmen den Vertrauensbalken.
      */}
      {/* Negativer Abstand auf dem Handy: der Inhalt beginnt im unteren
          Bilddrittel, damit Foto und Text ineinander uebergehen. */}
      <div className="relative mx-auto -mt-[16vw] w-full max-w-[1180px] px-5 pb-32 text-center sm:mt-0 sm:pb-36 sm:pt-28">
        <div className="mx-auto max-w-4xl">
          <span className="reveal inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-100 ring-1 ring-white/20 backdrop-blur-sm">
            <IconHeart className="h-4 w-4" />
            {tr("hero.tagline")}
          </span>

          <h1
            className="reveal hero-shadow mt-7 text-[2.6rem] font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            <AccentTitle title={tr("hero.title")} accent={ACCENT_WORD[locale]} />
          </h1>

          <p
            className="reveal hero-shadow mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-sand-100"
            style={{ animationDelay: "160ms" }}
          >
            {tr("hero.subtitle")}
          </p>

          <p
            className="reveal hero-shadow mt-5 text-base font-semibold text-brand-100"
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
              className="font-semibold text-white transition hover:text-accent-200"
              dir="ltr"
            >
              {CONTACT.phoneDisplay}
            </a>
            <span dir={isFa ? "rtl" : "ltr"}>{isFa ? CONTACT.hoursFa : CONTACT.hours}</span>
            {/*
              Frueher fest im Code: "ثبتشده در هامبورگ" — ohne Halbleerzeichen
              (ZWNJ) und sachlich falsch formuliert. Jetzt ein normaler
              i18n-Schluessel, damit der Satz im Admin-CMS korrigierbar ist und
              nicht erneut nur im Quelltext haengt.
            */}
            <span>{tr("hero.registered")}</span>
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
