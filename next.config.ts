// Next.js Konfiguration (Schahed Hilfsorganisation)

/**
 * Content-Security-Policy.
 *
 * Skripte: nur eigene plus Inline (Next.js braucht Inline-Skripte fuer die
 * Hydration und wir liefern JSON-LD inline). Eine Nonce-Loesung wuerde alle
 * Seiten dynamisch machen; fuer eine statische Vereinsseite ist das der
 * schlechtere Tausch. Fremde Skript-Hosts sind damit trotzdem gesperrt.
 * Bilder: eigene, data: (Platzhalter) und beliebige https-Quellen, weil die
 * Seite "Nuetzliche Links" Vorschaubilder der Zielseiten zeigt.
 * Schriften: self-hosted ueber next/font, daher nur 'self'.
 * Keine Frames, keine Plugins, Formulare nur an uns selbst.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Sicherheits-HTTP-Header fuer alle Routen.
 * Schuetzt gegen Clickjacking, MIME-Sniffing, Referrer-Leak, Fremd-Skripte
 * und erzwingt HTTPS (HSTS).
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig = {
  // Kein "X-Powered-By: Next.js" im Response-Header.
  poweredByHeader: false,
  images: {
    // AVIF/WebP explizit aktivieren: deutlich kleinere Bilder als PNG/JPEG.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 100],
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Der Verwaltungsbereich soll nie gecacht oder indexiert werden.
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
