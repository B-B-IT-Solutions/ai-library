# Feature-Spezifikation: Explore-Katalog — Wettbewerbsanalyse & Verbesserungen

**Bezieht sich auf:** `src/app/(public)/(explore)/explore/page.tsx`, `src/components/explore/**`,
`prisma/schema.prisma` (`CatalogEntry`, `CatalogCategory`, `CatalogEntryField`),
`prisma/seeds/catalog.ts`, `src/data/types/domain/common.ts` (`DListSortByMode`).
Vorgänger-Spec: `docs/claude/implementation/done/explore-feed.md` (AI-112, Status: umgesetzt).

**Priority:** P1 — Wachstumskritisch
**Effort:** Gemischt (siehe Priorisierung)
**Status:** Spezifikation
**Date:** 2026-07-27

---

## 0. Ausgangslage (Ist-Zustand, verifiziert im Code)

Der Explore-Feed (`/explore`) wurde am 2026-05-07 nach der Spec `explore-feed.md` gebaut und
funktioniert technisch wie geplant: eigenständige `CatalogEntry`-Domain, Kopier-Aktion in die
User-Library, Kategorie-Filter, Suche, Grid/List-Toggle. Das architektonische Fundament ist
solide. Das Problem liegt nicht in der Technik, sondern im **Inhalt und in der Discovery-Tiefe**:

- **Nur 28 Catalog-Einträge** über **7 Kategorien** verteilt (`prisma/seeds/catalog.ts`,
  verifiziert per `grep -c "slug:"`). Das ist weniger als jede in diesem Dokument analysierte
  Konkurrenzseite — selbst die kleinste (promptvorlage.de) wirkt durch dichtere Kategorien
  breiter.
- **Sortierung kennt keine Popularität.** `DListSortByMode`
  (`src/data/types/domain/common.ts:29-34`) hat nur `TITLE_ASC/DESC` und `DATE_ASC/DESC`. Dabei
  trackt `CatalogEntry.copyCount` bereits Nutzung und wird auf der Karte
  (`catalog-entry-item.tsx:49-58`) und der Detailseite bereits angezeigt. **Das war in der
  Ursprungs-Spec explizit MVP-Scope** ("Sort: Beliebt — Nach `copyCount DESC`",
  `explore-feed.md:98`) und ist nie umgesetzt worden — eine Regression gegenüber der eigenen
  Planung, kein neuer Wunsch.
- **Keine Modell-/Tool-Filterung.** `recommendedModel` ist ein freier String pro Eintrag
  (`catalog.d.ts:17`), wird auf der Karte nur als Text angezeigt (`catalog-entry-item.tsx:89`),
  aber ist **nicht filterbar**. Nutzer, die gezielt "Prompts für Claude" oder "für Midjourney"
  suchen, haben keinen Einstiegspunkt.
- **Kein Autor/Ersteller, keine Bewertung, keine Tags** — nur eine einzelne Kategorie pro
  Eintrag (`DCatalogEntry.category: DCatalogEntryCategory | null`, `catalog.d.ts:19`), kein
  Tag-Array.
- **Kein Beispiel-Output.** Der Detail-View (`catalog-entry-view.tsx`) zeigt Formularfelder als
  Vorschau, aber nirgends ein Beispiel, wie ein ausgefülltes Ergebnis aussieht — obwohl das
  "In-Platform Testing" (`UsePromptDialog`, AI-Priorität 2, verifiziert vorhanden über
  `use-entry-lazy-button.tsx`) diesen Beweis technisch bereits liefern könnte, wenn er
  prominenter beworben würde.
- **Keine redaktionelle Tiefe.** Es gibt keine Blog-/Guide-/FAQ-Inhalte im Explore-Bereich, die
  Longtail-SEO-Traffic erzeugen könnten (z.B. "ChatGPT Prompt für Kündigungsschreiben").
- **Kein Wachstumsloop über den reinen Feed hinaus.** Kein Newsletter-Capture, kein "Prompt der
  Woche", kein dynamischer Live-Zähler als Social Proof.

---

## 1. Wettbewerbsanalyse

### 1.1 Analysierte Wettbewerber (vom Nutzer genannt + eigene Recherche, Stand 2026-07)

| Anbieter                 | Sprache                     | Umfang (behauptet)                                                                               | Geschäftsmodell                                                   | Kern-Differenzierung                                                                                                                                                         |
| ------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **prompta.ch**           | DE                          | 1.083+ Prompts, 10 Kategorien nach Tool (57+ Tools: ChatGPT, Claude, Midjourney, FLUX, Cursor …) | Komplett kostenlos, Newsletter                                    | Tool-first Navigation (Kategorie → Tool → Use-Case), tägliche "Intelligence-Reports", Trend-Content (XML-Wrapper, Self-Correction Loops), Tool-Vergleichsseiten, Live-Zähler |
| **promptarchiv.de**      | DE (UI), EN (Prompt-Inhalt) | 1.036+ Prompts, 10 "Abteilungen" (Business-Sprache statt Tech-Jargon)                            | Hybrid: Gratis-Teilmenge + einmalig 12€ für Vollzugang (kein Abo) | Prompt-Finder-Wizard, Status-Badges Gratis/Premium direkt auf der Karte, klare Business-Taxonomie (HR, Buchhaltung, Kundenservice)                                           |
| **promptvorlage.de**     | DE                          | 6 Themenbereiche                                                                                 | Komplett kostenlos                                                | Eingebauter Prompt-Generator (interaktives Tool, nicht nur Browse), Platzhalter-System                                                                                       |
| **aipromptgalaxy.de**    | DE                          | 500.000+ Prompts (ChatGPT, Claude, Gemini)                                                       | Freemium mit Tageslimit (5 kostenlose Prompts/Tag)                | Reine Massen-/Scale-Positionierung als Verkaufsargument                                                                                                                      |
| **getpromptlibrary.com** | EN (+7 weitere Sprachen)    | 127 kuratierte Prompts                                                                           | Komplett kostenlos, kein Signup                                   | **Beispiel-Output direkt auf der Karte** + "Pro-Tipps" zur Wirkweise, Doppel-Taxonomie nach Jobrolle UND Aufgabe (nicht nur Thema)                                           |

### 1.2 Bereits bekannte Wettbewerber (aus vorheriger Analyse, siehe `market_landscape_2026.md`)

PromptBase (220K+ Listings, Pay-per-Prompt), FlowGPT (10M+ User, Community/Chat),
AIPRM (2M+ User, ChatGPT-Extension) — englischsprachiger, internationaler Markt. Die hier neu
analysierten Anbieter sind **deutschsprachige Nischenkonkurrenten** mit kleinerem, aber
direkterem Zielgruppen-Overlap (DACH-Raum, gleiche Sprache wie diese Plattform).

### 1.3 Feature-Matrix

| Feature                                         | Diese Plattform (/explore) | prompta.ch            | promptarchiv.de       | promptvorlage.de                  | aipromptgalaxy.de        | getpromptlibrary.com |
| ----------------------------------------------- | -------------------------- | --------------------- | --------------------- | --------------------------------- | ------------------------ | -------------------- |
| Anzahl Prompts                                  | **28**                     | 1.083+                | 1.036+                | mittel                            | 500.000+                 | 127 (kuratiert)      |
| Strukturierte, typisierte Formularfelder        | ✅ **einzigartig**         | ❌ (Platzhalter-Text) | ❌ (Platzhalter-Text) | ❌ (Platzhalter-Text)             | ❌                       | ❌                   |
| In-Platform Testing (Output live generieren)    | ✅ **einzigartig**         | ❌                    | ❌                    | ❌ (nur Generator, kein LLM-Call) | ❌                       | ❌                   |
| Beispiel-Output sichtbar (statisch, vorab)      | ❌                         | ❌                    | ❌                    | ❌                                | ❌                       | ✅                   |
| Sortierung nach Beliebtheit/Nutzung             | ❌ (Regression, siehe 0.)  | teils (Live-Zähler)   | ❌                    | ❌                                | ❌                       | ❌                   |
| Filter nach Ziel-Tool/Modell (ChatGPT/Claude/…) | ❌                         | ✅ (57+ Tools)        | ❌                    | ❌                                | ✅                       | ✅                   |
| Tags (Mehrfachzuordnung)                        | ❌ (nur 1 Kategorie)       | teils                 | ✅                    | ❌                                | —                        | —                    |
| Free/Premium-Kennzeichnung auf Karte            | ❌                         | n/a (alles frei)      | ✅                    | n/a                               | teils (Tageslimit)       | n/a                  |
| Redaktioneller Content (Blog/Guides/FAQ)        | ❌                         | ✅ stark              | ✅                    | ❌                                | —                        | ✅                   |
| Eigene Bibliothek nach Kopie versionierbar      | ✅ **einzigartig**         | ❌                    | ❌                    | ❌                                | ❌                       | ❌                   |
| Account/Login nötig für Kernnutzen              | Nein (Browse), Ja (Kopie)  | Nein                  | Nein                  | Nein                              | Ja (Tageslimit-Tracking) | Nein                 |
| Newsletter/Wachstumsloop                        | ❌                         | ✅                    | ✅                    | ❌                                | —                        | ❌                   |

**Kernbefund:** Diese Plattform hat die technisch anspruchsvollste Basis (typisierte Felder +
Live-Testing + Versionierung nach Übernahme) — aber **jeder einzelne Wettbewerber schlägt sie
in mindestens einer sichtbaren Discovery-Dimension**: Menge, Filterierbarkeit nach Tool,
Beispiel-Vorschau oder redaktionelle Tiefe. Für einen Erstbesucher, der die Seite mit einem der
obigen Anbieter vergleicht, wirkt `/explore` **dünner**, obwohl die zugrunde liegende
Technologie überlegen ist. Das deckt sich mit der bereits gespeicherten Erkenntnis
(`build_priorities.md`): der technische Vorsprung ist nicht sichtbar genug gemacht.

---

## 2. Kritische Probleme (Ist / Soll / Begründung)

### 2.1 Zu geringe Katalog-Tiefe wirkt wie eine unfertige Seite

|                |                                                                                                                                                                                                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ist**        | 28 Einträge auf 7 Kategorien verteilt — teils nur 2-3 Einträge pro Kategorie (z.B. "Musik & Audio"-Äquivalent bei prompta.ch hat ebenfalls nur 5, ist aber die Ausnahme, nicht die Regel).                                                                                                    |
| **Soll**       | Kurzfristig: Seed-Erweiterung auf **mind. 80-120 Einträge**, mind. 8-10 pro Kategorie, bevor Marketing/SEO-Aktivitäten für `/explore` verstärkt werden. Mittelfristig: Content-Pipeline (Priorität 2, siehe unten), damit die Zahl kontinuierlich wächst statt einmalig aufgefüllt zu werden. |
| **Begründung** | Jeder analysierte Wettbewerber positioniert die schiere Menge als Vertrauenssignal ("500.000+", "1.083+"). Eine dünne Kategorie wirkt für Erstbesucher wie ein verlassenes Produkt, unabhängig von der Qualität einzelner Einträge.                                                           |

### 2.2 `copyCount` wird getrackt und angezeigt, aber nicht zum Sortieren genutzt

|                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ist**        | `DListSortByMode` (`common.ts:29-34`) hat nur Titel/Datum. `copyCount` existiert im Schema, im Domain-Typ und in der UI (Karte + Detail), aber keine Sortierfunktion nutzt es.                                                                                                                                                                                                                                                                                                                                                      |
| **Soll**       | Neuer Wert `POPULAR_DESC = "desc(copyCount)"` in `DListSortByMode` (oder separates Enum, falls Kollision mit Prompts-Dashboard-Semantik vermieden werden soll — dort ergibt `copyCount` keinen Sinn). Als **Standard-Sortierung** für `/explore` setzen (aktuell keine explizite Default-Sortierung ersichtlich in `catalog-search-params.ts` — sollte geprüft werden). Repository-seitig: `pGetPublishedEntriesPage` um `ORDER BY copy_count DESC` erweitern (analog zu bereits in `explore-feed.md:98` spezifiziertem Verhalten). |
| **Begründung** | Geringster Aufwand mit sofortiger Wirkung: Daten sind bereits vorhanden, es fehlt nur die Sortieroption. Beliebtheits-Sortierung ist zudem die **einzige** Form von Qualitätssignal, die ohne neues Bewertungssystem (Priorität 7 laut `build_priorities.md`) sofort nutzbar ist.                                                                                                                                                                                                                                                   |

### 2.3 Keine Filterung nach Ziel-KI-Modell/Tool

|                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Ist**        | `recommendedModel: string` ist Freitext, nur textuell auf der Karte sichtbar (`catalog-entry-item.tsx:89`), keine Filterkomponente.                                                                                                                                                                                                                                                                                                                                                  |
| **Soll**       | `recommendedModel` in eine begrenzte Werteliste überführen (z.B. `GPT-4o`, `Claude`, `Gemini`, `Midjourney` etc. — analog zu `PromptFieldType`-Enum-Mustern im Projekt) und als zusätzlichen Filter neben Kategorie in `CatalogEntryFilters`/`CatalogSidebar` einbauen. Alternative mit geringerem Migrationsaufwand: Modell weiterhin als String, aber Filter-Query erlaubt Mehrfachauswahl über die tatsächlich vorkommenden, distinct-Werte (dynamisch geladen, kein Enum nötig). |
| **Begründung** | 3 von 5 analysierten Wettbewerbern (prompta.ch, aipromptgalaxy.de, getpromptlibrary.com) machen die Tool-Auswahl zur primären oder sekundären Navigationsachse. Nutzer denken oft zuerst "Ich habe Zugang zu X" und erst danach an den Anwendungsfall.                                                                                                                                                                                                                               |

### 2.4 Keine Vorschau des Ergebnisses vor der Übernahme

|                |                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Ist**        | Der Detail-View zeigt nur die Formularstruktur (Feldnamen, Typen), nicht wie ein ausgefülltes Ergebnis aussieht. Das "Anwenden"-Feature (`UseCatalogEntryLazyButton` → `UsePromptDialog`) kann zwar live einen Output erzeugen, ist aber als reine Nutzungs-Aktion positioniert, nicht als "Beweis"-Element auf der Seite selbst.                                                          |
| **Soll**       | Auf `/explore/[slug]` einen statischen "Beispiel-Ergebnis"-Block ergänzen (redaktionell gepflegtes Beispiel mit Platzhalter-Werten, ähnlich `getpromptlibrary.com`), **zusätzlich** zum bereits vorhandenen Live-Test. Der Live-Test bleibt der stärkere Beweis, sollte aber prominenter über der Faltkante beworben werden statt nur als sekundärer Button neben "In Library übernehmen". |
| **Begründung** | "Buy blind" ist laut eigener Wettbewerbsanalyse (`competitor_weaknesses.md`) die größte PromptBase-Schwäche, die diese Plattform bereits technisch löst — aber die Lösung ist auf der Explore-Seite selbst nicht sichtbar genug inszeniert. Ein statisches Beispiel kostet nichts an Infrastruktur und schafft sofortiges Vertrauen, auch für Nutzer, die den Live-Test nicht anklicken.   |

### 2.5 Keine Mehrfach-Tags, nur eine Kategorie pro Eintrag

|                |                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ist**        | `DCatalogEntry.category: DCatalogEntryCategory \| null` — genau eine Kategorie, kein Tag-Array.                                                                                                                                                                                                                                                                                                                      |
| **Soll**       | Optionales `tags: string[]`-Feld ergänzen (analog zum Muster in `kategorien-feature-spec.md` für User-Prompts, aber als **globale, redaktionell gepflegte** Tag-Liste, konsistent mit der bewussten Trennung Catalog vs. User-Domain aus `architecture_catalog_domain.md`). Tags ermöglichen Querschnitts-Filterung (z.B. "E-Mail" + "Kundenservice" gleichzeitig), die eine einzelne Kategorie nicht abbilden kann. |
| **Begründung** | promptarchiv.de nutzt sichtbare Aufgaben-Tags ("Protokoll", "Action Items") zusätzlich zur groben Abteilungs-Kategorie — das schafft feinere Auffindbarkeit ohne die Kategorie-Taxonomie aufzublähen.                                                                                                                                                                                                                |

### 2.6 Keine redaktionelle Content-Schicht (Blog/Guides/FAQ) im Explore-Bereich

|                |                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ist**        | `/explore` besteht ausschließlich aus der Katalog-Liste und Detailseiten. Keine Longtail-Landingpages.                                                                                                                                                                                                                                                                                                          |
| **Soll**       | Nicht Teil dieser Spec im Detail (eigenständiges Feature), aber als Lücke dokumentiert: Guides wie "Wie schreibe ich einen guten ChatGPT-Prompt" oder Tool-Vergleichsseiten ("ChatGPT vs. Claude für Marketing-Texte") würden zusätzlichen organischen Traffic erschließen, den `explore-feed.md` bereits als Ziel definiert hat (SEO-Impressions), aber bisher nur über einzelne Prompt-Detailseiten verfolgt. |
| **Begründung** | 3 von 5 Wettbewerbern (prompta.ch, promptarchiv.de, getpromptlibrary.com) fahren genau diese Strategie zusätzlich zum reinen Katalog. Empfehlung: separates Ticket, hier nur als Gap benannt, damit es nicht verloren geht.                                                                                                                                                                                     |

---

## 3. Was bereits stärker ist als jeder Wettbewerber (nicht schwächen!)

Zur Einordnung — diese Punkte sollen durch die obigen Änderungen **nicht verwässert** werden:

1. **Typisierte Formularfelder statt Copy-Paste-Text mit `{platzhalter}`.** Alle 5 analysierten
   Wettbewerber arbeiten mit rohem Text und manueller Platzhalter-Ersetzung durch den Nutzer.
   Keiner hat strukturierte Eingabeformulare mit Feldtypen (SELECT, CHECKBOX, DATE etc.).
2. **Live-Test mit echtem LLM-Output vor der Übernahme.** Kein einziger Wettbewerber bietet das
   — auch getpromptlibrary.com zeigt nur ein statisches, redaktionelles Beispiel, keinen
   Live-Call.
3. **Übernahme in eine versionierbare, private Library statt reinem Copy-Paste in die
   Zwischenablage.** Alle Wettbewerber enden beim "Kopieren"-Button; niemand bietet einen
   Übergang in ein strukturiertes, persönliches, weiterentwickelbares Asset.

→ Die in Abschnitt 2 vorgeschlagenen Änderungen zielen ausschließlich auf **Discovery- und
Vertrauens-Lücken**, nicht auf das Kernprodukt.

---

## 4. Priorisierung (MVP vs. Folgeschritte)

| Maßnahme                                                                        | Aufwand                                | Abschnitt | Sofort umsetzbar?                           |
| ------------------------------------------------------------------------------- | -------------------------------------- | --------- | ------------------------------------------- |
| Sortierung "Beliebt" (`copyCount DESC`) ergänzen                                | **Gering**                             | 2.2       | ✅ Daten bereits vorhanden                  |
| Katalog-Tiefe auf 80-120 Einträge erweitern                                     | Mittel (Content-Erstellung, kein Code) | 2.1       | ✅ reine Seed-Erweiterung                   |
| Statisches Beispiel-Ergebnis auf Detailseite                                    | Mittel                                 | 2.4       | Neues Feld `exampleOutput` je Eintrag nötig |
| Live-Test auf Detailseite prominenter platzieren (UX-Umbau, kein neues Feature) | Gering                                 | 2.4       | ✅ nur Layout-Änderung                      |
| Modell-/Tool-Filter                                                             | Mittel                                 | 2.3       | Ggf. Migration für Werteliste               |
| Tags (Mehrfachzuordnung)                                                        | Mittel-Hoch                            | 2.5       | Neues Schema-Feld + Migration + Filter-UI   |
| Redaktionelle Content-Schicht (Blog/Guides)                                     | Hoch                                   | 2.6       | Eigenständiges Folge-Ticket                 |

**Empfohlene Reihenfolge:** 2.2 → 2.1 → 2.4 (Live-Test-Layout) → 2.3 → 2.5 → 2.4 (statisches
Beispiel-Feld) → 2.6. Die ersten drei Schritte sind reine Sichtbarkeits-/Datenmaßnahmen ohne
Schema-Änderungen und sollten vor den strukturellen Erweiterungen (2.3, 2.5) umgesetzt werden.

---

## 5. Abhängigkeiten

- `src/data/types/domain/common.ts` — `DListSortByMode` um `POPULAR_DESC` erweitern; prüfen, ob
  ein geteiltes Enum mit dem Prompts-Dashboard (`prompts-toolbar.tsx`) sinnvoll bleibt oder ein
  catalog-spezifisches Sort-Enum sauberer ist (Prompts-Dashboard hat keine `copyCount`-Semantik).
- `src/data/repositories/catalog/catalog.public.repository.ts` — `ORDER BY` um
  `copy_count DESC` erweitern.
- `src/components/explore/lists/toolbar/sort-by/catalog-sort-by-select.tsx` — neuer
  `SelectItem` für "Beliebt".
- `prisma/schema.prisma` (`CatalogEntry`) — für 2.3/2.5: neue Felder `tags Json?` oder eigene
  `CatalogEntryTag`-Relation, ggf. `exampleOutput String?` für 2.4. Migration erforderlich.
- `prisma/seeds/catalog.ts` — Erweiterung um weitere Einträge (2.1) sowie neue Felder (2.4/2.5),
  falls diese umgesetzt werden.
- Keine Auswirkung auf `PromptTemplateDescriptor`/User-Domain — bleibt gemäß
  `architecture_catalog_domain.md` strikt getrennt.

---

## 6. Tier-Einordnung

Alle in dieser Spec vorgeschlagenen Maßnahmen betreffen den **öffentlichen, auth-freien**
Explore-Bereich und sind bewusst **nicht** Tier-gebunden — Ziel ist maximale Akquisitions-
Reichweite, nicht Monetarisierung an dieser Stelle. Die Übernahme-Aktion in die eigene Library
bleibt wie bisher unabhängig von dieser Spec durch bestehende Tier-Limits (`DPromptsUsage`)
geregelt.

---

## 7. Positionierung (Ableitung aus der Analyse)

Gegenüber den hier analysierten deutschsprachigen Nischen-Konkurrenten (anders als gegenüber
PromptBase/FlowGPT/AIPRM, siehe `positioning_angles.md`) ist die schärfste Botschaft:

> **"Andere lassen dich Text kopieren. Wir lassen dich das Ergebnis vorher sehen."**

Denn keiner der 5 analysierten Wettbewerber bietet einen echten Live-Test vor der Nutzung — das
ist der am wenigsten kopierbare, sofort erlebbare Unterschied, sobald Abschnitt 2.4 (Sichtbarkeit
des Live-Tests) umgesetzt ist. Diese Botschaft funktioniert nur, wenn vorher die
Discovery-Lücken (2.1–2.3) geschlossen sind — sonst verlässt der Nutzer die Seite, bevor er
diesen Vorteil überhaupt entdeckt.
