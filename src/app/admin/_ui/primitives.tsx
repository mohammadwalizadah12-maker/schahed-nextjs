"use client";

import { useEffect } from "react";

/* Gemeinsame Bausteine der Redaktionsoberflaeche. */

export const field =
  "w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm text-brand-900 outline-none transition placeholder:text-brand-700/50 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-sand-50";
export const label = "mb-1 flex items-baseline justify-between gap-2 text-xs font-semibold text-brand-800";
export const hint = "mt-1 text-[11px] text-brand-700/80";

export type SaveStatus = "idle" | "saving" | "ok" | "error";

/** Kopfzeile einer Redaktionsseite. */
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-sand-200 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-xl font-bold text-brand-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-brand-700">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

/**
 * Schwebende Speichern-Leiste. Erscheint nur, wenn es ungespeicherte
 * Aenderungen gibt, und warnt beim Verlassen der Seite.
 */
export function SaveBar({
  dirty,
  status,
  error,
  onSave,
  onDiscard,
  summary,
}: {
  dirty: boolean;
  status: SaveStatus;
  error?: string;
  onSave: () => void;
  onDiscard?: () => void;
  /** z. B. "3 Beiträge geändert" */
  summary?: string;
}) {
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  // Strg/Cmd+S speichert
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && status !== "saving") onSave();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [dirty, status, onSave]);

  const visible = dirty || status === "saving" || status === "ok" || status === "error";
  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-200 bg-white/95 shadow-[0_-8px_30px_rgba(95,44,20,0.08)] backdrop-blur lg:inset-x-auto lg:start-[250px] lg:end-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="text-sm">
          {status === "ok" && !dirty && (
            <span className="flex items-center gap-2 text-green-800">
              <Check /> Veröffentlicht. Die Website wird in 1 bis 2 Minuten neu bereitgestellt.
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-2 text-accent-700">
              <Warn /> {error || "Speichern fehlgeschlagen."}
            </span>
          )}
          {status !== "error" && (dirty || status === "saving") && (
            <span className="flex items-center gap-2 text-brand-800">
              <span className="inline-block h-2 w-2 rounded-full bg-accent-500" aria-hidden />
              {summary || "Ungespeicherte Änderungen"}
              <span className="hidden text-brand-700/70 sm:inline">· Strg+S</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {dirty && onDiscard && status !== "saving" && (
            <button onClick={onDiscard} className="rounded-full px-4 py-2 text-sm font-medium text-brand-700 hover:bg-sand-100">
              Verwerfen
            </button>
          )}
          {(dirty || status === "saving") && (
            <button
              onClick={onSave}
              disabled={status === "saving"}
              className="rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-400 disabled:opacity-60"
            >
              {status === "saving" ? "Wird veröffentlicht ..." : "Speichern & veröffentlichen"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Einheitliche Meldungen aus den API-Fehlercodes. */
export function describeError(json: Record<string, unknown> | null, httpStatus: number): string {
  const code = String(json?.error ?? "");
  const where = json?.slug ? ` („${json.slug}“)` : json?.url ? ` (${json.url})` : "";
  switch (code) {
    case "unauthorized": return "Sitzung abgelaufen. Bitte neu anmelden.";
    case "bad_origin": return "Anfrage abgelehnt (Herkunft). Seite neu laden und erneut versuchen.";
    case "invalid_slug": return `Ungültiger Slug${where}: nur Kleinbuchstaben, Ziffern und Bindestriche.`;
    case "duplicate_slug": return `Slug doppelt vergeben${where}.`;
    case "invalid_date": return `Ungültiges Datum${where}.`;
    case "invalid_image": return `Bildpfad ungültig${where}: /images/... oder https://...`;
    case "invalid_url": return `Ungültige URL${where}: nur http:// oder https://`;
    case "invalid_id": return `Interne ID ungültig oder doppelt${where}.`;
    case "invalid_fields": return `Ein Feld ist zu lang oder fehlt${where}.`;
    case "invalid_payload": return "Daten unvollständig oder zu umfangreich.";
    case "commit_failed": return "GitHub-Commit fehlgeschlagen. Bitte in einer Minute erneut versuchen.";
    case "rate_limited": return "Zu viele Anfragen. Bitte kurz warten.";
    default: return httpStatus ? `Fehler ${httpStatus}${code ? ` (${code})` : ""}` : "Netzwerkfehler.";
  }
}

/** Zaehler unter einem Textfeld. */
export function Count({ value, max }: { value: string; max?: number }) {
  const n = value.length;
  const over = max !== undefined && n > max;
  return (
    <span className={`text-[11px] tabular-nums ${over ? "font-semibold text-accent-600" : "text-brand-700/70"}`}>
      {n}{max ? ` / ${max}` : ""}
    </span>
  );
}

export function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
export function Warn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
    </svg>
  );
}

/** Leerer Zustand in der Editor-Spalte. */
export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-dashed border-sand-300 bg-white/60 p-12 text-center text-sm text-brand-700">
      {children}
    </section>
  );
}

/** Bestaetigung als Inline-Dialog (statt window.confirm). */
export function ConfirmInline({
  text,
  onYes,
  onNo,
}: {
  text: string;
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-700">
      <span className="flex-1">{text}</span>
      <button onClick={onYes} className="rounded-full bg-accent-500 px-4 py-1.5 font-semibold text-white hover:bg-accent-400">Ja, löschen</button>
      <button onClick={onNo} className="rounded-full px-4 py-1.5 font-medium text-brand-700 hover:bg-white">Abbrechen</button>
    </div>
  );
}
