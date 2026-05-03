---
name: Critical Gaps Blocking Release
description: Half-baked features and broken paths that block a shippable product
type: project
---

## Gap 1: Post-Purchase Fulfillment Is Commented Out (CRITICAL)
In `src/data/services/order/order.service.ts` line 59, the call `await this.collectionService.createLibraryEntries(order)` is commented out. When a user buys a template from the marketplace, the purchased templates are NEVER added to their library. The order completes and the cart clears, but the user gets nothing. This is a broken purchase flow. The method `createLibraryEntries` does not exist on `CollectionService` — it needs to be designed and implemented.

## Gap 2: Subscription Tier Enforcement Is Not Wired Up
`requireSubscriptionAccess` and `checkFeatureAccess` from `src/lib/subscription/server-guards.ts` are fully implemented and tested, but are called by ZERO production files. Not one server action checks subscription limits. FREE users can create unlimited prompts, templates, and bypass all tier gates. The enforcement infrastructure exists but is disconnected from the actual mutation paths.

## Gap 3: /forgot-password Route Does Not Exist
The sign-in form has a "Passwort vergessen?" link pointing to `/forgot-password` but no page exists at that route. Clicking it hits a 404. There is also no password reset email flow.

## Gap 4: /orders Not in Navigation (Intentionally Hidden)
The orders nav item is commented out in `src/components/shared/sidebar/menus.tsx`. The /orders route exists and works but users cannot navigate to it from the sidebar. Likely intentional deferral.

## Gap 5: /cart Route Not Protected by Auth Middleware
The `authorized` callback in `src/auth.config.ts` protects `/orders/(.*)` (requires ID) but does NOT protect `/cart` or `/checkout`. Cart/checkout are in the authenticated layout group but the middleware pattern doesn't include them. Relies on layout-level auth rather than middleware.

## Gap 6: Language Inconsistency (UX Polish Gap)
Mixed German/English throughout UI: Marketplace/cart/checkout/orders are in English ("Shopping Cart", "Order Successful!", "Back to Marketplace", "Choose Your Plan"), while prompts/templates/settings/navigation are in German. Publishable but signals unfinished state.

## Gap 7: No Admin Interface
User role field exists in schema (`role` String default "user"), admin routes listed in protected paths (`/admin`), but no admin pages exist. Products/templates are managed entirely through seeding. No way to add/edit products without running seed scripts.

## Gap 8: Stripe Price IDs Hardcoded in Seed File
`prisma/seed-data/subscription-plans.ts` has hardcoded Stripe price IDs. This is a test/dev environment concern — if shipping to production, these need to be production Stripe IDs or configured via env vars.

**Why:** These gaps were found 2026-05-03 during initial codebase audit.
**How to apply:** Prioritize Gap 1 and Gap 2 as absolute blockers for a revenue-generating release. The product cannot charge money without fixing Gap 1. Gap 2 means paying users get the same experience as free users.
