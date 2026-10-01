import type { NextConfig } from "next";

/**
 * Statik güvenlik başlıkları.
 * CSP burada DEĞİLDİR: nonce per-request olduğu için CSP middleware'da
 * (src/middleware.ts) üretilir ve Next.js script etiketlerine nonce ekler.
 * style-src 'unsafe-inline': Tailwind'in derleme zamanı <style> çıktısı ve
 * GSAP inline transform'ları için gereklidir.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Kullanıcı klasöründeki yabancı lockfile'lar workspace kökünü şaşırtmasın.
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
