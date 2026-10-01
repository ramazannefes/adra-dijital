"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useAnchorScroll } from "@/components/motion/SmoothScrollProvider";

type AnchorLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

/** Sayfa içi çapa: Lenis varsa yumuşak, yoksa native kaydırma. */
export function AnchorLink({ href, children, ...rest }: AnchorLinkProps) {
  const scrollTo = useAnchorScroll();

  return (
    <a
      href={href}
      onClick={(event) => {
        if (href.startsWith("#")) {
          event.preventDefault();
          scrollTo(href);
        }
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
