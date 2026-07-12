import { SITE_NAME, SITE_NAME_FA } from "@/lib/site-config";

/**
 * Schahed-Emblem — naturgetreuer Nachbau des offiziellen Logos:
 * roter Kreisring mit umlaufendem Vereinsnamen, zwei Haende die rote Tulpen
 * (لاله, Symbol fuer "Schahed") emporhalten, Gruendungsjahr "2012".
 *
 * Hinweis: Fuer pixelgenaue Treue kann das echte Logo als
 * /public/schahed-logo.png|svg abgelegt und hier per <img> eingebunden werden.
 */
function Emblem({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <path id="arcTop" d="M 16 50 A 34 34 0 0 1 84 50" fill="none" />
        <path id="arcBottom" d="M 22 50 A 28 28 0 0 0 78 50" fill="none" />
      </defs>

      {/* Kreis + roter Ring */}
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#b23124" strokeWidth="4" />
      <circle cx="50" cy="50" r="41.5" fill="#fff" stroke="#b23124" strokeWidth="1.4" />

      {/* Umlaufender Vereinsname (oben) */}
      <text fontSize="6.6" fontWeight="700" fill="#b23124" letterSpacing="0.4">
        <textPath href="#arcTop" startOffset="50%" textAnchor="middle">
          AFGHANISCHES HILFSWERK SCHAHED
        </textPath>
      </text>

      {/* schuetzende Haende (Tan) — cradle von links und rechts */}
      <g fill="#e3ad7e" stroke="#c88f5f" strokeWidth="0.7" strokeLinejoin="round">
        {/* linke Hand */}
        <path d="M50 76 C 40 77 30 72 27 61 C 31 63 35 63 38 61 C 37 66 42 72 50 72 Z" />
        {/* rechte Hand */}
        <path d="M50 76 C 60 77 70 72 73 61 C 69 63 65 63 62 61 C 63 66 58 72 50 72 Z" />
        {/* Handballen / Daumen */}
        <path d="M42 70 C 44 66 47 64 50 64 C 53 64 56 66 58 70 C 55 73 45 73 42 70 Z" />
      </g>

      {/* gruene Stiele */}
      <g stroke="#3f7d4f" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M50 66 L50 36" />
        <path d="M44 66 C 42 56 40 52 40 46" />
        <path d="M56 66 C 58 56 60 52 60 46" />
        {/* Blaetter */}
        <path d="M50 52 C 46 50 44 47 44 43" />
        <path d="M50 50 C 54 48 56 45 56 41" />
      </g>

      {/* rote Tulpen */}
      <g fill="#c0231d">
        {/* Mitte (hoch) */}
        <path d="M50 28 c-6 0 -9.5 6 -9.5 12 l3.2 -3.2 c1 3 3 4.2 6.3 4.2 c3.3 0 5.3 -1.2 6.3 -4.2 l3.2 3.2 c0 -6 -3.5 -12 -9.5 -12 z" />
        {/* links */}
        <path d="M40 38 c-4.6 0 -7.3 4.6 -7.3 9.2 l2.5 -2.5 c.8 2.3 2.3 3.2 4.8 3.2 c2.5 0 4 -.9 4.8 -3.2 l2.5 2.5 c0 -4.6 -2.7 -9.2 -7.3 -9.2 z" />
        {/* rechts */}
        <path d="M60 38 c-4.6 0 -7.3 4.6 -7.3 9.2 l2.5 -2.5 c.8 2.3 2.3 3.2 4.8 3.2 c2.5 0 4 -.9 4.8 -3.2 l2.5 2.5 c0 -4.6 -2.7 -9.2 -7.3 -9.2 z" />
      </g>

      {/* Gruendungsjahr */}
      <text x="50" y="93" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#b23124" letterSpacing="1">
        2012
      </text>
    </svg>
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
      <Emblem className="h-11 w-11 shrink-0" />
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
