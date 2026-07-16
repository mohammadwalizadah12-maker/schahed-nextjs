"use client";

import { useState } from "react";

export default function CopyField({
  label,
  value,
  copyLabel,
  copiedLabel,
}: {
  label: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex items-start justify-between gap-3 border-b border-sand-200 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium uppercase tracking-wide text-brand-500">{label}</div>
        {/* break-all: lange Werte (IBAN) umbrechen statt Ueberbreite zu erzeugen */}
        <div className="break-all font-mono text-sm text-brand-900" dir="ltr">{value}</div>
      </div>
      <button
        type="button"
        onClick={copy}
        className="mt-4 shrink-0 rounded-full bg-sand-100 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-sand-200"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
