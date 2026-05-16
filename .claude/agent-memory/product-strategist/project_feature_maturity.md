---
name: Feature Maturity Map
description: Depth assessment of each major feature area (updated 2026-05-16 after AI-137)
type: project
---

## Auth (COMPLETE)
- Sign-up, sign-in, sign-out, delete account all fully implemented
- JWT sessions with 30-day expiry, tier embedded in token
- Session cart migration on sign-in
- Email verification implemented
- Password reset: service + email layer EXISTS but no UI route (`/forgot-password` 404s)

## Templates / "Meine Prompts" (COMPLETE — primary feature)
- Full CRUD with typed form fields (TEXT, TEXTAREA, EMAIL, NUMBER, DATE, SELECT, CHECKBOX, RADIO)
- Global reusable template fields in settings
- Template engine composes prompts from field values (TemplateEngine.replace/validate)
- Categories, favorites, recommended model, download as JSON
- Infinite scroll list with filters (search, categories, models), sort, group-by
- Collections filter in toolbar
- Public template view pages at /preview/templates/[id]
- NOT subscription-gated despite limits defined in access-control.ts

## Prompts / Prompt0 (COMPLETE — but hidden from nav)
- Full CRUD, versioning (Prompt0Version), categories, favorites, follow-up prompts
- Well-implemented service + repository layer
- Commented out from sidebar nav (navigationMenu1 in menus.tsx)
- This appears to be an OLDER feature being phased out in favor of "Templates"

## Collections / Sammlungen (COMPLETE)
- Create, edit, delete, share via public token
- Add/remove templates, color-coded
- Public collection share page at /preview/collections/[token]
- Add-to-collection dialog from template list/detail

## Explore / Catalog (COMPLETE — now primary discovery surface)
- Public-facing curated prompt catalog at /explore
- Category sidebar filter, search filter, sort-by
- Individual catalog entry detail page with field preview and copy-count
- "Add to library" button copies catalog entry as user template
- "Use entry" button opens template fill dialog directly
- Related entries shown on detail page
- 300s ISR revalidation on list, 3600s on detail pages
- Copy count increment (fire-and-forget)
- Admin can only manage this via seed scripts — NO admin UI

## Marketplace / Products (BUILT BUT HIDDEN)
- Product listing page (authenticated + public at /preview/marketplace)
- Product detail pages
- Cart: add, remove, session-based + user-based with migration on sign-in
- Checkout: Stripe session creation works
- Orders: created, webhook-driven status updates work
- BROKEN: purchased templates NOT delivered to user library (commented out)
- HIDDEN: Marketplace and Orders removed from sidebar nav in AI-137

## Subscriptions (MOSTLY COMPLETE — enforcement missing)
- Pricing page at /subscription/pricing
- Stripe checkout, webhooks (checkout.completed, subscription CRUD, invoice paid/failed)
- Cancel/reactivate/billing portal all work
- Access control layer fully built (access-control.ts, server-guards.ts)
- CRITICAL: enforcement never called from any server action — limits not enforced
- PRO tier's `canUseAdvancedFeatures` unlocks nothing in the product

## Settings (COMPLETE)
- General: name update, password change
- Account: delete account
- Subscription: view active plan, manage billing, cancel/reactivate, pricing page
- Content: global template fields CRUD

## Iubenda Legal Consent (COMPLETE)
- Consent recorded on sign-up, synced to Iubenda API with retry logic

## Admin (NOT BUILT)
- Role field in schema, /admin in protected paths, zero pages exist
- Product management: seeding only
- Catalog management: seeding only

**Why:** Recorded during initial audit 2026-05-03, updated 2026-05-16 after AI-137 analysis.
**How to apply:** Use this to quickly assess whether a feature area needs work before assigning tickets.
