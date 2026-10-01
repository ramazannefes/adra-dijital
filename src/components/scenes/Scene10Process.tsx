"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const PROCESS_STEPS = [
  {
    id: "discover",
    number: "01",
    title: "Discover",
    detail: "Hedefleri, kullanıcıyı ve rekabeti anlıyoruz. Yanlış soruna doğru çözüm üretmenin anlamı yok.",
  },
  {
    id: "design",
    number: "02",
    title: "Design",
    detail: "Stratejiyi görsel dile çeviriyoruz: kimlik, deneyim ve sistem.",
  },
  {
    id: "build",
    number: "03",
    title: "Build",
    detail: "Performans, erişilebilirlik ve güvenlik baştan itibaren mühendisliğin parçası.",
  },
  {
    id: "launch",
    number: "04",
    title: "Launch",
    detail: "Ölçüm altyapısı hazır; yayına kontrollü ve veriyle giriyoruz.",
  },
  {
    id: "grow",
    number: "05",
    title: "Grow",
    detail: "Veri → içgörü → iyileştirme döngüsü ürünü büyütmeye devam eder.",
  },
] as const;

/**
 * SCENE 10 — PROCESS
 * Masaüstü: pin + yatay scroll scrub ("süreç bir yolculuk" hissi).
 * Mobil: dikey statik akış (yatay scrub mobilde yorucu → tasarım kararı).
 * Trigger: pin scrub (track genişliği kadar) · Easing: none (scrub)
 * Reduced motion: her ekranda dikey statik akış.
 */
export function Scene10Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mediaQuery = gsap.matchMedia();

      mediaQuery.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const getDistance = (): number =>
            track.scrollWidth - document.documentElement.clientWidth + 96;

          const tween = gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getDistance()}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );

      return () => mediaQuery.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Çalışma sürecimiz"
      className="relative overflow-hidden bg-background"
    >
      <div className="mx-auto max-w-[1440px] px-5 pt-28 md:px-10 md:pt-40">
        <p className="eyebrow">Scene 10 — Process</p>
        <h2 className="display-l mt-6 max-w-3xl text-foreground">
          Sürprizsiz, <span className="text-accent">şeffaf bir süreç.</span>
        </h2>
      </div>

      <div className="mt-14 pb-28 md:pb-40">
        <div
          ref={trackRef}
          className="flex flex-col gap-px border-y border-border bg-border md:w-max md:flex-row md:gap-0"
        >
          {PROCESS_STEPS.map((step) => (
            <article
              key={step.id}
              className="flex min-h-[240px] flex-col justify-between bg-background p-7 md:min-h-[380px] md:w-[420px] md:p-10 lg:w-[480px]"
            >
              <span className="font-display text-sm text-muted">
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                  {step.detail}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="mt-8 block h-px w-12 bg-accent md:mt-0"
              />
            </article>
          ))}

          <div
            aria-hidden="true"
            className="hidden w-[96px] shrink-0 bg-background md:block"
          />
        </div>
      </div>
    </section>
  );
}
