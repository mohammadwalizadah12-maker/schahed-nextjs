import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { sameOrigin } from "@/lib/admin-guard";

/**
 * Gemeinsame Vorpruefung der drei oeffentlichen Formulare
 * (Kontakt, Feedback, Patenschaft).
 *
 *  - Rate-Limit: 5 Absendungen je IP pro Stunde und Formular.
 *  - Herkunft: nur von der eigenen Seite.
 *  - Body-Groesse: hoechstens 32 kB.
 *  - Honeypot: das unsichtbare Feld "website" fuellen nur Bots. Dann
 *    antworten wir mit "ok", ohne etwas zu versenden, damit der Bot nichts lernt.
 *
 * Gibt entweder { body } oder eine fertige Antwort zurueck.
 */
export async function guardForm(
  req: NextRequest,
  scope: string
): Promise<{ body: Record<string, unknown> } | { response: NextResponse }> {
  const rl = rateLimit(`${scope}:${clientIp(req)}`, 5, 60 * 60 * 1000);
  if (!rl.ok) return { response: tooManyRequests(rl.retryAfter) as NextResponse };

  if (!sameOrigin(req)) {
    return { response: NextResponse.json({ ok: false, error: "bad_origin" }, { status: 403 }) };
  }

  const len = Number(req.headers.get("content-length") || 0);
  if (len > 32 * 1024) {
    return { response: NextResponse.json({ ok: false, error: "too_large" }, { status: 413 }) };
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
    if (!body || typeof body !== "object") throw new Error("no object");
  } catch {
    return { response: NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 }) };
  }

  if (typeof body.website === "string" && body.website.trim() !== "") {
    console.log(`[${scope}] honeypot ausgeloest, verworfen`);
    return { response: NextResponse.json({ ok: true }) };
  }

  return { body };
}
