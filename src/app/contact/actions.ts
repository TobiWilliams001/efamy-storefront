"use server";

import { siteConfig } from "@/config/site";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";

export type ContactResult =
  { status: "success" } | { status: "error"; message: string };

export async function submitContact(
  input: ContactInput,
): Promise<ContactResult> {
  // Re-validated here because anything arriving from the browser is untrusted,
  // including a payload that skipped the form entirely.
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Some details were not valid. Please check the form and retry.",
    };
  }

  if (parsed.data.website) {
    // Honeypot filled, so accept silently and let bots learn nothing.
    return { status: "success" };
  }

  // Sending is wired up once RESEND_API_KEY exists; until then the customer
  // gets the address rather than an explanation of our plumbing.
  return {
    status: "error",
    message: `Please email us at ${siteConfig.contact.email} and we will reply within two working days.`,
  };
}
