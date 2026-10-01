"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { EASE } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

const CHANNELS = [
  { id: "social", title: "Social Media", detail: "Platforma özgü içerik & takvim" },
  { id: "ads", title: "Performance Marketing", detail: "Test → ölç → iyileştir döngüsü" },
  { id: "seo", title: "SEO", detail: "Teknik altyapı + içerik otoritesi" },
  { id: "content", title: "Content", detail: "Markanın kendi dilinde üretim" },
  { id: "analytics", title: "Analytics", detail: "Kararları veriyle beslemek" },
] as const;

/**
 * SCENE 06 — DIGITAL GROWTH
 * Trigger: çerçeve bazlı ScrollTrigger enter (%85), stagger 0.08
 * Duration: 0.7s · Easing: expo.out · Amaç: kanal disiplinini göstermek.
 * Not: Gerçek olmayan metrik/ödül UYDURULMAZ (Content Rule §20) —
 * çerçeveler yetkinlik ve süreç anlatır.
 * Reduced motion: statik liste.
 */
export function Scene06Growth() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const frames = gsap.utils.toArray<HTMLElement>("[data-growth-frame]");

      const tweens = frames.map((frame, index) =>
        gsap.fromTo(
          frame,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: index * 0.08,
            ease: EASE.cinematic,
            scrollTrigger: { trigger: frame, start: "top 85%" },
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
      aria-label="Digital Growth"
      className="relative bg-background py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="max-w-3xl">
          <p className="eyebrow">Scene 06 — Digital Growth</p>
          <h2 className="display-l mt-6 text-foreground">
            Görünürlük tesadüf{" "}
            <span className="text-accent">değil, sistemdir.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            Dijital büyüme; kanalların ayrı ayrı değil, tek bir içerik-ölçüm-
            iyileştirme döngüsünde çalışmasıyla gerçekleşir.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {CHANNELS.map((channel, index) => (
            <article
              key={channel.id}
              data-growth-frame
              className="group flex min-h-[220px] flex-col justify-between bg-background p-6 transition-colors duration-300 hover:bg-surface"
            >
              <span className="font-display text-xs text-muted">
                0{index + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-accent">
                  {channel.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {channel.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
