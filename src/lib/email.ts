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

/**
 * Where order notifications land.
 *
 * Deliberately separate from the address printed on the site: the public one is
 * whatever customers should write to, which may not exist as a mailbox yet, and
 * an order must never be sent to an inbox nobody reads.
 */
export function orderInbox(): string {
  return process.env.ORDER_EMAIL_TO ?? siteConfig.contact.email;
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
  html,
  replyTo,
}: {
  to?: string;
  subject: string;
  /**
   * Always required, even when html is given. It is what a text-only client
   * shows, what a screen reader reads cleanly, and what stops a spam filter
   * marking an HTML-only message down.
   */
  text: string;
  html?: string;
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
      ...(html ? { html } : {}),
      replyTo,
    });

    if (error) return { sent: false, reason: error.message };

    return { sent: true };
  } catch (cause) {
    return { sent: false, reason: (cause as Error).message };
  }
}
