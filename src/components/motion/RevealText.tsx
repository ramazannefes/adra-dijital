"use client";

import { createElement, useMemo, useRef, type ElementType, type Ref } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { EASE, REVEAL_START, WORD_STAGGER } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

type RevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

type RevealTextProps = {
  text: string;
  /** Render edilen semantik etiket. Varsayılan: span */
  as?: RevealTag;
  className?: string;
  /** words: kelime kelime maskeli yükselme; clip: blok clip-path açılışı */
  mode?: "words" | "clip";
  delay?: number;
  stagger?: number;
  /** ScrollTrigger start konumu. Varsayılan: öğe %80 görünürken */
  start?: string;
  id?: string;
};

/**
 * RevealText — başlık/blok tipografisinin sahnelenen girişi.
 * Trigger: ScrollTrigger enter · Duration: 0.7s/word · Easing: expo.out
 * Amaç: metni okunurluk sırasına göre sahneye sokmak (dekorasyon değil).
 * Reduced motion: animasyon yok, metin tek karede tam görünür.
 */
export function RevealText({
  text,
  as = "span",
  className,
  mode = "words",
  delay = 0,
  stagger = WORD_STAGGER,
  start = REVEAL_START,
  id,
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const words = useMemo(() => text.split(" "), [text]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      if (mode === "clip") {
        gsap.fromTo(
          container,
          { clipPath: "inset(0 0 100% 0)", y: 28, autoAlpha: 0 },
          {
            clipPath: "inset(0 0 -10% 0)",
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: EASE.cinematic,
            delay,
            scrollTrigger: { trigger: container, start },
          },
        );
        return;
      }

      const wordInners = container.querySelectorAll<HTMLElement>(
        "[data-word-inner]",
      );
      gsap.set(wordInners, { yPercent: 115 });
      gsap.to(wordInners, {
        yPercent: 0,
        duration: 0.7,
        ease: EASE.cinematic,
        stagger,
        delay,
        scrollTrigger: { trigger: container, start },
      });
    },
    { scope: containerRef },
  );

  // Ekran okuyucular tam metni tek parça okur; split span'ler dekoratiftir.
  const content =
    mode === "clip" ? (
      text
    ) : (
      <>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
            >
              <span data-word-inner className="inline-block">
                {word}
                {index < words.length - 1 ? "\u00A0" : ""}
              </span>
            </span>
          ))}
        </span>
      </>
    );

  const Component = as as ElementType;
  return (
    <Component
      ref={containerRef as Ref<never>}
      id={id}
      className={className}
    >
      {content}
    </Component>
  );
}
