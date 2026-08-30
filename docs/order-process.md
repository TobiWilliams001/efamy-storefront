# How an order works

Three separate things, often confused with each other. Keeping them apart is
what makes it obvious whether a request is a website change, a business habit,
or something the courier already does.

## 1. What the customer does

Browse → Product → Basket → Checkout → Payment → Confirmation → Waiting →
Delivery

They pay on Stripe's page, land back on the confirmation page, and receive two
emails: an order confirmation from Efamy and a payment receipt from Stripe.

After that the website says nothing more to them. The next thing they hear is
from the courier.

## 2. What Efamy does

New order email → Check the order → Prepare and pack → Arrange postage →
Dispatch → Courier delivers

None of this is tracked on the website. The order email is the instruction, and
Stripe is the record. Marking an order as packed or sent happens in whatever way
Efamy already works, not in software.

## 3. What the website is responsible for

- Take the order
- Take the payment, through Stripe
- Confirm the order to the customer, on screen and by email
- Tell Efamy an order has arrived, with what to pack and where to send it
- Count the stock down, and say when a size has run out
- Carry enquiries from the contact form to a person

That is the whole list. Everything else belongs to Efamy or to the courier.

## What the website deliberately does not do

**Delivery updates.** The courier already emails and texts its own tracking.
Repeating it would mean holding a tracking number the website never sees, and
sending a second, worse notification after the real one.

**An order list or fulfilment status.** Stripe is the order book. Building a
second one means keeping two records in step, and the business does not need it
at this size.

**Stock counts across the shops.** The count follows online sales only. Jars
sold through the twenty stockists do not move it, so the number drifts unless
Efamy adjusts it.

Each of these is a reasonable thing to add later. None is needed to sell a jar.
