---
name: feedback-spec-approach
description: Confirmed approach for writing feature specs — deep code verification before spec, matching existing repo doc conventions
metadata:
  type: feedback
---

When asked to write a feature spec/UX critique for an existing feature (e.g. category
handling in `basic-info.tsx`), the accepted approach was:

1. Read the actual component, then trace the full stack it touches (Prisma schema →
   repository → service → server action → other consumers) before writing anything.
   This surfaced a non-obvious finding that wouldn't show up from reading the component
   alone: a working backend capability (`getPromptCategories()`) existed but was never
   wired into the editor UI — the real bug was an integration gap, not a missing feature.
2. Match the repo's own established documentation convention instead of inventing a new
   format. Existing specs live in `docs/claude/implementation/*.md`, are written in German,
   and use an Ist/Soll/Begründung table structure per finding (see
   `docs/claude/implementation/done/prompts-dashboard-ux-spec.md`). Blending that table
   format with PO-standard User Stories + Given/When/Then acceptance criteria + MVP-vs-full
   vision + tier notes was well received (confirmed with terse "gut").
3. Explicitly separate MVP from full vision, and flag monetization tier fit only as a
   suggestion/open question, not a decision — this project already has a tier-limit pattern
   (`DPromptsUsage` with `current/limit`, `-1 = unlimited`) worth referencing when proposing
   new tier-gated limits.

**Why:** User gave no pushback on this fairly heavy up-front investigation (multiple
Grep/Read round trips into schema, repository, service, actions, zod validators) before
producing the spec — confirms thoroughness here is valued over speed for spec-writing tasks.

**How to apply:** For future "review this feature" or "write a spec for X" requests in this
codebase, default to full-stack tracing first and reuse the German Ist/Soll/Begründung table
format for the critique section, layered with the standard PO structure (stories,
acceptance criteria, MVP/full vision, tier fit) from [[project_app_identity]].
