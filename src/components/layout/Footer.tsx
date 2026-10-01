import { siteConfig } from "@/lib/site";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { RevealText } from "@/components/motion/RevealText";

const SERVICE_INDEX = [
  { title: "Web", items: ["Web Experience", "E-commerce", "Web Apps"] },
  { title: "Brand", items: ["Identity", "Logo", "Social Design"] },
  { title: "Digital", items: ["Marketing", "SEO", "Content"] },
  { title: "AI", items: ["Automation", "Chatbots", "Integrations"] },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10 md:pt-28">
        <RevealText
          as="p"
          mode="clip"
          text="ADRA DİJİTAL"
          className="display-xl text-foreground"
        />

        <div className="mt-16 grid grid-cols-2 gap-10 border-t border-border pt-12 md:grid-cols-5">
          {SERVICE_INDEX.map((group) => (
            <div key={group.title}>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
              İletişim
            </h2>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="mt-4 inline-block text-sm text-muted transition-colors hover:text-accent"
            >
              {siteConfig.contactEmail}
            </a>
            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <AnchorLink
                  href="#contact"
                  className="text-muted transition-colors hover:text-foreground"
                >
                  Projenizi Konuşalım
                </AnchorLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {siteConfig.name}. Tüm hakları saklıdır.</p>
          <p className="uppercase tracking-[0.24em]">Web · Brand · Digital · AI</p>
        </div>
      </div>
    </footer>
  );
}
