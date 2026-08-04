import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function CallToAction() {
  return (
    <Section surface="clay" spacing="sm" width="narrow">
      <div className="text-center">
        <h2 className="text-3xl text-balance sm:text-4xl">
          Not sure where to start?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty">
          Every sauce comes in mild or hot. Tell us how you cook and we will
          point you to the right jar.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="xl">
            <Link href={routes.shop}>Shop all products</Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href={routes.contact}>Ask a question</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
