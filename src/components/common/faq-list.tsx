import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Faq } from "@/lib/faqs";

// Native details/summary: keyboard and screen reader behaviour free, zero JS.
export function FaqList({
  faqs,
  className,
}: {
  faqs: Faq[];
  className?: string;
}) {
  return (
    <div className={cn("divide-y border-y", className)}>
      {faqs.map((faq) => (
        <details key={faq.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-heading text-lg marker:content-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            {faq.question}
            <Plus
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-brand transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
