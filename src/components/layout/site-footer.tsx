import Link from "next/link";
import { Mail } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

// Lucide v1 removed brand icons, so these are text links.
const socialLinks = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();
  const social = socialLinks.filter(({ key }) => siteConfig.social[key]);

  return (
    <footer className="mt-auto border-t bg-muted/40">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm text-pretty text-muted-foreground">
              {siteConfig.description}
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4" aria-hidden="true" />
              {siteConfig.contact.email}
            </a>
            {social.length > 0 ? (
              <ul className="mt-4 flex items-center gap-5">
                {social.map(({ key, label }) => (
                  <li key={key}>
                    <a
                      href={siteConfig.social[key]}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="font-heading text-sm font-medium">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <p className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          © {year} {siteConfig.legalName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
