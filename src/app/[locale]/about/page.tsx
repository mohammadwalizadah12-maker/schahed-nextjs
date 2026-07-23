import { isLocale, t as translate, type Locale } from "@/lib/i18n";
import { ORG } from "@/lib/site-config";
import PageHero from "@/components/PageHero";
import ImpactSection from "@/components/home/ImpactSection";
import DonateCta from "@/components/home/DonateCta";

/**
 * Über uns — Gründungsgeschichte (aus schahed.com "درباره شاهد").
 * Alle Texte liegen in i18n (about.*) und sind über das CMS (/admin/texte)
 * in Deutsch und Dari bearbeitbar.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);
  const motto = locale === "fa" ? ORG.mottoFa : ORG.mottoDe;

  const facts: [string, string][] = [
    [tr("about.factSince"), tr("about.factSinceVal")],
    [tr("about.factRegister"), tr("about.factRegisterVal")],
    [tr("about.factCeo"), tr("about.factCeoVal")],
    [tr("about.factDeputyFin"), tr("about.factDeputyFinVal")],
    [tr("about.factDeputyAdmin"), tr("about.factDeputyAdminVal")],
  ];

  const Block = ({ title, body }: { title: string; body: string }) => (
    <div>
      <h2 className="text-2xl font-bold text-brand-900">{title}</h2>
      <p className="mt-3 leading-relaxed text-brand-700/85">{body}</p>
    </div>
  );

  return (
    <>
      <PageHero eyebrow={tr("mission.eyebrow")} title={tr("nav.about")} subtitle={motto} />

      <section className="mx-auto max-w-3xl px-5 py-16 space-y-12">
        <Block title={tr("about.introTitle")} body={tr("about.introBody")} />

        {/* Fakten-Box */}
        <div className="rounded-2xl border border-sand-200 bg-white p-7 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-accent-500">
            {tr("about.factsTitle")}
          </h3>
          <dl className="mt-4 divide-y divide-sand-200">
            {facts.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-sm text-brand-600">{k}</dt>
                <dd className="text-sm font-medium text-brand-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Block title={tr("about.historyTitle")} body={tr("about.historyBody")} />
        <Block title={tr("about.visionTitle")} body={tr("about.visionBody")} />
        <Block title={tr("about.ceoTitle")} body={tr("about.ceoBody")} />
      </section>

      <ImpactSection locale={locale} />
      <div className="py-6" />
      <DonateCta locale={locale} />
    </>
  );
}
