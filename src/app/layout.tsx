import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { organizationSchema } from "@/lib/seo/schemas";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "AdRa Dijital — Markaların Dijital Dünyasını Tasarlıyoruz",
    template: "%s | AdRa Dijital",
  },
  description:
    "AdRa Dijital; web deneyimi, marka kimliği, dijital pazarlama ve yapay zekâ otomasyonunu tek bir sistem olarak tasarlayan premium dijital teknoloji şirketidir.",
  keywords: [
    "dijital ajans",
    "web tasarım",
    "marka kimliği",
    "dijital pazarlama",
    "yapay zekâ çözümleri",
    "otomasyon",
    "AdRa Dijital",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteConfig.url,
    siteName: "AdRa Dijital",
    title: "AdRa Dijital — Markaların Dijital Dünyasını Tasarlıyoruz",
    description:
      "Web deneyimi, marka, dijital büyüme ve yapay zekâ otomasyonu; tek bir dijital sistem olarak.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdRa Dijital",
    description:
      "Web deneyimi, marka, dijital büyüme ve yapay zekâ otomasyonu; tek bir dijital sistem olarak.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

/**
 * Nonce'lu CSP middleware'da per-request üretildiği için HTML'in de
 * her istekte nonce ile render edilmesi gerekir (Next.js resmî modeli).
 * Statik varlıklar (_next/static) caching'den tam yararlanmaya devam eder.
 */
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-noise">
        <a href="#main" className="skip-link">
          İçeriğe geç
        </a>
        <SmoothScrollProvider>
          <Navbar />
          <ScrollProgress />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScrollProvider>
        <script
          type="application/ld+json"
          // Statik, sunucuda üretilmiş schema — kullanıcı girdisi içermez.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </body>
    </html>
  );
}
