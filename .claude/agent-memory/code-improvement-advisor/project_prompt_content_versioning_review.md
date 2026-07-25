---
name: project_prompt_content_versioning_review
description: Known unresolved issues found in the PromptContentVersion feature (branch AI-216-library) as of the 2026-07-25 review — check whether these got fixed before re-reviewing.
type: project
---

Branch `AI-216-library` added prompt content versioning (explicit "save as new
version" snapshots + restore), gated by subscription tier via
`canAccessVersionHistory` / `maxStoredPromptVersions` in
`src/lib/subscription/access-control.ts`. Full spec:
`.claude/agent-memory/prompt-product-owner/project_prompt_versioning_feature.md`
and `docs/.../prompt-content-versioning-feature-spec.md` (referenced by
in-code comments as "feature spec §x.y").

As of the 2026-07-25 review, the following were still open (not yet fixed):

1. **Race condition on concurrent version creation.**
   `PromptRepository.archiveCurrentContentAsVersion` (in
   `src/data/repositories/prompt/prompt.user.repository.ts`) computes the next
   `versionNumber` via `findFirst(orderBy: desc)` + 1 inside a `$transaction`,
   with no row lock and no retry-on-conflict. Two concurrent saves for the
   same prompt (double-submit, two tabs) can read the same max and both try
   to insert the same `(promptId, versionNumber)`, which violates the
   `@@unique([promptId, versionNumber])` constraint — the whole `updatePrompt`
   call fails (including the user's unrelated field edits), with no retry.

2. **`DPromptVersionsResult.locked = true` conflates two different meanings.**
   Both "user's tier doesn't have `canAccessVersionHistory`" (service-level
   gate) and "an unexpected error occurred while fetching" (action-level
   catch-all in `prompt.user.actions.ts` `getPromptVersions`) collapse to the
   same `{ locked: true }` shape. This flows into
   `src/components/prompts/detail/edit/prompt-edit.tsx`'s
   `canAccessVersionHistory` prop (via `edit/page.tsx`: `!versionsResult.locked`)
   and into `VersionHistoryButton` — so a transient fetch error can make a
   paying BASIC/PRO user see the "Ab BASIC verfügbar" upgrade prompt instead
   of an error/retry state.

3. **No error state for version content fetch.** In
   `version-history-sheet.tsx`, `fetchVersionContent` silently no-ops when
   `getPromptVersion` returns `null` (not-found *or* any error) — the
   "Ansehen" panel spins forever with no feedback, and
   `RestoreVersionDialog`'s missing-placeholder safety warning silently comes
   back empty (looks like "no missing variables" when it may just mean "failed
   to load").

4. **Hardcoded version-limit numbers drift from config.** `version-history-sheet.tsx`
   hardcodes `tier === "BASIC" && totalElements >= 15` and the display text
   "die letzten 20 Versionen" instead of deriving both from
   `TIER_FEATURES.BASIC.maxStoredPromptVersions` (`access-control.ts`) — will
   silently go stale if that limit is ever tuned.

**How to apply:** when reviewing this feature again, check whether these were
addressed (retry/locking on version creation, `locked` reason split, error UI
for version content fetch, limit sourced from `access-control.ts`) before
treating them as resolved.
