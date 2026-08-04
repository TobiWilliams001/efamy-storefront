import { cn } from "@/lib/utils";

const containerWidths = {
  /** 720px reading measure. */
  prose: "max-w-180",
  narrow: "max-w-3xl",
  /** 1280px site maximum. */
  default: "max-w-7xl",
  wide: "max-w-360",
} as const;

export type ContainerWidth = keyof typeof containerWidths;

type ContainerProps = React.ComponentProps<"div"> & {
  width?: ContainerWidth;
};

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
