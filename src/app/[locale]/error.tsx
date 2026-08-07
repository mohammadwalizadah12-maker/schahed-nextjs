"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Gebrandete Fehlerseite fuer alle Routen unter /[locale].
 * Ohne diese Datei zeigt Next.js im Fehlerfall seine nackte Standardseite.
 *
 * Zweisprachig ohne i18n-Dictionary: Error-Boundaries sind Client Components
 * und werden gerendert, wenn der Server-Kontext (inkl. Dictionary) evtl. genau
 * die Fehlerquelle war. Darum bewusst feste Texte.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = params?.locale === "fa" ? "fa" : "de";
  const isFa = locale === "fa";

  useEffect(() => {
    // Fuer Vercel-Logs / Diagnose
    console.error("[Schahed] Unerwarteter Fehler:", error);
  }, [error]);

  return (
    <div
      className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center"
      dir={isFa ? "rtl" : "ltr"}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/10 text-3xl text-accent-600">
        !
      </div>

      <h1 className="mt-6 text-2xl font-extrabold text-brand-900 sm:text-3xl">
        {isFa ? "خطایی رخ داد" : "Etwas ist schiefgelaufen"}
      </h1>

      <p className="mt-4 text-brand-700/80">
        {isFa
          ? "این صفحه در حال حاضر بارگذاری نشد. لطفاً دوباره تلاش کنید."
          : "Diese Seite konnte gerade nicht geladen werden. Bitte versuchen Sie es erneut."}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-accent-500 px-7 py-3 font-semibold text-white shadow-lg shadow-accent-900/20 transition hover:bg-accent-400"
        >
          {isFa ? "تلاش مجدد" : "Erneut versuchen"}
        </button>
        <Link
          href={`/${locale}`}
          className="rounded-full bg-brand-50 px-7 py-3 font-semibold text-brand-800 ring-1 ring-sand-200 transition hover:bg-brand-100"
        >
          {isFa ? "صفحه اصلی" : "Zur Startseite"}
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 text-xs text-brand-500" dir="ltr">
          Referenz: {error.digest}
        </p>
      )}
    </div>
  );
}
