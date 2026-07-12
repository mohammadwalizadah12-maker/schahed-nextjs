import { SITE_NAME, SITE_NAME_FA } from "@/lib/site-config";

/**
 * Schahed-Wortmarke mit Emblem im Stil des offiziellen Logos:
 * rundes rotes Emblem, schuetzende Haende, Herz/Buch, Gruendungsjahr 2012.
 *
 * Hinweis: Sobald das echte Logo unter /public/schahed-logo.png liegt,
 * kann diese SVG-Marke durch <img src="/schahed-logo.png"> ersetzt werden.
 */
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
      <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" aria-hidden="true">
        {/* roter Ring */}
        <circle cx="24" cy="24" r="22.5" fill="#fff" stroke="var(--color-accent-500)" strokeWidth="3" />
        {/* schuetzende Haende */}
        <path
          d="M9 30c1-3 3-4.5 5.5-4.5 1.3 0 2.3.5 3.5 1.4 1.6-1.4 3.2-2.2 6-2.2s4.4.8 6 2.2c1.2-.9 2.2-1.4 3.5-1.4 2.5 0 4.5 1.5 5.5 4.5-3 2-7 3-15 3s-12-1-15-3z"
          fill="var(--color-brand-400)"
        />
        {/* Herz */}
        <path
          d="M24 15.5c-.9-1.7-2.5-2.6-4.1-2.6-2.2 0-3.9 1.7-3.9 4 0 2.6 2.2 4.4 5.1 6.7l2.9 2.3 2.9-2.3c2.9-2.3 5.1-4.1 5.1-6.7 0-2.3-1.7-4-3.9-4-1.6 0-3.2.9-4.1 2.6z"
          fill="var(--color-accent-500)"
        />
        {/* Gruendungsjahr */}
        <text x="24" y="43" textAnchor="middle" fontSize="6" fontWeight="700" fill="var(--color-accent-500)">2012</text>
      </svg>
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
