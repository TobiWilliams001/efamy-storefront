import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Falls back to the wordmark set in type until real logo files exist. Drop the
 * assets into public/logos and fill in siteConfig.logo to switch over.
 */
export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  /** "dark" for ink on light, "light" for the maroon footer. */
  variant?: "dark" | "light";
}) {
  const asset = siteConfig.logo[variant];

  return (
    <Link
      href={routes.home}
      aria-label={`${siteConfig.name}, ${siteConfig.tagline}`}
      className={cn("inline-flex items-center", className)}
    >
      {asset ? (
        <Image
          src={asset.src}
          alt=""
          width={asset.width}
          height={asset.height}
          priority
          className="h-8 w-auto lg:h-9"
        />
      ) : (
        <span
          aria-hidden="true"
          className="font-heading text-2xl font-semibold tracking-tight"
        >
          {siteConfig.name}
          <span className="text-gold">.</span>
        </span>
      )}
    </Link>
  );
}
