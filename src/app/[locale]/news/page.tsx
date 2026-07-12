import Link from "next/link";
import { isLocale, t as translate, type Locale } from "@/lib/i18n";
import { allPosts } from "@/lib/posts";
import PageHero from "@/components/PageHero";
import { IconArrow } from "@/components/Icons";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);
  const href = (p: string) => `/${locale}${p}`;
  const posts = allPosts();

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "fa" ? "fa-AF" : "de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <PageHero eyebrow={tr("news.eyebrow")} title={tr("news.title")} subtitle={tr("news.subtitle")} />

      <section className="mx-auto max-w-[1180px] px-5 py-16">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand-300 bg-white/60 p-16 text-center text-brand-600">
            {tr("news.empty")}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={href(`/news/${p.slug}`)}
                className="lift group flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm hover:border-brand-200 hover:shadow-md"
              >
                {p.image && (
                  <div
                    className="aspect-[16/10] bg-sand-200 bg-cover bg-center"
                    style={{ backgroundImage: `url('${p.image}')` }}
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full bg-accent-50 px-2.5 py-1 font-semibold text-accent-600">
                      {tr(`news.cat.${p.category}`)}
                    </span>
                    <time className="text-brand-500">{fmtDate(p.date)}</time>
                  </div>
                  <h2 className="mt-3 text-lg font-bold leading-snug text-brand-900">
                    {p.title[locale]}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-brand-700/75">
                    {p.teaser[locale]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                    {tr("news.readMore")}
                    <IconArrow className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
