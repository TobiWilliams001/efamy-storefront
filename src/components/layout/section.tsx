import { cn } from "@/lib/utils";

import { Container, type ContainerWidth } from "./container";

const sectionSpacing = {
  sm: "py-10 sm:py-14",
  default: "py-14 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-28 lg:py-32",
} as const;

const sectionSurfaces = {
  default: "bg-background",
  muted: "bg-muted/50",
  accent: "bg-accent text-accent-foreground",
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
  eyebrow?: string;
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
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
        ) : null}
        <Heading
          className={cn(
            "text-balance",
            eyebrow && "mt-3",
            Heading === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
