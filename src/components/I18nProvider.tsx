"use client";

import { createContext, useContext, useCallback } from "react";
import { type Locale, type Dict, dirOf } from "@/lib/i18n";

interface I18nContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Server seedet Locale + Messages -> KEIN Client-Fetch, KEIN Flash.
 * Client-Komponenten nutzen useT()/useLocale() fuer Uebersetzungen.
 */
export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Dict;
  children: React.ReactNode;
}) {
  const t = useCallback(
    (key: string) => messages[key] ?? key,
    [messages]
  );
  const dir = dirOf(locale);

  return (
    <I18nContext.Provider value={{ locale, dir, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}

export function useLocale() {
  return useI18n().locale;
}
