---
description: Review Stripe integration using the stripe-integration-expert skill. Checks checkout sessions, webhook handling, idempotency, subscription lifecycle, and common pitfalls.
---

# Stripe Integration Review Workflow

This workflow uses the `stripe-integration-expert` skill from `claude-skills/engineering-team/stripe-integration-expert/`.

## Step 1: Client Setup Review

- [ ] Stripe SDK initialized with `apiVersion` pinned
- [ ] `appInfo` set for Stripe dashboard identification
- [ ] Secret key loaded from environment variable
- [ ] No secret keys exposed to client-side code

## Step 2: Checkout Session Review

- [ ] `metadata.userId` passed on checkout session (critical for linking)
- [ ] `success_url` includes `{CHECKOUT_SESSION_ID}` for verification
- [ ] `cancel_url` properly configured
- [ ] Customer created/retrieved before session creation
- [ ] `allow_promotion_codes` set if needed

## Step 3: Webhook Handler Review

- [ ] Signature verification with `stripe.webhooks.constructEvent`
- [ ] Idempotency: processed events tracked to prevent double-processing
- [ ] Return 500 on processing failure (so Stripe retries)
- [ ] Don't mark event as processed if handler throws
- [ ] Handle key events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`

## Step 4: Common Pitfalls Checklist

- [ ] Webhook delivery order not guaranteed — re-fetch from Stripe API
- [ ] Double-processing prevented with idempotency table
- [ ] Trial abuse prevented (track `hasHadTrial`)
- [ ] Proration previewed before upgrade confirmation
- [ ] Customer portal configured in Stripe dashboard
- [ ] Missing metadata checked and handled gracefully

## Step 5: Testing

```bash
# Forward webhooks to local dev
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed
```

Test cards:

- Success: `4242 4242 4242 4242`
- Requires auth: `4000 0025 0000 3155`
- Decline: `4000 0000 0000 9995`
