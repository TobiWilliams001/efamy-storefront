import { Rule } from "@/components/layout/rule";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  align?: "start" | "center";
  /** "ink" for the pages that should open with weight rather than warmth. */
  tone?: "warm" | "ink";
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  tone = "warm",
}: PageHeaderProps) {
  const centred = align === "center";
  const onInk = tone === "ink";

  return (
    <section
      className={cn(
        onInk
          ? "bg-ink text-ink-foreground"
          : "bg-linear-to-b from-clay/35 to-background",
      )}
    >
      <Container className="pt-12 pb-9 sm:pt-16 sm:pb-11 lg:pt-20 lg:pb-12">
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
                "display-title text-3xl text-balance sm:text-4xl lg:text-5xl",
                eyebrow && "mt-5",
                onInk ? "text-white" : "text-brand",
              )}
            >
              {title}
            </h1>

            <Rule
              className={cn("mt-6", centred ? "mx-auto" : "justify-start")}
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
