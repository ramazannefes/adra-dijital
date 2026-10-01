"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LenisContext = createContext<Lenis | null>(null);

/** Aktif Lenis örneğini döndürür (reduced motion veya SSR'da null). */
export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext);
}

const LENIS_EASING = (t: number): number =>
  Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Smooth scroll: Lenis rAF döngüsü GSAP ticker'ı üzerinden çalışır,
 * ScrollTrigger her Lenis kaymasında senkronize edilir.
 * prefers-reduced-motion durumunda Lenis kurulmaz → native scroll.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: LENIS_EASING,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number): void => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Font yüklendikçe ölçüler değişebilir → ScrollTrigger ölçümlerini tazele.
    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [prefersReducedMotion]);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}

/**
 * Bölüm içi çapa gezinmesi: Lenis varsa yumuşak, yoksa native.
 * Reduced motion'da anında atlar (animasyonlu kaydırma tercih edilmez).
 */
export function useAnchorScroll(): (target: string) => void {
  const lenis = useLenisInstance();
  const prefersReducedMotion = useReducedMotion();

  return (target: string) => {
    if (lenis) {
      lenis.scrollTo(target, { offset: 0 });
      return;
    }
    document
      .querySelector(target)
      ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  };
}
