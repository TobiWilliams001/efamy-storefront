import { cn } from "@/lib/utils";

import { Container, type ContainerWidth } from "./container";

/** 72 / 96 / 120px at mobile / tablet / desktop, per the design system. */
const sectionSpacing = {
  sm: "py-12 sm:py-16 lg:py-20",
  default: "py-18 sm:py-24 lg:py-30",
  lg: "py-24 sm:py-30 lg:py-40",
} as const;

const sectionSurfaces = {
  default: "bg-background",
  muted: "bg-neutral-100",
  clay: "bg-clay/40",
} as const;

type SectionProps = Omit<React.ComponentProps<"section">, "children"> & {
  spacing?: keyof typeof sectionSpacing;
  surface?: keyof typeof sectionSurfaces;
  width?: ContainerWidth;
  bleed?: boolean;
  children: React.ReactNode;
};

export function Section({
  className,
  spacing = "default",
  surface = "default",
  width = "default",
  bleed = false,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        sectionSpacing[spacing],
        sectionSurfaces[surface],
        className,
      )}
      {...props}
    >
      {bleed ? children : <Container width={width}>{children}</Container>}
    </section>
  );
}

type SectionHeaderProps = Omit<React.ComponentProps<"div">, "title"> & {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "start" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  as: Heading = "h2",
  align = "start",
  className,
  ...props
}: SectionHeaderProps) {
  const centred = align === "center";

  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 sm:mb-12",
        centred
          ? "items-center text-center"
          : action && "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className={cn("max-w-2xl", centred && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cn(
              "flex items-center gap-3 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase",
              centred && "justify-center",
            )}
          >
            <span
              aria-hidden="true"
              className="h-px w-6 shrink-0 bg-neutral-300"
            />
            {eyebrow}
          </p>
        ) : null}
        <Heading
          className={cn(
            "text-balance",
            eyebrow && "mt-4",
            Heading === "h1"
              ? "text-4xl sm:text-5xl lg:text-[3.25rem]"
              : "text-3xl sm:text-4xl lg:text-[2.75rem]",
          )}
        >
          {title}
        </Heading>
        {centred ? (
          <span
            aria-hidden="true"
            className="mx-auto mt-5 block h-px w-16 bg-gold"
          />
        ) : null}
        {description ? (
          <p className="mt-5 text-pretty text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
