"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Kullanıcının hareket azaltma tercihini reaktif olarak döndürür.
 * Aynı tercih CSS tarafında `html[data-reduced-motion]` üzerinden de
 * okunabilir (attribute'u yalnızca bu hook set eder).
 */
export function useReducedMotion(): boolean {
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const update = (): void => {
      setIsReduced(mediaQuery.matches);
      document.documentElement.dataset.reducedMotion = String(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isReduced;
}
