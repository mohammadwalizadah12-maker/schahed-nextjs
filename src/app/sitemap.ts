import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { LOCALES } from "@/lib/i18n";
import { POSTS } from "@/lib/posts";

const PATHS = ["", "/about", "/projects", "/donate", "/membership", "/news", "/contact", "/impressum", "/datenschutz"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = LOCALES.flatMap((locale) =>
    PATHS.map((p) => ({
      url: `${SITE_URL}/${locale}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${p}`])),
      },
    }))
  );

  const postEntries = LOCALES.flatMap((locale) =>
    POSTS.map((post) => ({
      url: `${SITE_URL}/${locale}/news/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}/news/${post.slug}`])
        ),
      },
    }))
  );

  return [...staticEntries, ...postEntries];
}
