import Image from "next/image";
import { SITE_NAME, SITE_NAME_FA } from "@/lib/site-config";

/**
 * Offizielles Schahed-Logo (echte Datei: /public/schahed-logo.jpeg).
 *
 * Die Datei hat einen schwarzen quadratischen Hintergrund; das eigentliche
 * Emblem ist rund. Wir zeigen es daher als Kreis-Ausschnitt (rounded-full +
 * leichter scale), sodass die schwarzen Ecken sauber weggeschnitten werden.
 */
function Emblem({ size = 44 }: { size?: number }) {
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-black/5"
      style={{ width: size, height: size }}
    >
      <Image
        src="/schahed-logo.jpeg"
        alt="Afghanisches Hilfswerk Schahed e.V."
        fill
        sizes="44px"
        className="scale-[1.18] object-cover"
        priority
      />
    </span>
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
      <Emblem size={44} />
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
