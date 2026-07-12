import { NextRequest, NextResponse } from "next/server";

/**
 * Mitgliedsantrag-Endpunkt.
 *
 * TODO(Mohammad): E-Mail-Versand / Speicherung ergaenzen (SMTP-ENV wie /api/contact).
 * Aktuell wird der Antrag nur validiert und quittiert (kein Versand).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, privacy } = body ?? {};

    if (!name || !email || !privacy) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }
    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    // >>> TODO: E-Mail versenden / DB speichern. Solange nicht konfiguriert: loggen. <<<
    console.log("[membership]", { name, email, type: body.type, phone: body.phone });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
