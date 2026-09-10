"use client";

import { useCallback, useMemo, useState } from "react";
import type { UsefulLink } from "@/lib/links";
import { isHttpUrl, LIMITS } from "@/lib/validate";
import { field, label, hint, Count, Empty, PageHeader, SaveBar, ConfirmInline, describeError, type SaveStatus } from "../_ui/primitives";

function emptyLink(): UsefulLink {
  return {
    id: "link-" + Math.random().toString(36).slice(2, 8),
    url: "",
    heading: { de: "", fa: "" },
    image: "",
    title: { de: "", fa: "" },
    description: { de: "", fa: "" },
  };
}

const host = (url: string) => {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
};

function problemsOf(l: UsefulLink): string[] {
  const out: string[] = [];
  if (!l.url.trim()) out.push("URL fehlt");
  else if (!isHttpUrl(l.url)) out.push("URL ungültig (http/https)");
  if (!l.title.de.trim()) out.push("Titel (DE) fehlt");
  if (!l.title.fa.trim()) out.push("Titel (FA) fehlt");
  return out;
}

export default function LinksEditor({ initialLinks }: { initialLinks: UsefulLink[] }) {
  const [saved, setSaved] = useState<UsefulLink[]>(initialLinks);
  const [links, setLinks] = useState<UsefulLink[]>(initialLinks);
  const [idx, setIdx] = useState<number>(initialLinks.length ? 0 : -1);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);

  const cur = idx >= 0 ? links[idx] : null;
  const dirty = useMemo(() => JSON.stringify(links) !== JSON.stringify(saved), [links, saved]);

  // Vorhandene Rubriken fuer die Schnellauswahl.
  const headings = useMemo(() => {
    const m = new Map<string, string>();
    for (const l of links) if (l.heading?.de?.trim()) m.set(l.heading.de.trim(), l.heading.fa ?? "");
    return [...m.entries()];
  }, [links]);

  const update = (patch: Partial<UsefulLink>) => {
    if (idx < 0) return;
    setLinks((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
    if (status !== "saving") setStatus("idle");
  };

  const addLink = () => {
    setLinks((prev) => [emptyLink(), ...prev]);
    setIdx(0);
    setStatus("idle");
  };

  const removeLink = () => {
    if (idx < 0) return;
    setLinks((prev) => prev.filter((_, i) => i !== idx));
    setIdx((prev) => (prev > 0 ? prev - 1 : links.length > 1 ? 0 : -1));
    setConfirmDel(false);
    setStatus("idle");
  };

  const move = (dir: -1 | 1) => {
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= links.length) return;
    setLinks((prev) => {
      const next = [...prev];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
    setIdx(j);
    setStatus("idle");
  };

  const discard = () => {
    setLinks(saved);
    setIdx(saved.length ? Math.min(idx, saved.length - 1) : -1);
    setStatus("idle");
    setError("");
  };

  const save = useCallback(async () => {
    const bad = links.map((l) => ({ l, probs: problemsOf(l) })).find((x) => x.probs.length);
    if (bad) {
      setError(`„${bad.l.title.de || bad.l.url || "Neuer Link"}“: ${bad.probs.join(", ")}.`);
      setStatus("error");
      setIdx(links.indexOf(bad.l));
      return;
    }
    // Leere Rubriken nicht mitschicken.
    const payload = links.map((l) => {
      const h = l.heading && (l.heading.de.trim() || l.heading.fa.trim()) ? l.heading : undefined;
      return { ...l, heading: h };
    });
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: payload }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setSaved(links);
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
  }, [links]);

  const probs = cur ? problemsOf(cur) : [];
  const faStyle = { fontFamily: "var(--font-fa)", lineHeight: 1.9 };

  return (
    <>
      <PageHeader title="Nützliche Links" subtitle={`${links.length} Links · Reihenfolge wie auf der Website`}>
        <button onClick={addLink} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
          + Neuer Link
        </button>
      </PageHeader>

      <div className="grid gap-6 px-4 py-6 pb-28 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <aside className="max-h-[40vh] space-y-1 overflow-y-auto lg:max-h-[calc(100vh-200px)]">
          {links.map((l, i) => {
            const pr = problemsOf(l);
            const changed = JSON.stringify(saved.find((s) => s.id === l.id)) !== JSON.stringify(l);
            return (
              <button
                key={l.id}
                onClick={() => { setIdx(i); setConfirmDel(false); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition ${
                  i === idx ? "bg-brand-100 text-brand-900 ring-1 ring-brand-200" : "text-brand-800 hover:bg-white"
                }`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-sand-200">
                  {l.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={l.image} alt="" className="h-full w-full object-contain p-1" />
                  ) : (
                    <span className="text-xs font-bold text-brand-700">{(host(l.url) || "?").slice(0, 1).toUpperCase()}</span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    {changed && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" title="geändert" />}
                    <span className="truncate font-medium">{l.title.de || host(l.url) || "Neuer Link"}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-brand-700" dir="ltr">
                    {l.heading?.de ? `${l.heading.de} · ` : ""}{host(l.url) || "—"}
                    {pr.length > 0 && <span className="ms-1 text-accent-600" title={pr.join(", ")}>⚠︎</span>}
                  </span>
                </span>
              </button>
            );
          })}
          {links.length === 0 && <p className="px-3 py-6 text-sm text-brand-700">Noch keine Links.</p>}
        </aside>

        {cur ? (
          <section className="min-w-0 space-y-6 rounded-2xl border border-sand-200 bg-white p-5 sm:p-6">
            {probs.length > 0 && (
              <div className="rounded-xl border border-accent-200 bg-accent-50 px-4 py-2.5 text-sm text-accent-700">
                Vor dem Veröffentlichen: {probs.join(" · ")}
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
              <div className="space-y-4">
                <div>
                  <label className={label}>Ziel-URL</label>
                  <input className={`${field} font-mono`} dir="ltr" value={cur.url} onChange={(e) => update({ url: e.target.value.trim() })} placeholder="https://beispiel.org" />
                </div>
                <div>
                  <label className={label}>Rubrik (optional)</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input className={field} list="headings-de" value={cur.heading?.de ?? ""} onChange={(e) => {
                      const de = e.target.value;
                      const known = headings.find(([h]) => h === de);
                      update({ heading: { de, fa: known ? known[1] : (cur.heading?.fa ?? "") } });
                    }} placeholder="Deutsch, z. B. Partnerorganisationen" />
                    <input className={field} dir="rtl" style={faStyle} value={cur.heading?.fa ?? ""} onChange={(e) => update({ heading: { de: cur.heading?.de ?? "", fa: e.target.value } })} placeholder="فارسی" />
                    <datalist id="headings-de">{headings.map(([h]) => <option key={h} value={h} />)}</datalist>
                  </div>
                  <p className={hint}>Links mit gleicher Rubrik werden auf der Website zusammen gezeigt.</p>
                </div>
                <div>
                  <label className={label}>Vorschaubild (optional)</label>
                  <input className={`${field} font-mono text-xs`} dir="ltr" value={cur.image ?? ""} onChange={(e) => update({ image: e.target.value.trim() })} placeholder="/images/links/… oder https://… · leer = automatisch von der Zielseite" />
                </div>
              </div>

              {/* Live-Karte, wie sie auf der Website erscheint */}
              <div>
                <p className={label}>So erscheint die Karte</p>
                <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm">
                  <div className="flex h-28 items-center justify-center bg-sand-100">
                    {cur.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={cur.image} alt="" className="max-h-full max-w-full object-contain p-3" />
                    ) : (
                      <span className="text-xs text-brand-700">automatische Vorschau</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-brand-900">{cur.title.de || "Titel"}</p>
                    {cur.description.de && <p className="mt-1 line-clamp-3 text-xs text-brand-700">{cur.description.de}</p>}
                    <p className="mt-2 text-xs font-semibold text-accent-600" dir="ltr">{host(cur.url) || "domain"} ↗</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-brand-800"><span className="inline-block h-4 w-1 rounded bg-accent-400" aria-hidden />Deutsch</h3>
                <div>
                  <label className={label}>Titel <Count value={cur.title.de} max={LIMITS.title} /></label>
                  <input className={field} value={cur.title.de} onChange={(e) => update({ title: { ...cur.title, de: e.target.value } })} />
                </div>
                <div>
                  <label className={label}>Beschreibung (optional) <Count value={cur.description.de} max={LIMITS.description} /></label>
                  <textarea rows={4} className={field} value={cur.description.de} onChange={(e) => update({ description: { ...cur.description, de: e.target.value } })} />
                </div>
              </div>
              <div className="space-y-4" dir="rtl">
                <h3 className="flex items-center gap-2 text-sm font-bold text-brand-800"><span className="inline-block h-4 w-1 rounded bg-accent-400" aria-hidden />فارسی (Farsi)</h3>
                <div>
                  <label className={label}>عنوان <Count value={cur.title.fa} max={LIMITS.title} /></label>
                  <input className={field} style={faStyle} value={cur.title.fa} onChange={(e) => update({ title: { ...cur.title, fa: e.target.value } })} />
                </div>
                <div>
                  <label className={label}>توضیحات (اختیاری) <Count value={cur.description.fa} max={LIMITS.description} /></label>
                  <textarea rows={4} className={field} style={faStyle} value={cur.description.fa} onChange={(e) => update({ description: { ...cur.description, fa: e.target.value } })} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-4">
              <div className="flex gap-2">
                <button onClick={() => move(-1)} disabled={idx <= 0} className="rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-sand-200 disabled:opacity-40">↑ Nach oben</button>
                <button onClick={() => move(1)} disabled={idx >= links.length - 1} className="rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-sand-200 disabled:opacity-40">↓ Nach unten</button>
              </div>
              {confirmDel ? (
                <ConfirmInline text={`Link „${cur.title.de || host(cur.url)}“ löschen?`} onYes={removeLink} onNo={() => setConfirmDel(false)} />
              ) : (
                <button onClick={() => setConfirmDel(true)} className="rounded-full px-4 py-2 text-sm font-medium text-accent-600 hover:bg-accent-50">Link löschen</button>
              )}
            </div>
          </section>
        ) : (
          <Empty>Wähle links einen Link oder lege mit „Neuer Link“ einen an.</Empty>
        )}
      </div>

      <SaveBar dirty={dirty} status={status} error={error} onSave={save} onDiscard={discard} summary="Links geändert" />
    </>
  );
}
