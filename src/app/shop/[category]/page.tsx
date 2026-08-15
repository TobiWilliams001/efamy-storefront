import { permanentRedirect } from "next/navigation";

import { routes } from "@/lib/routes";

/**
 * Categories used to have pages of their own. They are now a filter on the
 * shop, so anything still pointing here is sent to the filtered shop rather
 * than a dead end.
 */
export default async function CategoryRedirect({
  params,
}: PageProps<"/shop/[category]">) {
  const { category } = await params;
  permanentRedirect(routes.category(category));
}
