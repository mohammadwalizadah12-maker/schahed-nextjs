import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, t as translate, LOCALES, type Locale } from "@/lib/i18n";
import { getPost, allPosts, POSTS } from "@/lib/posts";
import PageHero from "@/components/PageHero";
import PostBody from "@/components/PostBody";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { SITE_URL } from "@/lib/site-config";
import { IconArrow } from "@/components/Icons";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    POSTS.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const post = getPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/${locale}/news/${post.slug}`;
  const image = post.image
    ? post.image.startsWith("http")
      ? post.image
      : `${SITE_URL}${post.image}`
    : undefined;

  return {
    title: post.title[locale],
    description: post.teaser[locale],
    alternates: {
      canonical: url,
      languages: {
        de: `${SITE_URL}/de/news/${post.slug}`,
        fa: `${SITE_URL}/fa/news/${post.slug}`,
        "x-default": `${SITE_URL}/de/news/${post.slug}`,
      },
    },
    openGraph: {
      type: "article",
      url,
      title: post.title[locale],
      description: post.teaser[locale],
      publishedTime: post.date,
      locale: locale === "fa" ? "fa_AF" : "de_DE",
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);
  const href = (p: string) => `/${locale}${p}`;

  const post = getPost(slug);
  if (!post) notFound();

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "fa" ? "fa-AF" : "de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const others = allPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <ArticleJsonLd post={post} locale={locale} />
      <PageHero eyebrow={tr(`news.cat.${post.category}`)} title={post.title[locale]} />

      <article className="mx-auto max-w-3xl px-5 py-14">
        <div className="flex items-center gap-3 text-sm text-brand-500">
          <span className="rounded-full bg-accent-50 px-3 py-1 font-semibold text-accent-600">
            {tr(`news.cat.${post.category}`)}
          </span>
          <time>{tr("news.published")} {fmtDate(post.date)}</time>
        </div>

        {post.image && (
          // next/image statt CSS-Hintergrund: liefert AVIF/WebP in passender
          // Groesse. Als groesstes Bild der Seite mit LCP-Prioritaet.
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-sand-200 shadow-sm">
            <Image
              src={post.image}
              alt={post.title[locale]}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-8">
          <PostBody lines={post.body[locale]} />
        </div>

        {/* Tags */}
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags[locale].map((tag) => (
            <span key={tag} className="rounded-full bg-sand-100 px-3 py-1 text-xs font-medium text-brand-600">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-10 border-t border-sand-200 pt-6">
          <Link href={href("/news")} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-800">
            <IconArrow className="h-4 w-4 rtl-flip rotate-180" />
            {tr("news.back")}
          </Link>
        </div>
      </article>

      {/* Weitere Beiträge */}
      {others.length > 0 && (
        <section className="border-t border-sand-200 bg-sand-100/50 py-14">
          <div className="mx-auto max-w-[1180px] px-5">
            <h2 className="text-xl font-bold text-brand-900">{tr("news.related")}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={href(`/news/${p.slug}`)}
                  className="lift flex gap-4 rounded-2xl border border-sand-200 bg-white p-4 shadow-sm hover:border-brand-200 hover:shadow-md"
                >
                  {p.image && (
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-sand-200">
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-semibold text-accent-600">{tr(`news.cat.${p.category}`)}</span>
                    <h3 className="mt-1 text-sm font-bold leading-snug text-brand-900">{p.title[locale]}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
