import { CartBadge } from "@/components/cart/cart-badge";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { mainNav } from "@/config/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-neutral-200/70 bg-background/85 backdrop-blur-md">
        <Container>
          <div className="relative flex h-16 items-center justify-between gap-6 lg:h-20">
            <Logo />

            <nav
              aria-label="Main"
              className="absolute left-1/2 hidden -translate-x-1/2 md:block"
            >
              <ul className="flex items-center gap-8 lg:gap-10">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      className="relative py-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-brand"
                      activeClassName="text-brand after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gold after:content-['']"
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
