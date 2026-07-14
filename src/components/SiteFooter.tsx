"use client";

import Link from "next/link";
import { useI18n, useLocale } from "@/components/I18nProvider";
import { NAV_ITEMS, DONATE_PATH } from "@/lib/nav";
import { CONTACT, SITE_NAME_FULL } from "@/lib/site-config";
import Logo from "@/components/Logo";

export default function SiteFooter() {
  const { t } = useI18n();
  const locale = useLocale();
  const href = (path: string) => `/${locale}${path}`;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-brand-800 text-sand-100">
      {/* Spenden-Band */}
      <div className="bg-brand-900/60">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:flex-row sm:text-start">
          <p className="text-lg font-semibold text-white">{t("footer.donateCta")}</p>
          <Link
            href={href(DONATE_PATH)}
            className="rounded-full bg-accent-400 px-6 py-3 font-semibold text-brand-900 transition hover:bg-accent-300"
          >
            {t("nav.donateCta")}
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo variant="light" emblemSize={112} showWordmark={false} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand-100/70">
            {t("footer.about")}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-200">
            {t("footer.quicklinks")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link href={href(item.path)} className="text-sand-100/80 transition hover:text-white">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-200">
            {t("footer.contact")}
          </h3>
          <address className="mt-4 space-y-2 text-sm not-italic text-sand-100/80">
            {CONTACT.street && <p>{CONTACT.street}</p>}
            <p>{CONTACT.zip} {CONTACT.city}</p>
            <p dir="ltr">
              <a href={`tel:${CONTACT.phone}`} className="transition hover:text-white">
                {CONTACT.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${CONTACT.email}`} className="transition hover:text-white">
                {CONTACT.email}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-200">
            {t("footer.legal")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href={href("/impressum")} className="text-sand-100/80 transition hover:text-white">
                {t("footer.imprint")}
              </Link>
            </li>
            <li>
              <Link href={href("/datenschutz")} className="text-sand-100/80 transition hover:text-white">
                {t("footer.privacy")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1180px] px-5 py-5 text-center text-xs text-sand-100/60">
          © {year} {SITE_NAME_FULL}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
