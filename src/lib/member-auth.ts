/**
 * Shared-Login-Authentifizierung fuer das CMS (/admin).
 *
 * Modell wie bei alghadir/belal: EIN gemeinsames Passwort (MEMBER_PASSWORD),
 * signierter Cookie (HMAC mit MEMBER_AUTH_SECRET). Kein User-System.
 *
 * Web-Crypto-Implementierung -> funktioniert in Middleware (Edge) UND
 * Route-Handlern (Node).
 */

export const AUTH_COOKIE = "schahed_admin";
const MAX_AGE_SEC = 60 * 60 * 12; // 12 Stunden

function b64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlToBytes(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(secret: string, msg: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return new Uint8Array(sig);
}

/** Erzeugt einen signierten Session-Token (payload.signature). */
export async function createToken(secret: string): Promise<string> {
  const payload = b64url(
    new TextEncoder().encode(JSON.stringify({ exp: Date.now() + MAX_AGE_SEC * 1000 }))
  );
  const sig = b64url(await hmac(secret, payload));
  return `${payload}.${sig}`;
}

/** Prueft Signatur + Ablaufzeit. */
export async function verifyToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token || !secret) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = b64url(await hmac(secret, payload));
  // Laengengleicher Vergleich
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return false;

  try {
    const data = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload)));
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export const COOKIE_MAX_AGE = MAX_AGE_SEC;
