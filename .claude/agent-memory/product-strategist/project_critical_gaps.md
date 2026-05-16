---
name: Critical Gaps Blocking Release
description: Half-baked features and broken paths that block a shippable product (updated 2026-05-16)
type: project
---

## Gap 1: Post-Purchase Fulfillment Is Commented Out (CRITICAL)
In `src/data/services/order/order.service.ts` line 59, the call `await this.collectionService.createLibraryEntries(order)` is commented out. When a user buys a template from the marketplace, the purchased templates are NEVER added to their library. The order completes and the cart clears, but the user gets nothing. The method `createLibraryEntries` does not exist on `CollectionService` — it needs to be designed and implemented. NOTE: Marketplace is now hidden from sidebar nav — this gap may be intentionally deferred with the marketplace deprioritization.

## Gap 2: Subscription Tier Enforcement Is Not Wired Up (CRITICAL)
`requireSubscriptionAccess` and `checkFeatureAccess` from `src/lib/subscription/server-guards.ts` are fully implemented and tested, but are called by ZERO production files. Not one server action checks subscription limits. FREE users can create unlimited prompts, templates, and bypass all tier gates. The enforcement infrastructure exists but is disconnected from the actual mutation paths. This means the subscription revenue model has no enforcement.

## Gap 3: Forgot-Password Route Does Not Exist
The sign-in form has a "Passwort vergessen?" link but no page exists at `/forgot-password`. There IS a full service and email implementation (`password-reset.service.ts`, `brevo.email.service.ts`) but no UI/route connecting it.

## Gap 4: "Advanced Features" (PRO tier) Is Undefined
`canUseAdvancedFeatures` is the PRO-exclusive feature flag. It shows on the pricing card as "Advanced features" but nothing in the product is actually gated behind it. The flag exists in the access-control layer but unlocks nothing. The PRO tier is indistinguishable from BASIC in practice.

## Gap 5: Marketplace/Orders Hidden From Nav (Strategic Shift)
As of AI-137 (2026-05-14), `/marketplace` and `/orders` are commented out from `src/components/shared/sidebar/menus.tsx`. The e-commerce purchase flow is built but not exposed to users. This is either a pivot toward subscription-only revenue or a deferral pending Gap 1 being fixed.

## Gap 6: Language Inconsistency (UX Polish Gap)
Mixed German/English throughout UI. E-commerce/checkout/orders are in English, prompts/templates/settings/navigation are in German.

## Gap 7: No Admin Interface
User role field exists in schema, `/admin` is in protected paths, but no admin pages exist. Products/templates are managed entirely through seeding. No way to add/edit catalog entries without developer access.

**Why:** These gaps were originally found 2026-05-03, updated 2026-05-16 after AI-137 analysis.
**How to apply:** Gap 2 is the single most important gap for revenue. Gap 4 is the clearest reason PRO is a hard sell. Gap 1 matters only when marketplace is re-activated.
