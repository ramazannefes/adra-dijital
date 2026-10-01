"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(useGSAP);

/**
 * ScrollProgress — sayfa konumu göstergesi.
 * Trigger: tüm sayfa scrub (0.3 yumuşatma) · Easing: none
 * Amaç: deneyimin "timeline" olduğunu göstermek.
 * Reduced motion: gizlenir.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const bar = barRef.current;
      if (!bar) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        },
      );
    },
    { scope: barRef },
  );

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[85] h-0.5 bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-accent will-change-transform"
      />
    </div>
  );
}
