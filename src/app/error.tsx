"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with the error monitoring service once one is configured.
    console.error(error);
  }, [error]);

  return (
    <Section width="narrow">
      <h1 className="sr-only">Something went wrong</h1>
      <EmptyState
        icon={TriangleAlert}
        title="Something went wrong"
        description="This is on us, not you. Try again, and if it keeps happening please get in touch."
        action={
          <Button size="xl" onClick={reset}>
            Try again
          </Button>
        }
      />
    </Section>
  );
}
