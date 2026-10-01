"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { EASE } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isAccent: boolean;
  radius: number;
};

const LINK_DISTANCE = 130;
const ACCENT_RATIO = 0.12;

/**
 * SCENE 03 — DIGITAL WORLD
 * Canvas parçacık ağı: soyut "dijital dünya" dokusu.
 * Trigger: pin + scrub (opacity/scale) + sürekli rAF döngüsü
 * Performans: DPR ≥ 2'de yarıya düşürülür; mobilde parçacık sayısı azalır;
 * sekme gizliyken döngü durur. Video yerine ~2 KB canvas → LCP dostu.
 * Reduced motion: döngü yok, tek kare statik çizilir.
 */
export function Scene03DigitalWorld() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Canvas yaşam döngüsü -------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = canvas?.parentElement;
    if (!canvas || !wrapper) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isCompactViewport = window.matchMedia("(max-width: 768px)").matches;

    const styles = getComputedStyle(document.documentElement);
    const colorForeground = styles.getPropertyValue("--color-foreground").trim() || "#f4f4f2";
    const colorAccent = styles.getPropertyValue("--color-accent").trim() || "#c8f04a";

    let particles: Particle[] = [];
    let rafId = 0;
    let width = 0;
    let height = 0;

    const spawn = (): void => {
      const baseCount = Math.round((width * height) / 14000);
      const count = Math.max(28, Math.min(isCompactViewport ? 70 : 140, baseCount));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        isAccent: Math.random() < ACCENT_RATIO,
        radius: Math.random() * 1.4 + 0.6,
      }));
    };

    const resize = (): void => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * (dpr >= 2 ? dpr / 2 : dpr));
      canvas.height = Math.round(height * (dpr >= 2 ? dpr / 2 : dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(
        canvas.width / width,
        0,
        0,
        canvas.height / height,
        0,
        0,
      );
      spawn();
      if (isReduced) drawFrame(); // statik kare
    };

    const drawFrame = (): void => {
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (!isReduced) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        }
      }

      context.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        if (!a) continue;
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          if (!b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance >= LINK_DISTANCE) continue;
          const alpha = (1 - distance / LINK_DISTANCE) * 0.22;
          context.strokeStyle = `rgba(244, 244, 242, ${alpha.toFixed(3)})`;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      for (const particle of particles) {
        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2,
        );
        context.fillStyle = particle.isAccent ? colorAccent : colorForeground;
        context.globalAlpha = particle.isAccent ? 0.9 : 0.55;
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const loop = (): void => {
      drawFrame();
      rafId = requestAnimationFrame(loop);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    if (!isReduced) {
      rafId = requestAnimationFrame(loop);
      const handleVisibility = (): void => {
        cancelAnimationFrame(rafId);
        if (!document.hidden) rafId = requestAnimationFrame(loop);
      };
      document.addEventListener("visibilitychange", handleVisibility);
      return () => {
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }

    return () => resizeObserver.disconnect();
  }, []);

  // --- Scroll scrub ----------------------------------------------------
  useGSAP(
    () => {
      const section = sectionRef.current;
      const message = section?.querySelector<HTMLElement>("[data-world-message]");
      if (!section || !message) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=140%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        message,
        { autoAlpha: 0, y: 60, scale: 0.94 },
        { autoAlpha: 1, y: 0, scale: 1, ease: EASE.cinematic, duration: 0.45 },
      ).to(message, { autoAlpha: 0.15, scale: 1.04, duration: 0.55 });

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
      aria-label="Dijital dünya"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <canvas ref={canvasRef} className="block h-full w-full opacity-70" />
      </div>

      <div data-world-message className="relative mx-auto max-w-4xl px-5 text-center md:px-10">
        <p className="eyebrow">Scene 03 — Digital World</p>
        <h2 className="display-l mt-6 text-balance text-foreground">
          Bugünün dünyasında dijital varlık bir{" "}
          <span className="text-accent">seçenek değil.</span>
        </h2>
      </div>
    </section>
  );
}
