---
name: Explore Catalog Discovery Gaps (code-verified)
description: Konkrete, im Code verifizierte Lücken im /explore-Katalog gegenüber der ursprünglichen Spec und gegenüber Wettbewerbern — Stand 2026-07-27
type: project
---

Vollständige Spec: `docs/claude/implementation/explore-katalog-erweiterung-spec.md`.
Basis-Feature ist umgesetzt (`docs/claude/implementation/done/explore-feed.md`, AI-112,
shipped 2026-05-07) — diese Lücken sind Iteration 2, kein Rebuild.

## Verifiziert im Code (2026-07-27)

- **Nur 28 Catalog-Einträge** in `prisma/seeds/catalog.ts`, verteilt auf 7 Kategorien
  (`prisma/schema.prisma` `CatalogCategory`/`CatalogEntry`). Deutlich dünner als jeder
  analysierte Wettbewerber, siehe [[explore_de_competitors]].
- **Sortierung "Beliebt" fehlt trotz vorhandener Daten.** `DListSortByMode`
  (`src/data/types/domain/common.ts:29-34`) hat nur `TITLE_ASC/DESC`, `DATE_ASC/DESC`. Kein
  `POPULAR`/`copyCount`-Sort — obwohl `CatalogEntry.copyCount` existiert, getrackt wird und auf
  Karte + Detailseite bereits angezeigt wird (`catalog-entry-item.tsx`,
  `catalog-entry-view.tsx`). **Das war explizit MVP-Scope in der Ursprungs-Spec**
  (`explore-feed.md:98`: "Sort: Beliebt — Nach copyCount DESC") und wurde nie umgesetzt — eine
  Regression gegenüber eigener Planung, kein neuer Wunsch. Günstigster Quick-Win der gesamten
  Analyse (Daten sind da, nur Sortieroption fehlt).
- **`recommendedModel` ist reiner Anzeigetext, nicht filterbar** (`catalog.d.ts:17`,
  `catalog-entry-item.tsx:89`). Kein Modell-/Tool-Filter in `CatalogEntryFilters`/
  `CatalogSidebar`.
- **Keine Tags, nur eine Kategorie pro Eintrag** (`DCatalogEntry.category` ist Singular, kein
  Array).
- **Kein Beispiel-Output auf der Detailseite.** `catalog-entry-view.tsx` zeigt nur die
  Formularstruktur (Feldnamen/Typen als Vorschau), kein ausgefülltes Beispielergebnis.
  **Korrektur (2026-07-27, code-verifiziert in `use-prompt-form.tsx`):** Der "Live-Test" ist
  KEIN echter In-Platform-LLM-Call. Er füllt das Formular, zeigt die aufgelöste Vorlage als
  Text-Vorschau (`PromptPreview`) und bietet dann "Kopieren" oder "In KI öffnen" (öffnet
  ChatGPT/Claude/Gemini/Perplexity extern mit vorbefülltem Query-Parameter, `ai-services.ts`).
  Es gibt keinen gehosteten Modell-Aufruf und keinen tatsächlichen Output innerhalb der
  Plattform. Der reale Vorteil ist also "strukturierte Vorbefüllung + Ein-Klick-Handoff an
  Wunsch-Tool", nicht "Ergebnis vorher sehen". Das ist immer noch besser als reines
  Copy-Paste-Rohtext bei allen 5 Wettbewerbern, aber schwächer als in
  `explore-katalog-erweiterung-spec.md` (Abschnitt 3, 7) und in einer früheren Version dieser
  Memory-Datei dargestellt. Diese Dateien sollten bei nächster Bearbeitung entsprechend
  präzisiert werden.
- **Keine redaktionelle Content-Schicht** (Blog/Guides/FAQ) innerhalb von `/explore` — nur Katalog
  + Detailseiten.

**Why:** Diese Lücken sind alle Discovery-/Vertrauens-Lücken, nicht Kernprodukt-Schwächen — das
Kernprodukt (typisierte Felder, Live-Test, versionierbare Übernahme) bleibt allen analysierten
Wettbewerbern überlegen, siehe [[unfair_advantages]].

**How to apply:** Empfohlene Reihenfolge bei Umsetzung: Popularitäts-Sort (kein Schema-Change) →
Katalog-Tiefe (Content, kein Code) → Live-Test-Layout prominenter (nur UX) → Modell-Filter →
Tags → redaktioneller Content. Erst reine Sichtbarkeits-/Datenmaßnahmen ohne Migration, dann
strukturelle Schema-Erweiterungen. Vor jeder Umsetzung Datei-/Feld-Existenz erneut prüfen, da
sich `common.ts`/`catalog.d.ts` seit 2026-07-27 geändert haben könnten.
