/**
 * E-Mail-Versand via SMTP (nodemailer).
 *
 * Benoetigte Env-Variablen (in Vercel setzen):
 *   SMTP_HOST     z. B. smtp.your-provider.de
 *   SMTP_PORT     465 (SSL) oder 587 (STARTTLS)
 *   SMTP_USER     Postfach-Benutzer
 *   SMTP_PASS     Passwort
 *   CONTACT_TO    Empfaenger (z. B. info@schahed.com) — Standard: SMTP_USER
 *   SMTP_FROM     Absender (optional) — Standard: SMTP_USER
 *
 * Ist nichts konfiguriert, meldet isMailConfigured() false, und die Routen
 * geben einen klaren Fehler zurueck (kein vorgetaeuschter Erfolg).
 */
import nodemailer from "nodemailer";

export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

function getTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL, sonst STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export interface MailInput {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

/** Sendet eine E-Mail an CONTACT_TO. Wirft bei Fehler. */
export async function sendMail({ subject, text, html, replyTo }: MailInput): Promise<void> {
  if (!isMailConfigured()) {
    throw new Error("SMTP not configured");
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const to = process.env.CONTACT_TO || process.env.SMTP_USER!;

  await getTransport().sendMail({
    from: `"Schahed Website" <${from}>`,
    to,
    subject,
    text,
    html,
    replyTo,
  });
}

/** Kleiner HTML-Escaper fuer Formular-Eingaben. */
export function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
