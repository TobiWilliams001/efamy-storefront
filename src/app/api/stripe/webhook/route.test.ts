import { beforeEach, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";

const notifyOrder = vi.hoisted(() => vi.fn());
vi.mock("@/lib/order-email", () => ({ notifyOrder }));

/*
 * The route retrieves and updates the session, so the Stripe client is stubbed
 * to keep these tests hermetic. Signature verification still runs for real —
 * that is the part worth proving.
 */
const retrieve = vi.hoisted(() => vi.fn());
const update = vi.hoisted(() => vi.fn());

vi.mock("@/lib/stripe", async () => {
  const { default: RealStripe } = await import("stripe");
  const real = new RealStripe("sk_test_not_used_for_signature_checks");

  return {
    getStripe: () => ({
      webhooks: real.webhooks,
      checkout: { sessions: { retrieve, update } },
    }),
  };
});

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
  update.mockReset();
  retrieve.mockReset();
  // By default the session comes back with no notification flag set.
  retrieve.mockImplementation(async (id: string) => ({
    id,
    status: "complete",
    payment_status: "paid",
    amount_total: 820,
    metadata: {},
  }));
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

  it("does not email twice when Stripe has already recorded the notification", async () => {
    // A redelivery landing on a cold instance: the in-memory cache is empty,
    // so only the flag on the session can prevent a second email.
    retrieve.mockResolvedValueOnce({
      id: "cs_test_123",
      status: "complete",
      payment_status: "paid",
      metadata: { efamy_notified: "1" },
    });

    const response = await POST(signed(event("evt_cold_instance")));

    expect(await response.json()).toMatchObject({ duplicate: true });
    expect(notifyOrder).not.toHaveBeenCalled();
  });

  it("records the notification on the session after sending", async () => {
    await POST(signed(event("evt_marks_flag")));

    expect(notifyOrder).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(
      "cs_test_123",
      expect.objectContaining({
        metadata: expect.objectContaining({ efamy_notified: "1" }),
      }),
    );
  });

  it("still delivers the order when the flag cannot be written", async () => {
    update.mockRejectedValueOnce(new Error("stripe unavailable"));

    const response = await POST(signed(event("evt_flag_fails")));

    // A duplicate email is a smaller failure than an order nobody hears about.
    expect(notifyOrder).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });
});
