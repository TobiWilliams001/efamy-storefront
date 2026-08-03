"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onNavigate?: () => void;
};

export function NavLink({
  href,
  children,
  className,
  activeClassName = "text-foreground",
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  );
}
