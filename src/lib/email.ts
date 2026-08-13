import "server-only";

import { Resend } from "resend";

import { siteConfig } from "@/config/site";

/**
 * Lazy, like the Stripe and Sanity clients. Constructing at module scope breaks
 * every build where the key is absent, which is every preview deploy until one
 * is set. That has already broken a production deploy on this project once.
 */
let client: Resend | undefined;

function getResend(): Resend | undefined {
  const key = process.env.RESEND_API_KEY;
  if (!key) return undefined;
  if (!client) client = new Resend(key);
  return client;
}

/**
 * Who mail comes from. Must sit on a domain verified in Resend or every send is
 * rejected. Defaults to Resend's shared sending domain so the plumbing can be
 * tested before anyone touches Efamy's DNS.
 */
function sender(): string {
  return process.env.EMAIL_FROM ?? "Efamy <onboarding@resend.dev>";
}

export type SendResult = { sent: boolean; reason?: string };

/**
 * Sends an email, or reports why it could not.
 *
 * Never throws. Every caller sits in a path where the customer has already been
 * served — a payment taken, a form submitted — and a mail failure must not undo
 * that.
 */
export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to?: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<SendResult> {
  const resend = getResend();

  if (!resend) return { sent: false, reason: "RESEND_API_KEY is not set" };

  try {
    const { error } = await resend.emails.send({
      from: sender(),
      to: [to ?? siteConfig.contact.email],
      subject,
      text,
      replyTo,
    });

    if (error) return { sent: false, reason: error.message };

    return { sent: true };
  } catch (cause) {
    return { sent: false, reason: (cause as Error).message };
  }
}
