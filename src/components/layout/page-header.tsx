import Link from "next/link";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type Crumb = { name: string; href?: string };

type PageHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumb?: Crumb[];
  action?: React.ReactNode;
  align?: "start" | "center";
  /** "ink" for the pages that should open with weight rather than warmth. */
  tone?: "warm" | "ink";
};

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
  action,
  align = "start",
  tone = "warm",
}: PageHeaderProps) {
  const centred = align === "center";
  const onInk = tone === "ink";

  return (
    <section
      className={cn(
        "border-b",
        onInk
          ? "border-transparent bg-ink text-ink-foreground"
          : "border-neutral-200 bg-linear-to-b from-clay/35 to-background",
      )}
    >
      <Container className="py-12 sm:py-16 lg:py-20">
        {breadcrumb?.length ? (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol
              className={cn(
                "flex flex-wrap items-center gap-2 text-sm",
                onInk ? "text-ink-muted" : "text-muted-foreground",
                centred && "justify-center",
              )}
            >
              {breadcrumb.map((crumb, index) => (
                <li key={crumb.name} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span aria-hidden="true" className="opacity-50">
                      /
                    </span>
                  ) : null}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="underline-offset-4 hover:underline"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span
                      aria-current="page"
                      className={
                        onInk ? "text-ink-foreground" : "text-foreground"
                      }
                    >
                      {crumb.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div
          className={cn(
            "flex flex-col gap-8",
            !centred && action && "sm:flex-row sm:items-end sm:justify-between",
          )}
        >
          <div className={cn("max-w-2xl", centred && "mx-auto text-center")}>
            {eyebrow ? (
              <p
                className={cn(
                  "flex items-center gap-3 text-xs font-medium tracking-[0.18em] uppercase",
                  centred && "justify-center",
                  onInk ? "text-gold" : "text-muted-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px w-6 shrink-0",
                    onInk ? "bg-gold/50" : "bg-neutral-300",
                  )}
                />
                {eyebrow}
              </p>
            ) : null}

            <h1
              className={cn(
                "text-4xl text-balance sm:text-5xl lg:text-[3.25rem]",
                eyebrow && "mt-5",
              )}
            >
              {title}
            </h1>

            <span
              aria-hidden="true"
              className={cn(
                "mt-6 block h-px w-16 bg-gold",
                centred && "mx-auto",
              )}
            />

            {description ? (
              <p
                className={cn(
                  "mt-6 text-pretty sm:text-lg",
                  onInk ? "text-ink-muted" : "text-muted-foreground",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>

          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </Container>
    </section>
  );
}
