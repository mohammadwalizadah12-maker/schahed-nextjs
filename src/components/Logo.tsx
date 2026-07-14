import { SITE_NAME, SITE_NAME_FA } from "@/lib/site-config";

/**
 * Schahed-Emblem als SVG mit FRISCH gerendertem Ringtext (gestochen scharf,
 * unabhaengig von der niedrig aufgeloesten Quelldatei).
 *
 * Aufbau:
 *   - schwarzer Ring (Aussenband) + orange/rote Ringlinien
 *   - der echte Emblem-Kern (vier Haende + rote Tulpe) aus /schahed-logo.png,
 *     per Kreis-Maske auf die Mitte beschraenkt (Ringtext der Quelle bleibt aussen)
 *   - oben: "AFGHANISCHES HILFSWERK SCHAHED E.V." (weiss, auf Kreisbahn)
 *   - unten: "موسسه خیریه شاهد" (weiss, auf Kreisbahn)
 */
function Emblem({ size = 46, withText = true }: { size?: number; withText?: boolean }) {
  const uid = "sch"; // stabile IDs (nur eine Instanz-Klasse noetig)
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className="shrink-0"
      role="img"
      aria-label="Afghanisches Hilfswerk Schahed e.V."
    >
      <defs>
        <clipPath id={`${uid}-core`}>
          <circle cx="100" cy="100" r={withText ? 66 : 96} />
        </clipPath>
        {/* Textbahnen (leicht innerhalb des Randes) */}
        <path id={`${uid}-top`} fill="none" d="M 100,100 m -84,0 a 84,84 0 0 1 168,0" />
        <path id={`${uid}-bot`} fill="none" d="M 100,100 m 84,0 a 84,84 0 0 1 -168,0" />
      </defs>

      {/* schwarzer Grundkreis */}
      <circle cx="100" cy="100" r="99" fill="#0e0e0e" />

      {/* echter Emblem-Kern (Haende + Tulpe) aus der Bilddatei */}
      <image
        href="/schahed-logo.png"
        x="4"
        y="4"
        width="192"
        height="192"
        clipPath={`url(#${uid}-core)`}
        preserveAspectRatio="xMidYMid slice"
      />

      {withText && (
        <>
          {/* Ringlinien */}
          <circle cx="100" cy="100" r="68" fill="none" stroke="#e0a83e" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="97" fill="none" stroke="#b23124" strokeWidth="3" />
          <circle cx="100" cy="100" r="90.5" fill="none" stroke="#e0a83e" strokeWidth="1" opacity="0.7" />

          {/* Ringtext */}
          <text fill="#ffffff" fontSize="9.2" fontWeight="700" letterSpacing="1.1"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            <textPath href={`#${uid}-top`} startOffset="50%" textAnchor="middle">
              AFGHANISCHES HILFSWERK SCHAHED E.V.
            </textPath>
          </text>
          <text fill="#ffffff" fontSize="12" fontWeight="600"
                style={{ fontFamily: "var(--font-vazir), Tahoma, sans-serif" }}>
            <textPath href={`#${uid}-bot`} startOffset="50%" textAnchor="middle">
              موسسه خیریه شاهد
            </textPath>
          </text>
        </>
      )}
    </svg>
  );
}

export default function Logo({
  variant = "dark",
  showFa = true,
  emblemSize = 46,
  showWordmark = true,
  withRingText,
}: {
  variant?: "dark" | "light";
  showFa?: boolean;
  emblemSize?: number;
  showWordmark?: boolean;
  withRingText?: boolean;
}) {
  const wordColor = variant === "light" ? "text-white" : "text-brand-800";
  const faColor = variant === "light" ? "text-white/70" : "text-brand-500";
  // Ringtext lohnt sich erst ab groesserer Darstellung.
  const ring = withRingText ?? emblemSize >= 88;

  return (
    <span className="flex items-center gap-2.5">
      <Emblem size={emblemSize} withText={ring} />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className={`text-lg font-bold tracking-tight ${wordColor}`}>
            {SITE_NAME}
          </span>
          {showFa && (
            <span className={`text-[0.7rem] font-medium ${faColor}`} dir="rtl">
              {SITE_NAME_FA}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
