import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, COOKIE_MAX_AGE, createToken } from "@/lib/member-auth";

/**
 * Login: prueft das gemeinsame Passwort (MEMBER_PASSWORD) und setzt bei Erfolg
 * einen signierten Cookie (HMAC mit MEMBER_AUTH_SECRET).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.MEMBER_AUTH_SECRET || "";
  const expected = process.env.MEMBER_PASSWORD || "";

  if (!secret || !expected) {
    return NextResponse.json(
      { ok: false, error: "server_not_configured" },
      { status: 500 }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = String(body?.password ?? "");
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
    return NextResponse.json({ ok: false, error: "invalid_password" }, { status: 401 });
  }

  const token = await createToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
