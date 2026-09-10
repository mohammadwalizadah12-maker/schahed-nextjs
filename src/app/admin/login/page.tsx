"use client";

import { useState } from "react";
import Logo from "@/components/Logo";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next") || "/admin";
        // Nur eigene Pfade als Ziel zulassen (kein Open Redirect).
        window.location.href = next.startsWith("/admin") ? next : "/admin";
        return;
      }
      if (res.status === 429) {
        const s = Number(json?.retryAfter || 60);
        setMessage(`Zu viele Versuche. Bitte ${s >= 60 ? `${Math.ceil(s / 60)} Minuten` : `${s} Sekunden`} warten.`);
      } else if (res.status === 500) {
        setMessage("Der Server ist nicht konfiguriert (MEMBER_PASSWORD / MEMBER_AUTH_SECRET fehlen).");
      } else if (json?.error === "bad_origin") {
        setMessage("Anfrage abgelehnt. Bitte die Seite neu laden.");
      } else {
        const left = typeof json?.remaining === "number" ? json.remaining : null;
        setMessage(left !== null && left <= 3 ? `Passwort falsch. Noch ${left} ${left === 1 ? "Versuch" : "Versuche"}.` : "Passwort falsch.");
      }
      setStatus("error");
    } catch {
      setMessage("Keine Verbindung. Bitte erneut versuchen.");
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--color-sand-100),_var(--color-sand-50)_60%)] px-5">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-sand-200 bg-white p-8 shadow-[0_20px_60px_-30px_rgba(95,44,20,0.35)]">
          <div className="flex justify-center">
            <Logo showFa={false} emblemSize={56} showWordmark={false} />
          </div>
          <h1 className="mt-5 text-center text-xl font-bold text-brand-900">Redaktion</h1>
          <p className="mt-1 text-center text-sm text-brand-700">Beiträge, Links und Texte der Website pflegen</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <label htmlFor="pw" className="block text-xs font-semibold text-brand-800">Passwort</label>
            <div className="relative">
              <input
                id="pw"
                type={show ? "text" : "password"}
                autoFocus
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (status === "error") setStatus("idle"); }}
                className="w-full rounded-xl border border-sand-300 bg-sand-50 px-4 py-3 pe-20 text-brand-900 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                aria-invalid={status === "error"}
                aria-describedby={message ? "pw-msg" : undefined}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute inset-y-0 end-2 my-auto h-8 rounded-lg px-2 text-xs font-medium text-brand-700 hover:bg-sand-100"
                aria-pressed={show}
              >
                {show ? "Verbergen" : "Anzeigen"}
              </button>
            </div>
            <button
              type="submit"
              disabled={status === "sending" || !password}
              className="w-full rounded-xl bg-accent-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-accent-400 disabled:opacity-60"
            >
              {status === "sending" ? "Anmelden ..." : "Anmelden"}
            </button>
            {message && (
              <p id="pw-msg" role="alert" className="rounded-lg bg-accent-50 px-3 py-2 text-center text-sm text-accent-700">
                {message}
              </p>
            )}
          </form>
        </div>
        <p className="mt-5 text-center text-xs text-brand-700">
          <a href="/de" className="hover:underline">← Zur Website</a>
        </p>
      </div>
    </div>
  );
}
