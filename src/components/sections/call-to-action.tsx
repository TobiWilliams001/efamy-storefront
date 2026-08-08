import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function CallToAction() {
  return (
    <Section surface="clay" spacing="sm" width="narrow">
      <div className="text-center">
        <h2 className="text-3xl text-balance sm:text-4xl">
          Cook something worth sharing
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty">
          The full range ships across the UK. If you would rather ask a person
          first, we are happy to help.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="xl">
            <Link href={routes.shop}>Shop the range</Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href={routes.contact}>Ask a question</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
