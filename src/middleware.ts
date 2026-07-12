import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import { AUTH_COOKIE, verifyToken } from "@/lib/member-auth";

/**
 * Zwei Aufgaben:
 *  1. /admin/* schuetzen (Shared-Login) — ausser /admin/login.
 *  2. Oeffentliche Seiten ohne Locale-Prefix auf /de bzw. /fa umleiten.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- 1) Admin-Bereich schuetzen ---
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return; // Login-Seite ist frei
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    const ok = await verifyToken(token, process.env.MEMBER_AUTH_SECRET || "");
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return; // eingeloggt
  }

  // --- 2) Locale-Redirect fuer oeffentliche Seiten ---
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
