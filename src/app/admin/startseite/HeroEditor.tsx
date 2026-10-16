"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { HERO_LIMITS, type HeroSettings } from "@/lib/startseite";
import { hint, PageHeader, SaveBar, describeError, type SaveStatus } from "../_ui/primitives";

export type ImageOption = { src: string; width: number; height: number };

type Upload = { name: string; data: string; previewUrl: string; width: number; height: number; bytes: number };

const ACCEPT = "image/jpeg,image/png,image/webp";
const MB = 1024 * 1024;

/** Liest eine Datei als data-URL und ermittelt die Pixelmasse im Browser. */
function readFile(file: File): Promise<Upload> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Die Datei konnte nicht gelesen werden."));
    reader.onload = () => {
      const url = String(reader.result);
      const img = new window.Image();
      img.onerror = () => reject(new Error("Die Datei ist kein lesbares Foto."));
      img.onload = () =>
        resolve({
          name: file.name,
          data: url.slice(url.indexOf(",") + 1),
          previewUrl: url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          bytes: file.size,
        });
      img.src = url;
    };
    reader.readAsDataURL(file);
  });
}

/** Kurzer Anzeigename ohne Ordner und Endung. */
function niceName(src: string): string {
  const base = src.split("/").pop() ?? src;
  return base.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
}

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-sand-200 bg-white p-4 sm:p-5">
    <h2 className="flex items-center gap-3 text-base font-bold text-brand-900">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white">{n}</span>
      {title}
    </h2>
    <div className="mt-4">{children}</div>
  </section>
);

/**
 * Editor fuer das grosse Foto der Startseite, in drei Schritten:
 * Foto waehlen (Upload oder vorhandenes Foto), Ausschnitt festlegen, speichern.
 * Oben zeigt eine Vorschau, wie es am Computer und auf dem Handy aussieht.
 * Speichert per POST /api/admin/startseite.
 */
export default function HeroEditor({ initial, images }: { initial: HeroSettings; images: ImageOption[] }) {
  const [saved, setSaved] = useState<HeroSettings>(initial);
  const [image, setImage] = useState(initial.image);
  const [dims, setDims] = useState({ width: initial.width, height: initial.height });
  const [focusY, setFocusY] = useState(initial.focusY);
  const [upload, setUpload] = useState<Upload | null>(null);
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty = upload !== null || image !== saved.image || focusY !== saved.focusY;
  const previewSrc = upload ? upload.previewUrl : image;
  const portrait = dims.height > dims.width;

  // Das aktuell gesetzte Foto steht immer in der Auswahl, auch wenn es von Hand eingetragen wurde.
  const options = useMemo(() => {
    const list = [...images];
    if (!list.some((o) => o.src === saved.image)) list.unshift({ src: saved.image, width: saved.width, height: saved.height });
    return list;
  }, [images, saved]);

  const summary = useMemo(() => {
    const parts: string[] = [];
    if (upload) parts.push("neues Foto");
    else if (image !== saved.image) parts.push("anderes Foto");
    if (focusY !== saved.focusY) parts.push("Bildausschnitt");
    return parts.length ? `Geändert: ${parts.join(" und ")}` : undefined;
  }, [upload, image, saved, focusY]);

  function resetFileInput() {
    if (fileRef.current) fileRef.current.value = "";
  }

  function chooseExisting(o: ImageOption) {
    setUpload(null);
    setFileError("");
    setImage(o.src);
    setDims({ width: o.width, height: o.height });
    resetFileInput();
  }

  async function takeFile(file: File | undefined) {
    if (!file) return;
    setFileError("");
    if (!ACCEPT.split(",").includes(file.type)) {
      setFileError("Bitte ein Foto als JPEG, PNG oder WebP wählen.");
      resetFileInput();
      return;
    }
    if (file.size > HERO_LIMITS.maxBytes) {
      setFileError(`Das Foto ist zu groß (${(file.size / MB).toFixed(1)} MB, erlaubt sind ${HERO_LIMITS.maxBytes / MB} MB). Bitte vorher verkleinern, zum Beispiel auf 2400 Pixel Breite.`);
      resetFileInput();
      return;
    }
    try {
      const u = await readFile(file);
      if (u.width < HERO_LIMITS.minWidth || u.height < HERO_LIMITS.minHeight) {
        setFileError(`Das Foto ist zu klein (${u.width} × ${u.height} Pixel). Es sollte mindestens ${HERO_LIMITS.minWidth} Pixel breit sein, besser 2000 oder mehr.`);
        resetFileInput();
        return;
      }
      setUpload(u);
      setDims({ width: u.width, height: u.height });
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "Die Datei konnte nicht gelesen werden.");
      resetFileInput();
    }
  }

  const discard = useCallback(() => {
    setUpload(null);
    setFileError("");
    setImage(saved.image);
    setDims({ width: saved.width, height: saved.height });
    setFocusY(saved.focusY);
    setStatus("idle");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }, [saved]);

  const save = useCallback(async () => {
    setStatus("saving");
    setError("");
    const body = upload
      ? { focusY, upload: { name: upload.name, data: upload.data } }
      : { focusY, image, width: dims.width, height: dims.height };
    try {
      const res = await fetch("/api/admin/startseite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
      if (!res.ok || !json?.ok) {
        setStatus("error");
        setError(describeError(json, res.status));
        return;
      }
      const hero = json.hero as HeroSettings;
      setSaved(hero);
      setImage(hero.image);
      setDims({ width: hero.width, height: hero.height });
      setFocusY(hero.focusY);
      setUpload(null);
      if (fileRef.current) fileRef.current.value = "";
      setStatus("ok");
    } catch {
      setStatus("error");
      setError(describeError(null, 0));
    }
  }, [upload, focusY, image, dims]);

  const dropzone = `flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
    dragging ? "border-accent-500 bg-accent-50" : "border-brand-300 bg-sand-50 hover:border-brand-400 hover:bg-sand-100"
  }`;

  return (
    <>
      <PageHeader title="Startseite" subtitle="Das große Foto ganz oben auf der Startseite ändern." />

      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 pb-28 sm:px-6 lg:px-8">
        {/* Vorschau */}
        <section className="rounded-2xl border border-sand-200 bg-white p-4 sm:p-5">
          <h2 className="text-base font-bold text-brand-900">So sieht es aus</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_150px]">
            <figure>
              <div className="relative aspect-[16/7] overflow-hidden rounded-xl bg-brand-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="" className="h-full w-full object-cover" style={{ objectPosition: `50% ${focusY}%` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-900/70 via-brand-900/60 to-brand-900/88" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-center sm:p-6">
                  <div className="mx-auto h-3 w-2/3 rounded bg-white/85 sm:h-4" />
                  <div className="mx-auto mt-2 h-3 w-1/2 rounded bg-white/60 sm:h-4" />
                  <div className="mx-auto mt-4 h-6 w-28 rounded-full bg-accent-500/90" />
                </div>
              </div>
              <figcaption className="mt-2 text-xs text-brand-700">Am Computer: das Foto füllt den Bildschirm, der Text liegt darauf.</figcaption>
            </figure>
            <figure>
              <div className="overflow-hidden rounded-xl bg-brand-900">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewSrc} alt="" className="w-full" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-brand-900" />
                </div>
                <div className="-mt-5 space-y-1.5 px-3 pb-4 pt-1">
                  <div className="mx-auto h-2 w-5/6 rounded bg-white/85" />
                  <div className="mx-auto h-2 w-2/3 rounded bg-white/60" />
                  <div className="mx-auto mt-3 h-4 w-16 rounded-full bg-accent-500/90" />
                </div>
              </div>
              <figcaption className="mt-2 text-xs text-brand-700">Auf dem Handy: ganzes Foto, Text darunter.</figcaption>
            </figure>
          </div>
          {portrait && (
            <p className="mt-3 rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-700">
              Dieses Foto ist hochkant. Auf dem Handy wird die Startseite dadurch sehr lang; ein Querformat passt besser.
            </p>
          )}
        </section>

        {/* Schritt 1: Foto */}
        <Step n={1} title="Foto wählen">
          <label
            className={dropzone}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); void takeFile(e.dataTransfer.files?.[0]); }}
          >
            <input ref={fileRef} type="file" accept={ACCEPT} className="sr-only" onChange={(e) => void takeFile(e.target.files?.[0])} />
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-brand-700" aria-hidden>
              <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
            </svg>
            <span className="text-sm font-semibold text-brand-900">Neues Foto vom Computer hochladen</span>
            <span className="text-xs text-brand-700">Hierher ziehen oder klicken · JPEG, PNG oder WebP · bis {HERO_LIMITS.maxBytes / MB} MB · Querformat</span>
          </label>
          {fileError && <p className="mt-2 rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-700">{fileError}</p>}
          {upload && !fileError && (
            <p className="mt-2 flex items-center gap-2 text-sm text-green-800">
              <span aria-hidden>✓</span> „{upload.name}“ ist bereit. Unten den Ausschnitt prüfen, dann speichern.
            </p>
          )}

          <p className="mt-5 text-sm font-semibold text-brand-800">Oder ein vorhandenes Foto nehmen</p>
          <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {options.map((o) => {
              const active = !upload && o.src === image;
              return (
                <li key={o.src}>
                  <button
                    type="button"
                    onClick={() => chooseExisting(o)}
                    aria-pressed={active}
                    title={o.src}
                    className={`group relative block w-full overflow-hidden rounded-xl border-2 text-start transition ${
                      active ? "border-accent-500 ring-2 ring-accent-100" : "border-transparent hover:border-brand-300"
                    }`}
                  >
                    <Image src={o.src} alt="" width={320} height={200} sizes="(max-width: 640px) 45vw, 240px" className="aspect-[16/10] w-full object-cover" />
                    <span className="block truncate bg-white px-2 py-1.5 text-xs text-brand-800">{niceName(o.src)}</span>
                    {active && (
                      <span className="absolute end-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white" aria-hidden>✓</span>
                    )}
                    {o.src === saved.image && (
                      <span className="absolute start-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-brand-800">aktuell online</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className={hint}>Hochgeladene Fotos erscheinen hier nach dem Veröffentlichen.</p>
        </Step>

        {/* Schritt 2: Ausschnitt */}
        <Step n={2} title="Bildausschnitt am Computer">
          <p className="text-sm text-brand-800">
            Am Computer wird das Foto oben und unten beschnitten. Schieben Sie den Regler, bis die Gesichter in der Vorschau oben gut sichtbar sind.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-brand-700">oben</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={focusY}
              onChange={(e) => setFocusY(Number(e.target.value))}
              className="w-full accent-accent-500"
              aria-label="Bildausschnitt: 0 zeigt den oberen Rand, 100 den unteren"
            />
            <span className="text-xs text-brand-700">unten</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[["Oberer Teil", 20], ["Mitte", 50], ["Unterer Teil", 80]].map(([lbl, v]) => (
              <button
                key={String(lbl)}
                type="button"
                onClick={() => setFocusY(Number(v))}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  focusY === v ? "bg-brand-800 text-white" : "bg-sand-100 text-brand-800 hover:bg-sand-200"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </Step>

        {/* Schritt 3 */}
        <Step n={3} title="Speichern">
          <p className="text-sm text-brand-800">
            Unten auf <strong>„Speichern &amp; veröffentlichen“</strong> klicken. Das neue Foto ist nach 1 bis 2 Minuten auf der Website.
            {!dirty && <span className="text-brand-700"> Zurzeit gibt es nichts zu speichern.</span>}
          </p>
        </Step>

        <details className="rounded-2xl border border-sand-200 bg-white px-4 py-3 text-xs text-brand-700 sm:px-5">
          <summary className="cursor-pointer font-semibold text-brand-800">Technische Angaben</summary>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt>Datei</dt>
            <dd className="break-all font-mono" dir="ltr">{upload ? `${upload.name} (neu, ${(upload.bytes / MB).toFixed(1)} MB)` : image}</dd>
            <dt>Größe</dt>
            <dd>{dims.width} × {dims.height} Pixel</dd>
            <dt>Ausschnitt</dt>
            <dd>{focusY} % von oben</dd>
            <dt>Ablage</dt>
            <dd>Fotos unter <code>public/images/startseite/</code>, Einstellung in <code>data/startseite.json</code>; jede Veröffentlichung ist ein Commit.</dd>
          </dl>
        </details>
      </div>

      <SaveBar dirty={dirty} status={status} error={error} onSave={save} onDiscard={discard} summary={summary} />
    </>
  );
}
