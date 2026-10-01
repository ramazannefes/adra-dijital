# AdRa Dijital — Teknik Mimari & Plan Dokümanı

> Durum: v1.0 — Implementation öncesi onaylanmış plan.
> İlke: Scroll = storytelling. Animation = communication. Security & performance = mimarinin parçası.

---

## 1. Technical Architecture

| Katman | Seçim | Gerekçe |
|---|---|---|
| Framework | **Next.js 15 (App Router) + React 19** | RSC ile statik sahneler server'da render edilir; etkileşimli sahneler `"use client"` ile izole edilir. SEO + metadata API + Server Actions yerleşik. |
| Dil | **TypeScript (strict)** | `strict`, `noUncheckedIndexedAccess`. `any` yok. |
| Stil | **Tailwind CSS v4** + CSS custom properties | Token sistemi `@theme` ile merkezi; utility'ler derleme zamanı üretilir (runtime maliyeti sıfır). |
| Motion | **GSAP 3 + ScrollTrigger** (`@gsap/react/useGSAP`) | Timeline tabanlı sinematik sahneler, pin/scrub kontrolü, industry standard easing (custom `expo`/`power4` curve'ler). |
| Smooth scroll | **Lenis** | GSAP ScrollTrigger ile resmî entegrasyon (`lenis.on('scroll', ScrollTrigger.update)`); rAF tabanlı, layout thrashing yok. |
| Form | **React 19 `useActionState` + Server Action + Zod** | Doğrulama hem istemci hem sunucuda; server action rate-limit + honeypot + süre kontrolü. |
| E-posta | **Resend** (opsiyonel) | `RESEND_API_KEY` yoksa form doğrulaması çalışır, mesaj sunucu loguna düşer — site bozulmaz. |
| Deployment hedefi | Vercel / Node | Headers `next.config.ts` + middleware üzerinden. |

**Rendering stratejisi:** Ana sayfa tamamen statik (SSG). Tüm sahne içerikleri Server Component'lerde; yalnızca motion sarmalayıcıları ve form client'tır. JS bütçesi: landing < 150 KB gzipped.

**Video kararı:** v1'de harici video dosyası YOK — Scene 03 "dijital dünya" sahnesi `<canvas>` parçacık ağı ile (GPU-friendly, ~2 KB, mobilde otomatik azaltılır). Video altyapısı (`<VideoScene>` sözleşmesi: autoplay/muted/playsinline/poster/lazy) `docs/` notlarında tanımlı; gerçek footage geldiğinde eklenecek. Bu, "video yüklenemezse site bozulmaz" şartını yapısal olarak garanti eder.

## 2. Design System

**Yön:** Dark luxury + scrollytelling. Editorial tipografi, güçlü whitespace, tek accent.

**Token'lar** (`src/app/globals.css` `@theme`):

| Token | Değer | Kullanım |
|---|---|---|
| `--background` | `#0A0A0B` (near-black) | Zemin |
| `--surface` | `#111113` | Kart / panel |
| `--foreground` | `#F4F4F2` (off-white) | Ana metin |
| `--muted` | `#8A8A93` | İkincil metin |
| `--accent` | `#C8F04A` (lime) | Tek vurgu rengi: CTA, aktif durum, vurgu çizgileri |
| `--border` | `rgba(244,244,242,0.08)` | Hairline'lar |
| `--grid-line` | `rgba(244,244,242,0.03)` | Düşük opaklık ızgara dokusu |

**Tipografi:** Space Grotesk (display, 500–700) + Inter (body, 400–500). `display: swap`, yalnızca kritik ağırlıklar preload. Display ölçek: `clamp(2.5rem → 9rem)` fluid. Uppercase + negatif tracking büyük başlıklarda.

**Ölki & ritim:** 4px taban; bölümler arası `clamp(6rem, 14vh, 12rem)` ritmik boşluk — üniform padding yok.

## 3. Information Architecture (12 sahne)

| # | Sahne | Mekanik | Amaç |
|---|---|---|---|
| 01 | Intro brand reveal | Zamanlı giriş: ADRA → DİJİTAL → tagline → perde açılır | İlk 2.5 sn'de marka güveni |
| 02 | Statement | Pin + scroll ile scale 0.85→1.15, satır reveal | "Markaların dijital dünyasını tasarlıyoruz." |
| 03 | Digital World | Canvas parçacık ağı, pin; opacity/scale scrub | "Dijital varlık bir seçenek değil." |
| 04 | Web Experience | Sticky 3 aşamalı mock: wireframe → interface → polished | Dönüşüm hikâyesi |
| 05 | Brand Identity | Katmanlar scroll ile yığılır (logo→renk→tipografi→sosyal) | Sistematik marka kurma |
| 06 | Digital Growth | Metrik çerçeveleri stagger reveal (gerçek olmayan sayı UYDURULMAZ) | Büyüme disiplini |
| 07 | AI & Automation | SVG node-graph, path çizim scrub | Sistemsel zihin |
| 08 | The System | 4 servis node'u tek çekirdekte birleşir | "Ayrı değil, tek sistem" |
| 09 | Selected Experiments | Dürüst portföy: kavram projeler, "coming" rozetleri | Sahte referans yok |
| 10 | Process | Yatay scroll: Discover→Design→Build→Launch→Grow | Süreç şeffaflığı |
| 11 | CTA + Form | Büyük ifade + güvenli iletişim formu | Dönüşüm |
| 12 | Footer | Marka + servis dizini + iletişim | Kapanış |

**Navigation:** Sol ADRA (monogram a. ), sağ Work / Services / About / Contact. Scroll'da arka plan blur + hairline kazanır. Mobil: tam ekran minimal menü (stagger link reveal, body scroll kilidi, Escape ile kapanır).

## 4. Animation / Motion Plan

**Kural: Fast UI / Slow Cinematic.** UI geçişleri 150–250 ms (`--ease-out`: `cubic-bezier(0.22, 1, 0.36, 1)`); sahne geçişleri 0.8–1.4 s (`--ease-cinematic`: `expo.out`).

Her animasyonun kaydı: **trigger / duration / easing / purpose** — `src/lib/motion.ts` tek kaynak. Örnek:

| Animasyon | Trigger | Duration | Easing | Amaç |
|---|---|---|---|---|
| Intro perde | mount | 0.9s ×3 kademe | expo.inOut | Marka reveal |
| Word reveal | ScrollTrigger enter 80% | 0.7s, stagger 0.06 | power4.out | Başlık okunurluğunu sahnelendirmek |
| Statement scale | pin scrub | scrub: 1 | none (linear scrub) | Odak hissi |
| Magnetic hover | mousemove | 0.25s follow | power3.out | Etkileşim geri bildirimi |
| Node-graph draw | scrub | — | — | Sistemin "kurulma" hissi |

**Teknik disiplin:** Yalnızca `transform` + `opacity` + `clip-path` animasyonlu. `will-change` dar kullanım, sahne sonunda kaldırılır. Scroll dinleyicisi churn yok (ScrollTrigger + rAF). `prefers-reduced-motion`: tüm scrub/pin kapatılır, içerik tek karede statik görünür, Lenis devre dışı, intro 300 ms fade.

## 5. Performance Plan

- Hedef: LCP < 2.5 s, CLS < 0.1, INP < 200 ms; landing JS < 150 KB gz.
- Intro sritical path: sistem fontu fallback + `swap`; intro overlay `position: fixed`, layout'ı etkilemez.
- Sahneler RSC; motion kodu yalnızca client bundle'da. Canvas parçacıkları DPR≥2'de yarı çözünürlük + mobilde parçacık sayısı ~%40 azaltılır, sekme gizliyken rAF durur.
- Görsel yok denecek kadar az (tutar mock'ları CSS/SVG ile çizilir) → görsel optimizasyon borcu yok.
- Font: 2 aile, 4 ağırlık; `next/font` self-host + preload.

## 6. Security Plan

**Gerçekçi model (Bölüm 17):** Tarayıcıya giden kod gizlenemez; hedef — gizli bilgi ve kritik iş mantığı istemcide bulunmaz.

- Tüm secret'lar env'te, `NEXT_PUBLIC_` öneksiz → yalnızca sunucu.
- **CSP (uygulandı):** `src/middleware.ts` per-request nonce üretir; CSP request+response header'larına yazılır, Next.js script etiketlerine nonce enjekte eder (`'nonce-…' 'strict-dynamic'`). Bu modelin çalışması için ana sayfa `dynamic = "force-dynamic"` render edilir; statik varlıklar `_next/static` altında hard-cache'e devam eder. `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action 'self'`.
- **Headers:** HSTS (2 yıl, preload), `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (kamera/mikrofon/konum kapalı).
- **Form:** Zod şeması (istemci + sunucu aynı kaynak), honeypot alan, min. gönderim süresi (3 sn), IP başına dakikada 5 istem rate limit (in-memory LRU; çoklu instance'ta Redis'e taşınır), `noindex` robot Meta. CSRF: Next Server Actions origin-check ile doğal olarak korunur; ek `SameSite=Lax` cookie varsayılanı.
- XSS: Kullanıcı girdisi asla `dangerouslySetInnerHTML` ile basılmaz; e-posta gövdesi düz metin.
- Source map'ler prod'da kapalı (`productionBrowserSourceMaps` varsayılan false).

## 7. SEO Plan

- Metadata API: title template `%s | AdRa Dijital`, açıklama, canonical, OG + Twitter card (`summary_large_image`).
- JSON-LD: `Organization` + `WebSite` (tek script, sunucuda üretilir).
- `sitemap.ts` + `robots.ts` (form sayfası yok; tek kanonik URL).
- Semantic iskelet: tek `h1` (Statement sahnesinde marka ifadesi), sahne başlıkları `h2`, hiyerarşi bozulmaz. Landmark'lar: `header/nav/main/footer`, skip link.
- İçerik dili `tr`; `hreflang` tek dil için gereksiz.

## 8. Implementation Plan

```
Faz 1  Scaffold + tokens + fonts + globals          ✅
Faz 2  Security: next.config headers + middleware   ✅
Faz 3  Motion core (Lenis+GSAP sağlayıcısı, Reveal, Magnetic, Cursor, Progress)
Faz 4  Layout: Navbar + MobileMenu + Footer
Faz 5  Scenes 01–12 (bölüm bölüm, her biri kendi dosyası)
Faz 6  Form action + validation + rate limit
Faz 7  SEO: metadata, JSON-LD, sitemap, robots
Faz 8  a11y + reduced-motion pass
Faz 9  typecheck + build + self-review
```

Her faz mevcut projeyi bozmaz: proje greenfield; her sahne bağımsız dosya, tek `page.tsx` kompozisyonu.
