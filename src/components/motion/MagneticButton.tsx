"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  /** Çekim gücü: imleç ofsetinin kaç katı hareket (0–0.5 arası önerilir) */
  strength?: number;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  ariaLabel?: string;
};

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * MagneticButton — etkileşim geri bildirimi.
 * Trigger: mousemove/mouseleave · Duration: 0.25s follow, 0.6s release
 * Easing: power3.out / elastic.out(1, 0.4) · Amaç: buton canlılığını hissettirmek.
 * Touch ve reduced-motion cihazlarda tamamen nötrdür.
 */
export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  href,
  type = "button",
  onClick,
  ariaLabel,
}: MagneticButtonProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const inner = innerRef.current;
      if (!wrapper || !inner) return;
      if (!window.matchMedia(FINE_POINTER).matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const xTo = gsap.quickTo(inner, "x", {
        duration: 0.25,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(inner, "y", {
        duration: 0.25,
        ease: "power3.out",
      });

      const handleMove = (event: MouseEvent): void => {
        const rect = wrapper.getBoundingClientRect();
        const relX = event.clientX - (rect.left + rect.width / 2);
        const relY = event.clientY - (rect.top + rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
      };

      const handleLeave = (): void => {
        gsap.to(inner, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
      };

      wrapper.addEventListener("mousemove", handleMove);
      wrapper.addEventListener("mouseleave", handleLeave);
      return () => {
        wrapper.removeEventListener("mousemove", handleMove);
        wrapper.removeEventListener("mouseleave", handleLeave);
      };
    },
    { scope: wrapperRef },
  );

  const innerContent = (
    <span ref={innerRef} className="inline-block will-change-transform">
      {children}
    </span>
  );

  const sharedClassName = `inline-block ${className}`;

  return (
    <span ref={wrapperRef} className="inline-block" data-magnetic>
      {href ? (
        <a href={href} className={sharedClassName} aria-label={ariaLabel}>
          {innerContent}
        </a>
      ) : (
        <button
          type={type}
          onClick={onClick}
          className={sharedClassName}
          aria-label={ariaLabel}
        >
          {innerContent}
        </button>
      )}
    </span>
  );
}
