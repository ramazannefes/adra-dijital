/**
 * Marka + site yapılandırması. İçeriklerin tek kaynağı.
 * Environment değişkenleri build zamanında okunur; secret içermez.
 */
const SITE_URL = process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://adradijital.com";
const CONTACT_EMAIL =
  process.env["NEXT_PUBLIC_CONTACT_EMAIL"] ?? "merhaba@adradijital.com";

export const siteConfig = {
  name: "AdRa Dijital",
  shortName: "ADRA",
  url: SITE_URL,
  contactEmail: CONTACT_EMAIL,
  description:
    "Web deneyimi, marka kimliği, dijital büyüme ve yapay zekâ otomasyonunu tek bir sistem olarak tasarlıyoruz.",
  tagline: "Markaların dijital dünyasını tasarlıyoruz.",
  foundedYear: 2026,
  navLinks: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ] as const,
} as const;

export type NavLink = (typeof siteConfig.navLinks)[number];
