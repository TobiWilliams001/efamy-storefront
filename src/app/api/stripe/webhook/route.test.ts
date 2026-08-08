import { beforeEach, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";

const notifyOrder = vi.hoisted(() => vi.fn());
vi.mock("@/lib/order-email", () => ({ notifyOrder }));

const SECRET = "whsec_test_secret_for_signature_verification";

process.env.STRIPE_SECRET_KEY = "sk_test_not_used_for_signature_checks";
process.env.STRIPE_WEBHOOK_SECRET = SECRET;

const { POST } = await import("@/app/api/stripe/webhook/route");

const stripe = new Stripe("sk_test_not_used_for_signature_checks");

function event(id: string, overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    id,
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_123",
        object: "checkout.session",
        status: "complete",
        payment_status: "paid",
        amount_total: 820,
        ...overrides,
      },
    },
  });
}

function signed(payload: string) {
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: SECRET,
  });

  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": signature },
    body: payload,
  });
}

beforeEach(() => {
  notifyOrder.mockReset();
});

describe("stripe webhook", () => {
  it("rejects a request with no signature", async () => {
    const response = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: event("evt_nosig"),
      }),
    );

    expect(response.status).toBe(400);
    expect(notifyOrder).not.toHaveBeenCalled();
  });

  it("rejects a forged signature", async () => {
    const response = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "t=1,v1=deadbeef" },
        body: event("evt_forged"),
      }),
    );

    expect(response.status).toBe(400);
    expect(notifyOrder).not.toHaveBeenCalled();
  });

  it("rejects a payload altered after signing", async () => {
    const payload = event("evt_tampered");
    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: SECRET,
    });

    const response = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": signature },
        body: payload.replace('"amount_total":820', '"amount_total":1'),
      }),
    );

    expect(response.status).toBe(400);
    expect(notifyOrder).not.toHaveBeenCalled();
  });

  it("accepts a genuine paid session", async () => {
    const response = await POST(signed(event("evt_paid")));

    expect(response.status).toBe(200);
    expect(notifyOrder).toHaveBeenCalledTimes(1);
  });

  it("ignores a redelivery of an event it has already handled", async () => {
    await POST(signed(event("evt_repeat")));
    const second = await POST(signed(event("evt_repeat")));

    expect(second.status).toBe(200);
    expect(await second.json()).toMatchObject({ duplicate: true });
    expect(notifyOrder).toHaveBeenCalledTimes(1);
  });

  it("does not act on a session that completed without payment", async () => {
    await POST(signed(event("evt_unpaid", { payment_status: "unpaid" })));

    expect(notifyOrder).not.toHaveBeenCalled();
  });

  it("still acknowledges when the notification throws, so Stripe stops retrying", async () => {
    notifyOrder.mockRejectedValueOnce(new Error("smtp down"));

    const response = await POST(signed(event("evt_email_fails")));

    expect(response.status).toBe(200);
  });
});
