"use client";

import { useState } from "react";
import Logo from "@/components/Logo";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const params = new URLSearchParams(window.location.search);
        window.location.href = params.get("next") || "/admin";
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-2xl border border-sand-200 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Logo showFa={false} />
        </div>
        <h1 className="mt-6 text-center text-xl font-bold text-brand-900">Redaktion · Anmeldung</h1>
        <p className="mt-1 text-center text-sm text-brand-600">Beiträge verwalten</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            className="w-full rounded-xl border border-sand-200 bg-sand-50 px-4 py-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-accent-500 px-6 py-3 font-semibold text-white transition hover:bg-accent-400 disabled:opacity-60"
          >
            {status === "sending" ? "Anmelden ..." : "Anmelden"}
          </button>
          {status === "error" && (
            <p className="text-center text-sm text-accent-600">Passwort falsch.</p>
          )}
        </form>
      </div>
    </div>
  );
}
