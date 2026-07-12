import Link from "next/link";
import { t as translate, type Locale } from "@/lib/i18n";
import { DONATE_PATH } from "@/lib/nav";
import { IconArrow } from "@/components/Icons";

/**
 * "Ein Aufruf zu Menschlichkeit und Hoffnung" — der Spendenaufruf aus dem Flyer,
 * eingeleitet vom Saadi-Zitat.
 */
export default function HumanityAppeal({ locale }: { locale: Locale }) {
  const tr = (k: string) => translate(locale, k);
  const href = (p: string) => `/${locale}${p}`;

  return (
    <section className="bg-gradient-to-b from-sand-100 to-sand-50 py-20">
      <div className="mx-auto max-w-3xl px-5">
        {/* Zitat */}
        <blockquote className="text-center" data-reveal>
          <p className="text-xl font-semibold italic leading-relaxed text-brand-700 sm:text-2xl">
            „{tr("quote.text")}“
          </p>
        </blockquote>

        <div className="mt-12" data-reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-500">
            {tr("appeal.eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
            {tr("appeal.title")}
          </h2>
        </div>

        <div className="mt-6 space-y-4 leading-relaxed text-brand-800/85" data-reveal-stagger>
          <p>{tr("appeal.p1")}</p>
          <p>{tr("appeal.p2")}</p>
          <p>{tr("appeal.p3")}</p>
          <p>{tr("appeal.p4")}</p>
        </div>

        <div data-reveal>
          <p className="mt-8 text-lg font-bold text-brand-700">
            {tr("appeal.closing")}
          </p>

          <Link
            href={href(DONATE_PATH)}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-accent-900/20 transition hover:bg-accent-400"
          >
            {tr("nav.donateCta")}
            <IconArrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
