import { SITE_URL, SITE_NAME_FULL } from "@/lib/site-config";
import type { Locale } from "@/lib/i18n";
import type { Post } from "@/lib/posts";

/**
 * Structured Data fuer einen einzelnen Beitrag (schema.org NewsArticle/Article).
 *
 * Ermoeglicht Rich Results in der Google-Suche (Titel, Datum, Bild) und
 * verknuepft den Beitrag ueber "publisher" mit der Organisation aus
 * OrganizationJsonLd (gemeinsame @id).
 */
export default function ArticleJsonLd({
  post,
  locale,
}: {
  post: Post;
  locale: Locale;
}) {
  const url = `${SITE_URL}/${locale}/news/${post.slug}`;
  const body = post.body[locale] ?? [];

  const data = {
    "@context": "https://schema.org",
    // "news" -> NewsArticle, "article" -> Article
    "@type": post.category === "news" ? "NewsArticle" : "Article",
    "@id": `${url}#article`,
    headline: post.title[locale],
    description: post.teaser[locale],
    inLanguage: locale,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(post.image
      ? { image: [post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`] }
      : {}),
    ...(post.tags[locale]?.length ? { keywords: post.tags[locale].join(", ") } : {}),
    // Vereinsbeitraege werden redaktionell vom Verein selbst verantwortet.
    author: { "@id": `${SITE_URL}/#organization`, name: SITE_NAME_FULL },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isAccessibleForFree: true,
    ...(body.length
      ? { wordCount: body.join(" ").trim().split(/\s+/).filter(Boolean).length }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      // Sicher: Werte stammen aus data/posts.json. "<" wird escaped, damit kein
      // </script> aus den Inhalten den Block vorzeitig schliessen kann.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
