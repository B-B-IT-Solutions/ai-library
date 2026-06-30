# UX-Verbesserungsspezifikation: Workflow-Editor

**Analysierte Dateien:**
- `src/components/workflows/detail/edit/workflow-edit.tsx`
- `src/components/workflows/detail/edit/form/workflow-form.tsx`
- `src/components/workflows/detail/edit/steps/step-list.tsx`
- `src/components/workflows/detail/edit/steps/step-detail-panel.tsx`

---

## 1. Identifizierte UX-Probleme

### 1.1 Layout & Informationsarchitektur

**Problem: Konzeptuell gemischtes linkes Panel**
Das linke Panel vereint zwei unabhängige Konzepte — Workflow-Metadaten (Titel, Beschreibung) und die Schrittliste — ohne klare visuelle Trennung. Nutzer erkennen nicht intuitiv, dass das Formular oben den *Workflow* betrifft, während die Liste darunter die *Schritte* betrifft.

**Problem: Verlorener primärer CTA**
Der "Workflow ausführen"-Button erscheint erst ganz unten im linken Panel, und nur wenn `steps.length > 0`. Das ist die wichtigste Aktion des gesamten Editors — sie ist visuell begraben.

**Problem: Kein persistenter Workflow-Titel**
Beim Scrollen im rechten Panel verschwindet jeder Hinweis, welcher Workflow gerade bearbeitet wird. Es fehlt ein persistent sichtbarer Header.

**Problem: Leerer Zustand rechts ist verschenkt**
Wenn kein Schritt gewählt ist, steht nur ein grauer Text `"Wähle einen Schritt..."`. Das ist eine verpasste Onboarding-Gelegenheit — besonders bei einem leeren Workflow ohne Schritte.

---

### 1.2 Schrittliste (`StepList`)

**Problem: Doppelter Edit-Einstiegspunkt**
Jede Karte ist komplett klickbar (`onClick → onSelectStep`) *und* hat zusätzlich einen `<Edit>`-Icon-Button, der dasselbe tut. Das ist redundante UI, die Nutzer verwirrt und Platz verschwendet.

**Problem: Versteckte Kernfunktion "Als Startschritt setzen"**
Diese Aktion ist hinter einem `MoreHorizontal`-Dropdown versteckt. Der Startschritt ist die wichtigste Konfiguration eines Workflows — er gehört direkt zugänglich, nicht in ein Overflow-Menü.

**Problem: Kein Drag-&-Drop für Reihenfolge**
Schritte haben ein `position`-Feld im Datenmodell, aber die UI bietet keine Möglichkeit, Schritte umzuordnen. Das `position`-Feld ist de facto totes Gewicht.

**Problem: Badge-Überfrachtung**
Eine Karte kann gleichzeitig "Start", "Ende" und "Nicht verbunden" zeigen. Bei mehreren Schritten mit Edges werden die Karten sehr dicht — die ausgehenden Kanten (`→ Label → Zielschritt`) sind als Text in der Karte schwer lesbar.

---

### 1.3 Workflow-Formular (`WorkflowForm`)

**Problem: Separater Speichern-Button für Metadaten**
Es gibt einen "Speichern"-Button für den Workflow und einen "Schritt speichern"-Button im rechten Panel. Zwei Speichern-Kontexte auf einer Seite erzeugen kognitiven Aufwand: "Welches Speichern betrifft was?"

**Problem: Kein Navigationsschutz bei dirty State**
`form.formState.isDirty` wird zwar geprüft, aber wenn der Nutzer zwischen Schritten navigiert oder die Seite verlässt, gibt es keine Warnung vor Datenverlust (weder für das Workflow-Formular noch für das Schritt-Formular).

---

### 1.4 Schritt-Detailpanel (`StepDetailPanel`)

**Problem: Keine Kontextanzeige im Panel-Header**
Der Header zeigt nur "Schritt bearbeiten" — ohne den Namen des aktuell bearbeiteten Schritts. Bei einem Workflow mit 8 Schritten weiß der Nutzer nach dem Scrollen nicht mehr, was er gerade bearbeitet.

**Problem: "Ist Startschritt"-Checkbox konzeptuell falsch platziert**
Die Checkbox steht nach dem Inhalt/Template-Picker und vor den Edges. Konzeptuell gehört "Ist Startschritt" zu den grundlegenden Schritt-Eigenschaften (oben) — nicht zwischen Inhalts- und Verbindungs-Sektion.

**Problem: Template-Select ohne Vorschau oder Suche**
Bei `PROMPT_REF` erscheint ein einfaches `<Select>` mit allen Templates als Dropdown. Bei vielen Templates ist das nicht skalierbar — kein Suchfeld, keine Kategorisierung, keine Vorschau des Template-Inhalts.

**Problem: Edge-Formulare werden endlos lang**
Bei mehreren ausgehenden Kanten wächst der Formularblock unbegrenzt. Es gibt keine Beschränkung, kein Collapse, keine kompakte Ansicht. Bei 5+ Kanten muss der Nutzer stark scrollen, um den Speichern-Button zu erreichen.

**Problem: Kein unsaved-changes-Indikator**
Das rechte Panel hat keinen visuellen Hinweis, wenn das Formular dirty ist. Wenn ein Nutzer Schritt A bearbeitet, dann auf Schritt B klickt, werden die Änderungen in Schritt A lautlos verworfen.

---

### 1.5 Fehler- und Limit-Behandlung

**Problem: Step-Limit-Tooltip ist die einzige Kommunikation**
Wenn das Step-Limit erreicht ist, wird der Button disabled und ein Tooltip zeigt "Upgrade auf PRO". Es gibt keinen Link, keinen CTA, keine Erklärung des Unterschieds — nur ein Tooltip, das auf Hover erscheint.

**Problem: Fehlermeldungen nur als Toasts**
Sowohl Workflow-Speichern als auch Schritt-Speichern geben Fehler ausschließlich als `toast.error()` aus. Toasts verschwinden nach Sekunden — persistente Fehlerdarstellung im Formular fehlt.

---

## 2. Konkrete Verbesserungsvorschläge

### 2.1 Neues Layout: Persistenter Header + klare Zonen

**Aktuell:**
```
┌─────────────────────┬──────────────────────────────────┐
│  WorkflowForm       │                                  │
│  [Titel]            │  StepDetailPanel                 │
│  [Beschreibung]     │  (oder Leer-Zustand)             │
│  [Speichern]        │                                  │
│                     │                                  │
│  --- Schritte ---   │                                  │
│  [Step 1]           │                                  │
│  [Step 2]           │                                  │
│  [+ Schritt]        │                                  │
│  [▶ Ausführen]      │                                  │
└─────────────────────┴──────────────────────────────────┘
```

**Vorschlag:**
```
┌────────────────────────────────────────────────────────┐
│  ← Workflows   [Workflow-Titel]         [▶ Ausführen] │  ← Sticky Header
├──────────────────┬─────────────────────────────────────┤
│  WORKFLOW-INFO   │                                     │
│  [Titel]         │  StepDetailPanel                    │
│  [Beschreibung]  │                                     │
│  [Speichern]     │                                     │
│                  │                                     │
│  SCHRITTE (3)    │                                     │
│  [Step 1] ★     │                                     │
│  [Step 2]        │                                     │
│  [Step 3] ●     │                                     │
│                  │                                     │
│  [+ Schritt]     │                                     │
└──────────────────┴─────────────────────────────────────┘
```

**Implementierung:**
- Neuer `WorkflowEditorHeader`-Sticky-Header: Zeigt Workflow-Titel (inline editierbar per Click), Breadcrumb `Workflows / [Name]`, und den "▶ Ausführen"-Button prominent rechts
- Linkes Panel in zwei Sektionen aufteilen: Collapsible "Workflow-Details" (initial eingeklappt wenn bereits gespeichert) + Sektion "Schritte"
- `"▶ Ausführen"` aus dem linken Panel entfernen und in den Header verlagern

---

### 2.2 Verbesserter Leer-Zustand (Empty State)

**Leerer Workflow (0 Schritte):**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│          ⬡ Workflow Builder                         │
│                                                     │
│   Dein Workflow hat noch keine Schritte.            │
│   Erstelle den ersten Schritt, um zu beginnen.      │
│                                                     │
│              [+ Ersten Schritt erstellen]           │
│                                                     │
│   ──── Wie funktioniert ein Workflow? ────          │
│   1. Schritte = einzelne Prompts oder Templates     │
│   2. Verbindungen = Verzweigungen zwischen Schritten│
│   3. Startschritt = wo der Workflow beginnt         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Workflow hat Schritte, keiner ausgewählt:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   Wähle links einen Schritt zum Bearbeiten,         │
│   oder erstelle einen neuen Schritt.                │
│                                                     │
│   [+ Schritt hinzufügen]                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2.3 Überarbeitete StepList-Karte

**Vorschlag — Kompaktere, klarere Karte:**
```
┌─────────────────────────────────────────┐
│  ★  Schritt 1: Brief vorbereiten        │  ← ★ = Startschritt (klickbar)
│     Template-Referenz · "Anschreiben"   │
│     [Weiter →] [Wiederholen ↺]          │  ← Edge-Chips
│                                 [⋯]    │
└─────────────────────────────────────────┘
```

**Konkrete Änderungen:**
- **Edit-Icon-Button entfernen** — die gesamte Karte ist bereits klickbar; der Button ist redundant
- **Stern-Icon (★/☆) direkt in der Karte** als Toggle für "Startschritt setzen" — sichtbar und zugänglich ohne Dropdown
- **Schritt-Nummer** (`1`, `2`, `3`) links als visuelle Ordnungsanker
- **"Nicht verbunden"-Warning** als subtiler oranger Randstreifen (`border-left: 3px solid orange`) statt Badge im Text
- **Edges kompakter**: Statt `ArrowRight + Label + → + Zielschritt` → kompakte Chips

---

### 2.4 Überarbeitetes StepDetailPanel

**Header des Panels:**
```
┌────────────────────────────────────────────────────────┐
│  Schritt bearbeiten: "Brief vorbereiten"         ● *   │
│  Startschritt ✓  |  Template-Referenz                  │
└────────────────────────────────────────────────────────┘
```
`●` = orangener Punkt wenn dirty (ungespeicherte Änderungen)

**Neue Formular-Reihenfolge:**
```
1. [Titel *]
2. [Typ: ● Template-Referenz  ○ Eigenständig]
3. [Template auswählen (Combobox)] / [Prompt-Text (MDEditor)]
4. ☑ Ist Startschritt                ← direkt nach Inhalt, vor Edges
5. [Hinweis (optional)] — collapsible, initial eingeklappt
6. ─── Verbindungen ───
   [Edge 1]  [Edge 2]  [+ Verbindung]
7.                          [Speichern]
```

**Template-Picker verbessert:**
- `Combobox` mit Suchfeld statt `<Select>` — skaliert auf viele Templates
- Optional: Vorschau-Tooltip bei Hover (erste 100 Zeichen des Prompt-Textes)

**Unsaved-changes-Indikator:**
- Wenn `form.formState.isDirty`: Orangener Punkt (●) im Panel-Header
- Beim Klick auf anderen Schritt: Confirmation-Dialog:
  *"Du hast ungespeicherte Änderungen in '[Schritt-Titel]'. Möchtest du sie verwerfen?"*
  Buttons: [Verwerfen] [Zurück zum Formular]

**Edge-Formulare — kompaktere Darstellung (horizontal):**
```
Verbindungen
┌─────────────────────────────────────────┐
│  [Weiter__________]  [Schritt 2 ▾]  [✕]│
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  [Nochmal_________]  [Schritt 1 ▾]  [✕]│
└─────────────────────────────────────────┘
[+ Verbindung hinzufügen]
```
Horizontales 2-Spalten-Layout (Label | Zielschritt) statt vertikalem Stack spart ~50% Höhe pro Edge.

---

### 2.5 Upgrade-CTA statt disabled Button

**Aktuell:** Disabled Button + Tooltip

**Vorschlag:**
```
┌─────────────────────────────────────────────────────┐
│  ⚡ Schritt-Limit erreicht (10/10)                   │
│  Mit PRO hast du unbegrenzte Schritte pro Workflow.  │
│                           [Auf PRO upgraden →]       │
└─────────────────────────────────────────────────────┘
```
Als `Alert`-Komponente mit Link zu `/settings/billing` statt Tooltip auf disabled Button.

---

## 3. Interaction-Design-Empfehlungen

### 3.1 Navigationsschutz vor Datenverlust

**Priorität: Hoch**

Implementierung mit eigenem Dialog bei Schritt-Wechsel:

```tsx
// In WorkflowEdit
const handleStepSwitch = (newStep: DWorkflowStep) => {
  if (stepFormIsDirty) {
    setUnsavedWarningTarget(newStep);
    setShowUnsavedDialog(true);
    return;
  }
  setSelectedStep(newStep);
};
```

Dialog-Text: *"Du hast den Schritt '[Titel]' nicht gespeichert. Möchtest du die Änderungen verwerfen?"*
Buttons: [Verwerfen] [Zurück zum Formular]

Zusätzlich `useBeforeUnload` für Browser-Navigation.

---

### 3.2 Auto-Save für Workflow-Metadaten

**Priorität: Mittel**

Der separate "Speichern"-Button im `WorkflowForm` erzeugt unnötige Friktion. Empfehlung: Debounced Auto-Save (1,5 Sekunden nach letzter Eingabe) mit `✓ Gespeichert`-Status statt Button.

```
Workflow-Details
[Brief erstellen_________________]  ✓ Gespeichert
[Für Bewerbungen verwendet_______]
```

Falls Auto-Save nicht gewünscht: Zumindest den Button in den globalen Header verlagern, damit der Nutzer einen einzigen Speicher-Kontext hat.

---

### 3.3 Keyboard-Navigation

**Priorität: Mittel**

| Shortcut | Aktion |
|----------|--------|
| `↑` / `↓` | Navigiert in der Schrittliste |
| `Enter` | Öffnet den gewählten Schritt zum Bearbeiten |
| `Escape` | Schließt Detailpanel / bricht Erstellen-Modus ab |
| `Ctrl+S` / `Cmd+S` | Speichert das aktive Formular |

---

### 3.4 Persistente Fehlerdarstellung

**Priorität: Mittel**

Ergänzend zu Toasts: Wenn `result.success === false`, einen Fehler-Banner direkt im Formular anzeigen:

```tsx
{submitError && (
  <Alert variant="destructive">
    <AlertDescription>{submitError}</AlertDescription>
  </Alert>
)}
```

Toasts für Erfolgs-Feedback beibehalten, Fehler hingegen persistent im Panel zeigen.

---

### 3.5 Startschritt-Warnung prominenter machen

**Priorität: Hoch**

Die aktuelle `AlertTriangle`-Warning "Kein Startschritt gesetzt" ist im linken Panel zwischen den Schritten — leicht übersehen. Empfehlung:

- Warnung auch im rechten Empty-State anzeigen
- "Workflow ausführen"-Button disabled wenn kein Startschritt gesetzt:
  Tooltip: *"Bitte setze zuerst einen Startschritt (★ in der Liste)"*

---

### 3.6 Visuelle Workflow-Übersicht (Roadmap)

**Priorität: Niedrig / Roadmap**

Die Liste ist für einfache lineare Workflows ausreichend. Ab ~5 Schritten mit mehreren Verzweigungen verliert der Nutzer den Überblick. Mittelfristige Empfehlung: Read-only Graph-View als optionales Panel (Toggle über dem rechten Panel: `[Liste] [Graph]`). Geeignete Libraries: `reactflow`, `d3-dag`.

---

## Priorisierte Umsetzungsreihenfolge

| # | Maßnahme | Aufwand | Wirkung |
|---|----------|---------|---------|
| 1 | Unsaved-changes-Dialog beim Schritt-Wechsel | Klein | Hoch — verhindert Datenverlust |
| 2 | "▶ Ausführen"-Button in persistenten Header | Klein | Hoch — primärer CTA sichtbar |
| 3 | Edit-Icon-Button aus StepList-Karte entfernen | Minimal | Mittel — weniger Rauschen |
| 4 | ★-Toggle für Startschritt direkt in Karte | Klein | Mittel — Kernfunktion zugänglich |
| 5 | Panel-Header zeigt Schritt-Titel + dirty-Indikator | Minimal | Mittel — Orientierung |
| 6 | Upgrade-Alert statt disabled Button | Klein | Mittel — bessere Konversion |
| 7 | Edge-Formular horizontal komprimieren | Mittel | Mittel — weniger Scrollen |
| 8 | Combobox statt Select für Template-Picker | Mittel | Mittel — Skalierbarkeit |
| 9 | Verbesserter Leer-Zustand mit Onboarding | Mittel | Mittel — Erstnutzer-Erlebnis |
| 10 | Auto-Save für Workflow-Metadaten | Mittel | Niedrig — nice-to-have |
