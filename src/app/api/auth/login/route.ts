import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, COOKIE_MAX_AGE, createToken } from "@/lib/member-auth";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { sameOrigin } from "@/lib/admin-guard";

/**
 * Login: prueft das gemeinsame Passwort (MEMBER_PASSWORD) und setzt bei Erfolg
 * einen signierten Cookie (HMAC mit MEMBER_AUTH_SECRET).
 */
export async function POST(req: NextRequest) {
  // Brute-Force-Bremse: 8 Versuche je IP in 10 Minuten.
  const rl = rateLimit(`login:${clientIp(req)}`, 8, 10 * 60 * 1000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  // Login nur von der eigenen Seite aus (kein Login-CSRF).
  if (!sameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "bad_origin" }, { status: 403 });
  }

  const secret = process.env.MEMBER_AUTH_SECRET || "";
  const expected = process.env.MEMBER_PASSWORD || "";

  if (!secret || secret.length < 32 || !expected) {
    console.error("[auth] MEMBER_AUTH_SECRET (min. 32 Zeichen) oder MEMBER_PASSWORD fehlt");
    return NextResponse.json({ ok: false, error: "server_not_configured" }, { status: 500 });
  }

  let password = "";
  try {
    const body = await req.json();
    password = String(body?.password ?? "").slice(0, 512);
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Laengengleicher, konstanter Vergleich
  const a = new TextEncoder().encode(password);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  if (diff !== 0) {
    return NextResponse.json(
      { ok: false, error: "invalid_password", remaining: rl.remaining },
      { status: 401 }
    );
  }

  const token = await createToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
