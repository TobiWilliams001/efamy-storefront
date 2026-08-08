"use server";

import { z } from "zod";

import { siteConfig } from "@/config/site";

const schema = z.object({
  email: z.email().max(254),
  /** Hidden field. Real people leave it empty; bots fill it in. */
  website: z.string().max(0).optional(),
});

export type SubscribeResult =
  { status: "success" } | { status: "error"; message: string };

export async function subscribe(formData: FormData): Promise<SubscribeResult> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    website: formData.get("website") ?? undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (parsed.data.website) {
    return { status: "success" };
  }

  // No mailing list provider is connected yet. Rather than accept an address
  // and drop it, we hand back one that reaches a person.
  return {
    status: "error",
    message: `Our mailing list is not open yet. Email ${siteConfig.contact.email} and we will add you.`,
  };
}
