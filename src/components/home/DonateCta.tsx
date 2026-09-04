import Link from "next/link";
import { t as translate, type Locale } from "@/lib/i18n";
import { DONATE_PATH } from "@/lib/nav";
import { IconArrow, IconHeart } from "@/components/Icons";

export default function DonateCta({ locale }: { locale: Locale }) {
  const tr = (k: string) => translate(locale, k);
  const href = (p: string) => `/${locale}${p}`;

  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-400 to-accent-500 px-8 py-14 text-center">
        {/* Logische Positionen (end/start): spiegeln auf /fa korrekt mit. */}
        <div className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -start-10 h-64 w-64 rounded-full bg-brand-900/10 blur-2xl" />
        <div className="relative mx-auto max-w-2xl">
          {/*
            Schrift auf dem roten Band war brand-900 auf accent-400/500:
            2,4:1 bzw. 1,8:1 — deutlich unter dem AA-Minimum. Weiss liegt
            auf derselben Flaeche bei 4,7:1 bzw. 6,3:1.
          */}
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25 text-white">
            <IconHeart className="h-7 w-7" />
          </span>
          <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
            {tr("donate.title")}
          </h2>
          <p className="mt-3 text-lg text-white">{tr("donate.subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={href(DONATE_PATH)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-800 px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-brand-900"
            >
              {tr("nav.donateCta")}
              <IconArrow className="h-4 w-4 rtl-flip" />
            </Link>
            <Link
              href={href("/membership")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-accent-700 transition hover:bg-sand-100"
            >
              {tr("nav.membership")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
