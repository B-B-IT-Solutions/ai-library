---
name: ux-debt
description: Confirmed UX/accessibility issues found in the initial comprehensive review (May 2026)
metadata:
   type: project
---

Issues confirmed by code review (initial audit, 2026-05-23):

1. **Mixed-language UI** — Subscription settings (`src/components/settings/user/subscription/active-plan.tsx`) and orders (`src/app/(authenticated)/orders/[id]/page.tsx`, cart page `src/app/(authenticated)/cart/page.tsx`) contain English text ("Subscription", "Current Plan", "Order Details", "Items", "Shopping Cart", "Browse Marketplace") while the rest of the app is German.

2. **Hardcoded totalEntries = 1** — `src/components/prompts/lists/toolbar/templates-toolbar.tsx` line 34 hardcodes `const totalEntries = 1`, so the toolbar always shows "1 Vorlage" regardless of actual count. Commented-out code above shows the intent was a real query.

3. **`totalElements={1}` passed as prop** — `src/components/explore/catalog-entries-dashboard.tsx` passes `totalElements={1}` to both `CatalogSidebar` and `CatalogEntriesToolbar` — same stub issue.

4. **Cart page entirely inaccessible from nav** — `/marketplace` and `/orders` are commented out of `src/components/shared/sidebar/menus.tsx`. Cart is only reachable via floating button (marketplace page) or direct URL. No nav entry for cart or orders.

5. **SheetTitle visually hidden in CartDrawer** — `src/components/cart/cart-drawer.tsx` wraps `SheetTitle` in `sr-only`. This is fine for screen readers but means the drawer has no visible heading, breaking visual hierarchy.

6. **Checkout page mixes German + English** — `src/app/(authenticated)/checkout/page.tsx` uses "Order Summary" and "Total" in English; `src/app/(authenticated)/orders/[id]/page.tsx` uses "Order Details", "Items", "Order Successful!", "Go to Library", "View All Orders".

7. **Billing interval toggle not keyboard-accessible as a group** — `src/components/settings/user/subscription/plans/pricing-plans.tsx` uses raw `<button>` elements inside a `div` for the monthly/yearly toggle instead of a proper `<fieldset>` + `role="radiogroup"` pattern, missing ARIA group semantics.

8. **Password change silently navigates away** — `src/components/settings/user/general/update-password.tsx` pushes to `/auth/sign-in` after success without warning. The user gets a toast then lands on the login page — no explicit explanation.

9. **`featureMaxPromptVariables` bug** — `src/components/settings/user/subscription/plans/pricing-plan.tsx` line 82 uses `plan.features.maxCollections` instead of `plan.features.maxPromptVariables` inside `featureMaxPromptVariables()`.

10.   **Settings nav uses relative `href`** — `src/components/settings/navigation.tsx` line 54 sets `href={entry.section}` (e.g. "general") without a leading slash. This works when already at `/settings/general` but is fragile and will break from other routes.

11.   **`"Other"` group label in sidebar** — `src/components/shared/sidebar/sidebar.tsx` renders a group labelled "Other" (English) while the rest of the sidebar labels are German ("Bibliothek", "Entdecken").

**Why:** These are concrete code-level findings from the first full audit.
**How to apply:** Reference these when working on any of the listed files. Prioritize items 2, 3, 4, 9 as they are either data bugs or navigation dead-ends.
