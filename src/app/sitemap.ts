import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { LOCALES } from "@/lib/i18n";

const PATHS = ["", "/about", "/projects", "/donate", "/membership", "/news", "/contact", "/impressum", "/datenschutz"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return LOCALES.flatMap((locale) =>
    PATHS.map((p) => ({
      url: `${SITE_URL}/${locale}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}${p}`])
        ),
      },
    }))
  );
}
