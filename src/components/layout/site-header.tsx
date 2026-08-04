import { Leaf, MapPin, Utensils } from "lucide-react";

import { CartBadge } from "@/components/cart/cart-badge";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const claims = [
  { icon: MapPin, label: "Made in the UK" },
  { icon: Leaf, label: "No artificial preservatives" },
  { icon: Utensils, label: "Authentic Ghanaian recipes" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      {/* Bookends the maroon footer, and puts the reasons to trust us first. */}
      <div className="hidden bg-ink text-ink-foreground md:block">
        <Container>
          <div className="flex h-9 items-center justify-between gap-6 text-xs">
            <ul className="flex items-center gap-7">
              {claims.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon
                    aria-hidden="true"
                    className="size-3.5 text-gold"
                    strokeWidth={1.75}
                  />
                  {label}
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-ink-muted underline-offset-4 transition-colors hover:text-ink-foreground hover:underline"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </Container>
      </div>

      <div className="border-b border-neutral-200/70 bg-background/85 backdrop-blur-md">
        <Container>
          <div className="relative flex h-16 items-center justify-between gap-6 lg:h-20">
            <Logo />

            <nav
              aria-label="Main"
              className="absolute left-1/2 hidden -translate-x-1/2 md:block"
            >
              <ul className="flex items-center gap-9">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      className="relative py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      activeClassName="text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gold after:content-['']"
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-1">
              <CartBadge />
              <MobileNav />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
