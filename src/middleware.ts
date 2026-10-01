import { NextRequest, NextResponse } from "next/server";

/**
 * Per-request CSP nonce üretimi (Next.js resmî modeli).
 * - nonce her istekte yenilenir; CSP hem request hem response header'ına
 *   yazılır. Next.js, request'teki CSP başlığından nonce'u okuyup kendi
 *   script etiketlerine ekler (dinamik render'da).
 * - 'strict-dynamic' sayesinde nonce'lı giriş script'leri diğer chunk'ları
 *   güvenli biçimde yükler; host allowlist'e gerek kalmaz.
 * - Statik varlıklar matcher ile bu pipeline'a girmez.
 */
export function middleware(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-nonce", nonce);
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-dns-prefetch-control", "off");
  return response;
}

export const config = {
  matcher: [
    // Statik dosyalar ve iç kaynaklar nonce pipeline'ına girmez.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif|woff2?)$).*)",
  ],
};
