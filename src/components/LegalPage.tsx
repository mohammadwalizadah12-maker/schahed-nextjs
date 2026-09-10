import Link from "next/link";
import PageHero from "@/components/PageHero";
import type { Locale } from "@/lib/i18n";

/**
 * Gemeinsames Gerüst fuer Impressum und Datenschutz in beiden Sprachen.
 * Abschnitte werden nummeriert und mit Sprungmarken versehen; oben steht
 * ein Inh@LTsverzeichnis, damit die lange Erklaerung auf dem Telefon
 * ueberschaubar bleibt.
 */
export interface LegalSection {
  id: string;
  title: string;
  /** Absaetze. Ein Absatz kann JSX sein (z. B. mit Zeilenumbruechen). */
  paragraphs: React.ReactNode[];
}

export default function LegalPage({
  locale,
  title,
  intro,
  sections,
  updated,
  note,
}: {
  locale: Locale;
  title: string;
  intro?: React.ReactNode;
  sections: LegalSection[];
  updated: string;
  /** Hinweis oben (z. B. dass die deutsche Fassung massgeblich ist). */
  note?: React.ReactNode;
}) {
  const tocLabel = locale === "fa" ? "فهرست" : "Übersicht";
  return (
    <>
      <PageHero title={title} subtitle={updated} />
      <section className="mx-auto max-w-3xl px-5 py-12 leading-relaxed text-brand-800 sm:py-14">
        {note && (
          <div className="mb-8 rounded-2xl border border-accent-200 bg-accent-50 px-5 py-4 text-sm text-accent-700">
            {note}
          </div>
        )}
        {intro && <div className="text-sm text-brand-700">{intro}</div>}

        <nav aria-label={tocLabel} className="mt-8 rounded-2xl border border-sand-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">{tocLabel}</p>
          <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <Link href={`#${s.id}`} className="text-brand-800 underline-offset-2 hover:text-accent-600 hover:underline">
                  {i + 1}. {s.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((s, i) => (
          <article key={s.id} id={s.id} className="mt-10 scroll-mt-24">
            <h2 className="text-lg font-bold text-brand-900">
              {i + 1}. {s.title}
            </h2>
            {s.paragraphs.map((p, j) => (
              <p key={j} className="mt-3 text-sm text-brand-800">
                {p}
              </p>
            ))}
          </article>
        ))}
      </section>
    </>
  );
}
