"use client";

import { usePathname } from "next/navigation";

import { CartBadge } from "@/components/cart/cart-badge";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { mainNav } from "@/config/navigation";
import { routes } from "@/lib/routes";
import { useScrolled } from "@/lib/use-scrolled";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled();

  /*
   * The home hero is a dark photograph that runs up behind the header, so the
   * bar starts transparent and only takes a background once it has scrolled
   * off the image. Every other route opens on a light page and needs the solid
   * bar from the first pixel.
   */
  /* Routes whose first section is the dark photographic hero. */
  const overlay =
    (pathname === routes.home || pathname === routes.about) && !scrolled;
  const onInk = overlay;

  return (
    <header className="sticky top-0 z-40">
      <div
        className={cn(
          "transition-colors duration-200",
          overlay
            ? "bg-transparent"
            : "border-b border-neutral-200/70 bg-background/85 backdrop-blur-md",
        )}
      >
        <Container>
          <div className="relative flex h-16 items-center justify-between gap-6 lg:h-20">
            <Logo variant={onInk ? "light" : "dark"} />

            <nav
              aria-label="Main"
              className="absolute left-1/2 hidden -translate-x-1/2 md:block"
            >
              <ul className="flex items-center gap-8 lg:gap-10">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      className={cn(
                        "relative py-2 text-xs font-semibold tracking-[0.14em] uppercase transition-colors",
                        onInk
                          ? "text-white/80 hover:text-white"
                          : "text-muted-foreground hover:text-brand",
                      )}
                      activeClassName={cn(
                        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gold after:content-['']",
                        onInk ? "text-white" : "text-brand",
                      )}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div
              className={cn(
                "flex items-center gap-1",
                onInk && "text-white [&_svg]:text-white",
              )}
            >
              <CartBadge />
              <MobileNav />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
