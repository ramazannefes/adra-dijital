import { siteConfig } from "@/lib/site";

/**
 * Structured data — sunucuda statik üretilir, kullanıcı girdisi içermez.
 * Organization + WebSite tek script bloğunda (@graph).
 */
export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        email: siteConfig.contactEmail,
        foundingDate: String(siteConfig.foundedYear),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "tr-TR",
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };
}
