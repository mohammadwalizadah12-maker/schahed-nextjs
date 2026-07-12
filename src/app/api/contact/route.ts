import { NextRequest, NextResponse } from "next/server";

/**
 * Kontakt-Formular-Endpunkt.
 *
 * TODO(Mohammad): E-Mail-Versand ergaenzen (analog perlweiss):
 *   Vercel-ENV: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO
 *   Dann hier per nodemailer versenden. Aktuell wird die Anfrage nur validiert
 *   und quittiert (kein Versand) — kein stiller Fehlschlag vortaeuschen.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    // Einfache Honeypot-/Format-Pruefung
    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    // >>> TODO: E-Mail versenden (SMTP). Solange nicht konfiguriert: loggen. <<<
    console.log("[contact]", { name, email, subject: body.subject, message });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
