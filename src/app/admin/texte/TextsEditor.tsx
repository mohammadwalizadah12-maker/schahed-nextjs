"use client";

import { useCallback, useMemo, useState } from "react";
import { LIMITS } from "@/lib/validate";
import { field, Count, PageHeader, SaveBar, describeError, type SaveStatus } from "../_ui/primitives";

type Dict = Record<string, string>;

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
const SECTION_ORDER = Object.keys(SECTION_LABELS);
const prefixOf = (key: string) => key.split(".")[0];

type Filter = "all" | "changed" | "custom" | "missing";

export default function TextsEditor({ de, fa, overridden }: { de: Dict; fa: Dict; overridden: string[] }) {
  const [savedDe, setSavedDe] = useState<Dict>(de);
  const [savedFa, setSavedFa] = useState<Dict>(fa);
  const [deVals, setDeVals] = useState<Dict>({ ...de });
  const [faVals, setFaVals] = useState<Dict>({ ...fa });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [section, setSection] = useState<string>("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");
  const custom = useMemo(() => new Set(overridden), [overridden]);

  const allKeys = useMemo(() => {
    const keys = Object.keys(de);
    for (const k of Object.keys(fa)) if (!keys.includes(k)) keys.push(k);
    return keys;
  }, [de, fa]);

  const changedKeys = useMemo(
    () => new Set(allKeys.filter((k) => deVals[k] !== savedDe[k] || faVals[k] !== savedFa[k])),
    [allKeys, deVals, faVals, savedDe, savedFa]
  );
  const dirty = changedKeys.size > 0;
  const missingKeys = useMemo(
    () => new Set(allKeys.filter((k) => !(deVals[k] || "").trim() || !(faVals[k] || "").trim())),
    [allKeys, deVals, faVals]
  );

  // Alle Abschnitte (fuer die Navigation), unabhaengig vom Filter.
  const allSections = useMemo(() => {
    const by: Record<string, number> = {};
    for (const k of allKeys) by[prefixOf(k)] = (by[prefixOf(k)] || 0) + 1;
    const order = [...SECTION_ORDER.filter((p) => by[p]), ...Object.keys(by).filter((p) => !SECTION_ORDER.includes(p)).sort()];
    return order.map((p) => ({ prefix: p, label: SECTION_LABELS[p] || p, count: by[p] }));
  }, [allKeys]);

  // Gefilterte Gruppen.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byPrefix: Record<string, string[]> = {};
    for (const k of allKeys) {
      if (section && prefixOf(k) !== section) continue;
      if (filter === "changed" && !changedKeys.has(k)) continue;
      if (filter === "custom" && !custom.has(k)) continue;
      if (filter === "missing" && !missingKeys.has(k)) continue;
      if (q && !(k + " " + (deVals[k] || "") + " " + (faVals[k] || "")).toLowerCase().includes(q)) continue;
      (byPrefix[prefixOf(k)] ||= []).push(k);
    }
    const order = [...SECTION_ORDER.filter((p) => byPrefix[p]), ...Object.keys(byPrefix).filter((p) => !SECTION_ORDER.includes(p)).sort()];
    return order.map((p) => ({ prefix: p, label: SECTION_LABELS[p] || p, keys: byPrefix[p] }));
  }, [allKeys, deVals, faVals, query, filter, section, changedKeys, custom, missingKeys]);

  const setDe = (k: string, v: string) => { setDeVals((s) => ({ ...s, [k]: v })); if (status !== "saving") setStatus("idle"); };
  const setFa = (k: string, v: string) => { setFaVals((s) => ({ ...s, [k]: v })); if (status !== "saving") setStatus("idle"); };
  const resetKey = (k: string) => { setDe(k, savedDe[k] ?? ""); setFa(k, savedFa[k] ?? ""); };

  const isLong = (k: string) =>
    (deVals[k] || "").length > 70 || (faVals[k] || "").length > 70 || (deVals[k] || "").includes("\n");

  const discard = () => { setDeVals({ ...savedDe }); setFaVals({ ...savedFa }); setStatus("idle"); setError(""); };

  const save = useCallback(async () => {
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/ui-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ de: deVals, fa: faVals }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setSavedDe({ ...deVals });
        setSavedFa({ ...faVals });
        setStatus("ok");
        setTimeout(() => setStatus((s) => (s === "ok" ? "idle" : s)), 6000);
      } else {
        setError(describeError(json, res.status));
        setStatus("error");
      }
    } catch {
      setError(describeError(null, 0));
      setStatus("error");
    }
  }, [deVals, faVals]);

  const shown = groups.reduce((n, g) => n + g.keys.length, 0);
  const faStyle = { fontFamily: "var(--font-fa)", lineHeight: 1.9 };

  const FilterChip = ({ v, children, n }: { v: Filter; children: React.ReactNode; n?: number }) => (
    <button
      onClick={() => setFilter(v)}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${filter === v ? "bg-brand-800 text-white" : "bg-white text-brand-800 ring-1 ring-sand-300 hover:bg-sand-100"}`}
    >
      {children}{n !== undefined && <span className="ms-1 opacity-70">{n}</span>}
    </button>
  );

  return (
    <>
      <PageHeader title="Website-Texte" subtitle={`${allKeys.length} Texte in Deutsch und Farsi · leere Felder fallen auf den eingebauten Standard zurück`} />

      <div className="grid gap-6 px-4 py-6 pb-28 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        {/* Abschnittsnavigation */}
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <div className="max-h-[30vh] overflow-y-auto rounded-2xl border border-sand-200 bg-white p-2 lg:max-h-[calc(100vh-140px)]">
            <button
              onClick={() => setSection("")}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${!section ? "bg-brand-100 font-semibold text-brand-900" : "text-brand-800 hover:bg-sand-100"}`}
            >
              Alle Abschnitte <span className="text-xs opacity-70">{allKeys.length}</span>
            </button>
            {allSections.map((s) => {
              const ch = allKeys.filter((k) => prefixOf(k) === s.prefix && changedKeys.has(k)).length;
              return (
                <button
                  key={s.prefix}
                  onClick={() => setSection(s.prefix)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-start text-sm ${section === s.prefix ? "bg-brand-100 font-semibold text-brand-900" : "text-brand-800 hover:bg-sand-100"}`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {ch > 0 && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />}
                    <span className="truncate">{s.label}</span>
                  </span>
                  <span className="text-xs opacity-70">{s.count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0">
          {/* Suche + Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suchen in Text oder Schlüssel ..."
              className={`${field} max-w-sm`}
              aria-label="Texte durchsuchen"
            />
            <FilterChip v="all">Alle</FilterChip>
            <FilterChip v="changed" n={changedKeys.size}>Ungespeichert</FilterChip>
            <FilterChip v="custom" n={custom.size}>Angepasst</FilterChip>
            <FilterChip v="missing" n={missingKeys.size}>Leer</FilterChip>
            <span className="ms-auto text-xs text-brand-700">{shown} von {allKeys.length}</span>
          </div>

          {/* Abschnitte */}
          <div className="mt-5 space-y-10">
            {groups.map((g) => (
              <section key={g.prefix} id={`sec-${g.prefix}`}>
                <h2 className="sticky top-0 z-10 -mx-1 mb-3 flex items-center gap-2 bg-sand-50/95 px-1 py-1.5 text-sm font-bold text-brand-900 backdrop-blur">
                  <span className="inline-block h-4 w-1 rounded bg-accent-400" aria-hidden />
                  {g.label}
                  <span className="text-xs font-normal text-brand-700">{g.keys.length}</span>
                </h2>
                <div className="space-y-3">
                  {g.keys.map((k) => {
                    const changed = changedKeys.has(k);
                    return (
                      <div key={k} className={`rounded-xl border bg-white p-4 transition ${changed ? "border-accent-300 shadow-[0_0_0_3px_rgba(201,74,52,0.08)]" : "border-sand-200"}`}>
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
                          <code className="text-brand-700">{k}</code>
                          {custom.has(k) && <span className="rounded-full bg-sand-100 px-2 py-px text-brand-700">angepasst</span>}
                          {changed && (
                            <button onClick={() => resetKey(k)} className="ms-auto text-accent-600 hover:underline">Änderung zurücknehmen</button>
                          )}
                        </div>
                        <div className="grid gap-3 lg:grid-cols-2">
                          <div>
                            <label className="mb-1 flex items-baseline justify-between text-xs font-semibold text-brand-800">
                              Deutsch <Count value={deVals[k] ?? ""} max={LIMITS.uiValue} />
                            </label>
                            {isLong(k) ? (
                              <textarea rows={3} className={field} value={deVals[k] ?? ""} onChange={(e) => setDe(k, e.target.value)} />
                            ) : (
                              <input className={field} value={deVals[k] ?? ""} onChange={(e) => setDe(k, e.target.value)} />
                            )}
                          </div>
                          <div>
                            <label className="mb-1 flex items-baseline justify-between text-xs font-semibold text-brand-800">
                              فارسی (Farsi) <Count value={faVals[k] ?? ""} max={LIMITS.uiValue} />
                            </label>
                            {isLong(k) ? (
                              <textarea rows={3} dir="rtl" style={faStyle} className={field} value={faVals[k] ?? ""} onChange={(e) => setFa(k, e.target.value)} />
                            ) : (
                              <input dir="rtl" style={faStyle} className={field} value={faVals[k] ?? ""} onChange={(e) => setFa(k, e.target.value)} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
            {groups.length === 0 && (
              <p className="py-10 text-center text-sm text-brand-700">
                {filter === "changed" ? "Keine ungespeicherten Änderungen." : filter === "missing" ? "Kein Text ist leer." : `Keine Treffer für „${query}“.`}
              </p>
            )}
          </div>

          <p className="mt-10 rounded-xl bg-sand-100 px-4 py-3 text-xs text-brand-700">
            Persische Halbabstände (نیم‌فاصله) bleiben beim Speichern erhalten. Ein leeres Feld setzt den eingebauten
            Standardtext wieder ein.
          </p>
        </div>
      </div>

      <SaveBar
        dirty={dirty}
        status={status}
        error={error}
        onSave={save}
        onDiscard={discard}
        summary={changedKeys.size === 1 ? "1 Text geändert" : `${changedKeys.size} Texte geändert`}
      />
    </>
  );
}
