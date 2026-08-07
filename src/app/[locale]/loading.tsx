/**
 * Ladezustand fuer alle Seiten unter /[locale].
 * Zeigt ein gebrandetes Skeleton statt eines weissen Bildschirms,
 * solange Server Components nachgeladen werden.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-24" aria-busy="true" aria-live="polite">
      <span className="sr-only">Wird geladen ...</span>

      {/* Kopfbereich */}
      <div className="animate-pulse">
        <div className="h-4 w-28 rounded-full bg-sand-200" />
        <div className="mt-6 h-10 w-3/4 rounded-lg bg-sand-200 sm:h-14" />
        <div className="mt-4 h-4 w-1/2 rounded bg-sand-200" />
      </div>

      {/* Karten-Raster */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl border border-sand-200 bg-white"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="h-40 bg-sand-100" />
            <div className="space-y-3 p-6">
              <div className="h-5 w-2/3 rounded bg-sand-200" />
              <div className="h-3 w-full rounded bg-sand-100" />
              <div className="h-3 w-5/6 rounded bg-sand-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
