---
name: design-system
description: Established shadcn/ui and Tailwind patterns in this codebase — conventions to follow and avoid duplicating
metadata:
  type: project
---

**Form widgets:** Custom wrappers in `src/components/shared/widgets/` — use `FormInput`, `FormTextArea`, `FormSelect`, `FormRadio`, `FormCheckBox`, `FormDynamicValues` rather than raw shadcn `FormField` everywhere. Auth forms use a different `Field/FieldLabel/FieldError` pattern from `src/components/shadcn/field`.

**Skeletons:** Shared skeleton components in `src/components/shared/skeletons.tsx` — `ProductCardSkeleton`, `OrderCardSkeleton`, `TemplateCardSkeleton`, `CartItemSkeleton`, `PageHeaderSkeleton`. All use `animate-pulse` with `bg-slate-200/bg-slate-100`.

**Layout wrappers:**
- Authenticated: `AuthenticatedLayoutWrapper` (`src/components/shared/wrappers/layout/layout-wrapper-authenticated.tsx`) — provides SidebarProvider + TrialBanner
- Public: `PublicLayoutWrapper` (`src/components/shared/wrappers/layout/layout-wrapper-pulbic.tsx`) — sticky header + footer

**Password visibility toggle:** Duplicated three times across sign-up, sign-in, and update-password. Pattern is a raw `<button type="button">` with `aria-label` inside a `relative` div. Could be extracted into a reusable `PasswordInput` component.

**Color palette in use:** `slate-50/100/200/300/600/900` for content backgrounds and text; `primary` token for CTAs; `destructive` for errors; `amber` for warnings; `green` for success.

**Sidebar nav:** Three groups — "Bibliothek" (templates, collections), "Entdecken" (explore), "Other" (settings). `menus.tsx` has multiple items commented out (marketplace, orders, feedback, invite-people).

**Loading/error/empty states:** All three states are covered on most pages. Error boundary at `src/app/(authenticated)/error.tsx`. Not-found at `src/app/(authenticated)/not-found.tsx`. Empty states include icon + heading + CTA pattern.
