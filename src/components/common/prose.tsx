import { cn } from "@/lib/utils";

/**
 * Long-form text. Styles headings, paragraphs and lists by element so page
 * content stays readable markup rather than a wall of utility classes, and so
 * it keeps working when this content moves to the CMS.
 */
export function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-none text-pretty",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:first:mt-0",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-medium",
        "[&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground",
        "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-muted-foreground",
        "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:text-muted-foreground",
        "[&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-foreground",
        "[&_strong]:font-medium [&_strong]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
