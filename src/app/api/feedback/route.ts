import { NextRequest, NextResponse } from "next/server";
import { sendMail, isMailConfigured, esc } from "@/lib/mailer";
import { guardForm } from "@/lib/form-guard";
import { clean, isEmail } from "@/lib/validate";

/**
 * Feedback-Formular: validiert und versendet das Feedback per E-Mail (SMTP).
 * Name/E-Mail sind optional; nur die Nachricht ist Pflicht.
 * Ohne SMTP-Konfiguration -> klarer Fehler (kein Fake-Erfolg).
 */
export async function POST(req: NextRequest) {
  const g = await guardForm(req, "feedback");
  if ("response" in g) return g.response;
  const body = g.body;

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const topic = clean(body.topic, 40);
  const message = clean(body.message, 5000);
  const ratingNum = Math.min(5, Math.max(0, Math.round(Number(body.rating) || 0)));
  const rating = ratingNum > 0 ? String(ratingNum) : "";

  if (!message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (email && !isEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!isMailConfigured()) {
    console.warn("[feedback] SMTP nicht konfiguriert, Anfrage verworfen");
    return NextResponse.json({ ok: false, error: "mail_not_configured" }, { status: 503 });
  }

  const stars = ratingNum > 0 ? "★".repeat(ratingNum) + "☆".repeat(5 - ratingNum) : "—";

  try {
    await sendMail({
      subject: `Feedback (${topic || "allgemein"})`,
      replyTo: email || undefined,
      text: `Name: ${name || "—"}\nE-Mail: ${email || "—"}\nThema: ${topic}\nBewertung: ${rating || "—"}/5\n\n${message}`,
      html: `
        <h2>Neues Feedback</h2>
        <p><strong>Name:</strong> ${esc(name) || "—"}</p>
        <p><strong>E-Mail:</strong> ${esc(email) || "—"}</p>
        <p><strong>Thema:</strong> ${esc(topic)}</p>
        <p><strong>Bewertung:</strong> ${stars} (${rating || "—"}/5)</p>
        <p><strong>Feedback:</strong></p>
        <p>${esc(message).replace(/\n/g, "<br>")}</p>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[feedback] send failed", e);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
