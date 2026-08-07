"use client";

import Link from "next/link";
import { useI18n, useLocale } from "@/components/I18nProvider";
import { NAV_ITEMS, DONATE_PATH } from "@/lib/nav";
import { CONTACT, ORG, SITE_NAME_FULL } from "@/lib/site-config";
import Logo from "@/components/Logo";
import {
  IconArrow,
  IconHeart,
  IconPhone,
  IconMail,
  IconPin,
  IconClock,
} from "@/components/Icons";

/**
 * Spaltentitel: kleine Kapitaelchen mit weiter Laufweite und kurzem
 * Akzentstrich darunter. Der Strich gibt den Spalten eine gemeinsame
 * Grundlinie und ersetzt harte Trennlinien.
 */
function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-200">
      {children}
      <span aria-hidden className="mt-2 block h-px w-7 bg-accent-300/60" />
    </h3>
  );
}

/** Footer-Link mit zurueckhaltender Hover-Bewegung statt Unterstreichung. */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sand-100/75 transition-colors hover:text-white"
    >
      <span
        aria-hidden
        className="h-1 w-1 shrink-0 rounded-full bg-accent-300/0 transition-all duration-200 group-hover:bg-accent-300"
      />
      <span className="transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
        {children}
      </span>
    </Link>
  );
}

/** Kontaktzeile: Icon in gedaempfter Akzentfarbe, Text optisch ausgerichtet. */
function ContactRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 text-accent-200/70">{icon}</span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export default function SiteFooter() {
  const { t } = useI18n();
  const locale = useLocale();
  const href = (path: string) => `/${locale}${path}`;
  const year = new Date().getFullYear();
  const hours = locale === "fa" ? CONTACT.hoursFa : CONTACT.hours;

  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-to-b from-brand-800 via-brand-800 to-brand-900 text-sand-100">
      {/* Feine Lichtkante oben: nimmt die Haerte der Blockkante heraus. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-300/50 to-transparent"
      />
      {/* Sehr dezenter Farbschimmer, damit die Flaeche nicht flach wirkt. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 start-1/4 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl"
      />

      {/* --- Spendenband --- */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-5 px-5 py-9 text-center sm:flex-row sm:text-start">
          <p className="flex items-center gap-3 text-lg font-semibold text-white">
            <IconHeart className="h-5 w-5 shrink-0 text-accent-300" />
            {t("footer.donateCta")}
          </p>
          <Link
            href={href(DONATE_PATH)}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-400 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-900/30 ring-1 ring-inset ring-white/20 transition hover:bg-accent-300 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("nav.donateCta")}
            <IconArrow className="h-4 w-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>

      {/* --- Spalten: 5/4/3. Rechtliches sitzt in der Schlusszeile, damit
              keine fast leere vierte Spalte entsteht. --- */}
      <div className="relative mx-auto grid max-w-[1180px] gap-x-10 gap-y-12 px-5 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-5">
          {/*
            Das Logo ist fuer hellen Grund gezeichnet: dunkler Ringtext und
            transparente Innenflaeche. Auf dem braunen Footer verschwindet
            beides. Die helle Scheibe gibt ihm seinen eigenen Hintergrund
            zurueck — dadurch ist es klar lesbar statt matschig.
          */}
          <span className="inline-flex items-center justify-center rounded-full bg-sand-50 p-2.5 shadow-xl shadow-brand-900/30 ring-1 ring-white/30">
            <Logo variant="light" emblemSize={120} showWordmark={false} emblemClass="h-28 w-28" />
          </span>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-sand-100/70">
            {t("footer.about")}
          </p>
        </div>

        <nav className="lg:col-span-4">
          <ColTitle>{t("footer.quicklinks")}</ColTitle>
          {/* Zweispaltig: sieben Punkte untereinander machten den Footer
              unnoetig hoch und liessen rechts eine grosse Leere stehen. */}
          <ul className="mt-4 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <FooterLink href={href(item.path)}>{t(item.key)}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <ColTitle>{t("footer.contact")}</ColTitle>
          <ul className="mt-4 space-y-3 text-sm text-sand-100/75">
            <ContactRow icon={<IconPin className="h-4 w-4" />}>
              <address className="not-italic leading-relaxed">
                {CONTACT.street && <>{CONTACT.street}<br /></>}
                {CONTACT.poBox}
                <br />
                {CONTACT.zip} {CONTACT.city}
              </address>
            </ContactRow>
            <ContactRow icon={<IconPhone className="h-4 w-4" />}>
              <a
                href={`tel:${CONTACT.phone}`}
                dir="ltr"
                className="inline-block transition-colors hover:text-white"
              >
                {CONTACT.phoneDisplay}
              </a>
            </ContactRow>
            <ContactRow icon={<IconMail className="h-4 w-4" />}>
              <a
                href={`mailto:${CONTACT.email}`}
                className="break-all transition-colors hover:text-white"
              >
                {CONTACT.email}
              </a>
            </ContactRow>
            <ContactRow icon={<IconClock className="h-4 w-4" />}>{hours}</ContactRow>
          </ul>
        </div>

      </div>

      {/* --- Schlusszeile: Copyright, Rechtliches, Registereintrag --- */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-4 px-5 py-6 text-xs text-sand-100/60 lg:flex-row lg:justify-between">
          <p className="order-2 text-center lg:order-1 lg:text-start">
            © {year} {SITE_NAME_FULL}. {t("footer.rights")}
          </p>

          {/* Rechtliches bewusst hier statt in einer eigenen, fast leeren
              Spalte — Impressum und Datenschutz bleiben klar erreichbar. */}
          <nav className="order-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:order-2">
            <Link href={href("/impressum")} className="transition-colors hover:text-white">
              {t("footer.imprint")}
            </Link>
            <Link href={href("/datenschutz")} className="transition-colors hover:text-white">
              {t("footer.privacy")}
            </Link>
            <span aria-hidden className="hidden h-3 w-px bg-white/15 sm:block" />
            <span dir="ltr" className="text-sand-100/45">{ORG.register}</span>
            {/* Verwaltung leiser: kein Besucherziel, aber erreichbar. */}
            <Link
              href="/admin"
              className="text-sand-100/45 transition-colors hover:text-sand-100/90"
            >
              {t("footer.admin")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
