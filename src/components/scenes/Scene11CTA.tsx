"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { EASE } from "@/lib/motion";
import { RevealText } from "@/components/motion/RevealText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ContactForm } from "@/components/sections/ContactForm";
import { useAnchorScroll } from "@/components/motion/SmoothScrollProvider";

gsap.registerPlugin(useGSAP);

/**
 * SCENE 11 — CTA
 * Trigger: başlık ScrollTrigger enter (%80) · Duration: 0.7s stagger
 * Easing: expo.out · Amaç: karar anında net eylem sunmak.
 * Magnetic buton + form; reduced motion: statik.
 */
export function Scene11CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTo = useAnchorScroll();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const glow = section?.querySelector<HTMLElement>("[data-cta-glow]");
      if (!section || !glow) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tween = gsap.fromTo(
        glow,
        { autoAlpha: 0.25, scale: 0.9 },
        {
          autoAlpha: 0.5,
          scale: 1.05,
          ease: EASE.cinematic,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "center center",
            scrub: 1,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef },
  );

  const scrollToContact = (): void => {
    scrollTo("#contact");
  };

  return (
    <section
      ref={sectionRef}
      aria-label="İletişim"
      className="relative overflow-hidden bg-background py-32 md:py-44"
    >
      <div
        data-cta-glow
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Scene 11 — Start</p>
          <RevealText
            as="h2"
            text="Markanızın dijital dünyasını birlikte tasarlayalım."
            className="display-l mt-6 text-balance text-foreground"
          />
          <div className="mt-10">
            <MagneticButton
              type="button"
              onClick={scrollToContact}
              ariaLabel="İletişim formuna git"
              className="rounded-full bg-accent px-9 py-4 font-display text-sm font-semibold uppercase tracking-[0.18em] text-background transition-[filter] duration-200 hover:brightness-110"
            >
              Projenizi Konuşalım
            </MagneticButton>
          </div>
        </div>

        <div
          id="contact"
          className="mx-auto mt-24 grid max-w-5xl gap-14 border-t border-border pt-16 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div>
            <h3 className="display-m text-foreground">
              Bir sonraki adım.
            </h3>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
              Formu doldurun; 24 saat içinde dönüş yapıyoruz. Tercih ederseniz
              doğrudan e-posta da gönderebilirsiniz.
            </p>
            <a
              href="mailto:merhaba@adradijital.com"
              className="mt-6 inline-block font-display text-sm text-foreground underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
            >
              merhaba@adradijital.com
            </a>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
