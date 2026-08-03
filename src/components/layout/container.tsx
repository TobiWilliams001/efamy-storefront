import { cn } from "@/lib/utils";

const containerWidths = {
  /** Long-form reading: About, policies, article bodies. */
  prose: "max-w-2xl",
  /** Forms and focused single-column flows: contact, checkout. */
  narrow: "max-w-3xl",
  /** The site default — product grids, most page content. */
  default: "max-w-6xl",
  /** Edge-to-edge feature areas: hero, full-bleed imagery. */
  wide: "max-w-[90rem]",
} as const;

export type ContainerWidth = keyof typeof containerWidths;

type ContainerProps = React.ComponentProps<"div"> & {
  width?: ContainerWidth;
};

/**
 * The single source of horizontal rhythm. Every page uses this rather than
 * hand-rolling `max-w-* px-*`, which is where layout drift usually starts.
 */
export function Container({
  className,
  width = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        containerWidths[width],
        className,
      )}
      {...props}
    />
  );
}
