import { isLocale, t as translate, type Locale } from "@/lib/i18n";
import PageHero from "@/components/PageHero";

/**
 * Aktuelles. TODO(Mohammad): Meldungen aus Datenquelle (JSON/CMS) laden.
 * Vorerst Leerzustand.
 */
export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);

  return (
    <>
      <PageHero eyebrow={tr("news.eyebrow")} title={tr("news.title")} subtitle={tr("news.subtitle")} />
      <section className="mx-auto max-w-[1180px] px-5 py-24">
        <div className="rounded-2xl border border-dashed border-sand-300 bg-white/60 p-16 text-center text-brand-600">
          {tr("news.empty")}
        </div>
      </section>
    </>
  );
}
