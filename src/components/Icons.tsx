/** Schlanke, einheitliche Stroke-Icons (currentColor). */
type P = { className?: string };
const base = "h-6 w-6";

export function IconHeart({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-4.5-9.5-9C.8 8.6 2.4 5 6 5c2 0 3.2 1.2 4 2.4C10.8 6.2 12 5 14 5c3.6 0 5.2 3.6 3.5 7-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}
export function IconBook({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4z" />
      <path d="M20 4h-7a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20z" />
    </svg>
  );
}
export function IconFood({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 0 18 0z" />
      <path d="M3 12h18" />
      <path d="M12 12V3M9 3v4M15 3v4" />
    </svg>
  );
}
export function IconDrop({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" />
    </svg>
  );
}
export function IconSnow({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" />
    </svg>
  );
}
export function IconCross({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
    </svg>
  );
}
export function IconShield({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
export function IconHandHeart({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14l4-1 5 2 4-1c1.5 0 2 2 0 2.5L12 20l-9-2z" />
      <path d="M13 8.5c-.6-1.2-3-1.3-3 .6 0 1.3 1.6 2.2 3 3.4 1.4-1.2 3-2.1 3-3.4 0-1.9-2.4-1.8-3-.6z" />
    </svg>
  );
}
export function IconAccessibility({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="1.6" />
      <path d="M6 8h12M12 8v6M12 14l-3 6M12 14l3 6" />
    </svg>
  );
}
export function IconUsers({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5M21 20c0-2.6-1.5-4.2-4-4.7" />
    </svg>
  );
}
export function IconArrow({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`rtl-flip ${className}`} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export const PROJECT_ICONS: Record<string, (p: P) => React.JSX.Element> = {
  heart: IconHeart,
  book: IconBook,
  food: IconFood,
  drop: IconDrop,
  snow: IconSnow,
  cross: IconCross,
  hand: IconAccessibility,
};
