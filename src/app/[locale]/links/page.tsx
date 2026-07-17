import { isLocale, t as translate, type Locale } from "@/lib/i18n";
import { allLinks } from "@/lib/links";
import PageHero from "@/components/PageHero";

export default async function LinksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);
  const links = allLinks();

  const host = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  return (
    <>
      <PageHero eyebrow={tr("links.eyebrow")} title={tr("links.title")} subtitle={tr("links.subtitle")} />

      <section className="mx-auto max-w-[1180px] px-5 py-16">
        {links.length === 0 ? (
          <p className="text-center text-brand-500">{tr("links.empty")}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((l) => {
              const title = l.title[locale] || l.title.de || host(l.url);
              const desc = l.description[locale] || l.description.de || "";
              return (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-sand-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                >
                  <h2 className="text-lg font-bold text-brand-900 group-hover:text-brand-700">{title}</h2>
                  {desc && <p className="mt-2 text-sm leading-relaxed text-brand-700/75">{desc}</p>}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600" dir="ltr">
                    {host(l.url)} ↗
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
