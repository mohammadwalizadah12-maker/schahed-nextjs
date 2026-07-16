"use client";

import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";

const field =
  "w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-brand-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export default function FeedbackForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rating }),
      });
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) {
        e.currentTarget.reset();
        setRating(0);
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center text-brand-800">
        ✓ {t("feedback.form.success")}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder={t("feedback.form.name")} className={field} />
        <input name="email" type="email" placeholder={t("feedback.form.email")} className={field} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-700">{t("feedback.form.topic")}</label>
        <select name="topic" className={field} defaultValue="website">
          <option value="website">{t("feedback.topic.website")}</option>
          <option value="projects">{t("feedback.topic.projects")}</option>
          <option value="donation">{t("feedback.topic.donation")}</option>
          <option value="general">{t("feedback.topic.general")}</option>
        </select>
      </div>

      {/* Sternebewertung */}
      <div>
        <label className="mb-1 block text-sm font-medium text-brand-700">{t("feedback.form.rating")}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${n}`}
              className="text-3xl leading-none transition"
            >
              <span className={(hover || rating) >= n ? "text-accent-400" : "text-sand-300"}>★</span>
            </button>
          ))}
        </div>
      </div>

      <textarea name="message" required rows={5} placeholder={t("feedback.form.message")} className={field} />

      <button
        type="submit"
        disabled={status === "sending"}
        className="justify-self-start rounded-full bg-brand-600 px-7 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {status === "sending" ? t("common.loading") : t("feedback.form.submit")}
      </button>

      {status === "error" && (
        <p className="text-sm text-accent-600">⚠︎ — bitte erneut versuchen.</p>
      )}
    </form>
  );
}
