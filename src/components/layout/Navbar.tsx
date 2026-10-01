"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";
import { useAnchorScroll } from "@/components/motion/SmoothScrollProvider";
import { MobileMenu } from "@/components/layout/MobileMenu";

/**
 * Navbar — minimal, koyu, scroll'da blur + hairline kazanır.
 * Trigger: scroll (rAF'ta class toggle) · Duration: 0.3s CSS transition
 * Amaç: marka varlığını sürekli korumak ama sahneyi "bağırmadan".
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollTo = useAnchorScroll();

  useEffect(() => {
    let frame = 0;
    const onScroll = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 40);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleNavigate = (href: string): void => {
    setIsMenuOpen(false);
    // Menü kapanış geçişi ile yarışmasın diye bir kare bekler.
    requestAnimationFrame(() => scrollTo(href));
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-300 ${
          isScrolled && !isMenuOpen
            ? "border-b border-border bg-background/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Ana gezinme"
          className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-20 md:px-10"
        >
          <a
            href="#main"
            onClick={(event) => {
              event.preventDefault();
              handleNavigate("#main");
            }}
            className="font-display text-lg font-bold tracking-tight text-foreground"
          >
            ADRA<span className="text-accent">.</span>
            <span className="ml-2 hidden text-xs font-medium uppercase tracking-[0.28em] text-muted sm:inline">
              Dijital
            </span>
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {siteConfig.navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavigate(link.href);
                  }}
                  className="group relative font-display text-[0.82rem] font-medium uppercase tracking-[0.2em] text-muted transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full"
                  />
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="relative z-[91] flex h-10 w-10 items-center justify-center md:hidden"
          >
            <span className="sr-only">
              {isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            </span>
            <span
              aria-hidden="true"
              className={`absolute h-px w-6 bg-foreground transition-all duration-300 ${
                isMenuOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-px w-6 bg-foreground transition-all duration-300 ${
                isMenuOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </nav>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
}
