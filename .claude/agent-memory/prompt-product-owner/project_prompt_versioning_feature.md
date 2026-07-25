---
name: project-prompt-versioning-feature
description: Prompt-Text-Versionierung Feature — explizite Versionierung via Split-Button-Option "Speichern als neue Version" an "Speichern" (NICHT Checkbox, NICHT zweiter Button, NICHT automatisch), BASIC+PRO Zugriff
metadata:
   type: project
---

**Feature:** Prompt-Text-Versionierung (Content-Historie für `PromptContent.content`)

**Status:** Spezifiziert, bereit zur Implementierung (2026-07-25, überarbeitet). Spec liegt in
`docs/claude/implementation/prompt-content-versioning-feature-spec.md` (noch nicht in `done/`,
da noch nicht implementiert — `done/` in diesem Repo bedeutet tatsächlich gebaut, nicht nur spezifiziert;
vgl. `workflows-feature-spec.md`, das erst nach Implementierung nach `done/` wanderte).

**Why:** Codebase hatte trotz CLAUDE.md-Erwähnung von "Prompt-Versionierung" **keine** Versionierung —
`pUpdatePrompt` überschreibt `PromptContent.content` hart, keine `PromptContentVersion`-Tabelle existierte
zum Zeitpunkt der Spec-Erstellung. Verifiziert durch Schema-Grep + Repository-Lesung, nicht nur CLAUDE.md geglaubt.

**Korrektur nach erster Fassung (wichtig!):** Erste Version dieser Spec sah automatisches Snapshotting bei
JEDER Content-Änderung vor (Git-artiger Audit-Trail). Nutzer korrigierte das explizit: Versionierung muss
**opt-in** sein — der Nutzer entscheidet pro Save bewusst, ob eine Version entsteht, nicht die App automatisch.
Begründung des PO (nicht des Nutzers wörtlich, sondern hergeleitet): automatische Versionierung bei jedem
Save hätte die Historie mit trivialen Zwischenständen geflutet und den Wert des Features (Auffinden einer
*bedeutsamen* früheren Fassung) verwässert. **Diese Korrektur ist die maßgebliche Design-Entscheidung —
bei jeder Weiterarbeit an diesem Feature zuerst prüfen, ob noch mit dem opt-in-Modell gearbeitet wird.**

**Zweite Korrektur (UI-Mechanismus, 2026-07-25):** Erste Überarbeitung sah eine Checkbox "Als neue Version
speichern" neben dem Content-Editor vor (opt-in, aber versteckt in einem Formular-Detail). Nutzer korrigierte
das erneut: er will einen **zweiten, eigenständigen Button** "Speichern als neue Version" direkt neben dem
bestehenden "Speichern"-Button (Header + Mobile-Footer in `prompt-edit.tsx`) — keine Checkbox. Umgesetzt via
`event.nativeEvent.submitter` (Standard-DOM-API), beide Buttons `type="submit"` mit `form={formId}`-Bindung
auf dasselbe Formular, unterschieden per `name="intent" value="version"|"normal"`. **Lehre: bei diesem Nutzer
nicht von einer Checkbox/Options-Feld ausgehen, wenn "der Nutzer soll wählen können" gesagt wird — bevorzugt
sichtbare, gleichrangige Buttons statt versteckter Formular-Optionen.** Backend-Contract (`saveAsVersion`/
`versionNote` in `DPromptUpdate`) blieb bei beiden Korrekturen unverändert — nur der Client-Trigger ändert sich.

**Dritte Korrektur (Snapshot-Richtung, 2026-07-25):** Zweite Überarbeitung ließ beim Klick auf "Speichern als
neue Version" den NEUEN (gerade eingegebenen) Text zur Version werden. Nutzer korrigierte: das ist nicht
nutzerfreundlich — erwartet wird, dass VOR dem Aktualisieren des Contents der BISHERIGE Text als Version
gesichert wird (Sicherheitsnetz-Mental-Model: "bevor ich überschreibe, wird das Alte aufgehoben"). Das ist
exakt die Regel, die der Restore-Flow von Anfang an schon hatte — jetzt für beide Aufrufer (Editor-Button UND
Restore) vereinheitlicht: `pUpdatePromptWithVersioning` liest IMMER zuerst den aktuellen (bisherigen) Content
und sichert genau diesen, bevor der neue Content geschrieben wird. Das eliminierte einen zuvor nötigen
internen `isRestoreOperation`-Marker komplett — schöne Nebenwirkung: eine einzige Regel statt zwei Sonderfälle.
**Lehre: bei "Version speichern"-artigen Features im Zweifel das Sicherheitsnetz-Modell (alter Zustand wird
bewahrt) annehmen, nicht das Checkpoint-Modell (neuer Zustand wird benannt) — Nutzer denkt in "bevor ich etwas
riskiere, sichere ich den Ist-Zustand", nicht in "ich benenne das Ergebnis meiner Änderung".**

**Vierte Korrektur (UI-Komposition, 2026-07-25):** Dritte Überarbeitung zeigte "Speichern" und "Speichern als
neue Version" als zwei gleichrangige, nebeneinanderstehende Buttons. Nutzer korrigierte: "Speichern als neue
Version" soll keine eigene Schaltfläche sein, sondern eine **Split-Button-Option** von "Speichern" (primäres
Segment "Speichern" + Chevron öffnet Dropdown mit der Option). Löst nebenbei das zuvor dokumentierte Mobile-
Crowding-Problem (drei Buttons nebeneinander). Technisch umgesetzt ohne die RHF-Instanz in die Parent-
Komponente (`prompt-edit.tsx`) heben zu müssen: primäres Segment bleibt natives `<button type="submit"
form={formId}>`, der Dropdown-Menüeintrag klickt programmatisch ein zweites, verstecktes Submit-Element mit
`value="version"` — die bereits gebaute `submitter`-basierte Unterscheidung in `prompt-form.tsx` (dritte
Korrektur) bleibt dadurch unverändert gültig. **Lehre: bei diesem Nutzer UI-Vorschläge tendenziell kompakter/
konsolidierter erwarten (Split-Button statt zwei Buttons, Button statt Checkbox war die Gegenrichtung bei
Korrektur 2 — die gemeinsame Linie ist "sichtbar und direkt erreichbar, aber nicht redundant/raumgreifend").**

**Fünfte Korrektur (FREE-Sichtbarkeit, 2026-07-25):** Vierte Überarbeitung blendete das Split-Button-Chevron
für FREE-Nutzer im Editor komplett aus ("kein totes UI-Element" — meine eigene Annahme, nicht vom Nutzer
verlangt). Nutzer korrigierte: FREE soll den Button/die Option **sehen**, sie aber **nicht anklicken können**
— sichtbar-aber-disabled statt komplett versteckt, mit Lock-Icon + Tooltip ("Ab BASIC verfügbar"). Macht die
Sidebar (§5.2, war schon immer "sichtbar mit CTA") und den Editor jetzt konsistent — die zuvor als "bewusste
Inkonsistenz" dokumentierte offene Frage #1 ist dadurch aufgelöst. **Lehre: bei diesem Nutzer für FREE-Tier-
Gating generell "sichtbar aber gesperrt" (Feature-Teasing/Upgrade-Anreiz) gegenüber "komplett versteckt"
bevorzugen, wenn nicht explizit anders gesagt — nicht von mir aus auf "kein totes UI-Element" schließen.**

**Sechste Korrektur (API-Signatur, 2026-07-25):** Fünfte Überarbeitung mischte `saveAsVersion`/`versionNote`
in den `DPromptUpdate`-Datenpayload (`updatePrompt(id, { ...data, saveAsVersion })`, additive Felder auf
`updatePromptSchema`). Nutzer korrigierte: `saveAsVersion` gehört **nicht** in den Data-Payload, sondern als
**zusätzlicher Parameter des Funktionsaufrufs**. Umgesetzt als dritter, optionaler Parameter `versionOptions:
DPromptUpdateOptions` auf `updatePrompt`/`pUpdatePromptWithVersioning`, mit eigenem Zod-Schema
`promptVersionOptionsSchema` — `updatePromptSchema`/`DPromptUpdate` bleiben dadurch von diesem Feature
komplett unangetastet. **Lehre: generelles API-Design-Prinzip für diesen Nutzer — Verhaltensoptionen eines
Aufrufs (wie/ob etwas passiert) nicht mit der eigentlichen Nutzlast (was gespeichert wird) im selben Objekt
vermischen. Bei künftigen Feature-Flags/Optionen an bestehenden Update-Funktionen default zu einem separaten
Options-Parameter greifen, nicht additiv ins Domain-Update-Objekt spreaden.**

**Key decisions (non-negotiable laut aktueller Spec):**

- Nur `content` (Prompt-Text) wird versioniert — nicht Titel/Beschreibung/Felder. MVP-Scope bewusst eng.
- **Explizites Modell über Split-Button:** "Speichern" (primäres Segment, erzeugt nie eine Version) + Chevron-
  Dropdown mit Option "Speichern als neue Version" (nicht Checkbox, nicht zweiter gleichrangiger Button).
  Normales Speichern erzeugt NIE eine Version. Version = Snapshot des BISHERIGEN Inhalts (nicht des neuen!),
  gesichert unmittelbar bevor er überschrieben wird — Sicherheitsnetz-Modell, kein Audit-Trail und kein
  "Checkpoint des Ergebnisses". Chevron/Dropdown nur im Edit-Modus sichtbar (nicht bei Neuanlage) und nur für
  BASIC/PRO — reduziert sich sonst auf einen einfachen "Speichern"-Button ohne Chevron.
- Restore ist die einzige Stelle mit einer sicheren Voreinstellung (Checkbox "Aktuelle Fassung vorher
  sichern" ist dort standardmäßig AN) — einzige Ausnahme vom sonst konsequenten Opt-in, weil dort echter
  unwiderruflicher Datenverlust droht (die "aktuelle, unversionierte" Fassung existiert sonst nirgends).
- Optionale Änderungsnotiz (`versionNote`, max 500 Zeichen) — Teil von `DPromptUpdateOptions`/
  `promptVersionOptionsSchema` (eigenes Schema, NICHT `updatePromptSchema`), nicht auf `Prompt` persistiert,
  nur an die erzeugte Version gehängt.
- Tier-Gating: FREE **sieht** die Versionierungs-Option im Editor (Chevron sichtbar, wie BASIC/PRO), der
  Menüeintrag ist aber `disabled` mit Lock-Icon + Tooltip "Ab BASIC verfügbar" — sichtbar-aber-gesperrt, nicht
  versteckt. Serverseitiger Guard (`VERSION_HISTORY_UPGRADE_REQUIRED`) schützt zusätzlich vor API-Bypass.
  BASIC: max. 20 aufbewahrte Versionen (Rotation, älteste zuerst gelöscht). PRO: unbegrenzt. Erweitert
  bestehendes `TIER_FEATURES`-Pattern in `src/lib/subscription/access-control.ts` (`canAccessVersionHistory`,
  `maxStoredPromptVersions`).
- FREE sammelt weiterhin KEINE Versionen im Hintergrund (da ohne erfolgreiche Nutzeraktion nichts entsteht,
  der disabled Menüeintrag kann ja nicht geklickt werden) — kein "stiller Upgrade-Köder" durch angesammelte
  Daten, sondern reines UI-Teasing der Funktion selbst.
- Wiederverwendet bestehende Utilities `extractVariablesFromContent`/`resolveVariableStatus`
  (aus dem "Platzhalter"-Tab) für eine nicht-blockierende Warnung beim Restore, wenn die wiederhergestellte
  Version Platzhalter enthält, die aktuell nicht als Felder existieren.

**Offene, nicht entschiedene Fragen (siehe Spec §13):**

- Ob der disabled Menüeintrag bei FREE zusätzlich klickbar sein soll (öffnet Upgrade-Toast) statt rein
  passiv per Tooltip zu informieren.
- Marketplace-Käufer sehen nach einem Restore automatisch die neue Fassung (kein Kaufzeitpunkt-Snapshot,
  `ProductItem.templateId` referenziert live) — als rechtlich/vertrauensrelevanter Edge Case markiert,
  nicht gelöst.
- Ob das BASIC-Limit von 20 Versionen im expliziten (selteneren) Modell noch passend bemessen ist.
- Workflow-Steps (`PROMPT_REF`) referenzieren Prompts ebenfalls live — Restore wirkt sich sofort auf
  Workflows aus, siehe [[project-workflows-feature]].

**How to apply:** Ground truth für Implementierungs-Review dieses Features. Bei verwandten Fragen zu
Content-Historie/Undo/Diff-Ansichten auf diese Spec verweisen — und IMMER das explizite Opt-in-Modell als
Ausgangspunkt nehmen, nicht das ursprüngliche automatische Modell. [[project-app-identity]]
[[feedback-spec-approach]]
