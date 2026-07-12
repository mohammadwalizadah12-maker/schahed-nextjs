"use client";

import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";

const field =
  "w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-brand-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export default function ContactForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center text-brand-800">
        ✓ {t("contact.form.success")}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder={t("contact.form.name")} className={field} />
        <input name="email" type="email" required placeholder={t("contact.form.email")} className={field} />
      </div>
      <input name="subject" placeholder={t("contact.form.subject")} className={field} />
      <textarea name="message" required rows={5} placeholder={t("contact.form.message")} className={field} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="justify-self-start rounded-full bg-brand-600 px-7 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {status === "sending" ? t("common.loading") : t("contact.form.submit")}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">⚠︎ {t("common.loading").replace("...", "")} — bitte erneut versuchen.</p>
      )}
    </form>
  );
}
