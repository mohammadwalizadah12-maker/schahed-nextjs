import { isLocale, t as translate, type Locale } from "@/lib/i18n";
import { allLinks, type UsefulLink } from "@/lib/links";
import PageHero from "@/components/PageHero";

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** Holt das og:image der Zielseite (mit Tages-Cache). Fällt bei Fehler auf null. */
async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SchahedBot/1.0; +https://schahed.com)" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 200_000);
    const m =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    if (!m) return null;
    let img = m[1].trim();
    if (img.startsWith("//")) img = "https:" + img;
    else if (img.startsWith("/")) img = new URL(url).origin + img;
    return img.startsWith("http") ? img : null;
  } catch {
    return null;
  }
}

const faviconOf = (url: string) =>
  `https://www.google.com/s/favicon?sz=128&domain=${encodeURIComponent(host(url))}`;

export default async function LinksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);
  const links = allLinks();

  // Vorschaubilder parallel bestimmen (manuell > og:image)
  const previews = await Promise.all(
    links.map(async (l) => {
      const manual = (l.image ?? "").trim();
      if (manual) return manual;
      return (await fetchOgImage(l.url)) ?? "";
    })
  );
  const previewOf = new Map(links.map((l, i) => [l.id, previews[i]]));

  // Nach Rubrik gruppieren (Reihenfolge bleibt erhalten; "ohne Rubrik" zuerst)
  const groups: { heading: string; items: UsefulLink[] }[] = [];
  for (const l of links) {
    const h = (l.heading?.[locale] || l.heading?.de || "").trim();
    let g = groups.find((x) => x.heading === h);
    if (!g) {
      g = { heading: h, items: [] };
      groups.push(g);
    }
    g.items.push(l);
  }

  return (
    <>
      <PageHero eyebrow={tr("links.eyebrow")} title={tr("links.title")} subtitle={tr("links.subtitle")} />

      <section className="mx-auto max-w-[1180px] px-5 py-16">
        {links.length === 0 ? (
          <p className="text-center text-brand-500">{tr("links.empty")}</p>
        ) : (
          <div className="space-y-12">
            {groups.map((group, gi) => (
              <div key={gi}>
                {group.heading && (
                  <h2 className="mb-5 border-s-4 border-accent-400 ps-3 text-xl font-bold text-brand-900">
                    {group.heading}
                  </h2>
                )}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((l) => {
                    const title = l.title[locale] || l.title.de || host(l.url);
                    const desc = l.description[locale] || l.description.de || "";
                    const preview = previewOf.get(l.id) || "";
                    return (
                      <a
                        key={l.id}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                      >
                        {/* Vorschau */}
                        <div className="flex h-40 items-center justify-center overflow-hidden bg-sand-100">
                          {preview ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={preview} alt="" className="h-full w-full object-cover" />
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={faviconOf(l.url)} alt="" className="h-14 w-14 rounded-lg" />
                          )}
                        </div>
                        {/* Text */}
                        <div className="flex flex-1 flex-col p-6">
                          <h3 className="text-lg font-bold text-brand-900 group-hover:text-brand-700">{title}</h3>
                          {desc && <p className="mt-2 text-sm leading-relaxed text-brand-700/75">{desc}</p>}
                          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600" dir="ltr">
                            {host(l.url)} ↗
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
