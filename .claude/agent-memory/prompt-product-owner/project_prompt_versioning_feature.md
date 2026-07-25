---
name: project-prompt-versioning-feature
description: Prompt-Text-Versionierung Feature — automatischer Snapshot bei Content-Änderung, BASIC+PRO Zugriff, restore = normales Update
metadata:
   type: project
---

**Feature:** Prompt-Text-Versionierung (Content-Historie für `PromptContent.content`)

**Status:** Spezifiziert, bereit zur Implementierung (2026-07-25). Spec liegt in
`docs/claude/implementation/prompt-content-versioning-feature-spec.md` (noch nicht in `done/`,
da noch nicht implementiert — `done/` in diesem Repo bedeutet tatsächlich gebaut, nicht nur spezifiziert;
vgl. `workflows-feature-spec.md`, das erst nach Implementierung nach `done/` wanderte).

**Why:** Codebase hatte trotz CLAUDE.md-Erwähnung von "Prompt-Versionierung" **keine** Versionierung —
`pUpdatePrompt` überschreibt `PromptContent.content` hart, keine `PromptContentVersion`-Tabelle existierte
zum Zeitpunkt der Spec-Erstellung. Verifiziert durch Schema-Grep + Repository-Lesung, nicht nur CLAUDE.md geglaubt.

**Key decisions (non-negotiable laut Spec):**

- Nur `content` (Prompt-Text) wird versioniert — nicht Titel/Beschreibung/Felder. MVP-Scope bewusst eng.
- Snapshot-Modell: `PromptContentVersion` speichert den ALTEN Inhalt beim Save, `PromptContent.content`
  bleibt die aktuelle Fassung. Kein Sonderfall für "Version 1 bei Erstellung".
- Automatisch bei jedem Save mit geänderten Content (Dedup via String-Vergleich) — kein manueller
  "Version erstellen"-Button, um Friktion für Gelegenheitsnutzer zu vermeiden.
- Restore = läuft durch dieselbe Update/Snapshot-Pipeline wie normales Speichern → nichts geht je verloren.
- Optionale Änderungsnotiz (`versionNote`, max 500 Zeichen) — additiv zu `updatePromptSchema`, nicht auf
  `Prompt` persistiert, nur an die erzeugte Version gehängt.
- Tier-Gating: FREE sieht nur Versionsanzahl (Upgrade-Hebel), kein Content-Zugriff. BASIC: max. 20
  aufbewahrte Versionen (Rotation, älteste zuerst gelöscht). PRO: unbegrenzt. Erweitert bestehendes
  `TIER_FEATURES`-Pattern in `src/lib/subscription/access-control.ts` (`canAccessVersionHistory`,
  `maxStoredPromptVersions`).
- Wichtig: Versionszeilen werden für ALLE Tiers geschrieben (auch FREE), nur der UI-Zugriff ist gesperrt —
  bewusster Upgrade-Anreiz, als offene Frage (nicht Entscheidung) im Dokument markiert.
- Wiederverwendet bestehende Utilities `extractVariablesFromContent` /`resolveVariableStatus`
  (aus dem "Platzhalter"-Tab) für eine nicht-blockierende Warnung beim Restore, wenn die wiederhergestellte
  Version Platzhalter enthält, die aktuell nicht als Felder existieren.

**Offene, nicht entschiedene Fragen (siehe Spec §13):**

- Ob FREE-Nutzer wirklich unbegrenzt Versionen im Hintergrund ansammeln dürfen (Storage-Kosten-Frage).
- Marketplace-Käufer sehen nach einem Restore automatisch die neue Fassung (kein Kaufzeitpunkt-Snapshot,
  `ProductItem.templateId` referenziert live) — als rechtlich/vertrauensrelevanter Edge Case markiert,
  nicht gelöst.
- Workflow-Steps (`PROMPT_REF`) referenzieren Prompts ebenfalls live — Restore wirkt sich sofort auf
  Workflows aus, siehe [[project-workflows-feature]].

**How to apply:** Ground truth für Implementierungs-Review dieses Features. Bei verwandten Fragen zu
Content-Historie/Undo/Diff-Ansichten auf diese Spec verweisen. [[project-app-identity]]
[[feedback-spec-approach]]
