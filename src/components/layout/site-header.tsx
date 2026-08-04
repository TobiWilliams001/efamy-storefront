import { CartBadge } from "@/components/cart/cart-badge";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { Container } from "@/components/layout/container";
import { mainNav } from "@/config/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-background/85 backdrop-blur-md">
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
                    className="text-sm text-muted-foreground underline-offset-8 transition-colors hover:text-foreground"
                    activeClassName="text-foreground underline decoration-brand decoration-2"
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
    </header>
  );
}
