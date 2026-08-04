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

Nothing here is implemented yet. `/checkout` is an honest placeholder that
collects nothing. `CartLine.price` in `cart-provider.tsx` is a display snapshot
and is explicitly marked as needing server-side re-pricing before any charge.
