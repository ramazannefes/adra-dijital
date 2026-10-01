"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  isCore?: boolean;
};

const NODES: readonly GraphNode[] = [
  { id: "ai", label: "AI Solutions", x: 18, y: 22 },
  { id: "chatbot", label: "Chatbots", x: 74, y: 16 },
  { id: "workflow", label: "Workflow Systems", x: 78, y: 62 },
  { id: "data", label: "Data & Integrations", x: 22, y: 68 },
  { id: "core", label: "Business Automation", x: 48, y: 42, isCore: true },
] as const;

const EDGES: ReadonlyArray<readonly [string, string]> = [
  ["ai", "core"],
  ["chatbot", "core"],
  ["workflow", "core"],
  ["data", "core"],
];

/**
 * SCENE 07 — AI & AUTOMATION
 * Trigger: pin + scrub (1.8 ekran) · Easing: none (scrub)
 * Amaç: otomasyonun "kurulan bir sistem" olduğunu göstermek —
 * node'lar belirir, bağlantılar çizilir, çekirdek aktive olur.
 * Teknik: SVG stroke-dashoffset scrub'ı (GPU dostu, layout etkilemez).
 * Reduced motion: graph tam çizilmiş, statik.
 */
export function Scene07AI() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const nodeMap = new Map(
        NODES.map((node) => [node.id, section.querySelector<HTMLElement>(`[data-node='${node.id}']`)]),
      );

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=180%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1) Çekirdek belirir
      tl.fromTo(
        "[data-node='core']",
        { autoAlpha: 0, scale: 0.8 },
        { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power3.out" },
      );

      // 2) Node'lar sırayla, 3) bağlantılar çizilir
      for (const [from, to] of EDGES) {
        const fromEl = nodeMap.get(from);
        const toEl = nodeMap.get(to);
        if (!fromEl || !toEl) continue;

        tl.fromTo(
          fromEl,
          { autoAlpha: 0, scale: 0.85 },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out" },
          ">-0.1",
        );

        const path = section.querySelector<SVGPathElement>(
          `[data-edge='${from}-${to}']`,
        );
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          tl.to(
            path,
            { strokeDashoffset: 0, duration: 0.6 },
            "<",
          );
        }
      }

      // 4) Çekirdek nabız vurgusu
      tl.to("[data-core-ring]", { scale: 1.35, autoAlpha: 0, duration: 0.8 }, ">-0.2");

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
      aria-label="AI ve Otomasyon"
      className="relative flex min-h-screen items-center overflow-hidden bg-background"
    >
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 py-24 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Scene 07 — AI &amp; Automation</p>
          <h2 className="display-l mt-6 text-foreground">
            İşletme için çalışan{" "}
            <span className="text-accent">dijital zihin.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Tekrarlayan işleri otomasyona devredin: yapay zekâ çözümleri,
            chatbot&apos;lar, workflow sistemleri ve entegrasyonlar — hepsi
            tek bir mimaride.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {NODES.filter((node) => !node.isCore).map((node) => (
              <li
                key={node.id}
                className="rounded-full border border-border px-4 py-1.5 font-display text-xs uppercase tracking-[0.14em] text-muted"
              >
                {node.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Node graph */}
        <div className="relative">
          <div className="relative aspect-[4/3] w-full rounded-2xl border border-border bg-surface/40">
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {EDGES.map(([from, to]) => {
                const fromNode = NODES.find((n) => n.id === from);
                const toNode = NODES.find((n) => n.id === to);
                if (!fromNode || !toNode) return null;
                const mx = (fromNode.x + toNode.x) / 2;
                const my = (fromNode.y + toNode.y) / 2;
                return (
                  <path
                    key={`${from}-${to}`}
                    data-edge={`${from}-${to}`}
                    d={`M ${fromNode.x} ${fromNode.y} Q ${mx} ${my} ${toNode.x} ${toNode.y}`}
                    fill="none"
                    stroke="rgba(244,244,242,0.25)"
                    strokeWidth="0.35"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>

            {NODES.map((node) => (
              <div
                key={node.id}
                data-node={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 ${
                  node.isCore
                    ? "flex h-24 w-24 items-center justify-center rounded-full border border-accent/50 bg-accent/10 md:h-28 md:w-28"
                    : "rounded-full border border-border bg-background px-4 py-2"
                }`}
              >
                {node.isCore && (
                  <span
                    data-core-ring
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-accent/60"
                  />
                )}
                <span
                  className={`text-center font-display ${
                    node.isCore
                      ? "text-xs font-semibold uppercase tracking-[0.14em] text-accent md:text-sm"
                      : "text-[0.7rem] text-foreground/90"
                  }`}
                >
                  {node.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center font-display text-[0.6rem] uppercase tracking-[0.3em] text-muted">
            Systems that run while you build
          </p>
        </div>
      </div>
    </section>
  );
}
