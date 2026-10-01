/**
 * GSAP merkezi kayıt noktası.
 * Client bundle'ında yalnızca bir kez register edilir; sahne bileşenleri
 * gsap/ScrollTrigger'ı buradan import eder.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
