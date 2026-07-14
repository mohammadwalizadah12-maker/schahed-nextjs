import Image from "next/image";
import { SITE_NAME, SITE_NAME_FA } from "@/lib/site-config";

/**
 * Offizielles Schahed-Logo (transparentes PNG: /public/schahed-logo.png).
 *
 * Das Emblem ist rund und traegt im schwarzen Ring den Vereinsnamen
 * (oben DE, unten FA). Wir zeigen das VOLLSTAENDIGE Logo (object-contain,
 * kein Zoom-Crop), damit der Ringtext erhalten bleibt. Die vier Bild-Ecken
 * sind im PNG bereits transparent.
 */
function Emblem({ size = 46 }: { size?: number }) {
  return (
    <Image
      src="/schahed-logo.png"
      alt="Afghanisches Hilfswerk Schahed e.V."
      width={size}
      height={size}
      className="shrink-0 object-contain"
      priority
    />
  );
}

export default function Logo({
  variant = "dark",
  showFa = true,
}: {
  variant?: "dark" | "light";
  showFa?: boolean;
}) {
  const wordColor = variant === "light" ? "text-white" : "text-brand-800";
  const faColor = variant === "light" ? "text-white/70" : "text-brand-500";

  return (
    <span className="flex items-center gap-2.5">
      <Emblem size={46} />
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
    </span>
  );
}
