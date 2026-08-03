import { CartBadge } from "@/components/cart/cart-badge";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { Container } from "@/components/layout/container";
import { mainNav } from "@/config/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6 lg:h-20">
          <Logo />

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    activeClassName="text-foreground font-medium"
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
