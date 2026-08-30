"use server";

import { siteConfig } from "@/config/site";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { sendEmail } from "@/lib/email";

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
      message: "Please check the details you entered and try again.",
    };
  }

  if (parsed.data.website) {
    // Honeypot filled, so accept silently and let bots learn nothing.
    return { status: "success" };
  }

  const { name, email, topic, message } = parsed.data;

  const result = await sendEmail({
    subject: `${topic}: ${name}`,
    text: [
      `${topic} from the website`,
      "",
      `From: ${name} <${email}>`,
      "",
      message,
    ].join("\n"),
    // Hitting reply answers the customer directly.
    replyTo: email,
  });

  if (!result.sent) {
    console.error("Contact message not sent:", result.reason, {
      name,
      email,
      topic,
    });

    // The customer gets a route that works, not an explanation of our plumbing.
    return {
      status: "error",
      message: `Please email us at ${siteConfig.contact.email} and we will come back to you.`,
    };
  }

  return { status: "success" };
}
