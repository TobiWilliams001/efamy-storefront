import Link from "next/link";
import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <Section width="narrow">
      <h1 className="sr-only">Page not found</h1>
      <EmptyState
        icon={SearchX}
        title="We could not find that page"
        description="The link may be out of date, or the product may no longer be available."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="xl">
              <Link href={routes.shop}>Shop the range</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href={routes.home}>Go home</Link>
            </Button>
          </div>
        }
      />
    </Section>
  );
}
