# UX-Verbesserungsspezifikation: Template-Edit-Seite

---

## 1. Executive Summary

Die aktuelle Edit-Seite ist **funktional korrekt, aber ergonomisch schwach**. Der zentrale Arbeitsbereich — der Prompt-Content-Editor — konkurriert mit Metadaten-Feldern und Variablen-Management in einer einzigen langen Scroll-Seite ohne räumliche Hierarchie. Nutzer verlieren den Überblick, müssen häufig scrollen und erhalten kein Live-Feedback über den Zustand ihrer Eingaben.

**Kern-Diagnose:** Die Seite behandelt alle Sektionen als gleichwertig, obwohl der **Prompt-Content** die primäre Arbeitsfläche ist und alles andere sekundär ist.

---

## 2. Problemanalyse im Detail

| #   | Problem                                       | Häufigkeit             | Schwere    |
| --- | --------------------------------------------- | ---------------------- | ---------- |
| P1  | Langer Single-Column-Scroll ohne Orientierung | Jeden Edit-Vorgang     | 🔴 Hoch    |
| P2  | Save-Button außerhalb des Sichtfeldes         | Jeden Speichervorgang  | 🔴 Hoch    |
| P3  | Content ↔ Variablen räumlich getrennt         | Bei jeder Variable     | 🔴 Hoch    |
| P4  | Keine Live-Vorschau des befüllten Prompts     | Jeden Edit-Vorgang     | 🟠 Mittel  |
| P5  | Kein inline Validierungsfeedback              | Bei Fehlern            | 🟠 Mittel  |
| P6  | BasicInfo-Reihenfolge nicht nach Priorität    | Jeden Edit-Vorgang     | 🟡 Niedrig |
| P7  | Header wiederholt Breadcrumb-Information      | Visuell                | 🟡 Niedrig |
| P8  | Leerer Felder-Zustand nimmt Platz weg         | Immer bei neuem Prompt | 🟡 Niedrig |

---

## 3. Vorgeschlagenes neues Layout

### Konzept: **Split-Editor mit Sticky Action Bar**

Der Kerngedanke ist eine **Zwei-Spalten-Aufteilung** auf Desktop:

- **Links (40%):** Metadaten-Panel — BasicInfo, Felder-Management, Einstellungen
- **Rechts (60%):** Content-Workspace — Editor + Detected Variables live darunter

Dazu eine **Sticky Action Bar** oben rechts (im Header) mit den Aktions-Buttons, sodass Speichern jederzeit erreichbar ist.

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Breadcrumbs]                          [Abbrechen] [Speichern ▶]   │  ← Sticky Header
├──────────────────────────┬──────────────────────────────────────────┤
│                          │                                          │
│  METADATEN               │  PROMPT-EDITOR                           │
│  ─────────────           │  ──────────────────────────────────────  │
│  Titel *                 │  ┌────────────────────────────────────┐  │
│  [___________________]   │  │                                    │  │
│                          │  │  Markdown Editor                   │  │
│  Beschreibung            │  │                                    │  │
│  [___________________]   │  │  "Schreibe einen Post über         │  │
│  [___________________]   │  │   {{thema}} für {{zielgruppe}}"    │  │
│                          │  │                                    │  │
│  Kategorien              │  └────────────────────────────────────┘  │
│  [tag1] [tag2] [+]       │                                          │
│                          │  ERKANNTE VARIABLEN                      │
│  Modell                  │  ────────────────────                    │
│  [Claude          ▾]     │  ✅ {{thema}}      🟠 {{zielgruppe}} [+] │
│                          │  [Alle sync ↺]                           │
│  ──────────────────────  │                                          │
│                          │                                          │
│  FELDER                  │                                          │
│  ─────────               │                                          │
│  [+ Feld hinzufügen]     │                                          │
│  [⊕ Globale Felder]      │                                          │
│                          │                                          │
│  ┌──────────────────┐    │                                          │
│  │ 📋 thema         │    │                                          │
│  │ Text · Pflicht   │    │                                          │
│  │ [Bearbeiten] [×] │    │                                          │
│  └──────────────────┘    │                                          │
│                          │                                          │
│  ┌──────────────────┐    │                                          │
│  │ 📋 zielgruppe ⚠️ │    │                                          │
│  │ (kein Feld def.) │    │                                          │
│  │ [Feld erstellen] │    │                                          │
│  └──────────────────┘    │                                          │
│                          │                                          │
└──────────────────────────┴──────────────────────────────────────────┘
```

**Mobile (< md):** Stacked, aber mit Tab-Navigation zwischen "Metadaten" und "Editor+Variablen":

```
┌──────────────────────────────────┐
│ [Breadcrumbs]    [Speichern ▶]  │  ← Sticky
├──────────────────────────────────┤
│ [Metadaten]  [Editor & Felder]  │  ← Tab-Bar
├──────────────────────────────────┤
│                                  │
│  (aktiver Tab-Inhalt)            │
│                                  │
└──────────────────────────────────┘
```

---

## 4. Detaillierte Verbesserungen pro Bereich

---

### 4.1 Header & Navigation

**Problem:** Header zeigt Titel doppelt (H1 + Breadcrumb). Save-Button ist nicht erreichbar ohne zu scrollen.

**Lösung:**

- Header enthält **nur** Breadcrumbs + Action Buttons (Abbrechen / Speichern)
- H1 wird entfernt — der Breadcrumb `Vorlagen > [Titel] > Bearbeiten` gibt genug Kontext
- Save-Button im Header ist der **primäre** CTA, immer sichtbar
- Save-Button zeigt Live-Status: `Speichern` → `Wird gespeichert...` → `Gespeichert ✓`

```
Vorher:
  [H1: Prompt Bearbeiten]                       ← redundant
  [Subtitle: Bearbeiten Sie den Prompt]         ← generisch

Nachher:
  Vorlagen / Blog-Post Generator / Bearbeiten    [Abbrechen]  [Speichern →]
```

**Komponenten-Änderung:** `template-edit.tsx` — `header()`-Funktion entfernen, Buttons aus `prompt-edit-form.tsx` in `ItemDetailsEditHeader` hochziehen.

---

### 4.2 Layout: Zwei-Spalten-Split

**Problem:** Alles untereinander, kein räumlicher Zusammenhang.

**Lösung:** `ItemDetailsEditBody` erhält ein Zwei-Spalten-Grid auf `lg`-Breakpoint:

```
lg: grid grid-cols-[380px_1fr] gap-0
    → Linke Spalte scrollt unabhängig (overflow-y-auto, sticky top-0)
    → Rechte Spalte: Editor + Detected Variables zusammen
```

**Neue Struktur:**

```tsx
<ItemDetailsEditBody>
  <div className="lg:grid lg:grid-cols-[380px_1fr] lg:divide-x lg:divide-slate-200">
    <MetadataPanel />     {/* BasicInfo + PromptVariables */}
    <ContentPanel />      {/* PromptTemplateContent + DetectedVariables */}
  </div>
</ItemDetailsEditBody>
```

---

### 4.3 BasicInfo — Reihenfolge & Styling

**Problem:** Reihenfolge nicht nach Nutzungsfrequenz. Kategorien kommen nach Modell.

**Neue Reihenfolge:**

1. **Titel** _(Pflichtfeld, prominentester Input)_
2. **Kategorien** _(häufig genutzt für Filterbarkeit)_
3. **Beschreibung** _(optional, längerer Text)_
4. **Modell** _(selten geändert, sollte visuell zurücktreten)_

**Weitere Verbesserungen:**

- Pflichtfeld-Marker `*` nur bei Titel anzeigen
- Modell-Select als kleinere, kompaktere Darstellung (z.B. Icon + Label statt vollem Select)
- Kategorien-Input: zeige Vorschläge basierend auf existierenden Kategorien

---

### 4.4 Content-Editor + Detected Variables (zusammen im rechten Panel)

**Problem:** Editor und Variablen sind durch andere Sektionen räumlich getrennt — kein Live-Zusammenhang sichtbar.

**Lösung:** Im rechten Panel direkt untereinander:

```
[Markdown Editor — nimmt 60% der Panel-Höhe]
────────────────────────────────────────────────
ERKANNTE VARIABLEN  (erscheint direkt wenn Content eingegeben)
✅ {{thema}}     🟠 {{zielgruppe}} [+ Als Feld]
                                   [Alle sync ↺]
```

**Zusätzlich:** Beim Tippen einer `{{`-Sequenz im Editor → leichte Puls-Animation auf dem "Erkannte Variablen"-Bereich, um auf die Verbindung hinzuweisen.

---

### 4.5 Variablen-Chips — Status-Kommunikation

**Problem:** Orange/Grün ist der einzige Status-Indikator, kein Kontext warum etwas undefiniert ist.

**Verbesserung:**

```
Aktuell:   🟢 {{thema}}     🟠 {{zielgruppe}} [Hinzufügen]

Neu:
  ✅ {{thema}}        → Tooltip: "Feld 'Thema' (Text, Pflicht)"
  ⚠ {{zielgruppe}}   → Tooltip: "Noch kein Feld definiert"
                         [+ Als Feld hinzufügen] [→ Globales Feld wählen]
```

- Chips werden **sortiert**: Undefinierte zuerst (erfordern Action)
- `Alle synchronisieren` wird zum **primären Button** wenn undefinierte vorhanden sind (nicht nur Outline-Variant)

---

### 4.6 PromptVariables — Linkes Panel

**Problem:** Felder-Empty-State nimmt unnötig Platz (dashed border, 12px padding).

**Lösung:**

- **Kein separater Empty-State-Block** wenn keine Felder vorhanden
- Stattdessen: Nur die Buttons `+ Feld hinzufügen` und `⊕ Globale Felder`
- Kleiner Hinweis-Text unter den Buttons: `"Felder aus erkannten Variablen werden automatisch vorgeschlagen"`

**Felder-Karten verbessern — kollabierbar:**

```
Collapsed:
┌──────────────────────────────────┐
│ 📝 thema  (Text · Pflicht)  [⌄] │
└──────────────────────────────────┘

Expanded:
┌──────────────────────────────────┐
│ 📝 thema  (Text · Pflicht)  [⌃] │
│ ─────────────────────────────── │
│ Variablenname: thema             │
│ Label: [Thema________________]  │
│ Typ:   [Text              ▾]    │
│ [✓] Pflichtfeld                  │
│ Beschreibung: [optional_______]  │
│                       [× Löschen]│
└──────────────────────────────────┘
```

→ Kollabierte Ansicht zeigt den wichtigsten Status auf einen Blick. Expanded beim Erstellen, kollabiert nach erstem Save.

---

### 4.7 Vorschau-Modus (Live-Preview)

**Problem:** Kein Feedback wie der befüllte Prompt aussieht.

**Lösung:** Toggle im rechten Panel-Header:

```
PROMPT-VORLAGE        [✏ Bearbeiten]  [👁 Vorschau]
```

Im Vorschau-Modus:

- Editor wird ausgeblendet
- Darstellung des Prompt-Textes mit **ausgefüllten Platzhalter-Inputs**
- Jedes `{{feld}}` wird zu einem kleinen Inline-Input-Chip
- Nutzer kann Testwerte eingeben und den resultierenden Prompt lesen

**Technisch:** Separater `PreviewMode`-State in der Form-Komponente. Kein Backend-Call nötig — rein clientseitig mit `watch("content")` und `watch("fields")`.

---

### 4.8 Inline-Validierung

**Problem:** Fehler werden erst beim Submit angezeigt.

**Lösung:**

- `mode: "onBlur"` in `useForm` statt Standard `"onSubmit"`
- Fehler erscheinen direkt nach Verlassen eines Feldes
- Bei Submit-Versuch: Scroll zum ersten Fehler (mit `form.setFocus`)
- Save-Button wird disabled + Tooltip: `"Bitte alle Pflichtfelder ausfüllen"` wenn Formular invalid

---

## 5. Priorisierung

### 🔴 High Impact — sofort umsetzen

| #   | Änderung                                    | Aufwand | Nutzen                               |
| --- | ------------------------------------------- | ------- | ------------------------------------ |
| H1  | Action Buttons in Sticky Header             | Klein   | Riesig — Speichern immer erreichbar  |
| H2  | Zwei-Spalten-Layout (Content + Metadaten)   | Mittel  | Editor + Variablen zusammen sichtbar |
| H3  | BasicInfo-Reihenfolge korrigieren           | Minimal | Besserer Authoring-Flow              |
| H4  | H1 aus Header entfernen (Breadcrumb reicht) | Minimal | Cleaner, weniger redundant           |

### 🟠 Medium Impact — nächste Iteration

| #   | Änderung                                       | Aufwand | Nutzen                               |
| --- | ---------------------------------------------- | ------- | ------------------------------------ |
| M1  | Kollabierbare Felder-Karten                    | Mittel  | Bessere Übersicht bei vielen Feldern |
| M2  | Inline-Validierung mit `onBlur`                | Klein   | Fehler früher sichtbar               |
| M3  | Empty-State Felder vereinfachen                | Minimal | Weniger visual noise                 |
| M4  | Variablen-Chips sortieren (undefiniert zuerst) | Minimal | Klarer Call-to-Action                |

### 🟡 Low Impact — später / nice-to-have

| #   | Änderung                                   | Aufwand | Nutzen                     |
| --- | ------------------------------------------ | ------- | -------------------------- |
| L1  | Live-Vorschau-Modus                        | Groß    | Nützlich aber kein Blocker |
| L2  | Variablen-Tooltips mit Feld-Details        | Klein   | Kleine UX-Verbesserung     |
| L3  | Animierter Hinweis bei neuer `{{`-Variable | Mittel  | Entdeckbarkeit             |
| L4  | Kategorie-Vorschläge aus existierenden     | Mittel  | Komfort-Feature            |

---

## 6. Komponenten-Änderungen

### Neue Dateien

```
src/components/prompts/detail/edit/
  ├── metadata-panel.tsx          ← BasicInfo + PromptVariables kombiniert (linke Spalte)
  ├── content-panel.tsx           ← PromptTemplateContent + DetectedVariables (rechte Spalte)
  └── sections/
      └── prompt-preview.tsx      ← [L1] Vorschau-Modus Komponente
```

### Geänderte Dateien

| Datei                    | Änderung                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| `template-edit.tsx`      | `header()` entfernen; Buttons aus Form hochziehen; Split-Layout einführen                |
| `prompt-edit-form.tsx`   | Buttons-Render nach oben (werden via Prop/Context an Header übergeben); `mode: "onBlur"` |
| `item-details-edit.tsx`  | Header-Slot für Buttons erweitern (z.B. `rightSlot?: ReactNode`)                         |
| `basic-info.tsx`         | Felder-Reihenfolge ändern: Titel → Kategorien → Beschreibung → Modell                    |
| `prompt-variables.tsx`   | Empty-State vereinfachen; Kollaps-Logik hinzufügen                                       |
| `detected-variables.tsx` | Chips sortieren; Tooltip hinzufügen; "Sync"-Button als primary wenn nötig                |

### API-Änderung: `ItemDetailsEditHeader`

```tsx
// Vorher
const ItemDetailsEditHeader = ({ children }: Props) => (
  <div className="border-b border-slate-200 bg-white px-6 py-4">
    {children}
  </div>
);

// Nachher — unterstützt rechten Slot für Action Buttons
const ItemDetailsEditHeader = ({
  children,
  actions,
}: Props & { actions?: ReactNode }) => (
  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
    <div>{children}</div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);
```

---

## 7. Zusammenfassung

Die wichtigsten drei Änderungen, die 80% des UX-Gewinns bringen:

1. **Sticky Save-Button im Header** — eliminiert das Hauptproblem (Scrollen zum Speichern)
2. **Zwei-Spalten-Split** — bringt Content-Editor und Variablen-Management räumlich zusammen
3. **BasicInfo-Reihenfolge** — minimaler Aufwand, direkt spürbarer Flow-Verbesserung

Der Rest ist Iteration. Mit diesen drei Änderungen ist die Seite von einer langen Scroll-Form zu einem **echten Editor-Interface** geworden.

---

## 8. Offene Ideen für spätere Iterationen

Diese Optionen wurden diskutiert und zurückgestellt. Beide adressieren das noch ungelöste Problem, dass **Variablen im Editor und ihre Feld-Definitionen räumlich getrennt** sind.

---

### Option D: Bidirektionales Highlighting _(Quick Win)_

**Priorität:** Medium | **Aufwand:** Klein

Beim bestehenden Tab-Layout (Editor-Tab / Felder-Tab) wird eine **Live-Verbindung** zwischen `{{variable}}`-Chips und Feld-Karten hergestellt:

- Hover über `{{variable}}`-Chip in "Erkannte Variablen" → zugehörige Feld-Karte im Felder-Tab wird visuell hervorgehoben (Ring/Glow)
- Klick auf einen **undefinierten** `{{variable}}`-Chip → automatischer Wechsel zum Felder-Tab mit Scroll zur leeren Position (oder direkt "Feld erstellen"-Aktion)
- Klick auf eine Feld-Karte → Wechsel zum Editor-Tab mit Hervorhebung der `{{variable}}` im Editor-Text

**Technisch:** Shared `highlightedVariable`-State (z.B. via `useState` im Form-Parent oder `useContext`), der sowohl in `DetectedVariables` als auch in `PromptVariables` abonniert wird. Tab-Wechsel via controlled `Tabs`-Komponente (`value` + `onValueChange`).

**Dateien betroffen:**

- `prompt-edit-form.tsx` — `activeTab`-State + `highlightedVariable`-State einführen
- `detected-variables.tsx` — Chip-Hover/-Klick sendet `highlightedVariable`
- `prompt-variables.tsx` / `prompt-variable.tsx` — reagiert auf `highlightedVariable` mit visueller Hervorhebung

---

### Option B: Inline-Variablen-Definition im Editor _(Best UX, größter Aufwand)_

**Priorität:** Low (langfristig) | **Aufwand:** Groß

Kein separates Felder-Panel mehr. Feld-Definitionen entstehen **direkt im Editor-Kontext**:

- Beim Tippen von `{{variable}}` → Popover erscheint direkt am Cursor mit Felddefinitions-Formular (Label, Typ, Pflicht)
- Klick auf eine bestehende `{{variable}}` im Text → Popover zeigt die aktuelle Feld-Definition zum Bearbeiten
- Bereits definierte Variablen erscheinen im Editor farblich anders (grün) als undefinierte (orange)

```
  Editor-Text:
  "Schreibe einen Post über {{thema}} für {{zielgruppe}}..."
                              ↑ Klick
                    ┌─────────────────────┐
                    │ {{thema}}           │
                    │ Label: [Thema     ] │
                    │ Typ:   [Text    ▾] │
                    │ [✓] Pflichtfeld     │
                    │        [Fertig] [×] │
                    └─────────────────────┘
```

**Technisch:** Erfordert eine **Tiptap-Extension** (Custom Node oder Mark), die `{{...}}`-Muster als interaktive Inline-Nodes rendert. Die Extension kommuniziert via Callback mit dem React-Form-State. Komplex, aber das intuitiv stärkste Pattern für diesen Anwendungsfall.

**Dateien betroffen:**

- Neue Tiptap-Extension: `src/components/shared/md/extensions/template-variable-extension.ts`
- `promt-content.tsx` — Extension registrieren
- `prompt-edit-form.tsx` — Felder-Panel kann stark vereinfacht oder entfernt werden
- `prompt-variables.tsx` — wird zur reinen Übersicht/Verwaltungsliste (kein primäres Eingabe-Interface mehr)
