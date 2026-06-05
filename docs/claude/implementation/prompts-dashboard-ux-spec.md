# UX-Spezifikation: Prompts Dashboard

Bezieht sich auf: `src/components/prompts/prompts-dashboard.tsx` und zugehörige Subkomponenten.

---

## 1. Kritische Probleme (Broken / Misleading)

### 1.1 Falsche Ergebnisanzahl in der Toolbar

|                |                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Ist**        | `totalEntries` ist hardcoded auf `1` – die Toolbar zeigt immer "1 Vorlage" an, unabhängig vom tatsächlichen Inhalt |
| **Soll**       | Echter Wert aus `data.pages[0].totalEntries` (Code bereits auskommentiert in `templates-toolbar.tsx` vorhanden)    |
| **Begründung** | Irreführendes UI-Feedback – User können nicht einschätzen, wie viele Ergebnisse ihre Filterkriterien liefern       |

---

### 1.2 Filter-Reset-Button ist kaputt

|                |                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Ist**        | `onClick` im Reset-Button von `LibraryFilters` auskommentiert – Button ist sichtbar, aber tut nichts              |
| **Soll**       | `resetFilters`-Funktion implementieren: alle drei Filter-States auf Leer-Werte zurücksetzen und Popover schließen |
| **Begründung** | Sichtbare UI-Elemente ohne Funktion zerstören das Vertrauen in die gesamte Oberfläche                             |

---

## 2. UX-Verbesserungen (Usability)

### 2.1 Filter-Konsolidierung: Zwei Stellen → Eine

|                |                                                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ist**        | Collections-Filter lebt im Header-Bereich, Library-Filters (Search/Categories/Models) in der Toolbar → User muss zwei separate Bereiche bedienen                                  |
| **Soll**       | Alle Filter in der Toolbar zusammenführen. Collections als erste Filter-Option im bestehenden Popover (eigene Sektion), oder als horizontale Chip-Leiste direkt unter der Toolbar |
| **Begründung** | Filterlogik gehört an einen Ort. Die aktuelle Aufteilung erzeugt mentalen Overhead und versteckt die Filter-Mächtigkeit des Systems                                               |

**Empfohlene neue Toolbar-Struktur:**

```
[Grid/List Toggle] | [🔍 Suche] [Filter ▾ (2)] [Sortierung ▾] | 42 Vorlagen
                                        ↑
                           Popover: Search + Collections + Categories + Models
```

---

### 2.2 Sammlungen als primäre Navigation sichtbar machen

|                |                                                                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Ist**        | Collections-Filter versteckt hinter einem Dropdown-Button im Header-Bereich; aktive Collections zeigen nur eine Zahl-Badge                                                                                   |
| **Soll**       | Option A: Horizontale scrollbare Collection-Chip-Leiste direkt unter dem Header (ähnlich Tab-Navigation mit farbigen Folder-Icons). Option B: Linke Sidebar mit Collections-Liste für persistente Navigation |
| **Begründung** | Collections sind eine Kernfunktion zum Organisieren von Prompts – sie müssen sichtbar und schnell erreichbar sein, nicht hinter einem Dropdown versteckt                                                     |

**Empfehlung:** Option A (Chip-Leiste) — weniger Layout-Aufwand, passt besser zum bestehenden Design-System:

```
[Alle] [🟦 Work Prompts ×] [🟢 Creative] [🟡 Research] [+ Neue Sammlung]
```

---

### 2.3 Live-Filtering statt OK-Button-Bestätigung

|                |                                                                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Ist**        | Filter werden nur nach Klick auf "OK" angewendet – zweistufiger Prozess: Auswahl + Bestätigung                                                                                             |
| **Soll**       | Debounced Live-Filtering (bereits für Collections implementiert mit `limitUrlUpdates: debounce(400)`) – dasselbe Pattern auf Search/Categories/Models anwenden                             |
| **Begründung** | OK-Button-Pattern suggeriert, dass Filter "gefährlich" oder aufwändig sind. Direktes Feedback beim Filtern ist die intuitivere UX und entspricht modernen Filter-Patterns (Airbnb, Notion) |

---

### 2.4 Empty State

|          |                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------- |
| **Ist**  | Kein Empty State – bei 0 Ergebnissen zeigt `TemplateItemsGrid`/`TemplateItemsList` leeren Bereich |
| **Soll** | Zwei unterschiedliche Empty States:                                                               |

**Empty State A – Keine Prompts vorhanden (Erstnutzer):**

```
[Illustration: leeres Notizbuch oder Prompt-Blase]
"Noch keine Prompts"
"Erstelle deinen ersten Prompt und baue deine persönliche Prompt-Bibliothek auf."
[Neuer Prompt Button]
```

**Empty State B – Filter aktiv, keine Treffer:**

```
[Illustration: Lupe ohne Ergebnisse]
"Keine Ergebnisse für diese Filter"
"Passe deine Filterkriterien an oder lösche sie."
[Filter zurücksetzen Button]
```

---

### 2.5 Edit-Button direkt in der Card

|                |                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Ist**        | Edit-Aktion versteckt: User muss "Details anzeigen" klicken und dann auf der Detail-Seite bearbeiten                       |
| **Soll**       | Edit-Button (Stift-Icon) direkt in der Card als Ghost-Button, erscheint beim Hover neben dem Dropdown-Button               |
| **Begründung** | Bearbeiten ist eine der häufigsten Aktionen auf eigenen Prompts – sie darf nicht zwei Klicks und einen Page-Wechsel kosten |

**Empfohlenes Action-Layout in der Card:**

```
[Vorlage verwenden (flex-1)] [✏️ Edit] [⋮ Mehr]
```

---

### 2.6 Usage-Limit-Indikation

|          |                                                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Ist**  | Limit-Info wird nur verwendet, um den Create-Button durch `UpgradePlanDialog` zu ersetzen – kein vorgelagertes Feedback |
| **Soll** | Subtiler Progress-Indikator im Header, wenn User >80% ihres Limits erreicht hat:                                        |

```
// Bei 80–99%:
"8 von 10 Prompts verwendet"  [Upgrade]

// Bei 100% (isUpgradeRequired):
Banner: "Du hast dein Limit erreicht. Upgrade für unbegrenzte Prompts."  [Jetzt upgraden]
```

---

### 2.7 Filter-Button: Aktive-Filter-Badge fehlt

|                |                                                                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Ist**        | `LibraryFilters`-Button zeigt kein Badge für aktive Filter (anders als der Collections-Button, der ein korrektes Badge hat)               |
| **Soll**       | Konsistenz: `Filter (2)` – Zahl der aktiven Filter-Gruppen (nicht einzelner Werte) anzeigen, gleiche Badge-Komponente wie bei Collections |
| **Begründung** | Inkonsistentes Verhalten in derselben Toolbar – ein Button kommuniziert aktive Filter, der andere nicht                                   |

---

## 3. Visual Design Improvements

### 3.1 Model-Badge vs. Category-Tags: Visueller Kontrast

|          |                                                                                                                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ist**  | Model-Badge: `border-blue-200 bg-blue-50 text-blue-700` — Category-Tags: `border-slate-200 bg-slate-100 text-slate-700` — ähnliche Größe, ähnliche Form, schwer zu unterscheiden |
| **Soll** | Klare visuelle Hierarchie:                                                                                                                                                       |

```
Model-Badge: Pill-Form (rounded-full), leicht größer, filled (nicht nur border)
             → z.B. bg-violet-100 text-violet-800 oder modellspezifische Farbe

Category-Tags: kleinere Schrift, schlichter, eher wie Labels
               → text-xs, leichter Hintergrund, kein Border
```

---

### 3.2 Favoriten-Status in der Card

|                |                                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ist**        | `AddToFavoriteButton` zeigt Herz-Icon – kein visueller Unterschied zwischen "ist Favorit" und "ist kein Favorit" erkennbar aus der Card-Gesamtansicht |
| **Soll**       | Favorisierte Cards: subtiler visueller Marker (z.B. goldener Herz-Icon, leichter amber Accent im Card-Border, oder kleines Badge am Titel)            |
| **Begründung** | User sollen Favoriten auf einen Blick identifizieren können, ohne Hover-States auszulösen                                                             |

---

### 3.3 Dropdown-Trigger: Zu unauffällig

|                |                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| **Ist**        | Outline-Button mit `MoreVertical`-Icon als Dropdown-Trigger – konkurriert visuell mit dem primären CTA |
| **Soll**       | Ghost-Button ohne Border (nur auf Hover sichtbar), erscheint als natürliche Erweiterung der Action-Row |
| **Begründung** | Sekundäre Aktionen sollten nicht mit primären CTAs um visuelle Aufmerksamkeit konkurrieren             |

---

### 3.4 Hardcoded `bg-blue-600` im CreatePromptButton

|                |                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------- |
| **Ist**        | `bg-blue-600 hover:bg-blue-700` direkt im Button – nicht über Design-System-Token steuerbar        |
| **Soll**       | Tailwind CSS Custom Property oder `variant="primary"` – konsistent mit dem Rest des Design-Systems |
| **Begründung** | Wenn die Primärfarbe der App geändert wird, wird dieser Button nicht mitaktualisiert               |

---

### 3.5 Loading State: Spinner statt Skeleton

|                |                                                                                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ist**        | Beim Laden: zentrierter blauer Spinner mit Text "Lädt Vorlagen..."                                                                                                                 |
| **Soll**       | Skeleton-Cards (gleiche Dimensionen wie echte Cards, Shimmer-Effekt) in der gleichen Grid-/List-Struktur                                                                           |
| **Begründung** | Skeleton Loading verhindert Layout-Shift und kommuniziert dem User schon vor dem Laden, wie viele und welche Art von Inhalten erscheinen werden – reduziert wahrgenommene Ladezeit |

---

## Priorisierungs-Matrix

| #   | Problem                    | Impact  | Aufwand | Priorität |
| --- | -------------------------- | ------- | ------- | --------- |
| 1.1 | Falsche Ergebnisanzahl     | Hoch    | Minimal | **P0**    |
| 1.2 | Kaputtes Filter-Reset      | Hoch    | Minimal | **P0**    |
| 2.4 | Empty States               | Hoch    | Klein   | **P1**    |
| 2.7 | Filter-Badge Inkonsistenz  | Mittel  | Minimal | **P1**    |
| 2.5 | Edit-Button in Card        | Hoch    | Klein   | **P1**    |
| 2.3 | Live-Filtering             | Mittel  | Mittel  | **P2**    |
| 2.1 | Filter-Konsolidierung      | Hoch    | Mittel  | **P2**    |
| 2.2 | Collections als Navigation | Hoch    | Groß    | **P2**    |
| 2.6 | Usage-Limit Indikation     | Mittel  | Klein   | **P2**    |
| 3.5 | Skeleton Loading           | Mittel  | Klein   | **P3**    |
| 3.1 | Badge/Tag-Hierarchie       | Niedrig | Klein   | **P3**    |
| 3.2 | Favoriten-Feedback         | Niedrig | Klein   | **P3**    |
| 3.4 | Hardcoded bg-blue-600      | Niedrig | Minimal | **P3**    |
