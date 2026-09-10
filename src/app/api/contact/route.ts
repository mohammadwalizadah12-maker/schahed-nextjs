import { NextRequest, NextResponse } from "next/server";
import { sendMail, isMailConfigured, esc } from "@/lib/mailer";
import { guardForm } from "@/lib/form-guard";
import { clean, isEmail } from "@/lib/validate";

/**
 * Kontakt-Formular: validiert und versendet die Anfrage per E-Mail (SMTP).
 * Ohne SMTP-Konfiguration wird ein klarer Fehler zurueckgegeben (kein Fake-Erfolg).
 */
export async function POST(req: NextRequest) {
  const g = await guardForm(req, "contact");
  if ("response" in g) return g.response;
  const body = g.body;

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const subject = clean(body.subject, 200);
  const message = clean(body.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!isMailConfigured()) {
    // Keine personenbezogenen Daten ins Log schreiben.
    console.warn("[contact] SMTP nicht konfiguriert, Anfrage verworfen");
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
