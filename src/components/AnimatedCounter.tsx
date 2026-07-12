"use client";

import { useEffect, useRef, useState } from "react";

/** Zaehlt beim Scrollen ins Sichtfeld von 0 auf `value` hoch. */
export default function AnimatedCounter({
  value,
  suffix = "",
  label,
  locale,
}: {
  value: number;
  suffix?: string;
  label: string;
  locale: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-extrabold text-accent-300 sm:text-5xl">
        {display.toLocaleString(locale === "fa" ? "fa-AF" : "de-DE")}
        {suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-sand-100/80">{label}</div>
    </div>
  );
}
