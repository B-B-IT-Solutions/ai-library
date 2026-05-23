---
name: project-overview
description: Core facts about the ai-library app — language, layout structure, user types, navigation model
metadata:
   type: project
---

The app is an AI prompt library + marketplace platform. All UI text is in German (de-DE). Currency is CHF.

**User types:** unauthenticated visitors (public Explore page), registered free users (Free tier), paid users (BASIC/PRO).

**Layout model:**

- Authenticated zone: collapsible icon sidebar (shadcn SidebarProvider) + main content area. File: `src/components/shared/sidebar/sidebar.tsx`.
- Public zone: sticky top navbar with Sign In / Sign Up CTAs. File: `src/components/shared/wrappers/layout/layout-wrapper-pulbic.tsx`.

**Main authenticated routes:**

- `/templates` — user's prompt library (primary landing after login)
- `/collections` — grouped prompt sets
- `/explore` — public catalog (also accessible unauthenticated)
- `/marketplace` — product/bundle store (currently commented out of nav)
- `/settings/[section]` — tabbed settings (general, account, subscription, global-template-fields)
- `/subscription/pricing` — plan picker (FREE / BASIC / PRO)
- `/cart`, `/checkout`, `/orders` — e-commerce flow

**Why:** Understanding the context shapes all UX recommendations — this is a B2C/B2B SaaS tool, not an internal tool.

**How to apply:** All UX suggestions must account for the German-language UI and CHF pricing. The primary user goal is managing and using AI prompts.
