# UX-Spezifikation: Template Detail Page

**Feature ID:** AI-152
**Priority:** P2 — UX-Verbesserung
**Effort:** Medium
**Status:** Specification
**Date:** 2026-05-23

---

## 1. Executive Summary

Die Template-Detailseite (`/templates/[id]`) enthält alle nötigen Informationen, leidet aber unter falscher Informationshierarchie: Der primäre CTA ist im Card-Header vergraben, der Titel erscheint doppelt, und die flache Layouts verschenkt Bildschirmfläche. Die vorgeschlagenen Änderungen sind überwiegend struktureller Natur — kein neuer State, keine neuen Backend-Calls.

---

## 2. Aktuelle Struktur (Ist-Zustand)

```
Page (h-screen bg-slate-50)
└── ItemDetailsView
    ├── ItemDetailsViewHeader          ← <h1> Titel
    └── ItemDetailsViewContent
        ├── ItemDetailsViewBreadcrumbs
        └── ItemDetailsViewBody (max-w-5xl)
            └── Card
                ├── CardHeader
                │   ├── [Model-Badge]  [UseTemplate] [Edit] [⋯]
                │   └── [Kat A] [Kat B]
                └── CardContent
                    ├── <h2>Beschreibung</h2>
                    │   └── MDRenderer
                    └── PromptTextDisplay (collapsible, default: expanded)
                        ├── [▾ Prompt-Text]        [Kopieren]
                        └── MDRenderer (content)
```

---

## 3. Identifizierte UX-Probleme

| #   | Problem                                                        | Auswirkung                       |
| --- | -------------------------------------------------------------- | -------------------------------- |
| 1   | Titel erscheint in Topbar **und** implizit im Card-Kontext     | Redundanz, schlechte Hierarchie  |
| 2   | `Prompt anwenden` im Card-Header neben Edit und Dots-Menü      | Primäre Aktion schwer auffindbar |
| 3   | Beschreibung und Prompt-Text haben gleiche visuelle Gewichtung | Kein inhaltlicher Fokus          |
| 4   | Model-Badge steht isoliert links im Card-Header                | Semantisch falsch platziert      |
| 5   | Kategorien erscheinen unter den Buttons                        | Fühlen sich wie Afterthought an  |
| 6   | Collapsible für Prompt-Text (Default: expanded)                | Unnötige Interaktion ohne Nutzen |
| 7   | Copy-Button im Collapsible-Header braucht `stopPropagation`    | Architektonisch fragil           |
| 8   | `max-w-5xl` single column verschenkt Bildschirmfläche          | Suboptimale Raumnutzung          |
| 9   | Keine Metadaten (Datum, Modell) als kontextueller Block        | Fehlende Orientierung            |
| 10  | Browser-Tab-Titel statisch: `"Vorlage"`                        | SEO- und UX-Problem              |

---

## 4. Empfohlenes Layout (Desktop ≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [← Vorlagen]                                          [Bearbeiten] │  sticky, h-14, bg-white border-b
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────── max-w-6xl grid-cols-[2fr_1fr] ─────────┐
│                                                                      │
│  ┌────────────────────────────────────┐  ┌────────────────────────┐ │
│  │                                    │  │  AKTIONS-SIDEBAR       │ │
│  │  [Kat A] [Kat B]                   │  │  (sticky top-14)       │ │
│  │                                    │  │                        │ │
│  │  # Template-Titel                  │  │  ╔══════════════════╗  │ │
│  │                                    │  │  ║ Prompt anwenden  ║  │ │
│  │  Erstellt 12. Mai 2025             │  │  ╚══════════════════╝  │ │
│  │  Claude 3.5 Sonnet                 │  │                        │ │
│  │                                    │  │  [⬇ Herunterladen]    │ │
│  │  ──────────────────────────────    │  │  [🗑 Löschen]          │ │
│  │                                    │  │                        │ │
│  │  BESCHREIBUNG                      │  │  ────────────────────  │ │
│  │  ────────────                      │  │                        │ │
│  │  [Markdown-Content]                │  │  Empfohlenes Modell    │ │
│  │                                    │  │  ┌──────────────────┐  │ │
│  │  ──────────────────────────────    │  │  │ Claude Sonnet    │  │ │
│  │                                    │  │  └──────────────────┘  │ │
│  │  PROMPT-TEXT          [Kopieren]   │  │                        │ │
│  │  ────────────────────────────────  │  │                        │ │
│  │  ┌──────────────────────────────┐  │  │                        │ │
│  │  │ bg-slate-950 text-slate-100  │  │  │                        │ │
│  │  │ font-mono, rounded-lg        │  │  │                        │ │
│  │  │                              │  │  │                        │ │
│  │  │ [Prompt-Inhalt]              │  │  │                        │ │
│  │  │                              │  │  │                        │ │
│  │  └──────────────────────────────┘  │  │                        │ │
│  │                                    │  │                        │ │
│  └────────────────────────────────────┘  └────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5. Komponentenspezifikationen

### 5.1 Topbar

**Ziel:** Navigation + sekundäre Aktion, kein Inhalt

- Höhe: `h-14` (statt bisherigem `py-5`)
- `sticky top-0 z-40 bg-white border-b border-slate-200`
- Links: Breadcrumb-Link `← Vorlagen` — **kein Titel**
- Rechts: **nur** `EditTemplateButton` (outline, icon + Label)
- Der Titel verschwindet aus der Topbar — er wird zum dominanten Element im Hero-Block

### 5.2 Hero-Block (Hauptspalte, oben)

**Ziel:** Klare Identität der Seite, Kategorien als erster Kontext

```
[Kategorie A] [Kategorie B]        ← über dem Titel

# Vorlage für Jahresgespräche      ← <h1>, text-3xl font-bold

Erstellt 12. Mai 2025 · Claude 3.5 Sonnet   ← Metadaten-Zeile
```

- **Kategorien:** `text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5` — über dem `<h1>`
- **Titel `<h1>`:** `text-3xl font-bold text-slate-900 mt-2 mb-3` — kein Card-Wrapper
- **Metadaten-Zeile:** `text-sm text-slate-500` — Erstellungsdatum + recommendedModel zusammen. Das Modell verlässt den isolierten Badge und wird zu kontextuellem Metadata.

### 5.3 Beschreibungs-Abschnitt

- **Section-Label:** `text-xs font-semibold tracking-widest text-slate-400 uppercase` — kein `<h2>` mehr
- Trennlinie: `border-t border-slate-200 mt-2 mb-4`
- Content: `prose prose-slate max-w-none`
- Kein Collapsible — immer sichtbar

### 5.4 Prompt-Text-Abschnitt

**Kernänderung: Kein Collapsible, Code-Block-Ästhetik, Copy-Button entkoppelt**

- **Kein Collapsible** — Prompt-Text ist der Kerninhalt, Default war ohnehin `expanded: true`. Die Toggle-Logik entfällt vollständig.
- **Section-Label:** identisch mit Beschreibungs-Label-System
- **Copy-Button:** Positioniert rechts neben dem Section-Label (`flex justify-between items-center`) — vollständig getrennt vom Content-Block, kein `stopPropagation` mehr nötig
- **Content-Block:**
   - `bg-slate-950 text-slate-100 rounded-lg p-5 font-mono text-sm leading-relaxed`
   - Kommuniziert visuell: "maschinenlesbare Instruktion", nicht Prosa
   - Schafft starken Kontrast zur hellen Beschreibung darüber

**Copy-Button States:**
| State | Darstellung |
|---|---|
| Idle | `📋 Kopieren` — ghost variant |
| Success (2s) | `✓ Kopiert!` — `text-green-600 bg-green-50` |
| Reset | automatisch nach 2000ms |

### 5.5 Aktions-Sidebar (rechte Spalte)

**Ziel:** Primäre Aktion prominent, destruktive Aktion sichtbar aber klar markiert\*\*

```
┌─────────────────────────────────┐
│  ╔═══════════════════════════╗  │
│  ║   Prompt anwenden    →    ║  │  ← w-full, size="lg", bg-blue-700
│  ╚═══════════════════════════╝  │
│                                 │
│  [⬇ Herunterladen]             │  ← ghost, w-full, justify-start
│  [🗑 Löschen]                   │  ← ghost, text-red-600, w-full
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Empfohlenes Modell             │
│  ┌─────────────────────────┐   │
│  │  🤖  Claude Sonnet 3.5  │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

**CTA `Prompt anwenden`:**

- `w-full size="lg" bg-blue-700 hover:bg-blue-800 text-white font-semibold`
- `sticky top-[calc(3.5rem+1rem)]` — unterhalb der Topbar, immer sichtbar beim Scrollen
- Einziger primärer Button auf der gesamten Seite

**Löschen — aus Dots-Menü herausholen:**

- `variant="ghost" w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50`
- Sicherheit durch Farbe kommuniziert, nicht durch Verstecken
- `MoreOptionsButton` (Dots-Menü) entfällt — Aktionen sind jetzt alle direkt sichtbar

**Modell-Info-Block:**

- Separator `border-t border-slate-200 my-4`
- Label: `text-xs font-medium text-slate-400 mb-2`
- Badge: `bg-slate-100 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 flex items-center gap-2`

---

## 6. Mobile Layout (< 768px)

```
┌────────────────────────────┐
│ ← Vorlagen    [Bearbeiten] │  sticky topbar
├────────────────────────────┤
│ [Kat A] [Kat B]            │
│                            │
│ # Template-Titel           │
│                            │
│ Erstellt 12. Mai · Sonnet  │
├────────────────────────────┤
│ BESCHREIBUNG               │
│ ──────────────             │
│ [Markdown content]         │
├────────────────────────────┤
│ PROMPT-TEXT   [Kopieren]   │
│ ──────────────             │
│ ┌──────────────────────┐   │
│ │ dunkler Block        │   │
│ └──────────────────────┘   │
│                            │
│ [⬇ Herunterladen]         │
│ [🗑 Löschen]               │
└────────────────────────────┘
         ↕ scroll
┌────────────────────────────┐
│ [  Prompt anwenden  →  ]   │  fixed bottom bar
└────────────────────────────┘
```

- **Sticky Bottom Bar:** `fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4` — enthält nur den primären CTA, volle Breite
- Sidebar entfällt als Spalte — Modell-Info bereits in der Metadaten-Zeile enthalten
- Download + Löschen erscheinen nach dem Prompt-Text-Block als Ghost-Buttons

---

## 7. Visuelle Hierarchie

| Ebene              | Element                   | Behandlung                                |
| ------------------ | ------------------------- | ----------------------------------------- |
| **1 (dominant)**   | Template-Titel            | `text-3xl font-bold`, freistehend         |
| **2 (primär)**     | Prompt anwenden           | Volle Breite, `size="lg"`, sticky         |
| **3 (inhalt)**     | Prompt-Text               | Dunkler Block `bg-slate-950`, `font-mono` |
| **4 (inhalt)**     | Beschreibung              | Prose, helle Seite                        |
| **5 (kontext)**    | Kategorien, Modell, Datum | Klein, `text-slate-400/500`               |
| **6 (sekundär)**   | Bearbeiten                | Topbar, outline                           |
| **7 (destruktiv)** | Löschen                   | Sichtbar, `text-red-600`, klar markiert   |
| **8 (utility)**    | Kopieren, Herunterladen   | Ghost, inline                             |

---

## 8. Layout-Breakpoints

| Breakpoint       | Layout                                        |
| ---------------- | --------------------------------------------- |
| `< 768px`        | Single Column, CTA als fixed Bottom Bar       |
| `768px – 1023px` | Single Column, Sidebar-Inhalt nach Hero-Block |
| `≥ 1024px`       | Two-Column: `grid-cols-[2fr_1fr]`, max-w-6xl  |

**`max-w` Anpassung:** `max-w-5xl` → `max-w-6xl` (1152px) um dem Two-Column Grid Raum zu geben.

---

## 9. Browser-Tab-Titel

**Aktuell:** `"Vorlage"` (statisch in `export const metadata`)

**Fix:** `generateMetadata` statt statischem Export

```ts
// src/app/(authenticated)/(prompts)/templates/[id]/page.tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const descriptor = await getPrompt(id);
  return {
    title: descriptor?.title ?? "Vorlage",
  };
}
```

Ergebnis: `"Vorlage für Jahresgespräche | AI Library"` (sofern `title.template` im Root-Layout konfiguriert)

---

## 10. Was NICHT geändert wird

| Was                                        | Warum                                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `UsePromptDialog` Logik                    | Funktioniert korrekt, kein UX-Problem                                                            |
| `MDRenderer` für Beschreibung              | Rendering-Qualität ist gut                                                                       |
| `TemplateBreadcrumb` Komponente            | Funktional korrekt                                                                               |
| `DeleteTemplateButton` Confirmation-Dialog | Sicherheitsmuster ist richtig — nur die Sichtbarkeit ändert sich                                 |
| Jest-Tests für Buttons                     | Stabil; neue Layout-Tests separat schreiben                                                      |
| `ItemDetailsView` Wrapper-Komponente       | Wird von anderen Seiten genutzt; Page-Komponente befüllt Wrapper anders, statt Wrapper zu ändern |

---

## 11. Implementierungs-Reihenfolge

| Prio | Schritt                                                    | Aufwand |
| ---- | ---------------------------------------------------------- | ------- |
| 1    | `generateMetadata` → dynamischer Browser-Tab-Titel         | ~5 min  |
| 2    | Sidebar mit sticky CTA + Löschen sichtbar (ohne Dots-Menü) | S       |
| 3    | Prompt-Text: dunkler Block + Copy-Button-Position          | S       |
| 4    | Hero-Block: Kategorien über Titel, Metadaten-Zeile         | S       |
| 5    | Two-Column Grid (`max-w-6xl`, `grid-cols-[2fr_1fr]`)       | M       |
| 6    | Bearbeiten in Topbar, Topbar-Höhe auf `h-14`               | S       |
| 7    | Mobile Bottom Bar für CTA                                  | M       |
