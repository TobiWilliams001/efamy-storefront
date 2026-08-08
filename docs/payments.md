# Payment & order engineering principles

Rules for anything touching money, orders or customer data. Stricter than the
rest of the codebase, and not negotiable for expedience.

**Stripe is the payment authority. This application is the order authority.**
Stripe decides whether money was collected. We decide how the order is
fulfilled, tracked and communicated. Keeping those separate avoids most
payment bugs.

## Non-negotiable

1. **Never store card details.** All card data goes through Stripe's hosted
   checkout. Nothing card-related touches our servers or database.
2. **Stripe confirms payment, not the browser.** Reaching `/order/success`
   proves nothing. An order becomes paid only on a verified webhook or a
   server-side API confirmation.
3. **Never trust the client.** Prices, discounts, shipping and totals are
   recalculated server-side from the catalogue on every checkout. The basket in
   `localStorage` is a display convenience and an untrusted input.
4. **Validate every line.** Product exists, price matches current price, item
   is in stock, quantity is sane, shipping option is real.
5. **Idempotency.** Refreshes, double clicks, retries and webhook redeliveries
   must not create duplicate orders or double charges.
6. **Orders and payments are separate states.** Payment status and fulfilment
   status are distinct fields, never one enum.
7. **Never delete an order.** Cancel, refund or archive. Orders are business
   records.
8. **Timestamp everything.** Created, paid, processing, shipped, completed,
   cancelled, refunded.
9. **Fail safely.** A failed email must never lose an order. External failures
   degrade, they do not destroy.
10. **Webhooks:** verify the Stripe signature, process each event exactly once,
    stay idempotent, log failures.
11. **Business logic stays server-side.** Pricing, discounts, shipping, tax and
    verification never run in the browser.
12. **Separate environments.** Test keys in development and preview, live keys
    only in production. Never mixed.
13. **Protect secrets.** Secret keys, tokens and webhook secrets are unprefixed
    env vars read only from server-only modules. Never re-exported from
    anything a client component can import.
14. **Secure by default.** HTTPS, input validation, output sanitisation, CSRF
    protection where applicable, secure cookies if auth arrives.
15. **Design for recovery.** Failed payments, abandoned baskets and dropped
    connections need clear messaging and a safe retry.

## Order states

```
Draft → Pending Payment → Paid → Processing → Shipped → Completed
                            ↘ Cancelled
                            ↘ Refunded
```

Payment status and fulfilment status are tracked separately.

## Checkout experience

The customer should always know what they are buying, the total, shipping
charges, estimated delivery, payment status and what happens next.

## Definition of done

A payment feature is complete only when it is secure, server-validated,
idempotent, tested in Stripe test mode, handles failure gracefully, exposes no
sensitive data, produces accurate order records, sends confirmation only after
verified payment, and switches to live mode by configuration alone.

## Current state

**Implemented and testable.** Stripe hosted Checkout, in test mode.

| Piece              | Where                                 |
| ------------------ | ------------------------------------- |
| Server re-pricing  | `src/lib/pricing.ts` (13 tests)       |
| Session creation   | `src/app/checkout/actions.ts`         |
| Webhook            | `src/app/api/stripe/webhook/route.ts` |
| Order notification | `src/lib/order-email.ts`              |
| Delivery rates     | `src/config/delivery.ts`              |

**Hosted Checkout, not embedded Elements.** Stripe hosts the card page, so no
card data reaches this application and PCI scope stays at SAQ-A. It also brings
Apple Pay, Google Pay and SCA/3-D Secure with no extra work — all three are
required in the UK and all three are easy to get subtly wrong. The tradeoff is
less control over the payment page's styling, which is the right trade for a
business with no in-house developer.

**Stripe is the order book.** Stripe records the payment, customer, phone,
shipping address and line items, and Mr Emmanuel already has a login. No
database means nothing extra to pay for, back up, or depend on the contractor
for. `notifyOrder` will email each order through once a provider is connected.

### The account, as it stands

The test keys authenticate against `acct_1U1ZC36nFQCsbMAY` — a **GB, GBP,
standard account** named "EFAMY COMPANY LIMITED sandbox". Correct country and
currency, so nothing to change.

But `details_submitted` is **false**, and both `charges_enabled` and
`payouts_enabled` are **false**. The account is a sandbox and onboarding has not
been completed, so **it cannot take a real payment or pay money out**. Test mode
works fully; live mode does not exist yet. Completing that — business details,
bank account, ID verification — is Efamy's to do and nobody else can.

### Known limitation: idempotency is per-instance

The webhook keeps handled event ids in a module-level `Set`. On Vercel each
serverless instance has its own memory, so a redelivery routed to a different
instance is not recognised as a duplicate.

The consequence today is bounded: the only side effect is a notification, so the
worst case is Efamy receiving the same order email twice. No double charge is
possible — Stripe holds the payment record and we never create one. If order
side effects grow beyond notification, this needs a shared store before that
happens.

### Two things still to wire

- [ ] **Real delivery rates.** `src/config/delivery.ts` holds invented numbers
      (£4.95, free over £40) flagged `provisional: true`. `assertDeliveryIsReal`
      throws if a `sk_live_` key is used while that flag is set, so a real
      customer cannot be charged made-up postage. Set the rates, flip the flag.
- [ ] **An email provider.** `notifyOrder` logs the order and returns. It never
      throws, because a failed notification must not reverse a payment Stripe
      has already taken.

### Testing in test mode

1. Put the test keys in `.env.local` — `STRIPE_SECRET_KEY`,
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
2. Forward webhooks and take the signing secret it prints:

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. Put that value in `.env.local` as `STRIPE_WEBHOOK_SECRET` and restart — Next
   reads env files at boot, not per request
4. Pay with `4242 4242 4242 4242`, any future expiry, any CVC
5. Check the terminal for `Order paid` and the Stripe dashboard for the payment

Worth testing beyond the happy path: `4000 0000 0000 9995` declines,
`4000 0027 6000 3184` forces a 3-D Secure challenge, and closing the Stripe tab
should leave the basket intact.
