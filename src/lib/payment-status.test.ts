import { beforeEach, describe, expect, it, vi } from "vitest";

const retrieve = vi.hoisted(() => vi.fn());

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({ checkout: { sessions: { retrieve } } }),
}));

import { confirmPayment } from "@/lib/payment-status";

beforeEach(() => {
  retrieve.mockReset();
  process.env.STRIPE_SECRET_KEY = "sk_test_x";
});

/**
 * This decides whether a customer is told their order exists. Getting it wrong
 * in either direction is bad: claiming an order that was never paid, or denying
 * one that was.
 */
describe("confirmPayment", () => {
  it("refuses a missing session id without calling Stripe", async () => {
    expect(await confirmPayment(undefined)).toMatchObject({
      status: "unknown",
    });
    expect(retrieve).not.toHaveBeenCalled();
  });

  it("refuses an id that is not a checkout session", async () => {
    // Someone pasting a payment intent, or guessing.
    expect(await confirmPayment("pi_12345")).toMatchObject({
      status: "unknown",
    });
    expect(retrieve).not.toHaveBeenCalled();
  });

  it("refuses when Stripe is not configured", async () => {
    delete process.env.STRIPE_SECRET_KEY;

    expect(await confirmPayment("cs_test_123")).toMatchObject({
      status: "unknown",
    });
    expect(retrieve).not.toHaveBeenCalled();
  });

  it("treats an id Stripe does not recognise as no order", async () => {
    retrieve.mockRejectedValue(new Error("No such checkout session"));

    expect(await confirmPayment("cs_test_bogus")).toMatchObject({
      status: "unknown",
    });
  });

  it("confirms a paid session and reports the sale for analytics", async () => {
    retrieve.mockResolvedValue({
      id: "cs_test_paid",
      status: "complete",
      payment_status: "paid",
      amount_total: 1095,
      currency: "gbp",
      shipping_cost: { amount_total: 495 },
    });

    expect(await confirmPayment("cs_test_paid")).toEqual({
      status: "paid",
      transactionId: "cs_test_paid",
      value: 10.95,
      currency: "GBP",
      shipping: 4.95,
    });
  });

  it("uses the session id as the transaction id, so a refresh is not a second sale", async () => {
    retrieve.mockResolvedValue({
      id: "cs_test_same",
      status: "complete",
      payment_status: "paid",
      amount_total: 500,
      currency: "gbp",
    });

    const first = await confirmPayment("cs_test_same");
    const second = await confirmPayment("cs_test_same");

    expect(first.transactionId).toBe(second.transactionId);
  });

  it("reports a still-open session as pending, not as failed", async () => {
    retrieve.mockResolvedValue({
      id: "cs_test_open",
      status: "open",
      payment_status: "unpaid",
    });

    expect(await confirmPayment("cs_test_open")).toMatchObject({
      status: "pending",
    });
  });

  it("never claims an order for an expired, unpaid session", async () => {
    retrieve.mockResolvedValue({
      id: "cs_test_expired",
      status: "expired",
      payment_status: "unpaid",
    });

    expect(await confirmPayment("cs_test_expired")).toMatchObject({
      status: "unknown",
    });
  });

  it("treats a deferred payment as pending rather than confirmed", async () => {
    retrieve.mockResolvedValue({
      id: "cs_test_deferred",
      status: "complete",
      payment_status: "no_payment_required",
    });

    expect(await confirmPayment("cs_test_deferred")).toMatchObject({
      status: "pending",
    });
  });

  it("copes with a paid session that reports no totals", async () => {
    retrieve.mockResolvedValue({
      id: "cs_test_zero",
      status: "complete",
      payment_status: "paid",
    });

    expect(await confirmPayment("cs_test_zero")).toMatchObject({
      status: "paid",
      value: 0,
      shipping: 0,
      currency: "GBP",
    });
  });
});
