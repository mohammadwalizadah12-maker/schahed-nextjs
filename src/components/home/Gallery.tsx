import { t as translate, type Locale } from "@/lib/i18n";

/**
 * Foto-Galerie — echte Fotos der Iftar-Verteilung (aus dem schahed.com-Archiv,
 * unter /public/images/schahed/). Zeigt die tatsaechliche Arbeit der Stiftung.
 */
const IMAGES = [
  { src: "/images/schahed/editor_1c87bf.jpg", alt: "Freiwillige bei der Essenszubereitung" },
  { src: "/images/schahed/editor_431339.jpg", alt: "Verteilung des Iftar-Essens" },
  { src: "/images/schahed/editor_122727.jpg", alt: "Beladen der Essenspakete" },
  { src: "/images/schahed/editor_263102.jpg", alt: "Abfüllen der Mahlzeiten" },
  { src: "/images/schahed/editor_1dbc1c.jpg", alt: "Kochen im Großkessel" },
  { src: "/images/schahed/editor_0bb185.jpg", alt: "Verpackte Essenspakete" },
];

export default function Gallery({ locale }: { locale: Locale }) {
  const tr = (k: string) => translate(locale, k);

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-16">
      <div className="mx-auto max-w-2xl text-center" data-reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-500">
          {tr("impact.eyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
          {tr("gallery.title")}
        </h2>
        <p className="mt-3 text-brand-700/80">{tr("gallery.subtitle")}</p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3" data-reveal-stagger>
        {IMAGES.map((img, i) => (
          <div
            key={i}
            className="lift aspect-[4/3] overflow-hidden rounded-2xl bg-sand-200 bg-cover bg-center shadow-sm"
            style={{ backgroundImage: `url('${img.src}')` }}
            role="img"
            aria-label={img.alt}
          />
        ))}
      </div>
    </section>
  );
}
