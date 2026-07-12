"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Globaler Scroll-Reveal-Observer.
 *
 * Beobachtet alle Elemente mit [data-reveal] oder [data-reveal-stagger] und
 * setzt beim Eintritt ins Sichtfeld die Klasse .is-visible (einmalig).
 * Das CSS in globals.css uebernimmt die eigentliche Animation.
 *
 * Vorteile: keine Animations-Logik in den (server-gerenderten) Sektionen,
 * respektiert prefers-reduced-motion (dort setzt CSS alles sofort sichtbar).
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-stagger]")
    );
    if (nodes.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((n) => {
      // Bereits im Viewport (oben) -> sofort zeigen, sonst beobachten
      const rect = n.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        n.classList.add("is-visible");
      } else {
        io.observe(n);
      }
    });

    return () => io.disconnect();
    // Bei Sprach-/Seitenwechsel neu einhaengen
  }, [pathname]);

  return null;
}
