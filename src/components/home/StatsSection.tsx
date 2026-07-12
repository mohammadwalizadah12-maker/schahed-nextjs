import { t as translate, type Locale } from "@/lib/i18n";
import { AFG_STATS } from "@/lib/site-config";

/**
 * Die Lage in Afghanistan — UN-Zahlen aus dem Flyer.
 */
export default function StatsSection({ locale }: { locale: Locale }) {
  const tr = (k: string) => translate(locale, k);

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-20">
      <div className="mx-auto max-w-2xl text-center" data-reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-500">
          {tr("stats.eyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
          {tr("stats.title")}
        </h2>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
        {AFG_STATS.map((s) => (
          <div
            key={s.key}
            className="lift rounded-2xl border border-sand-200 bg-white p-6 shadow-sm hover:border-brand-200 hover:shadow-md"
          >
            <div className="text-3xl font-extrabold text-brand-600">
              {locale === "fa" ? s.valueFa : s.value}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-brand-700/80">
              {tr(s.key)}
            </p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-brand-500" data-reveal>
        {tr("stats.source")}
      </p>
    </section>
  );
}
