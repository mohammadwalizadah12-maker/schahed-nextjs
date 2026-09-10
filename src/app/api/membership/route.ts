import { NextRequest, NextResponse } from "next/server";
import { sendMail, isMailConfigured, esc } from "@/lib/mailer";
import { guardForm } from "@/lib/form-guard";
import { clean, isEmail } from "@/lib/validate";

/**
 * Mitglieds-/Patenschaftsantrag: validiert und versendet per E-Mail (SMTP).
 * Ohne SMTP-Konfiguration wird ein klarer Fehler zurueckgegeben.
 */
export async function POST(req: NextRequest) {
  const g = await guardForm(req, "membership");
  if ("response" in g) return g.response;
  const body = g.body;

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 40);
  const type = clean(body.type, 20);
  const message = clean(body.message, 5000);
  const privacy = body.privacy === "on" || body.privacy === true || body.privacy === "true";

  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (!privacy) {
    return NextResponse.json({ ok: false, error: "privacy_required" }, { status: 400 });
  }

  const typeLabel =
    type === "active" ? "Patenschaft (Hâmi)" : type === "support" ? "Einmalige/regelmäßige Spende" : "Mitgliedschaft";

  if (!isMailConfigured()) {
    console.warn("[membership] SMTP nicht konfiguriert, Anfrage verworfen");
    return NextResponse.json({ ok: false, error: "mail_not_configured" }, { status: 503 });
  }

  try {
    await sendMail({
      subject: `Neue Anfrage: ${typeLabel}`,
      replyTo: email,
      text: `Name: ${name}\nE-Mail: ${email}\nTelefon: ${phone}\nInteresse: ${typeLabel}\nDatenschutz bestätigt: ja\n\n${message}`,
      html: `
        <h2>Neue Mitglieds-/Patenschaftsanfrage</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>E-Mail:</strong> ${esc(email)}</p>
        <p><strong>Telefon:</strong> ${esc(phone) || "—"}</p>
        <p><strong>Interesse:</strong> ${esc(typeLabel)}</p>
        <p><strong>Datenschutzerklärung bestätigt:</strong> ja</p>
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
