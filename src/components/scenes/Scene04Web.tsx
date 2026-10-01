"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const WEB_SERVICES = [
  "Corporate Websites",
  "Landing Pages",
  "E-commerce",
  "Custom Web Applications",
] as const;

const STAGE_LABELS = ["Wireframe", "Interface", "Polished"] as const;

/**
 * SCENE 04 — WEB EXPERIENCE
 * Trigger: pin + scrub (2.2 ekran yüksekliği) · Easing: none (scrub) + power3
 * Amaç: "fikirden cilalı ürüne" dönüşümü hissettirmek.
 * Mock saf CSS ile çizilir → görsel ağırlığı ~0, CLS yok.
 * Reduced motion: mock final (polished) durumda statik.
 */
export function Scene04Web() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const stageOne = section.querySelector<HTMLElement>("[data-stage='1']");
      const stageTwo = section.querySelector<HTMLElement>("[data-stage='2']");
      const stageThree = section.querySelector<HTMLElement>("[data-stage='3']");
      const progressFill = section.querySelector<HTMLElement>(
        "[data-progress-fill]",
      );

      if (!stageOne || !stageTwo || !stageThree || !progressFill) return;

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=220%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1) Wireframe → Interface → Polished (çapraz erime)
      tl.to(stageOne, { autoAlpha: 0, scale: 0.97, duration: 1 })
        .fromTo(
          stageTwo,
          { autoAlpha: 0, scale: 0.97 },
          { autoAlpha: 1, scale: 1, duration: 1 },
          "<",
        )
        .to(stageTwo, { autoAlpha: 0, scale: 0.97, duration: 1 }, "+=0.4")
        .fromTo(
          stageThree,
          { autoAlpha: 0, scale: 0.96 },
          { autoAlpha: 1, scale: 1, duration: 1 },
          "<",
        )
        // İlerleme çizgisi tüm timeline boyunca dolar.
        .to(progressFill, { scaleX: 1, duration: 3.4, ease: "none" }, 0);

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
      id="services"
      aria-label="Web Experience"
      className="relative flex min-h-screen items-center overflow-hidden bg-background"
    >
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 py-24 md:px-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Browser mock — 3 aşama üst üste */}
        <div>
          <div className="relative aspect-[16/10] w-full">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-xl border border-border bg-surface/60 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]"
            />

            {/* Aşama 1: Wireframe */}
            <div data-stage="1" className="absolute inset-0 p-4 md:p-6">
              <div className="flex h-full flex-col gap-3 rounded-lg border border-dashed border-muted/40 p-4 md:p-6">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-2 w-2 rounded-full border border-muted/50"
                    />
                  ))}
                </div>
                <div className="mt-2 h-10 w-2/3 border-b border-dashed border-muted/40" />
                <div className="grid flex-1 grid-cols-3 gap-3">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div
                      key={index}
                      className="rounded border border-dashed border-muted/40"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Aşama 2: Interface — yapı yerleşti */}
            <div
              data-stage="2"
              className="absolute inset-0 p-4 opacity-0 md:p-6"
            >
              <div className="flex h-full flex-col gap-3 rounded-lg border border-border bg-surface p-4 md:p-6">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted/60" />
                  <span className="h-2 w-2 rounded-full bg-muted/40" />
                  <span className="h-2 w-2 rounded-full bg-muted/40" />
                  <span className="ml-3 h-2 w-24 rounded-full bg-muted/25" />
                </div>
                <div className="mt-2 h-10 w-2/3 rounded bg-foreground/15" />
                <div className="grid flex-1 grid-cols-3 gap-3">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div key={index} className="rounded bg-foreground/10" />
                  ))}
                </div>
              </div>
            </div>

            {/* Aşama 3: Polished — gerçek içerikli mini site */}
            <div
              data-stage="3"
              className="absolute inset-0 p-4 opacity-0 md:p-6"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface">
                <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="h-2 w-2 rounded-full bg-muted/40" />
                  <span className="h-2 w-2 rounded-full bg-muted/40" />
                  <span className="ml-3 h-2 w-24 rounded-full bg-muted/25" />
                  <span className="ml-auto h-4 w-14 rounded-full bg-accent/90" />
                </div>
                <div className="flex flex-1 flex-col justify-center gap-3 px-6 py-6">
                  <span className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    Markanı inşa et.
                  </span>
                  <span className="h-2 w-3/5 rounded-full bg-muted/25" />
                  <span className="h-2 w-2/5 rounded-full bg-muted/25" />
                  <div className="mt-2 flex gap-2">
                    <span className="h-7 w-20 rounded-full bg-accent" />
                    <span className="h-7 w-20 rounded-full border border-border" />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {["Web", "Brand", "AI"].map((label) => (
                      <span
                        key={label}
                        className="rounded border border-border px-2 py-3 text-center font-display text-[0.65rem] uppercase tracking-[0.18em] text-muted"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dönüşüm göstergesi */}
          <div className="mt-5 flex items-center gap-4">
            <div
              aria-hidden="true"
              className="h-px flex-1 overflow-hidden bg-border"
            >
              <div
                data-progress-fill
                className="h-full w-full origin-left scale-x-0 bg-accent"
              />
            </div>
            <div className="flex gap-3">
              {STAGE_LABELS.map((label) => (
                <span
                  key={label}
                  className="font-display text-[0.6rem] uppercase tracking-[0.22em] text-muted"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copy */}
        <div>
          <p className="eyebrow">Scene 04 — Web Experience</p>
          <h2 className="display-l mt-6 text-foreground">
            Wireframe&apos;den <span className="text-accent">canlı ürüne.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Strateji, tasarım ve mühendislik tek akışta: performans odaklı,
            erişilebilir, ölçeklenebilir web deneyimleri.
          </p>
          <ul className="mt-8 space-y-3">
            {WEB_SERVICES.map((service) => (
              <li
                key={service}
                className="flex items-center gap-3 border-b border-border pb-3 text-sm text-foreground/90"
              >
                <span aria-hidden="true" className="h-px w-6 bg-accent" />
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
