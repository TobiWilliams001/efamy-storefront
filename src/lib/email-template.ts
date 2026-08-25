import "server-only";

import { siteConfig } from "@/config/site";

/*
 * Email HTML is not web HTML. Outlook still renders through Word, Gmail strips
 * <style> blocks and anything it does not recognise, and neither flexbox nor
 * grid can be relied on. So: tables, inline styles, one 600px column, and no
 * external assets. Every email also carries a plain text part, which is what
 * some people read and what keeps the message out of spam filters that
 * distrust HTML-only mail.
 */

const BRAND = "#8b2d2d";
const INK = "#4a1414";
const GOLD = "#cb9954";
const TEXT = "#242424";
const MUTED = "#676159";
const LINE = "#e5e0d8";
const PAPER = "#faf8f3";

/** Anything from Stripe or a customer is untrusted text, not markup. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type EmailRow = { label: string; value: string; strong?: boolean };

export function itemRows(
  items: { quantity: number; description: string; amount: string }[],
): string {
  if (items.length === 0) return "";

  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${LINE};color:${TEXT};font-size:15px;line-height:1.5;">
          <span style="display:inline-block;min-width:28px;color:${MUTED};">${item.quantity}&times;</span>
          ${escapeHtml(item.description)}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid ${LINE};color:${TEXT};font-size:15px;text-align:right;white-space:nowrap;">
          ${escapeHtml(item.amount)}
        </td>
      </tr>`,
    )
    .join("");
}

export function totalRows(rows: EmailRow[]): string {
  return rows
    .map(
      (row) => `
      <tr>
        <td style="padding:6px 0;color:${row.strong ? TEXT : MUTED};font-size:${row.strong ? "17px" : "15px"};font-weight:${row.strong ? "600" : "400"};">
          ${escapeHtml(row.label)}
        </td>
        <td style="padding:6px 0;color:${row.strong ? TEXT : MUTED};font-size:${row.strong ? "17px" : "15px"};font-weight:${row.strong ? "600" : "400"};text-align:right;white-space:nowrap;">
          ${escapeHtml(row.value)}
        </td>
      </tr>`,
    )
    .join("");
}

export function panel(title: string, body: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
      <tr>
        <td style="background:${PAPER};border-radius:8px;padding:20px 22px;">
          <p style="margin:0 0 8px;color:${MUTED};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">
            ${escapeHtml(title)}
          </p>
          <div style="color:${TEXT};font-size:15px;line-height:1.6;">${body}</div>
        </td>
      </tr>
    </table>`;
}

/**
 * The shell every email shares.
 *
 * `preheader` is the grey line a client shows next to the subject in the inbox
 * list. Left unset it scrapes whatever text comes first, which is usually the
 * logo alt text and tells the reader nothing.
 */
export function layout({
  heading,
  preheader,
  intro,
  content,
  footnote,
}: {
  heading: string;
  preheader: string;
  intro?: string;
  content: string;
  footnote?: string;
}): string {
  const { legalName, address, contact } = siteConfig;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">

          <tr>
            <td style="background:${INK};border-radius:8px 8px 0 0;padding:26px 32px;">
              <p style="margin:0;color:#ffffff;font-family:Georgia,'Times New Roman',serif;font-size:26px;letter-spacing:0.02em;">
                efamy
              </p>
              <p style="margin:4px 0 0;color:${GOLD};font-size:12px;letter-spacing:0.14em;text-transform:uppercase;">
                ${escapeHtml(siteConfig.tagline)}
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
              <h1 style="margin:0;color:${BRAND};font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;">
                ${escapeHtml(heading)}
              </h1>
              <div style="height:2px;width:44px;background:${GOLD};margin:14px 0 0;"></div>
              ${intro ? `<p style="margin:20px 0 0;color:${TEXT};font-size:16px;line-height:1.6;">${intro}</p>` : ""}
              ${content}
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;border-radius:0 0 8px 8px;border-top:1px solid ${LINE};padding:24px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
              ${footnote ? `<p style="margin:0 0 14px;color:${MUTED};font-size:14px;line-height:1.6;">${footnote}</p>` : ""}
              <p style="margin:0;color:${MUTED};font-size:12px;line-height:1.6;">
                ${escapeHtml(legalName)}, ${escapeHtml(address.line1)}, ${escapeHtml(address.town)} ${escapeHtml(address.postcode)}<br>
                <a href="mailto:${escapeHtml(contact.email)}" style="color:${BRAND};">${escapeHtml(contact.email)}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
