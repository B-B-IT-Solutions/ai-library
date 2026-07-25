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

**Keep revision history OUT of the spec document itself.** During iterative correction of
`[[project_prompt_versioning_feature]]` (four rounds of user corrections on the same doc), I had
been adding "Korrektur ggü. vorheriger Fassung" / "ursprünglich war X vorgesehen" callouts directly
into the spec to explain what changed and why. User explicitly said: "entferne alle Hinweise was
die vorherige Spezifikation gesagt hat - das ist eine komplete neue Spezifikation, also in der
Spezifikation soll nur stehen, was soll implementiert werden."

**Why:** A spec document is a description of what to build, not a changelog of how the PO's
thinking evolved. Revision narration is noise for a developer implementing it and noise for anyone
reading it later without the conversation context.

**How to apply:** When a spec gets corrected across multiple turns, edit it in place to read as if
it were written correctly from the start — no "ursprünglich", "Korrektur ggü.", "frühere Fassung",
"Design-Entscheidung (Korrektur ...)" callouts, no revision counters in date lines. Rationale/
"why this design" explanations are fine and encouraged (e.g. "dies folgt dem Sicherheitsnetz-Modell,
weil Nutzer X erwarten") — just don't frame them as corrections of an earlier draft. The revision
history itself still belongs in agent memory (e.g. project-type feature memory files) so future
sessions know what was tried and rejected — just not in the shipped spec doc.
