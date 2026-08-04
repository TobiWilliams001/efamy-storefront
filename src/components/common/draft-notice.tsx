import { TriangleAlert } from "lucide-react";

/**
 * Marks placeholder legal copy. This must be removed, along with the copy it
 * wraps, before the site goes live.
 */
export function DraftNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 flex gap-3 rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm">
      <TriangleAlert
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-brand"
      />
      <p className="text-foreground">{children}</p>
    </div>
  );
}
