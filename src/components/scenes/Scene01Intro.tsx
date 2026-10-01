"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { EASE, INTRO_SEQUENCE_MS } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

const SESSION_KEY = "adra-intro-seen";

/**
 * SCENE 01 — INTRO / BRAND REVEAL
 * Trigger: mount (oturumda bir kez) · Duration: ~2.6s toplam, 3 kademe
 * Easing: expo.inOut · Amaç: ilk saniyelerde marka güveni kurmak.
 * - "Geç" butonu ile atlanabilir (keyboard erişilebilir).
 * - reduced-motion: yalnızca 300ms fade, scroll kilidi hiç uygulanmaz.
 * - Aynı oturumda tekrar gösterilmez.
 */
export function Scene01Intro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      const isReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const seen = sessionStorage.getItem(SESSION_KEY) === "1";

      const finish = (): void => {
        setIsDone(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        document.body.style.overflow = "";
        // Intro sırasında scrollbar durumu değişti → pin ölçümlerini tazele.
        ScrollTrigger.refresh();
      };

      // Vite benzeri hız: içerik hazır, intro sadece bir vitrin.
      document.body.style.overflow = "hidden";

      if (isReduced || seen) {
        gsap.to(overlay, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "none",
          onComplete: finish,
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: EASE.cinematicInOut },
        onComplete: finish,
      });

      tl.from("[data-intro-word='adra'] [data-char]", {
        yPercent: 120,
        duration: 0.8,
        stagger: 0.055,
      })
        .from(
          "[data-intro-word='dijital'] [data-char]",
          { yPercent: 120, duration: 0.7, stagger: 0.04 },
          "-=0.35",
        )
        .fromTo(
          "[data-intro-tagline]",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE.cinematic },
          "-=0.2",
        )
        .to("[data-intro-line]", { scaleX: 1, duration: 0.6 }, "<")
        .to(overlay, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.9,
          ease: EASE.cinematicInOut,
          delay: INTRO_SEQUENCE_MS - 2600,
        });

      return () => {
        document.body.style.overflow = "";
      };
    },
    { scope: overlayRef },
  );

  const handleSkip = (): void => {
    const overlay = overlayRef.current;
    if (!overlay || isDone) return;
    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.25,
      ease: "none",
      onComplete: () => {
        setIsDone(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        document.body.style.overflow = "";
        ScrollTrigger.refresh();
      },
    });
  };

  if (isDone) return null;

  return (
    <div
      ref={overlayRef}
      aria-label="Marka tanıtımı"
      className="fixed inset-0 z-[92] flex flex-col items-center justify-center bg-background"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="flex flex-col items-center px-6 text-center">
        <span
          data-intro-word="adra"
          className="display-xl overflow-hidden text-foreground"
        >
          {"ADRA".split("").map((char, index) => (
            <span
              key={index}
              data-char
              className="inline-block will-change-transform"
            >
              {char}
            </span>
          ))}
        </span>
        <span
          data-intro-word="dijital"
          className="mt-2 overflow-hidden font-display text-lg font-medium uppercase tracking-[0.5em] text-muted md:text-2xl"
        >
          {"DİJİTAL".split("").map((char, index) => (
            <span
              key={index}
              data-char
              className="inline-block will-change-transform"
            >
              {char}
            </span>
          ))}
        </span>

        <span
          data-intro-line
          aria-hidden="true"
          className="mt-8 h-px w-24 origin-center scale-x-0 bg-accent"
        />

        <p
          data-intro-tagline
          className="mt-8 max-w-md text-balance text-sm text-muted md:text-base"
        >
          Markaların dijital dünyasını tasarlıyoruz.
        </p>
      </div>

      <button
        type="button"
        onClick={handleSkip}
        className="absolute bottom-8 right-8 font-display text-xs uppercase tracking-[0.24em] text-muted transition-colors hover:text-foreground"
      >
        Geç →
      </button>
    </div>
  );
}
