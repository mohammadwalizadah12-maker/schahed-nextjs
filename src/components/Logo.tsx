import Image from "next/image";
import { SITE_NAME, SITE_NAME_FA } from "@/lib/site-config";

/**
 * Offizielles Schahed-Logo — die echte Datei /public/schahed-logo.png
 * (rundes Emblem: vier Haende um eine rote Tulpe, umlaufender Ringtext
 * "AFGHANISCHES HILFSWERK SCHAHED E.V." / "موسسه خیریه شاهد").
 *
 * Wir zeigen das Bild DIREKT (object-contain), ohne eigenen Ring/Overlay —
 * so entspricht der Rand exakt dem Original.
 */
function Emblem({ size = 46, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/schahed-logo.png"
      alt="Afghanisches Hilfswerk Schahed e.V."
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
      priority
    />
  );
}

export default function Logo({
  variant = "dark",
  showFa = true,
  emblemSize = 46,
  emblemClass = "",
  showWordmark = true,
  wordmarkClass = "flex",
}: {
  variant?: "dark" | "light";
  showFa?: boolean;
  emblemSize?: number;
  emblemClass?: string;
  showWordmark?: boolean;
  /** Sichtbarkeit des Schriftzugs steuerbar (z. B. auf sehr schmalen Geraeten aus). */
  wordmarkClass?: string;
}) {
  const wordColor = variant === "light" ? "text-white" : "text-brand-800";
  // brand-500 hatte auf Weiss nur 3,4:1 — fuer den kleinen Farsi-Namen zu wenig.
  const faColor = variant === "light" ? "text-white/85" : "text-brand-700";

  return (
    <span className="flex items-center gap-2.5">
      <Emblem size={emblemSize} className={emblemClass} />
      {showWordmark && (
        <span className={`${wordmarkClass} flex-col leading-none`}>
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
