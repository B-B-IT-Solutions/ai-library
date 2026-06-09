# UX-Verbesserungsspezifikation: `TemplateItemCard`

**Datei:** `src/components/prompts/lists/items/prompt-item.tsx`
**Datum:** 2026-06-07

---

## Analyse des Ist-Zustands

### Kritische Schwachstellen

| Bereich             | Problem                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Visuelle Hierarchie | Titel und Model-Badge konkurrieren auf gleicher Ebene — kein klarer Scan-Pfad                |
| Favoriten-Button    | Absolut positioniert, überlappt den Titel, kein definierter Interaktionsbereich              |
| Hover-State         | Nur `border-color` + `shadow` — keine Feedback-Sprache für klickbare Elemente                |
| Kategorien          | Vor der Beschreibung platziert, obwohl sie sekundäre Metadaten sind                          |
| Accessibility       | Kein sichtbarer Focus-Ring, keine ARIA-Labels auf Icon-Buttons, kein `title` auf Model-Badge |
| CTA-Bereich         | `UseTemplateButton` und `MoreOptions` haben kein visuelles Gewichtsgefälle                   |
| Kartenatmosphäre    | Vollständig generischer White/Slate-Look, null visuelle Persönlichkeit                       |

---

## ASCII Mockup: Ist-Zustand

```
┌─────────────────────────────────────┐  ← border-slate-300
│ ♡ (absolut, oben-rechts, überlappt) │
│─────────────────────────────────────│
│ Titel des Templates                  │  ← h4, lg, semibold
│                                      │
│ [GPT-4o mini]                        │  ← blue badge, isolated
│─────────────────────────────────────│
│ [cat1] [cat2] [cat3]                 │  ← slate-100 tags
│                                      │
│ Beschreibung des Prompts, die bis    │
│ zu drei Zeilen lang sein kann und    │
│ dann abgeschnitten wird...           │
│                                      │
│ [──── Vorlage nutzen ────] [⋯]       │
└─────────────────────────────────────┘
```

## ASCII Mockup: Soll-Zustand

```
┌─────────────────────────────────────┐
│ ░░░░ Accent-Bar (3px, Kategorie-    │  ← farbkodiert nach erster Kategorie
│      farbe, links)                  │
│  [✦ Writing] [✦ Marketing]          │  ← Tags oben, vor Titel (Kontext first)
│                                      │
│  Titel des Templates                 │  ← Größer, mehr Gewicht
│  mit Link-Underline on hover         │
│                                      │
│  Beschreibung des Prompts, bis zu   │
│  drei Zeilen, klar lesbar...        │
│                                      │
├─────────────────────────────────────┤  ← divider
│  ⚡ GPT-4o      [♡]  [──Use──] [⋯] │  ← Footer-Row, alles auf einer Linie
└─────────────────────────────────────┘
          ↑                    ↑
   Model-Badge in Footer    CTA rechts
   (sekundär, aber auffindbar)
```

---

## Detaillierte Verbesserungen

### 1. Informationsarchitektur — Reihenfolge neu definieren

**Problem:** Aktuell: Titel → Model-Badge → Kategorien → Beschreibung → Actions

Der Nutzer scannt zuerst _Kontext_ (Kategorie), dann _Inhalt_ (Titel + Beschreibung), dann _Aktion_.

**Empfehlung:**

```
Kategorien (was ist das?)
→ Titel (welches Template?)
→ Beschreibung (warum relevant?)
→ Footer: Model + Favorit + CTA (wie benutzen?)
```

---

### 2. Visueller Akzent links (Kategorie-Farbkodierung)

Statt einer neutralen weißen Box: ein 3px linker Border-Akzent, der farblich zur ersten Kategorie gehört.

```tsx
const categoryColor: Record<string, string> = {
  Writing:    "border-l-violet-500",
  Marketing:  "border-l-rose-500",
  Code:       "border-l-cyan-500",
  // Fallback:
  default:    "border-l-slate-400",
};
```

Erzeugt sofortige visuelle Gruppierbarkeit beim Scannen einer langen Liste.

---

### 3. Hover-State — Card-Level Interaktion

**Aktuell:** `hover:border-slate-400 hover:shadow-md` — zu schwach, kein Richtungsgefühl

**Empfehlung:** Subtiler `translateY(-2px)` + stärkere Shadow + Accent-Bar wird heller:

```tsx
className="... transition-all duration-200
  hover:-translate-y-0.5
  hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)]
  hover:border-slate-300"
```

Der Titel bekommt keine `hover:text-blue-700` mehr auf Element-Ebene — die ganze Card reagiert als einheitlicher Interaktionsraum.

---

### 4. Footer-Leiste — Model-Badge + Actions zusammenführen

Das Model-Badge gehört nicht in den Header. Es ist Metadatum, nicht Hauptinhalt.

**Ziel-Struktur:**

```
├─────────────────────────────────────┤
│ ⚡ claude-3.5-sonnet  •  [♡] [Use] [⋯] │
└─────────────────────────────────────┘
```

```tsx
<div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
  <span className="text-xs text-slate-500 flex items-center gap-1">
    <Zap className="size-3" />
    {prompt.recommendedModel}
  </span>
  <div className="flex gap-2">
    <AddToFavoriteButton />
    <UseTemplateButton />
    <PromptMoreOptionsButton />
  </div>
</div>
```

**Vorteil:** `AddToFavoriteButton` verlässt die absolute Positionierung — kein z-index-Problem, kein Überlappen des Titels.

---

### 5. Kategorie-Tags — Farbige Akzente statt Grau

```tsx
// Vorher
"rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-700"

// Nachher
"rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-violet-200"
```

Alternative: Tags als "dot + label":

```
● Writing  ● Marketing
```

---

### 6. Accessibility — Pflichtverbesserungen

| Element                   | Fehlend                | Fix                                                                                    |
| ------------------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| `AddToFavoriteButton`     | `aria-label`           | `aria-label="Zu Favoriten hinzufügen"`                                                 |
| `PromptMoreOptionsButton` | `aria-label`           | `aria-label="Weitere Optionen"`                                                        |
| Model-Badge               | kein `title`           | `title="Empfohlenes KI-Modell"`                                                        |
| Card-Link                 | deckt nur den Titel ab | Erwägen: ganze Card als Link mit `after:absolute after:inset-0`                        |
| Focus-Ring                | nicht spezifiziert     | `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none` auf Link |

---

### 7. Beschreibungs-Fade statt hartem Abschnitt

Statt `line-clamp-3` ohne Indikator: Gradient-Fade am Ende signalisiert "es gibt mehr":

```tsx
<div className="relative">
  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
    {prompt.description}
  </p>
  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent" />
</div>
```

---

## Zusammenfassung der Prioritäten

| Priorität       | Maßnahme                                           | Aufwand |
| --------------- | -------------------------------------------------- | ------- |
| 🔴 Hoch         | Footer-Leiste (Model + Buttons) konsolidieren      | Mittel  |
| 🔴 Hoch         | `AddToFavoriteButton` aus absoluter Position lösen | Gering  |
| 🟡 Mittel       | Kategorie-Tags vor den Titel verschieben           | Gering  |
| 🟡 Mittel       | Accessibility: ARIA-Labels + Focus-Rings           | Gering  |
| 🟡 Mittel       | Hover: `translateY` + bessere Shadow               | Gering  |
| 🟢 Nice-to-have | Kategorie-Farbakzent links                         | Mittel  |
| 🟢 Nice-to-have | Beschreibungs-Fade statt hartem Clip               | Gering  |

---

## Kernaussage

Die wichtigste strukturelle Änderung ist die **Footer-Konsolidierung**: Model-Badge, Favorit-Button und CTAs auf einer Linie — das löst das Absolute-Positioning-Problem, verbessert den Scan-Pfad und gibt der Card eine klare Dreiteiler-Struktur:

```
[Kontext: Kategorien]
[Inhalt: Titel + Beschreibung]
[Aktion: Model-Info + Buttons]
```
