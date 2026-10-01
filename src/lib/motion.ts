/**
 * ADRA DİJİTAL — MERKEZİ MOTION KAYDI
 * Her animasyonun trigger / duration / easing / purpose tanımı buradadır.
 * Kural: Fast UI (150–250ms) / Slow Cinematic (0.8–1.4s).
 */

/** GSAP custom ease adları — timeline'larda string olarak kullanılır. */
export const EASE = {
  ui: "power3.out",
  cinematic: "expo.out",
  cinematicInOut: "expo.inOut",
} as const;

export const DURATION = {
  ui: 0.22,
  uiSlow: 0.35,
  scene: 1.1,
  introStep: 0.9,
} as const;

/** Word-reveal varsayılanları */
export const WORD_STAGGER = 0.055;

/** ScrollTrigger default start: öğe görünür alanın %80'ine girince */
export const REVEAL_START = "top 80%" as const;

/** Intro sekansı adımları (ms) — reduced motion'da yalnızca fade uygulanır */
export const INTRO_SEQUENCE_MS = 2600;
