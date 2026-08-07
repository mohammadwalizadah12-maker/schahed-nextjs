/**
 * Schlankes Rate-Limiting fuer Formular- und Login-Endpunkte.
 *
 * Zweck:
 *  - /api/auth/login: Brute-Force auf das gemeinsame Passwort verlangsamen.
 *  - /api/contact, /feedback, /membership: Massenversand ueber das
 *    Vereinspostfach (nodemailer) verhindern.
 *
 * Bewusste Grenze: Der Zaehler liegt im Prozessspeicher. Auf Vercel bedeutet
 * das "pro Serverinstanz" — kein globaler Schutz, aber eine wirksame Huerde
 * ohne zusaetzliche Infrastruktur (Redis/KV). Reicht fuer eine Vereinsseite;
 * bei echtem Angriffsdruck spaeter auf Vercel KV umstellen.
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

/** Verhindert unbegrenztes Wachstum der Map. */
function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
}

/**
 * Ermittelt die Client-IP hinter dem Vercel-Proxy.
 * Faellt auf einen festen Schluessel zurueck, damit nie "unbegrenzt" gilt.
 */
export function clientIp(req: Request): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

/**
 * Prueft und erhoeht den Zaehler.
 * @returns ok=false, wenn das Limit erreicht ist (inkl. Wartezeit in Sekunden).
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  sweep(now);

  const cur = buckets.get(key);
  if (!cur || cur.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  cur.count++;
  if (cur.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((cur.resetAt - now) / 1000)),
    };
  }
  return { ok: true, remaining: limit - cur.count, retryAfter: 0 };
}

/** Fertige 429-Antwort mit Retry-After-Header. */
export function tooManyRequests(retryAfter: number): Response {
  return new Response(
    JSON.stringify({ ok: false, error: "rate_limited", retryAfter }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
      },
    }
  );
}
