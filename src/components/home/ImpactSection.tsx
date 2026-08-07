import { t as translate, type Locale } from "@/lib/i18n";
import AnimatedCounter from "@/components/AnimatedCounter";

/**
 * Wirkungs-Zahlen — echte Kennzahlen der Stiftung (Stand 2023 / 1402).
 */
export default function ImpactSection({ locale }: { locale: Locale }) {
  const tr = (k: string) => translate(locale, k);

  const stats = [
    { value: 527, suffix: "", label: "impact.families" },
    { value: 1766, suffix: "", label: "impact.people" },
    { value: 3000, suffix: "", label: "impact.students" },
    { value: 493, suffix: "", label: "impact.patrons" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-800 via-brand-800 to-brand-900 py-20 text-white">
      {/* Feine Lichtkanten oben und unten: nehmen die Haerte des Farbblocks
          heraus, analog zum Footer und zum PageHero. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-300/50 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      {/* Dezenter Farbschimmer, damit die Flaeche Tiefe bekommt. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 end-1/4 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-[1180px] px-5">
        <div className="mx-auto mb-12 max-w-2xl text-center" data-reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-100">
            {tr("impact.eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{tr("impact.title")}</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4" data-reveal-stagger>
          {stats.map((s) => (
            <AnimatedCounter
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={tr(s.label)}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
