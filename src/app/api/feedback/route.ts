import { NextRequest, NextResponse } from "next/server";
import { sendMail, isMailConfigured, esc } from "@/lib/mailer";

/**
 * Feedback-Formular: validiert und versendet das Feedback per E-Mail (SMTP).
 * Name/E-Mail sind optional; nur die Nachricht ist Pflicht.
 * Ohne SMTP-Konfiguration -> klarer Fehler (kein Fake-Erfolg).
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
  const topic = (body.topic || "").trim();
  const rating = (body.rating ?? "").toString().trim();
  const message = (body.message || "").trim();

  if (!message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (email && !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!isMailConfigured()) {
    console.log("[feedback] (SMTP nicht konfiguriert)", { name, email, topic, rating, message });
    return NextResponse.json({ ok: false, error: "mail_not_configured" }, { status: 503 });
  }

  const stars = rating && Number(rating) > 0 ? "★".repeat(Number(rating)) + "☆".repeat(5 - Number(rating)) : "—";

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
        <p><strong>Bewertung:</strong> ${stars} (${esc(rating) || "—"}/5)</p>
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
