"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { NavLink } from "@/components/layout/nav-link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-xl" className="md:hidden">
          <Menu />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">
            {siteConfig.name}
          </SheetTitle>
        </SheetHeader>
        <nav className="px-4 pb-8">
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  onNavigate={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b text-lg text-muted-foreground"
                  activeClassName="text-foreground font-medium"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
