"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { EASE } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

type ExperimentStatus = "concept" | "coming";

const EXPERIMENTS: ReadonlyArray<{
  id: string;
  index: string;
  title: string;
  scope: readonly string[];
  status: ExperimentStatus;
  statusLabel: string;
}> = [
  {
    id: "saas-concept",
    index: "01",
    title: "SaaS Landing Concept",
    scope: ["Web Experience", "Conversion"],
    status: "concept",
    statusLabel: "Kavram",
  },
  {
    id: "ecommerce-identity",
    index: "02",
    title: "E-ticaret Kimlik Sistemi",
    scope: ["Web", "Brand"],
    status: "coming",
    statusLabel: "Yakında",
  },
  {
    id: "ai-support",
    index: "03",
    title: "AI Destekli Destek Asistanı",
    scope: ["AI & Automation"],
    status: "concept",
    statusLabel: "Kavram",
  },
];

/**
 * SCENE 09 — SELECTED EXPERIMENTS
 * Dürüst portföy: gerçek case study yokken sahte referans/metric üretilmez.
 * Editoryal indeks satırları + hover'da soyut vitrin.
 * Trigger: satır bazlı ScrollTrigger enter (%88), stagger 0.09
 * Duration: 0.7s · Easing: expo.out · Reduced motion: statik liste.
 */
export function Scene09Experiments() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rows = gsap.utils.toArray<HTMLElement>("[data-experiment-row]");
      const tweens = rows.map((row, index) =>
        gsap.fromTo(
          row,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: index * 0.09,
            ease: EASE.cinematic,
            scrollTrigger: { trigger: row, start: "top 88%" },
          },
        ),
      );

      return () => {
        tweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected Experiments"
      className="relative bg-background py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Scene 09 — Selected Experiments</p>
            <h2 className="display-l mt-6 text-foreground">
              Seçilmiş <span className="text-accent">deneyler.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Şu an stüdyo, ilk iş ortaklarıyla çalışıyor. Gerçek vaka
            çalışmaları burada yayınlandığında her detayıyla anlatacağız —
            şimdilik deneyim alanlarımızı gösteren kavram çalışmaları.
          </p>
        </div>

        <ul className="mt-16 border-t border-border">
          {EXPERIMENTS.map((experiment) => (
            <li
              key={experiment.id}
              data-experiment-row
              className="group relative border-b border-border"
            >
              <div className="flex flex-col gap-4 py-8 transition-colors duration-300 md:flex-row md:items-center md:gap-10 md:py-10">
                <span className="font-display text-sm text-muted">
                  {experiment.index}
                </span>

                <h3 className="flex-1 font-display text-2xl font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent md:text-3xl">
                  {experiment.title}
                </h3>

                <ul className="flex flex-wrap gap-2">
                  {experiment.scope.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <span
                  className={`w-fit rounded-full px-3 py-1 font-display text-[0.65rem] uppercase tracking-[0.2em] ${
                    experiment.status === "coming"
                      ? "border border-accent/40 text-accent"
                      : "border border-border text-muted"
                  }`}
                >
                  {experiment.statusLabel}
                </span>
              </div>

              {/* Hover soyut vitrin — touch cihazlarda gizli */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-6 top-1/2 hidden h-16 w-40 -translate-y-1/2 origin-right scale-90 overflow-hidden rounded-lg border border-border bg-surface opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 lg:block"
              >
                <div className="bg-grid h-full w-full p-2">
                  <div className="h-2 w-1/2 rounded-full bg-muted/40" />
                  <div className="mt-1.5 h-2 w-1/3 rounded-full bg-muted/25" />
                  <div className="mt-2 h-4 w-10 rounded-full bg-accent/80" />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 font-display text-xs uppercase tracking-[0.24em] text-muted">
          Coming projects — bu alan büyüyor.
        </p>
      </div>
    </section>
  );
}
