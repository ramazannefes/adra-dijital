"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { EASE } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

/**
 * SCENE 02 — STATEMENT
 * "Markaların dijital dünyasını tasarlıyoruz."
 * Trigger: pin + scrub (1.6 ekran yüksekliği) · Easing: none (scrub)
 * Amaç: mesajı odak noktasına dönüştürmek; scale hareketi niyeti vurgular.
 * Reduced motion: pin yok, metin statik tam görünür.
 */
export function Scene02Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!section || !content) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=160%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        content,
        { scale: 0.86, autoAlpha: 0.25 },
        { scale: 1, autoAlpha: 1, ease: EASE.cinematic, duration: 0.5 },
      ).to(content, { scale: 1.08, autoAlpha: 0.85, duration: 0.5 });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="Manifesto"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-grid"
    >
      <div
        ref={contentRef}
        className="mx-auto max-w-5xl px-5 text-center md:px-10"
      >
        <p className="eyebrow">Scene 02 — Manifesto</p>
        <h1 className="display-l mt-6 text-balance text-foreground">
          Markaların <span className="text-accent">dijital dünyasını</span>{" "}
          tasarlıyoruz.
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-balance text-base leading-relaxed text-muted md:text-lg">
          Web, marka, dijital büyüme ve yapay zekâ; ayrı hizmetler değil, tek bir
          sistemin katmanlarıdır.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
      >
        <span className="font-display text-[0.65rem] uppercase tracking-[0.4em] text-muted">
          Scroll
        </span>
      </div>
    </section>
  );
}
