import Link from "next/link";
import { t as translate, type Locale } from "@/lib/i18n";
import { PROJECTS } from "@/lib/projects";
import { PROJECT_ICONS, IconArrow } from "@/components/Icons";

export default function ProjectsSection({ locale }: { locale: Locale }) {
  const tr = (k: string) => translate(locale, k);
  const href = (p: string) => `/${locale}${p}`;

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-20">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end" data-reveal>
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-500">
            {tr("projects.eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
            {tr("projects.title")}
          </h2>
          <p className="mt-3 text-brand-700/80">{tr("projects.subtitle")}</p>
        </div>
        <Link
          href={href("/projects")}
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-800"
        >
          {tr("projects.more")}
          <IconArrow />
        </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2" data-reveal-stagger>
        {PROJECTS.map((p) => {
          const Icon = PROJECT_ICONS[p.icon] ?? PROJECT_ICONS.heart;
          return (
            <Link
              key={p.id}
              href={href(`/projects#${p.id}`)}
              className="lift group relative overflow-hidden rounded-2xl border border-sand-200 bg-white p-7 shadow-sm hover:border-brand-200 hover:shadow-md"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600 transition group-hover:bg-accent-100">
                <Icon />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-brand-900">{tr(p.titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-700/75">{tr(p.textKey)}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
                {tr("projects.support")}
                <IconArrow className="h-3.5 w-3.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
