import { NextRequest, NextResponse } from "next/server";
import { sendMail, isMailConfigured, esc } from "@/lib/mailer";

/**
 * Mitglieds-/Patenschaftsantrag: validiert und versendet per E-Mail (SMTP).
 * Ohne SMTP-Konfiguration wird ein klarer Fehler zurueckgegeben.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const type = (body.type || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const typeLabel =
    type === "active" ? "Patenschaft (Hâmi)" : type === "support" ? "Einmalige/regelmäßige Spende" : type;

  if (!isMailConfigured()) {
    console.log("[membership] (SMTP nicht konfiguriert)", { name, email, phone, type });
    return NextResponse.json({ ok: false, error: "mail_not_configured" }, { status: 503 });
  }

  try {
    await sendMail({
      subject: `Neue Anfrage: ${typeLabel || "Mitgliedschaft"}`,
      replyTo: email,
      text: `Name: ${name}\nE-Mail: ${email}\nTelefon: ${phone}\nInteresse: ${typeLabel}\n\n${message}`,
      html: `
        <h2>Neue Mitglieds-/Patenschaftsanfrage</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>E-Mail:</strong> ${esc(email)}</p>
        <p><strong>Telefon:</strong> ${esc(phone) || "—"}</p>
        <p><strong>Interesse:</strong> ${esc(typeLabel)}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${(esc(message) || "—").replace(/\n/g, "<br>")}</p>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[membership] send failed", e);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
