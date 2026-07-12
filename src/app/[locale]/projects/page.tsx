import Link from "next/link";
import { isLocale, t as translate, MESSAGES, type Locale } from "@/lib/i18n";
import { PROJECTS } from "@/lib/projects";
import { PROJECT_ICONS, IconArrow } from "@/components/Icons";
import { DONATE_PATH } from "@/lib/nav";
import PageHero from "@/components/PageHero";
import DonateCta from "@/components/home/DonateCta";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);
  const href = (p: string) => `/${locale}${p}`;
  const dict = MESSAGES[locale];

  return (
    <>
      <PageHero eyebrow={tr("projects.eyebrow")} title={tr("projects.title")} subtitle={tr("projects.subtitle")} />

      <section className="mx-auto max-w-[1180px] px-5 py-16">
        <div className="space-y-6">
          {PROJECTS.map((p) => {
            const Icon = PROJECT_ICONS[p.icon] ?? PROJECT_ICONS.heart;
            const detailKey = `prog.${p.id}.detail`;
            const detail = dict[detailKey];
            return (
              <article
                key={p.id}
                id={p.id}
                className="scroll-mt-24 rounded-2xl border border-sand-200 bg-white p-7 shadow-sm sm:flex sm:items-start sm:gap-6"
              >
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon className="h-7 w-7" />
                </span>
                <div className="mt-4 sm:mt-0">
                  <h2 className="text-xl font-bold text-brand-900">{tr(p.titleKey)}</h2>
                  <p className="mt-2 max-w-3xl leading-relaxed text-brand-700/85">{tr(p.textKey)}</p>
                  {detail && (
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-700/70">{detail}</p>
                  )}
                  <Link
                    href={href(DONATE_PATH)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-400 px-5 py-2.5 text-sm font-semibold text-brand-900 transition hover:bg-accent-300"
                  >
                    {tr("projects.support")}
                    <IconArrow />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <DonateCta locale={locale} />
    </>
  );
}
