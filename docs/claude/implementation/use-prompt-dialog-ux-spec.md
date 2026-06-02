# UX-Verbesserungsspezifikation: `UsePromptDialog`

**Datei:** `src/components/prompt-templating/dialogs/use-prompt-dialog.tsx`  
**Stand:** 2026-06-02

---

## Übersicht

Der Dialog dient als zentrales Werkzeug zum Anwenden von Prompt-Templates. Die aktuelle Implementierung hat mehrere UX-Schwachstellen, die den Workflow verlangsamen und die kognitive Last erhöhen.

---

## Priorisierte Verbesserungen

---

### 🔴 HOCH — Visuelle Hierarchie im Footer (invertierter CTA)

**Problem:**
`Öffnen In` ist der primäre Abschluss-Workflow (Prompt direkt in einem KI-Tool verwenden), ist aber als `variant="outline"` gestylt. Der `CopyButton` ist als `type="submit"` markiert — semantisch und visuell falsch.

**Vorher:**
```
╔══════════════════════════════════╗
║  [ Öffnen In ▾ ]  [ Kopieren ]  ║
║   (outline)        (submit/fill) ║
╚══════════════════════════════════╝
```

**Nachher:**
```
╔══════════════════════════════════════════════════╗
║  [ Kopieren ]   [ ██ In Claude öffnen ▾ ██ ]   ║
║   (ghost/sm)        (primary, prominent)         ║
╚══════════════════════════════════════════════════╝
```

- `Öffnen In` → `variant="default"` (primäre Aktion)
- Empfohlener Dienst (z.B. Claude) direkt im Button-Label sichtbar machen, Chevron für Alternativen
- `Kopieren` → `variant="ghost"` oder `variant="outline"` (sekundäre Aktion, links)

**Implementation:**
```tsx
// Empfohlener Dienst direkt als Button-Label
<Button variant="default" ...>
  In {recommended?.name ?? "KI"} öffnen
  <ChevronDown />
</Button>
```

---

### 🔴 HOCH — Spalten-Beziehung klarmachen (Vorschau ↔ Formular)

**Problem:**
Die linke Vorschau und das rechte Formular sind visuell gleichwertig. Neue Nutzer verstehen nicht, dass das Formular rechts die Vorschau links live beeinflusst. Es fehlt ein visueller Kausalitätspfeil.

**Vorher:**
```
┌──────────────────┬──────────────────┐
│   Vorschau       │ Platzhalter      │
│                  │ ausfüllen        │
│  [Prompt-Text]   │  [Felder]        │
└──────────────────┴──────────────────┘
```

**Nachher:**
```
┌──────────────────────────────────────────┐
│  ① Felder ausfüllen  →  ② Vorschau      │
├─────────────────────┬────────────────────┤
│  Platzhalter        │  Live-Vorschau     │
│  ausfüllen          │                    │
│  [Felder]     ────► │  [Prompt-Text]     │
└─────────────────────┴────────────────────┘
```

Konkrete Maßnahmen:
- Schritt-Labels als `①` / `②` oder `Schritt 1 / Schritt 2` über den Spalten
- Reihenfolge **tauschen**: Formular links (zuerst), Vorschau rechts (Ergebnis) — entspricht natürlicher Leserichtung
- Optional: Subtiler animierter Pfeil-Trenner zwischen den Spalten

---

### 🔴 HOCH — Titel kommuniziert keinen Workflow

**Problem:**
`Prompt Anwenden: {title}` ist ein Zustandsbeschreiber, kein Handlungsaufruf. Nutzer wissen nicht, was von ihnen erwartet wird.

**Vorher:**
```
┌─────────────────────────────────────────────────┐
│ Prompt Anwenden: Bewerbungsschreiben verfassen  │
```

**Nachher:**
```
┌──────────────────────────────────────────────────┐
│ Bewerbungsschreiben verfassen                    │
│ Felder ausfüllen → Prompt kopieren oder öffnen  │
│ ─────────────────────────────────────────────── │
```

- Titel = Prompt-Name (ohne Präfix)
- Darunter ein permanenter Untertitel in `text-muted-foreground text-xs`: `Felder ausfüllen, dann in einem KI-Tool verwenden`

---

### 🟡 MITTEL — Fortschrittsanzeige für Pflichtfelder

**Problem:**
Nutzer sehen nicht, ob sie alle Pflichtfelder ausgefüllt haben, bevor sie auf „Öffnen In" klicken.

**Vorher:**
Keine Rückmeldung über Vollständigkeit.

**Nachher:**
```
╔══════════════════════════════════════════════════╗
║  3 von 5 Feldern ausgefüllt                     ║
║  [ Kopieren ]   [ ██ In Claude öffnen ▾ ██ ]   ║
╚══════════════════════════════════════════════════╝
```

**Implementation:**
```tsx
const filledCount = fields.filter(f => currentValues[f.name]).length;
const totalCount = fields.filter(f => f.required).length;
// Fortschrittsbalken mit shadcn Progress-Komponente
```

---

### 🟡 MITTEL — Leerzustand wenn keine Variablen vorhanden

**Problem:**
Wenn ein Prompt keine Platzhalter hat, zeigt das rechte Panel ein leeres Formular. Das ist verwirrend.

**Vorher:**
Leeres `div` mit Border und Padding.

**Nachher:**
```
┌──────────────────────────────┐
│                              │
│   ✓ Keine Felder nötig       │
│   Dieser Prompt ist          │
│   sofort einsatzbereit.      │
│                              │
└──────────────────────────────┘
```

Bei 0 Feldern: Einspaltige Vollbreite-Vorschau anzeigen (kein Split-Layout). Im Footer direkt die primäre Aktion hervorheben.

---

### 🟡 MITTEL — Position des Expand-Buttons

**Problem:**
Der Expand-Button sitzt direkt neben dem Schließen-Button (X). Nutzer könnten fälschlicherweise annehmen, der Button schließt den Dialog. Die Nähe zur destruktiven Aktion ist irreführend.

**Vorher:**
```
┌───────────────────────────────────────┐
│ Titel                    [⤢]  [✕]   │
└───────────────────────────────────────┘
```

**Nachher (Option A — links vom Titel):**
```
┌───────────────────────────────────────┐
│ [⤢]  Titel                    [✕]   │
└───────────────────────────────────────┘
```

**Nachher (Option B — visueller Separator):**
```
┌───────────────────────────────────────┐
│ Titel           [⤢]  │  [✕]         │
└───────────────────────────────────────┘
```

Visueller Separator `│` zwischen Expand und Close-Gruppe.

---

### 🟢 NIEDRIG — Tastaturkürzel-Hinweise

**Problem:**
Power-User müssen die Maus nutzen. Keine Shortcut-Hinweise sichtbar.

**Nachher:**
```
╔══════════════════════════════════════════════════════╗
║  [ Kopieren  ⌘C ]   [ ██ In Claude öffnen  ⌘↵ ██ ] ║
╚══════════════════════════════════════════════════════╝
```

- `⌘+Enter` (Mac) / `Ctrl+Enter` (Win) → primäre Aktion auslösen
- `Escape` → Dialog schließen (bereits via Radix vorhanden)
- Shortcuts in `<kbd>`-Tags oder als `text-xs text-muted-foreground` im Button

---

### 🟢 NIEDRIG — Footer visuell mit dem Workflow verbinden

**Problem:**
Der Footer-Bereich (weiß, mit Border oben) ist visuell abgekoppelt vom Formular. Es ist nicht klar, dass die Footer-Aktionen das Ergebnis des Ausfüllens sind.

**Nachher:**
Statt harter Border: leichter Gradient-Übergang vom Formular-Bereich in den Footer:

```css
background: linear-gradient(
  to bottom,
  transparent,
  hsl(var(--background)) 20%
);
```

Oder: Fortschritts-Status im Footer selbst integrieren (siehe Fortschrittsanzeige oben), damit Footer und Formular zusammengehörig wirken.

---

## Zusammenfassung der Prioritäten

| # | Verbesserung | Prio | Aufwand | Impact |
|---|---|---|---|---|
| 1 | CTA-Hierarchie korrigieren | 🔴 Hoch | Klein | Sehr hoch |
| 2 | Spalten-Reihenfolge + Workflow-Beschriftung | 🔴 Hoch | Mittel | Hoch |
| 3 | Titel vereinfachen + Untertitel | 🔴 Hoch | Klein | Mittel |
| 4 | Fortschrittsanzeige | 🟡 Mittel | Mittel | Mittel |
| 5 | Leerzustand (keine Variablen) | 🟡 Mittel | Klein | Mittel |
| 6 | Expand-Button repositionieren | 🟡 Mittel | Klein | Niedrig |
| 7 | Tastaturkürzel | 🟢 Niedrig | Klein | Niedrig |
| 8 | Footer-Gradient | 🟢 Niedrig | Sehr klein | Niedrig |

**Empfohlene Implementierungsreihenfolge:** 1 → 3 → 2 → 5 → 4 → 6 → 7 → 8
