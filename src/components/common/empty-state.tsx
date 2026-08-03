import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center",
        className,
      )}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="mb-4 size-8 text-muted-foreground"
          strokeWidth={1.5}
        />
      ) : null}
      <p className="font-heading text-lg font-medium">{title}</p>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
