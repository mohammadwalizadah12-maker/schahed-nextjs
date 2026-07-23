"use client";

import { useMemo, useState } from "react";

type Dict = Record<string, string>;

const field =
  "w-full rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

/** Abschnitts-Label je Schlüssel-Präfix (Teil vor dem ersten Punkt). */
const SECTION_LABELS: Record<string, string> = {
  nav: "Navigation",
  hero: "Startseite – Hero",
  quote: "Zitat",
  appeal: "Aufruf",
  stats: "Statistiken – Überschrift",
  stat: "Statistiken – Werte",
  mission: "Über uns – Mission",
  impact: "Wirkung",
  gallery: "Galerie",
  projects: "Programme – Übersicht",
  prog: "Programme – Details",
  donate: "Spenden",
  membership: "Patenschaft",
  news: "Aktuelles",
  contact: "Kontakt",
  feedback: "Feedback",
  links: "Nützliche Links",
  footer: "Fußzeile",
  common: "Allgemein",
  about: "Über uns – Seite",
};

/** Reihenfolge der Abschnitte (unbekannte hängen hinten an). */
const SECTION_ORDER = Object.keys(SECTION_LABELS);

const prefixOf = (key: string) => key.split(".")[0];

export default function TextsEditor({ de, fa }: { de: Dict; fa: Dict }) {
  const [deVals, setDeVals] = useState<Dict>({ ...de });
  const [faVals, setFaVals] = useState<Dict>({ ...fa });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  // Alle Schlüssel (DE-Reihenfolge ist maßgeblich, FA-only ergänzt).
  const allKeys = useMemo(() => {
    const keys = Object.keys(de);
    for (const k of Object.keys(fa)) if (!keys.includes(k)) keys.push(k);
    return keys;
  }, [de, fa]);

  // Nach Abschnitt gruppieren + gefiltert.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byPrefix: Record<string, string[]> = {};
    for (const k of allKeys) {
      if (q) {
        const hay = (k + " " + (deVals[k] || "") + " " + (faVals[k] || "")).toLowerCase();
        if (!hay.includes(q)) continue;
      }
      const p = prefixOf(k);
      (byPrefix[p] ||= []).push(k);
    }
    const order = [
      ...SECTION_ORDER.filter((p) => byPrefix[p]),
      ...Object.keys(byPrefix).filter((p) => !SECTION_ORDER.includes(p)).sort(),
    ];
    return order.map((p) => ({
      prefix: p,
      label: SECTION_LABELS[p] || p,
      keys: byPrefix[p],
    }));
  }, [allKeys, deVals, faVals, query]);

  const setDe = (k: string, v: string) => { setDeVals((s) => ({ ...s, [k]: v })); setStatus("idle"); };
  const setFa = (k: string, v: string) => { setFaVals((s) => ({ ...s, [k]: v })); setStatus("idle"); };

  const isLong = (k: string) =>
    (deVals[k] || "").length > 70 || (faVals[k] || "").length > 70 ||
    (deVals[k] || "").includes("\n");

  async function save() {
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/ui-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ de: deVals, fa: faVals }),
      });
      const json = await res.json();
      if (res.ok && json.ok) setStatus("ok");
      else { setError(json.detail || json.error || "Unbekannter Fehler"); setStatus("error"); }
    } catch (e) {
      setError(String(e)); setStatus("error");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const total = allKeys.length;
  const shown = groups.reduce((n, g) => n + g.keys.length, 0);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-8">
      {/* Umschalter */}
      <div className="mb-5 flex flex-wrap gap-2 text-sm">
        <a href="/admin" className="rounded-full px-4 py-2 font-medium text-brand-600 hover:bg-sand-100">Beiträge</a>
        <a href="/admin/links" className="rounded-full px-4 py-2 font-medium text-brand-600 hover:bg-sand-100">Nützliche Links</a>
        <span className="rounded-full bg-brand-100 px-4 py-2 font-semibold text-brand-900">Texte</span>
      </div>

      {/* Kopf */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-900">Website-Texte (Deutsch &amp; دری)</h1>
          <p className="text-sm text-brand-500">
            Alle Oberflächentexte in beiden Sprachen · Speichern löst eine Neubereitstellung aus (ca. 1–2 Min).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={status === "saving"}
            className="rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-white hover:bg-accent-400 disabled:opacity-60"
          >
            {status === "saving" ? "Speichern ..." : "Speichern & veröffentlichen"}
          </button>
          <button onClick={logout} className="rounded-full px-4 py-2 text-sm font-medium text-brand-600 hover:bg-sand-100">Abmelden</button>
        </div>
      </div>

      {status === "ok" && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          ✓ Gespeichert. Die Website wird in ca. 1–2 Minuten automatisch neu bereitgestellt.
        </div>
      )}
      {status === "error" && (
        <div className="mt-4 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-700">
          ⚠︎ {error}
        </div>
      )}

      {/* Suche */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suchen (Text oder Schlüssel) ..."
          className={`${field} max-w-md`}
        />
        <span className="text-xs text-brand-400">
          {query ? `${shown} von ${total}` : `${total} Texte`}
        </span>
      </div>

      {/* Abschnitte */}
      <div className="mt-6 space-y-10">
        {groups.map((g) => (
          <section key={g.prefix}>
            <h2 className="sticky top-0 z-10 -mx-1 mb-3 bg-sand-50/95 px-1 py-1 text-sm font-bold uppercase tracking-wide text-accent-600 backdrop-blur">
              {g.label}
            </h2>
            <div className="space-y-5">
              {g.keys.map((k) => (
                <div key={k} className="rounded-xl border border-sand-200 bg-white p-4">
                  <div className="mb-2 font-mono text-[11px] text-brand-400">{k}</div>
                  <div className="grid gap-3 lg:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-brand-500">Deutsch</label>
                      {isLong(k) ? (
                        <textarea rows={3} className={field} value={deVals[k] ?? ""} onChange={(e) => setDe(k, e.target.value)} />
                      ) : (
                        <input className={field} value={deVals[k] ?? ""} onChange={(e) => setDe(k, e.target.value)} />
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-brand-500">دری (Farsi)</label>
                      {isLong(k) ? (
                        <textarea
                          rows={3}
                          dir="rtl"
                          style={{ fontFamily: "var(--font-fa)", lineHeight: 1.9 }}
                          className={field}
                          value={faVals[k] ?? ""}
                          onChange={(e) => setFa(k, e.target.value)}
                        />
                      ) : (
                        <input
                          dir="rtl"
                          style={{ fontFamily: "var(--font-fa)" }}
                          className={field}
                          value={faVals[k] ?? ""}
                          onChange={(e) => setFa(k, e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
        {groups.length === 0 && (
          <p className="py-10 text-center text-sm text-brand-400">Keine Treffer für „{query}".</p>
        )}
      </div>

      <p className="mt-10 rounded-xl bg-sand-100 px-4 py-3 text-xs text-brand-600">
        Hinweis: Persische Halbabstände (نیمفاصله) bleiben beim Speichern erhalten.
        Leere Felder setzen automatisch den eingebauten Standardtext ein.
      </p>
    </div>
  );
}
