"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
};

/**
 * MobileMenu — tam ekran minimal menü.
 * Trigger: isOpen state · Duration: 0.45s panel, 0.4s link stagger (delay'li)
 * Easing: var(--ease-cinematic) · Amaç: mobilde net, kesintisiz gezinme.
 * Açıkken body scroll kilitlidir; Escape ile kapanır; focus panele verilir.
 */
export function MobileMenu({ isOpen, onClose, onNavigate }: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menü"
      hidden={!isOpen}
      className={`fixed inset-0 z-[90] flex flex-col bg-background/98 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <nav aria-label="Mobil gezinme" className="flex flex-1 flex-col justify-center px-8">
        <ul className="space-y-2">
          {siteConfig.navLinks.map((link, index) => (
            <li
              key={link.href}
              className={`transition-all duration-500 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              style={{
                transitionDelay: isOpen ? `${120 + index * 70}ms` : "0ms",
                transitionTimingFunction: "var(--ease-cinematic)",
              }}
            >
              <a
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(link.href);
                }}
                className="display-l block py-2 text-foreground transition-colors hover:text-accent"
              >
                <span className="mr-3 align-middle font-display text-xs text-muted">
                  0{index + 1}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="px-8 pb-10 text-sm text-muted">
        {siteConfig.contactEmail}
      </p>
    </div>
  );
}
