import { t as translate, type Locale } from "@/lib/i18n";

/**
 * Foto-Galerie. Aktuell generierte Fotos im Flyer-Stil.
 * Zum Ersetzen die Pfade unten auf eigene Dateien in /public/images/ zeigen lassen.
 */
const IMAGES = [
  "/images/documentary_photo_of_a_group.jpg",     // Kindergruppe mit Buechern
  "/images/documentary_photo_of_an_afghan_1.jpg", // Kind am Wasserhahn
  "/images/close_up_of_small_child.jpg",          // Haende geben Blume
  "/images/documentary_photo_of_an_afghan.jpg",   // Schulkinder in Gruen
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
          {tr("impact.title")}
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4" data-reveal-stagger>
        {IMAGES.map((src, i) => (
          <div
            key={i}
            className="lift aspect-[3/4] overflow-hidden rounded-2xl bg-sand-200 bg-cover bg-center shadow-sm"
            style={{ backgroundImage: `url('${src}')` }}
            role="img"
            aria-label="Schahed"
          />
        ))}
      </div>
    </section>
  );
}
