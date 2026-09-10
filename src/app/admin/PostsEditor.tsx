"use client";

import { useCallback, useMemo, useState } from "react";
import type { Post, PostCategory } from "@/lib/posts";
import { slugify, isSlug, LIMITS } from "@/lib/validate";
import { field, label, hint, Count, Empty, PageHeader, SaveBar, ConfirmInline, describeError, type SaveStatus } from "./_ui/primitives";

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

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
};

/** Ein Beitrag als kurzer Eintrag mit seinen Problemen. */
function problemsOf(p: Post, all: Post[]): string[] {
  const out: string[] = [];
  if (!p.slug) out.push("Slug fehlt");
  else if (!isSlug(p.slug)) out.push("Slug ungültig");
  else if (all.filter((x) => x.slug === p.slug).length > 1) out.push("Slug doppelt");
  if (!p.title.de.trim()) out.push("Titel (DE) fehlt");
  if (!p.title.fa.trim()) out.push("Titel (FA) fehlt");
  if (p.body.de.filter((l) => l.trim()).length === 0) out.push("Text (DE) leer");
  if (p.teaser.de.length > LIMITS.teaser || p.teaser.fa.length > LIMITS.teaser) out.push("Teaser zu lang");
  return out;
}

export default function PostsEditor({ initialPosts, images }: { initialPosts: Post[]; images: string[] }) {
  const [saved, setSaved] = useState<Post[]>(initialPosts);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [idx, setIdx] = useState<number>(initialPosts.length ? 0 : -1);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);
  const [autoSlug, setAutoSlug] = useState<Record<number, boolean>>({});
  const [preview, setPreview] = useState(false);
  // Steigt bei jeder Listenaenderung (anlegen, duplizieren, loeschen, verwerfen),
  // damit die Sprachspalten frisch aufgebaut werden.
  const [gen, setGen] = useState(0);

  const cur = idx >= 0 ? posts[idx] : null;
  const dirty = useMemo(() => JSON.stringify(posts) !== JSON.stringify(saved), [posts, saved]);
  const changedCount = useMemo(() => {
    const bySlug = new Map(saved.map((p) => [p.slug, JSON.stringify(p)]));
    let n = 0;
    for (const p of posts) if (bySlug.get(p.slug) !== JSON.stringify(p)) n++;
    return n + Math.max(0, saved.length - posts.length);
  }, [posts, saved]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => !q || (p.title.de + " " + p.title.fa + " " + p.slug + " " + p.tags.de.join(" ")).toLowerCase().includes(q));
  }, [posts, query]);

  const update = (patch: Partial<Post>) => {
    if (idx < 0) return;
    setPosts((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
    if (status !== "saving") setStatus("idle");
  };

  const setTitleDe = (v: string) => {
    if (!cur) return;
    const patch: Partial<Post> = { title: { ...cur.title, de: v } };
    // Slug automatisch aus dem deutschen Titel, solange er nicht von Hand geaendert wurde.
    const isNew = !saved.some((s) => s.slug === cur.slug);
    if (isNew && autoSlug[idx] !== false) patch.slug = slugify(v);
    update(patch);
  };

  const addPost = () => {
    setPosts((prev) => [emptyPost(), ...prev]);
    setIdx(0);
    setGen((g) => g + 1);
    setAutoSlug((a) => ({ ...a, 0: true }));
    setQuery("");
    setPreview(false);
    setStatus("idle");
  };

  const duplicatePost = () => {
    if (!cur) return;
    const copy: Post = JSON.parse(JSON.stringify(cur));
    copy.slug = `${cur.slug}-kopie`;
    copy.date = new Date().toISOString().slice(0, 10);
    setPosts((prev) => [copy, ...prev]);
    setIdx(0);
    setGen((g) => g + 1);
    setStatus("idle");
  };

  const removePost = () => {
    if (idx < 0) return;
    setPosts((prev) => prev.filter((_, i) => i !== idx));
    setIdx((prev) => (prev > 0 ? prev - 1 : posts.length > 1 ? 0 : -1));
    setGen((g) => g + 1);
    setConfirmDel(false);
    setStatus("idle");
  };

  const discard = () => {
    setPosts(saved);
    setIdx(saved.length ? Math.min(idx, saved.length - 1) : -1);
    setGen((g) => g + 1);
    setStatus("idle");
    setError("");
  };

  const save = useCallback(async () => {
    const bad = posts.map((p) => ({ p, probs: problemsOf(p, posts) })).find((x) => x.probs.length);
    if (bad) {
      setError(`„${bad.p.title.de || bad.p.slug || "Neuer Beitrag"}“: ${bad.probs.join(", ")}.`);
      setStatus("error");
      setIdx(posts.indexOf(bad.p));
      return;
    }
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setSaved(posts);
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
  }, [posts]);

  const probs = cur ? problemsOf(cur, posts) : [];

  return (
    <>
      <PageHeader title="Beiträge" subtitle={`${posts.length} Beiträge · Änderungen gehen als Commit in die Website`}>
        <button onClick={addPost} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
          + Neuer Beitrag
        </button>
      </PageHeader>

      <div className="grid gap-6 px-4 py-6 pb-28 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        {/* Liste */}
        <aside className="space-y-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Beiträge durchsuchen ..."
            className={field}
            aria-label="Beiträge durchsuchen"
          />
          <div className="max-h-[40vh] space-y-1 overflow-y-auto lg:max-h-[calc(100vh-240px)]">
            {filtered.map(({ p, i }) => {
              const pr = problemsOf(p, posts);
              const changed = JSON.stringify(saved.find((s) => s.slug === p.slug)) !== JSON.stringify(p);
              return (
                <button
                  key={i}
                  onClick={() => { setIdx(i); setConfirmDel(false); }}
                  className={`block w-full rounded-xl px-3 py-2.5 text-start text-sm transition ${
                    i === idx ? "bg-brand-100 text-brand-900 ring-1 ring-brand-200" : "text-brand-800 hover:bg-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {changed && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" title="geändert" />}
                    <span className="truncate font-medium">{p.title.de || p.slug || "Neuer Beitrag"}</span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-2 text-xs text-brand-700">
                    <span className={`rounded-full px-1.5 py-px ${p.category === "news" ? "bg-accent-50 text-accent-700" : "bg-sand-100"}`}>
                      {p.category === "news" ? "Nachricht" : "Artikel"}
                    </span>
                    {fmtDate(p.date)}
                    {pr.length > 0 && <span className="text-accent-600" title={pr.join(", ")}>⚠︎</span>}
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-sm text-brand-700">{query ? "Keine Treffer." : "Noch keine Beiträge."}</p>
            )}
          </div>
        </aside>

        {/* Editor */}
        {cur ? (
          <section className="min-w-0 space-y-6 rounded-2xl border border-sand-200 bg-white p-5 sm:p-6">
            {/* Werkzeugleiste */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-brand-700">Adresse:</span>
                <code className="rounded bg-sand-100 px-2 py-1 text-brand-900" dir="ltr">/de/news/{cur.slug || "…"}</code>
                {saved.some((s) => s.slug === cur.slug) && (
                  <a href={`/de/news/${cur.slug}`} target="_blank" rel="noopener" className="font-semibold text-accent-600 hover:underline">
                    Live ansehen ↗
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPreview((v) => !v)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${preview ? "bg-brand-100 text-brand-900" : "text-brand-700 hover:bg-sand-100"}`}>
                  {preview ? "Bearbeiten" : "Vorschau"}
                </button>
                <button onClick={duplicatePost} className="rounded-full px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-sand-100">
                  Duplizieren
                </button>
              </div>
            </div>

            {probs.length > 0 && (
              <div className="rounded-xl border border-accent-200 bg-accent-50 px-4 py-2.5 text-sm text-accent-700">
                Vor dem Veröffentlichen: {probs.join(" · ")}
              </div>
            )}

            {preview ? (
              <PostPreview post={cur} />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={label}>Datum</label>
                    <input type="date" className={field} value={cur.date} onChange={(e) => update({ date: e.target.value })} />
                  </div>
                  <div>
                    <label className={label}>Art</label>
                    <select className={field} value={cur.category} onChange={(e) => update({ category: e.target.value as PostCategory })}>
                      <option value="article">Artikel (zeitlos)</option>
                      <option value="news">Nachricht (aktuell)</option>
                    </select>
                  </div>
                  <div>
                    <label className={label}>
                      Slug (URL-Kürzel)
                      {!saved.some((s) => s.slug === cur.slug) && (
                        <button
                          type="button"
                          onClick={() => { setAutoSlug((a) => ({ ...a, [idx]: true })); update({ slug: slugify(cur.title.de) }); }}
                          className="font-normal text-accent-600 hover:underline"
                        >
                          aus Titel
                        </button>
                      )}
                    </label>
                    <input
                      className={`${field} font-mono`}
                      dir="ltr"
                      value={cur.slug}
                      onChange={(e) => { setAutoSlug((a) => ({ ...a, [idx]: false })); update({ slug: e.target.value.toLowerCase() }); }}
                      placeholder="wird aus dem Titel gebildet"
                    />
                    <p className={hint}>Nur a–z, 0–9 und Bindestrich. Nach Veröffentlichung nicht mehr ändern (Links brechen).</p>
                  </div>
                </div>

                <div>
                  <label className={label}>Titelbild</label>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <select className={field} value={images.includes(cur.image ?? "") ? cur.image : cur.image ? "__custom" : ""} onChange={(e) => { if (e.target.value !== "__custom") update({ image: e.target.value }); }}>
                      <option value="">Kein Bild</option>
                      {images.map((src) => (
                        <option key={src} value={src}>{src.replace("/images/", "")}</option>
                      ))}
                      {cur.image && !images.includes(cur.image) && <option value="__custom">Eigener Pfad: {cur.image}</option>}
                    </select>
                    {cur.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={cur.image} alt="" className="h-[38px] w-16 rounded-md border border-sand-200 object-cover" />
                    ) : <span />}
                  </div>
                  <input className={`${field} mt-2 font-mono text-xs`} dir="ltr" value={cur.image ?? ""} onChange={(e) => update({ image: e.target.value })} placeholder="/images/schahed/… oder https://…" />
                  <p className={hint}>Neue Bilder in <code>public/images/schahed/</code> ins Repository legen; sie erscheinen dann in der Auswahl.</p>
                </div>

                {/* DE / FA zweispaltig */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <LangColumn
                    key={`de-${idx}-${gen}`}
                    dir="ltr"
                    heading="Deutsch"
                    title={cur.title.de} onTitle={setTitleDe}
                    teaser={cur.teaser.de} onTeaser={(v) => update({ teaser: { ...cur.teaser, de: v } })}
                    body={cur.body.de} onBody={(v) => update({ body: { ...cur.body, de: v } })}
                    tags={cur.tags.de} onTags={(v) => update({ tags: { ...cur.tags, de: v } })}
                    labels={{ title: "Titel", teaser: "Teaser (Vorschautext)", body: "Text", tags: "Schlagwörter (Komma-getrennt)" }}
                    sep=","
                  />
                  <LangColumn
                    key={`fa-${idx}-${gen}`}
                    dir="rtl"
                    heading="فارسی (Farsi)"
                    title={cur.title.fa} onTitle={(v) => update({ title: { ...cur.title, fa: v } })}
                    teaser={cur.teaser.fa} onTeaser={(v) => update({ teaser: { ...cur.teaser, fa: v } })}
                    body={cur.body.fa} onBody={(v) => update({ body: { ...cur.body, fa: v } })}
                    tags={cur.tags.fa} onTags={(v) => update({ tags: { ...cur.tags, fa: v } })}
                    labels={{ title: "عنوان", teaser: "خلاصه", body: "متن", tags: "برچسب‌ها (با ویرگول)" }}
                    sep="،"
                  />
                </div>

                <details className="rounded-xl bg-sand-50 px-4 py-3 text-xs text-brand-700">
                  <summary className="cursor-pointer font-semibold">Formatierung im Text</summary>
                  <ul className="mt-2 space-y-1">
                    <li><code>## Überschrift</code> für eine Zwischenüberschrift</li>
                    <li><code>- Punkt</code> für einen Aufzählungspunkt (mehrere Zeilen hintereinander werden eine Liste)</li>
                    <li><code>&gt; Zitat</code> für ein hervorgehobenes Zitat</li>
                    <li>Jede andere Zeile wird ein Absatz. Leerzeilen werden ignoriert.</li>
                  </ul>
                </details>
              </>
            )}

            <div className="border-t border-sand-200 pt-4">
              {confirmDel ? (
                <ConfirmInline text={`Beitrag „${cur.title.de || cur.slug}“ endgültig löschen?`} onYes={removePost} onNo={() => setConfirmDel(false)} />
              ) : (
                <button onClick={() => setConfirmDel(true)} className="rounded-full px-4 py-2 text-sm font-medium text-accent-600 hover:bg-accent-50">
                  Beitrag löschen
                </button>
              )}
            </div>
          </section>
        ) : (
          <Empty>Wähle links einen Beitrag oder lege mit „Neuer Beitrag“ einen an.</Empty>
        )}
      </div>

      <SaveBar
        dirty={dirty}
        status={status}
        error={error}
        onSave={save}
        onDiscard={discard}
        summary={changedCount === 1 ? "1 Beitrag geändert" : `${changedCount} Beiträge geändert`}
      />
    </>
  );
}

function LangColumn(props: {
  dir: "ltr" | "rtl";
  heading: string;
  title: string; onTitle: (v: string) => void;
  teaser: string; onTeaser: (v: string) => void;
  body: string[]; onBody: (v: string[]) => void;
  tags: string[]; onTags: (v: string[]) => void;
  labels: { title: string; teaser: string; body: string; tags: string };
  sep: string;
}) {
  const fa = props.dir === "rtl";
  const faStyle = fa ? { fontFamily: "var(--font-fa)", lineHeight: 1.9 } : undefined;
  // Freitext fuer die Schlagwoerter; die Spalte wird per key je Beitrag neu
  // aufgebaut, daher reicht ein einfacher Startwert.
  const [tagsText, setTagsText] = useState(props.tags.join(`${props.sep} `));

  return (
    <div className="space-y-4" dir={props.dir}>
      <h3 className="flex items-center gap-2 text-sm font-bold text-brand-800">
        <span className="inline-block h-4 w-1 rounded bg-accent-400" aria-hidden />
        {props.heading}
      </h3>
      <div>
        <label className={label}>{props.labels.title} <Count value={props.title} max={LIMITS.title} /></label>
        <input className={field} style={faStyle} value={props.title} onChange={(e) => props.onTitle(e.target.value)} />
      </div>
      <div>
        <label className={label}>{props.labels.teaser} <Count value={props.teaser} max={LIMITS.teaser} /></label>
        <textarea rows={3} className={field} style={faStyle} value={props.teaser} onChange={(e) => props.onTeaser(e.target.value)} />
      </div>
      <div>
        <label className={label}>{props.labels.body} <span className="font-normal text-brand-700/70">{props.body.filter((l) => l.trim()).length} Absätze</span></label>
        <textarea
          rows={14}
          className={`${field} leading-relaxed`}
          style={faStyle}
          value={props.body.join("\n")}
          onChange={(e) => props.onBody(e.target.value.split("\n"))}
        />
      </div>
      <div>
        <label className={label}>{props.labels.tags}</label>
        <input
          className={field}
          style={faStyle}
          value={tagsText}
          onChange={(e) => {
            setTagsText(e.target.value);
            props.onTags(e.target.value.split(/[,،]/).map((s) => s.trim()).filter(Boolean));
          }}
        />
      </div>
    </div>
  );
}

/** Vorschau in beiden Sprachen, angelehnt an die Detailseite. */
function PostPreview({ post }: { post: Post }) {
  const render = (lines: string[]) => {
    const out: React.ReactNode[] = [];
    let list: string[] = [];
    const flush = (k: string) => {
      if (!list.length) return;
      out.push(<ul key={k} className="my-3 list-disc space-y-1 ps-5 marker:text-accent-400">{list.map((l, i) => <li key={i}>{l}</li>)}</ul>);
      list = [];
    };
    lines.forEach((raw, i) => {
      const line = raw.trim();
      if (!line) return;
      if (line.startsWith("- ")) { list.push(line.slice(2)); return; }
      flush(`u${i}`);
      if (line.startsWith("## ")) out.push(<h4 key={i} className="mt-5 text-base font-bold text-brand-900">{line.slice(3)}</h4>);
      else if (line.startsWith("> ")) out.push(<blockquote key={i} className="my-4 border-s-4 border-accent-400 bg-sand-100 px-4 py-2 italic text-brand-700">{line.slice(2)}</blockquote>);
      else out.push(<p key={i} className="mt-3 text-brand-800/90">{line}</p>);
    });
    flush("end");
    return out;
  };
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {(["de", "fa"] as const).map((loc) => (
        <article key={loc} dir={loc === "fa" ? "rtl" : "ltr"} className="rounded-xl border border-sand-200 bg-sand-50 p-5 text-sm" style={loc === "fa" ? { fontFamily: "var(--font-fa)", lineHeight: 1.9 } : undefined}>
          {post.image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={post.image} alt="" className="mb-4 h-40 w-full rounded-lg object-cover" />
          )}
          <p className="text-xs uppercase tracking-wide text-accent-600">{post.category === "news" ? (loc === "fa" ? "خبر" : "Nachricht") : (loc === "fa" ? "مقاله" : "Artikel")} · {fmtDate(post.date)}</p>
          <h3 className="mt-1 text-xl font-bold text-brand-900">{post.title[loc] || "—"}</h3>
          <p className="mt-2 font-medium text-brand-700">{post.teaser[loc]}</p>
          {render(post.body[loc])}
          {post.tags[loc].length > 0 && (
            <p className="mt-4 flex flex-wrap gap-1.5">{post.tags[loc].map((t) => <span key={t} className="rounded-full bg-white px-2 py-0.5 text-xs text-brand-700 ring-1 ring-sand-200">{t}</span>)}</p>
          )}
        </article>
      ))}
    </div>
  );
}
