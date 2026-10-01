"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { EASE } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

const BRAND_LAYERS = [
  { id: "logo", label: "Logo & Logotype", detail: "Form · denge · tanınırlık" },
  { id: "type", label: "Typography", detail: "Ses tonunun görsel karşılığı" },
  { id: "color", label: "Color System", detail: "Anlam taşıyan palet" },
  { id: "social", label: "Social Design", detail: "Tüm yüzeylerde tutarlılık" },
] as const;

/**
 * SCENE 05 — BRAND IDENTITY
 * Trigger: her katman ScrollTrigger enter (%85) + hover dokunuşları
 * Duration: 0.8s · Easing: expo.out · Amaç: markanın "katman katman
 * kurulduğunu" göstermek — düz kart dizisi değil, yığılan bir sistem.
 * Reduced motion: tüm katmanlar statik görünür.
 */
export function Scene05Brand() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const layers = gsap.utils.toArray<HTMLElement>("[data-brand-layer]");

      const triggers = layers.map((layer, index) =>
        gsap.fromTo(
          layer,
          { autoAlpha: 0, y: 56, rotateX: 8 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            delay: index * 0.08,
            ease: EASE.cinematic,
            scrollTrigger: { trigger: layer, start: "top 85%" },
          },
        ),
      );

      // Monogram kartı: hafif paralaks
      const monogram = section.querySelector<HTMLElement>("[data-monogram]");
      const parallax = monogram
        ? gsap.to(monogram, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          })
        : null;

      return () => {
        triggers.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        parallax?.scrollTrigger?.kill();
        parallax?.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      aria-label="Brand Identity"
      className="relative overflow-hidden bg-background py-28 md:py-40"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-5 md:px-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Scene 05 — Brand Identity</p>
          <h2 className="display-l mt-6 text-foreground">
            Marka, <span className="text-accent">sistematik</span> kurulur.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Logo tek başına marka değildir. Tipografi, renk, ritim ve tüm
            dijital yüzeylerde tutarlılık; tanınabilirliği inşa eder.
          </p>

          <ul className="mt-12 space-y-0">
            {BRAND_LAYERS.map((layer, index) => (
              <li
                key={layer.id}
                data-brand-layer
                className="group flex items-baseline gap-6 border-b border-border py-6 first:border-t"
              >
                <span className="font-display text-xs text-muted">
                  0{index + 1}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="font-display text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-accent">
                    {layer.label}
                  </span>
                  <span className="text-sm text-muted">{layer.detail}</span>
                </div>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Monogram vitrin — katmanların çarpraşması */}
        <div className="relative mx-auto aspect-square w-full max-w-[420px]">
          <div
            aria-hidden="true"
            className="absolute inset-6 rounded-2xl border border-border bg-surface/40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-12 rounded-2xl border border-border bg-surface/70"
          />
          <div
            data-monogram
            className="absolute inset-0 flex items-center justify-center will-change-transform"
          >
            <div className="flex h-44 w-44 items-center justify-center rounded-3xl border border-accent/40 bg-accent/10 shadow-[0_0_80px_-20px_rgba(200,240,74,0.35)] md:h-52 md:w-52">
              <span className="font-display text-7xl font-bold tracking-tighter text-accent md:text-8xl">
                a<span className="text-foreground">.</span>
              </span>
            </div>
          </div>
          <span
            aria-hidden="true"
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[0.6rem] uppercase tracking-[0.3em] text-muted"
          >
            Identity System
          </span>
        </div>
      </div>
    </section>
  );
}
