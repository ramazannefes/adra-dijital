"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(useGSAP);

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const INTERACTIVE_SELECTOR = "a, button, [data-cursor-hover], input, textarea";

/**
 * CustomCursor — imleç geri bildirimi.
 * Trigger: mousemove (dot 0.12s, ring 0.45s quickTo) · Easing: power3.out
 * Amaç: etkileşimli öğelerde farkındalık; native cursor yalnızca
 * JS aktifken gizlenir (no-JS kullanıcıları etkilenmez).
 * Touch cihazlar ve reduced-motion: bileşen hiçbir şey yapmaz.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) return;
      if (!window.matchMedia(FINE_POINTER).matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      document.documentElement.classList.add("has-custom-cursor");

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

      let shown = false;
      const handleMove = (event: MouseEvent): void => {
        if (!shown) {
          shown = true;
          gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
        }
        dotX(event.clientX);
        dotY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);
      };

      const handleOver = (event: MouseEvent): void => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const isInteractive = target.closest(INTERACTIVE_SELECTOR) !== null;
        gsap.to(ring, {
          scale: isInteractive ? 2.2 : 1,
          opacity: isInteractive ? 0.9 : 0.55,
          duration: 0.3,
          ease: "power3.out",
        });
      };

      const handleLeaveWindow = (): void => {
        gsap.to([dot, ring], { autoAlpha: 0, duration: 0.25 });
        shown = false;
      };

      window.addEventListener("mousemove", handleMove, { passive: true });
      document.addEventListener("mouseover", handleOver, { passive: true });
      document.documentElement.addEventListener("mouseleave", handleLeaveWindow);

      return () => {
        document.documentElement.classList.remove("has-custom-cursor");
        window.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseover", handleOver);
        document.documentElement.removeEventListener(
          "mouseleave",
          handleLeaveWindow,
        );
      };
    },
    { scope: dotRef },
  );

  if (prefersReducedMotion) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden h-1.5 w-1.5 rounded-full bg-accent mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden h-8 w-8 rounded-full border border-accent/60 opacity-55 mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block"
      />
    </>
  );
}
