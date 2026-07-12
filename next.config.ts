// Next.js Konfiguration (Schahed Hilfsorganisation)

/**
 * Sicherheits-HTTP-Header fuer alle Routen.
 * Schuetzt gegen Clickjacking, MIME-Sniffing, Referrer-Leak und erzwingt HTTPS (HSTS).
 */
const securityHeaders = [
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
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig = {
  images: {
    qualities: [75, 90, 100],
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
