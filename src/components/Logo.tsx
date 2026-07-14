import Image from "next/image";
import { SITE_NAME, SITE_NAME_FA } from "@/lib/site-config";

/**
 * Offizielles Schahed-Logo (transparentes PNG: /public/schahed-logo.png).
 * Rundes Emblem: vier Hände um eine rote Tulpe, im Ring der Vereinsname
 * (oben DE, unten FA). Ecken sind transparent.
 *
 * Hinweis: Der Ringtext ist erst ab ca. 96px lesbar — in der Navigation
 * (kleines Emblem) dient das Logo als Erkennungszeichen, der Name steht
 * als Wortmarke daneben.
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
  emblemSize = 46,
  showWordmark = true,
}: {
  variant?: "dark" | "light";
  showFa?: boolean;
  emblemSize?: number;
  showWordmark?: boolean;
}) {
  const wordColor = variant === "light" ? "text-white" : "text-brand-800";
  const faColor = variant === "light" ? "text-white/70" : "text-brand-500";

  return (
    <span className="flex items-center gap-2.5">
      <Emblem size={emblemSize} />
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
