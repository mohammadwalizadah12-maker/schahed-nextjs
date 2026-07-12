import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * Leitet Anfragen ohne Locale-Prefix (/, /projekte, ...) auf die passende
 * Sprache um. FA/Dari/Paschto-Browser -> /fa, sonst -> /de (Default).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  const accept = (req.headers.get("accept-language") || "").toLowerCase();
  const prefersFa =
    accept.includes("fa") || accept.includes("prs") || accept.includes("ps");
  const locale = prefersFa ? "fa" : DEFAULT_LOCALE;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Alles ausser _next, api und Dateien mit Endung (Assets).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
