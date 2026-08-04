import Link from "next/link";

import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={routes.home}
      className={cn(
        "font-heading text-2xl font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      {siteConfig.name}
      <span className="text-brand">.</span>
      <span className="sr-only">, {siteConfig.tagline}</span>
    </Link>
  );
}
