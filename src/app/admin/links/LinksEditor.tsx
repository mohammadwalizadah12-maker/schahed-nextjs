"use client";

import { useState } from "react";
import type { UsefulLink } from "@/lib/links";

const field =
  "w-full rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
const label = "block text-xs font-semibold uppercase tracking-wide text-brand-500 mb-1";

function emptyLink(): UsefulLink {
  return {
    id: "link-" + Math.random().toString(36).slice(2, 8),
    url: "https://",
    heading: { de: "", fa: "" },
    image: "",
    title: { de: "", fa: "" },
    description: { de: "", fa: "" },
  };
}

export default function LinksEditor({ initialLinks }: { initialLinks: UsefulLink[] }) {
  const [links, setLinks] = useState<UsefulLink[]>(initialLinks);
  const [idx, setIdx] = useState<number>(initialLinks.length ? 0 : -1);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const cur = idx >= 0 ? links[idx] : null;

  const update = (patch: Partial<UsefulLink>) => {
    if (idx < 0) return;
    setLinks((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
    setStatus("idle");
  };

  const addLink = () => {
    setLinks((prev) => [emptyLink(), ...prev]);
    setIdx(0);
    setStatus("idle");
  };

  const removeLink = () => {
    if (idx < 0) return;
    if (!confirm("Diesen Link wirklich löschen?")) return;
    setLinks((prev) => prev.filter((_, i) => i !== idx));
    setIdx((prev) => (prev > 0 ? prev - 1 : links.length > 1 ? 0 : -1));
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

  async function save() {
    for (const l of links) {
      if (!l.url.trim() || l.url.trim() === "https://") {
        setError("Jeder Link braucht eine gültige URL.");
        setStatus("error");
        return;
      }
    }
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
      } else {
        setError(json.detail || json.error || "Unbekannter Fehler");
        setStatus("error");
      }
    } catch (e) {
      setError(String(e));
      setStatus("error");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-8">
      {/* Umschalter Beiträge / Links */}
      <div className="mb-5 flex gap-2 text-sm">
        <a href="/admin" className="rounded-full px-4 py-2 font-medium text-brand-600 hover:bg-sand-100">
          Beiträge
        </a>
        <span className="rounded-full bg-brand-100 px-4 py-2 font-semibold text-brand-900">
          Nützliche Links
        </span>
      </div>

      {/* Kopfzeile */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-900">Nützliche Links verwalten</h1>
          <p className="text-sm text-brand-500">
            Änderungen werden per Commit gespeichert · Neubereitstellung ca. 1–2 Min.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={addLink} className="rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-200">
            + Neuer Link
          </button>
          <button
            onClick={save}
            disabled={status === "saving"}
            className="rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-white hover:bg-accent-400 disabled:opacity-60"
          >
            {status === "saving" ? "Speichern ..." : "Speichern & veröffentlichen"}
          </button>
          <button onClick={logout} className="rounded-full px-4 py-2 text-sm font-medium text-brand-600 hover:bg-sand-100">
            Abmelden
          </button>
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

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Liste */}
        <aside className="space-y-1">
          {links.map((l, i) => (
            <button
              key={l.id || i}
              onClick={() => setIdx(i)}
              className={`block w-full rounded-lg px-3 py-2 text-start text-sm transition ${
                i === idx ? "bg-brand-100 text-brand-900" : "hover:bg-sand-100 text-brand-700"
              }`}
            >
              <span className="block truncate font-medium">{l.title.de || l.url || "(ohne Titel)"}</span>
              <span className="block truncate text-xs text-brand-400">{l.url}</span>
            </button>
          ))}
          {links.length === 0 && (
            <p className="px-3 py-6 text-sm text-brand-400">Noch keine Links.</p>
          )}
        </aside>

        {/* Editor */}
        {cur ? (
          <section className="space-y-5 rounded-2xl border border-sand-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>URL</label>
                <input className={field} value={cur.url} dir="ltr" onChange={(e) => update({ url: e.target.value })} placeholder="https://beispiel.de" />
              </div>
              <div>
                <label className={label}>Vorschaubild (optional · Pfad oder URL)</label>
                <input className={field} value={cur.image ?? ""} dir="ltr" onChange={(e) => update({ image: e.target.value })} placeholder="leer = automatisch (Favicon/og:image)" />
              </div>
            </div>

            {(cur.image ?? "").trim() !== "" && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={cur.image} alt="" className="h-40 w-full rounded-xl border border-sand-200 object-cover" />
            )}

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-brand-800">Deutsch</h3>
                <div>
                  <label className={label}>Rubrik / Überschrift (optional)</label>
                  <input className={field} value={cur.heading?.de ?? ""} onChange={(e) => update({ heading: { de: e.target.value, fa: cur.heading?.fa ?? "" } })} placeholder="z. B. Partnerorganisationen" />
                </div>
                <div>
                  <label className={label}>Titel</label>
                  <input className={field} value={cur.title.de} onChange={(e) => update({ title: { ...cur.title, de: e.target.value } })} />
                </div>
                <div>
                  <label className={label}>Beschreibung (optional)</label>
                  <textarea rows={3} className={field} value={cur.description.de} onChange={(e) => update({ description: { ...cur.description, de: e.target.value } })} />
                </div>
              </div>

              <div className="space-y-4" dir="rtl">
                <h3 className="text-sm font-bold text-brand-800">دری (Farsi)</h3>
                <div>
                  <label className={label}>رابریک / عنوان بخش (اختیاری)</label>
                  <input className={field} value={cur.heading?.fa ?? ""} onChange={(e) => update({ heading: { de: cur.heading?.de ?? "", fa: e.target.value } })} />
                </div>
                <div>
                  <label className={label}>عنوان</label>
                  <input className={field} value={cur.title.fa} onChange={(e) => update({ title: { ...cur.title, fa: e.target.value } })} />
                </div>
                <div>
                  <label className={label}>توضیحات (اختیاری)</label>
                  <textarea rows={3} className={field} value={cur.description.fa} onChange={(e) => update({ description: { ...cur.description, fa: e.target.value } })} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-4">
              <div className="flex gap-2">
                <button onClick={() => move(-1)} disabled={idx <= 0} className="rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-sand-200 disabled:opacity-40">
                  ↑ Nach oben
                </button>
                <button onClick={() => move(1)} disabled={idx >= links.length - 1} className="rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-sand-200 disabled:opacity-40">
                  ↓ Nach unten
                </button>
              </div>
              <button onClick={removeLink} className="rounded-full px-4 py-2 text-sm font-medium text-accent-600 hover:bg-accent-50">
                Diesen Link löschen
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-sand-300 bg-white/60 p-16 text-center text-brand-500">
            Wähle links einen Link oder erstelle einen neuen.
          </section>
        )}
      </div>
    </div>
  );
}
