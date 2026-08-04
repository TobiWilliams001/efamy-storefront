"use server";

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
    // Honeypot filled — accept silently so bots learn nothing.
    return { status: "success" };
  }

  if (!process.env.RESEND_API_KEY) {
    return {
      status: "error",
      message:
        "Our contact form is not connected yet. Please email us directly and we will reply as soon as we can.",
    };
  }

  // TODO: send via Resend once the domain is verified.
  return {
    status: "error",
    message:
      "Our contact form is not connected yet. Please email us directly and we will reply as soon as we can.",
  };
}
