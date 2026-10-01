"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { EASE, REVEAL_START } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

type Work = {
  readonly id: string;
  readonly index: string;
  readonly name: string;
  readonly location: string;
  readonly sector: string;
  readonly scope: readonly string[];
  readonly url: string;
  /** Yayında olan gerçek işler — durum etiketi sabit. */
  readonly statusLabel: "Canlıda";
  readonly hero: { src: string; alt: string };
  readonly frames: ReadonlyArray<{ src: string; alt: string }>;
  readonly mobile: { src: string; alt: string };
  readonly summary: string;
};

/**
 * İçerik — hepsi gerçek, yayında olan işler. Screenshot'lar
 * scripts/capture-work.mjs ile üretildi; metric/sayı uydurulmaz.
 */
const WORKS: readonly Work[] = [
  {
    id: "giritli-balik",
    index: "01",
    name: "Giritli Balık Restaurant",
    location: "Mudanya · Bursa",
    sector: "Butik Deniz Restoranı",
    scope: ["Web Experience", "Online Rezervasyon", "TR / EN"],
    url: "https://giritli-balik.vercel.app",
    statusLabel: "Canlıda",
    hero: {
      src: "/work/giritli-balik-hero.jpg",
      alt: "Giritli Balık Restaurant web sitesi ana sayfası — gün batımında denize karşı teras ve zarif tipografi",
    },
    frames: [
      {
        src: "/work/giritli-balik-frame-1.jpg",
        alt: "Giritli Balık — çevrimiçi rezervasyon bölümü: online masa seçimi ve WhatsApp rezervasyonu",
      },
      {
        src: "/work/giritli-balik-frame-2.jpg",
        alt: "Giritli Balık — iletişim ve konum bölümü: Mudanya haritası ve yol tarifi",
      },
    ],
    mobile: {
      src: "/work/giritli-balik-mobile.jpg",
      alt: "Giritli Balık web sitesinin mobil görünümü",
    },
    summary:
      "Girit mirası ile Ege tazeliğini buluşturan butik restoran için gün batımı atmosferini ekrana taşıyan, çevrimiçi rezervasyonlu çok dilli web deneyimi.",
  },
  {
    id: "kirmizi-pide",
    index: "02",
    name: "Kırmızı Pide",
    location: "Güzelyalı · Bursa",
    sector: "Taş Fırın · Pide & Kavurma",
    scope: ["Web Experience", "Online Sipariş", "Şube Ağı"],
    url: "https://kirmizi-pide.vercel.app",
    statusLabel: "Canlıda",
    hero: {
      src: "/work/kirmizi-pide-hero.jpg",
      alt: "Kırmızı Pide web sitesi ana sayfası — taş fırında hamur açılırken, editoryal serif tipografi",
    },
    frames: [
      {
        src: "/work/kirmizi-pide-frame-1.jpg",
        alt: "Kırmızı Pide — marka hikâyesi bölümü: düşey Türkçe tipografi ve fırın atmosferi",
      },
    ],
    mobile: {
      src: "/work/kirmizi-pide-mobile.jpg",
      alt: "Kırmızı Pide web sitesinin mobil görünümü",
    },
    summary:
      "Taş fırın geleneğini editoryal tipografiyle buluşturan marka sitesi; online sipariş akışı ve şube ağı tek deneyimde.",
  },
  {
    id: "cag-doner",
    index: "03",
    name: "6 Parmak Cağ Döner",
    location: "Osmangazi · Bursa",
    sector: "Cağ Döner · Odun Ateşi",
    scope: ["Web Experience", "Rezervasyon", "Menü & Galeri"],
    url: "https://6-parmak-cag-doner-szi3.vercel.app",
    statusLabel: "Canlıda",
    hero: {
      src: "/work/cag-doner-hero.jpg",
      alt: "6 Parmak Cağ Döner web sitesi ana sayfası — döner karesi üzerinde koyu temalı tipografi",
    },
    frames: [
      {
        src: "/work/cag-doner-frame-1.jpg",
        alt: "6 Parmak Cağ Döner — menü bölümü: odun ateşinde pişen cağ döner kareleri",
      },
      {
        src: "/work/cag-doner-frame-2.jpg",
        alt: "6 Parmak Cağ Döner — deneyim bölümü: alev ve ustalık atmosferi",
      },
    ],
    mobile: {
      src: "/work/cag-doner-mobile.jpg",
      alt: "6 Parmak Cağ Döner web sitesinin mobil görünümü",
    },
    summary:
      "Odun ateşinin sıcaklığını sinematik video hero ile taşıyan restoran sitesi; menü, galeri ve rezervasyon tek akışta.",
  },
] as const;

/**
 * SCENE 09 — SELECTED WORK
 * Gerçek, yayında olan işlerin editoryal vitrini.
 * Motion: plaka clip-path reveal (enter) + görsel parallax (scrub),
 * kare şeridi stagger (enter). Trigger'lar öğe bazlı, easing expo.out.
 * Reduced motion: tüm animasyonlar kapalı, statik editoryal grid.
 */
export function Scene09Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cleanups: Array<() => void> = [];

      // 1) Plaka: clip reveal + iç görsel parallax (scrub)
      gsap.utils.toArray<HTMLElement>("[data-plate]").forEach((plate) => {
        const parallax = plate.querySelector<HTMLElement>(
          "[data-plate-parallax]",
        );
        const reveal = gsap.fromTo(
          plate,
          { clipPath: "inset(10% 5% 10% 5% round 16px)", autoAlpha: 0.55 },
          {
            clipPath: "inset(0% 0% 0% 0% round 16px)",
            autoAlpha: 1,
            duration: 1.1,
            ease: EASE.cinematic,
            scrollTrigger: { trigger: plate, start: REVEAL_START },
          },
        );
        cleanups.push(() => {
          reveal.scrollTrigger?.kill();
          reveal.kill();
        });

        if (parallax) {
          const drift = gsap.fromTo(
            parallax,
            { yPercent: -5, scale: 1.15 },
            {
              yPercent: 5,
              scale: 1.15,
              ease: "none",
              scrollTrigger: {
                trigger: plate,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
          cleanups.push(() => {
            drift.scrollTrigger?.kill();
            drift.kill();
          });
        }
      });

      // 2) Meta satırı + kare şeridi: stagger yükselme
      gsap.utils
        .toArray<HTMLElement>("[data-work-meta], [data-work-frames]")
        .forEach((el) => {
          const tween = gsap.fromTo(
            el,
            { autoAlpha: 0, y: 44 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: EASE.cinematic,
              scrollTrigger: { trigger: el, start: "top 88%" },
            },
          );
          cleanups.push(() => {
            tween.scrollTrigger?.kill();
            tween.kill();
          });
        });

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Seçilmiş İşler"
      className="relative bg-background py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Scene 09 — Selected Work</p>
            <h2 className="display-l mt-6 text-foreground">
              Seçilmiş <span className="text-accent">işler.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Bursa ve Mudanya&rsquo;daki gerçek işletmeler için tasarlayıp
            yayına aldığımız dijital deneyimler. Her biri hâlâ yayında —
            ziyaret edip kendiniz görebilirsiniz.
          </p>
        </div>

        <div className="mt-20 space-y-28 md:space-y-40">
          {WORKS.map((work) => (
            <article key={work.id} aria-label={work.name}>
              {/* Plaka — tümü canlı siteye giden tek bağlantı */}
              <a
                data-plate
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${work.name} — canlı siteyi yeni sekmede aç`}
                className="group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <div
                  data-plate-parallax
                  className="absolute -inset-y-[7%] inset-x-0 will-change-transform"
                >
                  <Image
                    src={work.hero.src}
                    alt={work.hero.alt}
                    fill
                    sizes="(min-width: 1280px) 1152px, 92vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Okunurluk gradyanı */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-background/30"
                />

                {/* Durum rozeti */}
                <span className="absolute right-5 top-5 rounded-full border border-accent/50 bg-background/60 px-4 py-1.5 font-display text-[0.65rem] uppercase tracking-[0.22em] text-accent backdrop-blur-sm">
                  {work.statusLabel} ↗
                </span>

                {/* Plaka içi meta */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                  <span
                    aria-hidden="true"
                    className="font-display text-sm text-accent"
                  >
                    {work.index}
                  </span>
                  <h3 className="display-m mt-2 text-foreground">
                    {work.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {work.sector} — {work.location}
                  </p>
                </div>
              </a>

              {/* Alt meta: özet + kapsam + bağlantı */}
              <div
                data-work-meta
                className="mt-8 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-start md:justify-between"
              >
                <p className="max-w-xl text-sm leading-relaxed text-muted">
                  {work.summary}
                </p>
                <div className="flex flex-col items-start gap-4 md:items-end">
                  <ul className="flex flex-wrap gap-2">
                    {work.scope.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-foreground transition-colors duration-200 hover:text-accent"
                  >
                    Siteyi ziyaret et
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </div>
              </div>

              {/* Kare şeridi: bölüm kareleri + mobil — asimetrik editoryal grid */}
              <div
                data-work-frames
                className="mt-10 grid gap-4 md:grid-cols-12"
              >
                {work.frames.map((frame, i) => (
                  <div
                    key={frame.src}
                    className={`relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-surface ${
                      work.frames.length === 1
                        ? "md:col-span-8"
                        : i === 0
                          ? "md:col-span-7"
                          : "md:col-span-5"
                    }`}
                  >
                    <Image
                      src={frame.src}
                      alt={frame.alt}
                      fill
                      sizes={
                        work.frames.length === 1
                          ? "(min-width: 768px) 60vw, 92vw"
                          : i === 0
                            ? "(min-width: 768px) 55vw, 92vw"
                            : "(min-width: 768px) 38vw, 92vw"
                      }
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="relative mx-auto aspect-[9/19] w-2/3 overflow-hidden rounded-xl border border-border bg-surface md:col-span-3 md:mt-12 md:w-auto">
                  <Image
                    src={work.mobile.src}
                    alt={work.mobile.alt}
                    fill
                    sizes="(min-width: 768px) 24vw, 60vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-20 font-display text-xs uppercase tracking-[0.24em] text-muted">
          Coming projects — bu vitrin büyüyor.
        </p>
      </div>
    </section>
  );
}
