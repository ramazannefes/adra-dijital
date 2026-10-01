"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { EASE } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

const SERVICE_NODES = [
  { id: "web", label: "Web", direction: [-1, -1] as const },
  { id: "brand", label: "Brand", direction: [1, -1] as const },
  { id: "digital", label: "Digital", direction: [-1, 1] as const },
  { id: "ai", label: "AI", direction: [1, 1] as const },
] as const;

/**
 * SCENE 08 — THE SYSTEM
 * Trigger: pin + scrub (2 ekran) · Easing: none (scrub) + power3.inOut
 * Amaç: servislerin ayrı sütunlar değil, tek sistemin bileşenleri olduğunu
 * hissettirmek — node'lar scroll ile merkeze birleşir, çekirdek aktive olur.
 * Teknik: transform-only (left/top animasyonu yok), function-based değerler
 * sayesinde resize'da yeniden hesaplanır. Reduced motion: statik bileşim.
 */
export function Scene08System() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const offsetX = (): number => stage.offsetWidth * 0.32;
      const offsetY = (): number => stage.offsetHeight * 0.3;

      // Başlangıç: node'lar köşelerde (reduced motion dahil — statik bileşim)
      SERVICE_NODES.forEach((node) => {
        gsap.set(`[data-system-node='${node.id}']`, {
          x: () => node.direction[0] * offsetX(),
          y: () => node.direction[1] * offsetY(),
        });
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set("[data-system-core]", { autoAlpha: 1 });
        gsap.set("[data-system-message]", { autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Birleşme
      tl.to("[data-system-node]", {
        x: 0,
        y: 0,
        duration: 2,
        stagger: 0.12,
      })
        .to("[data-system-node] [data-node-chip]", {
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.05,
        }, "-=0.6")
        .fromTo(
          "[data-system-core]",
          { scale: 0.6, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1, ease: EASE.cinematic },
          "-=0.4",
        )
        .fromTo(
          "[data-system-message]",
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE.cinematic },
          "-=0.5",
        );

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
      aria-label="The System"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-grid"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-24 text-center md:px-10">
        <p className="eyebrow">Scene 08 — The System</p>
        <h2 className="display-l mx-auto mt-6 max-w-3xl text-balance text-foreground">
          Dört disiplin, <span className="text-accent">tek sistem.</span>
        </h2>

        <div
          ref={stageRef}
          className="relative mx-auto mt-14 h-[380px] w-full max-w-2xl md:h-[440px]"
        >
          {SERVICE_NODES.map((node) => (
            <div
              key={node.id}
              data-system-node={node.id}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
            >
              <span
                data-node-chip
                className="inline-block rounded-full border border-border bg-surface px-6 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-foreground"
              >
                {node.label}
              </span>
            </div>
          ))}

          {/* Çekirdek */}
          <div
            data-system-core
            className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/50 bg-accent/10 opacity-0 shadow-[0_0_120px_-30px_rgba(200,240,74,0.4)] md:h-48 md:w-48"
          >
            <span className="font-display text-5xl font-bold tracking-tighter text-accent">
              a<span className="text-foreground">.</span>
            </span>
          </div>
        </div>

        <p
          data-system-message
          className="mx-auto max-w-xl text-balance text-base leading-relaxed text-muted opacity-0"
        >
          Web siteniz markanızı taşır; markanız pazarlamayı besler,
          pazarlama veri üretir, veri otomasyonu büyütür. Hepsi birlikte
          çalışır — çünkü birlikte tasarlanmıştır.
        </p>
      </div>
    </section>
  );
}
