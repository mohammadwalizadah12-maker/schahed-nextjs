import { NextRequest, NextResponse } from "next/server";
import { sendMail, isMailConfigured, esc } from "@/lib/mailer";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

/**
 * Kontakt-Formular: validiert und versendet die Anfrage per E-Mail (SMTP).
 * Ohne SMTP-Konfiguration wird ein klarer Fehler zurueckgegeben (kein Fake-Erfolg).
 */
export async function POST(req: NextRequest) {
  // Spam-Bremse fuer den Mailversand: 5 Absendungen je IP pro Stunde.
  const rl = rateLimit(`contact:${clientIp(req)}`, 5, 60 * 60 * 1000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!isMailConfigured()) {
    console.log("[contact] (SMTP nicht konfiguriert)", { name, email, subject, message });
    return NextResponse.json({ ok: false, error: "mail_not_configured" }, { status: 503 });
  }

  try {
    await sendMail({
      subject: `Kontaktanfrage: ${subject || "(ohne Betreff)"}`,
      replyTo: email,
      text: `Name: ${name}\nE-Mail: ${email}\nBetreff: ${subject}\n\n${message}`,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>E-Mail:</strong> ${esc(email)}</p>
        <p><strong>Betreff:</strong> ${esc(subject)}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${esc(message).replace(/\n/g, "<br>")}</p>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] send failed", e);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
