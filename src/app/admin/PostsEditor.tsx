"use client";

import { useState } from "react";
import type { Post, PostCategory } from "@/lib/posts";

const field =
  "w-full rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
const label = "block text-xs font-semibold uppercase tracking-wide text-brand-500 mb-1";

function emptyPost(): Post {
  return {
    slug: "",
    date: new Date().toISOString().slice(0, 10),
    category: "article",
    image: "",
    title: { de: "", fa: "" },
    teaser: { de: "", fa: "" },
    body: { de: [], fa: [] },
    tags: { de: [], fa: [] },
  };
}

export default function PostsEditor({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [idx, setIdx] = useState<number>(initialPosts.length ? 0 : -1);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const cur = idx >= 0 ? posts[idx] : null;

  const update = (patch: Partial<Post>) => {
    if (idx < 0) return;
    setPosts((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
    setStatus("idle");
  };

  const addPost = () => {
    setPosts((prev) => [emptyPost(), ...prev]);
    setIdx(0);
    setStatus("idle");
  };

  const removePost = () => {
    if (idx < 0) return;
    if (!confirm("Diesen Beitrag wirklich löschen?")) return;
    setPosts((prev) => prev.filter((_, i) => i !== idx));
    setIdx((prev) => (prev > 0 ? prev - 1 : posts.length > 1 ? 0 : -1));
    setStatus("idle");
  };

  async function save() {
    // Slugs pruefen
    for (const p of posts) {
      if (!p.slug.trim()) {
        setError("Jeder Beitrag braucht einen Slug (URL-Kürzel).");
        setStatus("error");
        return;
      }
    }
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts }),
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
        <span className="rounded-full bg-brand-100 px-4 py-2 font-semibold text-brand-900">
          Beiträge
        </span>
        <a href="/admin/links" className="rounded-full px-4 py-2 font-medium text-brand-600 hover:bg-sand-100">
          Nützliche Links
        </a>
      </div>

      {/* Kopfzeile */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-900">Beiträge verwalten</h1>
          <p className="text-sm text-brand-500">
            Änderungen werden per Commit gespeichert · Neubereitstellung ca. 1–2 Min.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={addPost} className="rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-200">
            + Neuer Beitrag
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
          {posts.map((p, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`block w-full rounded-lg px-3 py-2 text-start text-sm transition ${
                i === idx ? "bg-brand-100 text-brand-900" : "hover:bg-sand-100 text-brand-700"
              }`}
            >
              <span className="block truncate font-medium">{p.title.de || p.slug || "(ohne Titel)"}</span>
              <span className="block truncate text-xs text-brand-400">
                {p.category === "news" ? "Nachricht" : "Artikel"} · {p.date}
              </span>
            </button>
          ))}
          {posts.length === 0 && (
            <p className="px-3 py-6 text-sm text-brand-400">Noch keine Beiträge.</p>
          )}
        </aside>

        {/* Editor */}
        {cur ? (
          <section className="space-y-5 rounded-2xl border border-sand-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className={label}>Slug (URL)</label>
                <input className={field} value={cur.slug} onChange={(e) => update({ slug: e.target.value })} />
              </div>
              <div>
                <label className={label}>Datum</label>
                <input type="date" className={field} value={cur.date} onChange={(e) => update({ date: e.target.value })} />
              </div>
              <div>
                <label className={label}>Kategorie</label>
                <select
                  className={field}
                  value={cur.category}
                  onChange={(e) => update({ category: e.target.value as PostCategory })}
                >
                  <option value="article">Artikel</option>
                  <option value="news">Nachricht</option>
                </select>
              </div>
            </div>

            <div>
              <label className={label}>Bild (Pfad, z. B. /images/gallery-1.jpg)</label>
              <input className={field} value={cur.image ?? ""} onChange={(e) => update({ image: e.target.value })} />
            </div>

            {/* DE / FA zweispaltig */}
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-brand-800">Deutsch</h3>
                <div>
                  <label className={label}>Titel</label>
                  <input className={field} value={cur.title.de} onChange={(e) => update({ title: { ...cur.title, de: e.target.value } })} />
                </div>
                <div>
                  <label className={label}>Teaser</label>
                  <textarea rows={3} className={field} value={cur.teaser.de} onChange={(e) => update({ teaser: { ...cur.teaser, de: e.target.value } })} />
                </div>
                <div>
                  <label className={label}>Text (ein Absatz pro Zeile · ## Überschrift · - Punkt · &gt; Zitat)</label>
                  <textarea rows={12} className={`${field} font-mono`} value={cur.body.de.join("\n")} onChange={(e) => update({ body: { ...cur.body, de: e.target.value.split("\n") } })} />
                </div>
                <div>
                  <label className={label}>Tags (mit Komma getrennt)</label>
                  <input className={field} value={cur.tags.de.join(", ")} onChange={(e) => update({ tags: { ...cur.tags, de: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })} />
                </div>
              </div>

              <div className="space-y-4" dir="rtl">
                <h3 className="text-sm font-bold text-brand-800">دری (Farsi)</h3>
                <div>
                  <label className={label}>عنوان</label>
                  <input className={field} value={cur.title.fa} onChange={(e) => update({ title: { ...cur.title, fa: e.target.value } })} />
                </div>
                <div>
                  <label className={label}>خلاصه</label>
                  <textarea rows={3} className={field} value={cur.teaser.fa} onChange={(e) => update({ teaser: { ...cur.teaser, fa: e.target.value } })} />
                </div>
                <div>
                  <label className={label}>متن (هر پاراگراف در یک خط · ## عنوان · - مورد · &gt; نقلقول)</label>
                  <textarea rows={12} className={field} value={cur.body.fa.join("\n")} onChange={(e) => update({ body: { ...cur.body, fa: e.target.value.split("\n") } })} />
                </div>
                <div>
                  <label className={label}>برچسبها (با کاما جدا کنید)</label>
                  <input className={field} value={cur.tags.fa.join("، ")} onChange={(e) => update({ tags: { ...cur.tags, fa: e.target.value.split(/[,،]/).map((s) => s.trim()).filter(Boolean) } })} />
                </div>
              </div>
            </div>

            <div className="border-t border-sand-200 pt-4">
              <button onClick={removePost} className="rounded-full px-4 py-2 text-sm font-medium text-accent-600 hover:bg-accent-50">
                Diesen Beitrag löschen
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-sand-300 bg-white/60 p-16 text-center text-brand-500">
            Wähle links einen Beitrag oder erstelle einen neuen.
          </section>
        )}
      </div>
    </div>
  );
}
