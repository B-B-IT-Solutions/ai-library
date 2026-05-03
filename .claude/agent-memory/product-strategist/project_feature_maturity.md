---
name: Feature Maturity Map
description: Depth assessment of each major feature area as of 2026-05-03
type: project
---

## Auth (COMPLETE)
- Sign-up, sign-in, sign-out, delete account all fully implemented
- JWT sessions with 30-day expiry
- Session cart migration on sign-in
- Tier embedded in JWT token
- MISSING: forgot-password / email reset (link exists, page doesn't)
- MISSING: email verification

## Prompts (COMPLETE)
- Full CRUD, versioning, categories, favorites, follow-up prompts
- Well-implemented service + repository layer
- NOT subscription-gated despite limits defined in access-control.ts

## Templates (COMPLETE)
- Full CRUD with typed form fields (TEXT, TEXTAREA, EMAIL, NUMBER, DATE, SELECT, CHECKBOX, RADIO)
- Global reusable template fields in settings
- Template engine composes prompts from field values
- Categories, favorites, recommended model
- Download as JSON
- Public template view pages at /p/templates/[id]

## Collections (COMPLETE)
- Create, edit, delete, share via public token
- Add/remove templates
- Public collection share page at /p/collections/[token]

## Marketplace / Products (MOSTLY COMPLETE)
- Product listing (both authenticated /marketplace and public /p/marketplace)
- Product detail pages (authenticated + public)
- Cart: add, remove, session-based + user-based with migration on sign-in
- Checkout: Stripe session creation works
- Orders: created, webhook-driven status updates work
- BROKEN: purchased templates NOT added to user library (commented out in order.service.ts)

## Subscriptions (MOSTLY COMPLETE)
- Pricing page at /subscription/pricing
- Stripe checkout session creation works
- Webhooks handle: checkout.completed, subscription.created/updated/deleted, invoice.paid/failed
- Cancel/reactivate subscription works
- Billing portal (Stripe customer portal) works
- CRITICAL: tier limits defined but NOT enforced anywhere in production code

## Settings (COMPLETE)
- General: name update, password change
- Account: delete account
- Subscription: view active plan, manage billing, cancel/reactivate
- Content: global template fields management

## Iubenda Legal Consent (COMPLETE)
- Consent recorded on sign-up, sent to Iubenda API with retry logic

## Admin (NOT BUILT)
- Role field exists, /admin in protected paths, no pages built
- Product management is seeding-only

**Why:** Recorded during initial audit 2026-05-03.
**How to apply:** Use this to quickly assess whether a feature area needs work vs. is ready.
