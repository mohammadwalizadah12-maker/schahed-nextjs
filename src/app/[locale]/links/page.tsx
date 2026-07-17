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

type Preview = { src: string; kind: "photo" | "logo" };

/**
 * Bestimmt das beste Vorschaubild einer Zielseite (mit Tages-Cache).
 * Kette: og:image -> twitter:image (Foto, füllend)
 *        -> apple-touch-icon -> großes <link icon> (Logo, eingepasst)
 *        -> erstes sinnvolles Inhaltsbild (Foto). null, falls nichts brauchbar.
 */
async function fetchPreview(url: string): Promise<Preview | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SchahedBot/1.0; +https://schahed.com)" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 300_000);
    const origin = new URL(url).origin;

    const abs = (raw: string): string | null => {
      let img = raw.trim();
      if (!img) return null;
      if (img.startsWith("//")) img = "https:" + img;
      else if (img.startsWith("/")) img = origin + img;
      return img.startsWith("http") ? img : null;
    };

    // 1) og:image / twitter:image = echtes Vorschaufoto -> füllend
    const meta =
      html.match(/<meta[^>]+property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::url)?["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
    if (meta) {
      const r = abs(meta[1]);
      if (r) return { src: r, kind: "photo" };
    }

    // 2) apple-touch-icon = meist hochwertiges Logo -> eingepasst
    const apple = html.match(/<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i);
    if (apple) {
      const r = abs(apple[1]);
      if (r) return { src: r, kind: "logo" };
    }

    // 3) Größtes <link rel="icon" sizes="..."> -> Logo, eingepasst
    const iconLinks = [...html.matchAll(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*>/gi)];
    let best: { href: string; size: number } | null = null;
    for (const tag of iconLinks) {
      const t = tag[0];
      const href = t.match(/href=["']([^"']+)["']/i)?.[1];
      if (!href) continue;
      const size = parseInt(t.match(/sizes=["'](\d+)/i)?.[1] || "0", 10);
      if (!best || size > best.size) best = { href, size };
    }
    if (best && best.size >= 64) {
      const r = abs(best.href);
      if (r) return { src: r, kind: "logo" };
    }

    // 4) Erstes sinnvolles Inhaltsbild = Foto -> füllend
    const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+\.(?:png|jpe?g|webp)[^"']*)["']/gi)];
    for (const im of imgs) {
      const src = im[1];
      if (/sprite|pixel|blank|spacer|1x1|loading|placeholder/i.test(src)) continue;
      const r = abs(src);
      if (r) return { src: r, kind: "photo" };
    }

    return null;
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

  // Vorschaubilder parallel bestimmen (manuell > automatisch > Favicon)
  const previews = await Promise.all(
    links.map(async (l): Promise<Preview> => {
      const manual = (l.image ?? "").trim();
      if (manual) return { src: manual, kind: "photo" };
      return (await fetchPreview(l.url)) ?? { src: faviconOf(l.url), kind: "logo" };
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
                    const preview = previewOf.get(l.id)!;
                    return (
                      <a
                        key={l.id}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                      >
                        {/* Vorschau: Foto füllend (cover), Logo/Icon eingepasst (contain, weißer Grund) */}
                        <div className={`flex h-40 items-center justify-center overflow-hidden ${preview.kind === "logo" ? "bg-white p-6" : "bg-sand-100"}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview.src}
                            alt=""
                            className={preview.kind === "logo" ? "max-h-full max-w-full object-contain" : "h-full w-full object-cover"}
                          />
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
