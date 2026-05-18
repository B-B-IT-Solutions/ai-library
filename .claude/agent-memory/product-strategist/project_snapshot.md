---
name: Product Snapshot
description: What this product is, who it's for, and its monetization model (updated 2026-05-16)
type: project
---

"Vision Notes" — a German-language personal AI prompt library SaaS. Users manage, organize, and discover prompt templates for AI tools. Revenue comes from two streams: (1) subscription tiers FREE/BASIC(CHF 9.90/mo)/PRO(CHF 19.90/mo) and (2) one-time purchases of individual templates and bundles via a marketplace. The core user action is: create/save templates → fill in template fields → generate a composed prompt → use it in an AI tool.

Stack: Next.js App Router, Prisma/PostgreSQL, NextAuth v5 (JWT sessions), Stripe, TanStack Query, shadcn/ui.

App Name: "Vision Notes" (from APP_NAME env)
Target language: German (UI heavily German, some English mixing especially in e-commerce/checkout flows)
Currency: CHF (Swiss Francs)
Legal: Iubenda for GDPR consent tracking

**Current product focus (as of AI-137, 2026-05-14):** Builder has de-emphasized the e-commerce marketplace in the navigation (Marketplace and Orders are now commented out from sidebar menus). The app currently surfaces only: Templates ("Meine Prompts"), Collections ("Sammlungen"), Explore, and Settings. The Explore/Catalog feature (admin-curated public templates) is now the primary discovery mechanism, replacing the paid marketplace in the nav. The marketplace still exists as a route but is not user-navigable from the sidebar.

**Why:** Needed for future product strategy advice and architectural context.
**How to apply:** Use this as the baseline when advising on product priorities, feature sequencing, or monetization decisions.
