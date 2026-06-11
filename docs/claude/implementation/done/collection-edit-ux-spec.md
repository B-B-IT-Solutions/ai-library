# UX-Verbesserungsspezifikation: Collection-Edit-Seite

---

## 1. Executive Summary

Die Collection-Edit-Seite verwendet denselben `ItemDetailsEdit`-Shell wie `PromptEdit`, weicht aber in zentralen Strukturentscheidungen ab: Actions liegen unten in einer Card statt im sticky Header, Breadcrumbs haben eine eigene Zone unterhalb des Headers, und der visuelle Karten-Stil unterscheidet sich. Das Ergebnis ist eine Seite, die zur selben App gehört, sich aber anders anfühlt.

**Kern-Diagnose:** Die Seite muss auf die etablierten Muster von `PromptEdit` ausgerichtet werden — gleicher Shell, gleiche Action-Platzierung, gleicher Karten-Stil — und dabei neue, Collection-spezifische Probleme lösen (Color Picker, Touch-Kompatibilität, Sharing-Bestätigung).

---

## 2. Problemanalyse im Detail

| #  | Problem                                           | Schwere    | Typ             |
|----|---------------------------------------------------|------------|-----------------|
| P1 | H1/Subtitle im Body statt Breadcrumb im Header    | 🔴 Hoch    | Konsistenz      |
| P2 | Actions unten in Card, nicht im sticky Header     | 🔴 Hoch    | Konsistenz      |
| P3 | Submit-Button ohne `bg-blue-700`                  | 🔴 Hoch    | Konsistenz      |
| P4 | shadcn `<Card>` statt `rounded-xl bg-white shadow-sm` | 🟠 Mittel | Konsistenz  |
| P5 | Box-style Tabs auf Seiten-Ebene statt Underline   | 🟠 Mittel  | Konsistenz      |
| P6 | Nativer HTML Color Picker (`<input type="color">`)| 🔴 Hoch    | Feature-Qualität|
| P7 | Create-Modus ohne Tabs → Layout-Bruch nach Erstellen | 🔴 Hoch | UX-Flow      |
| P8 | Kein Mobile Footer (fehlt `lg:hidden`-Block)      | 🔴 Hoch    | Konsistenz      |
| P9 | `variant="destructive"` für Routine-Aktion (Privat machen) | 🟠 Mittel | UX-Qualität |
| P10| Kein Unsaved-Changes-Indikator                    | 🟠 Mittel  | UX-Qualität     |
| P11| Sticky-Header Z-Index in Vorlagen-Scroll-Liste    | 🟠 Mittel  | Bug             |
| P12| Add/Remove-Button: CSS `group-hover` auf Touch nicht erkannt | 🟠 Mittel | Accessibility |
| P13| Empty State in Vorlagen ohne Call-to-Action       | 🟡 Niedrig | UX-Qualität     |
| P14| Kein Bestätigungs-Dialog beim Privat-Schalten     | 🟡 Niedrig | UX-Qualität     |

---

## 3. Referenzstruktur: PromptEdit als Standard

Beide Edit-Seiten teilen denselben Shell. Die Struktur von `PromptEdit` ist der etablierte Standard:

```
PromptEdit (Referenz):
┌─────────────────────────────────────────────────────────┐
│ sticky header (z-40):                                    │
│ [Breadcrumbs]                    [Abbrechen][Speichern] │  ← Actions im Header
├─────────────────────────────────────────────────────────┤
│  overflow-y-auto:                                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  rounded-xl bg-white p-6 shadow-sm               │   │
│  │  BasicInfo                                        │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  rounded-xl bg-white p-6 shadow-sm               │   │
│  │  PromptFormTabs                                   │   │
│  └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│ mobile footer (lg:hidden):                               │
│ [Abbrechen][Speichern]                                   │
└─────────────────────────────────────────────────────────┘
```

```
CollectionEdit Ziel:
┌─────────────────────────────────────────────────────────┐
│ sticky header (z-40):                                    │
│ [Sammlungen / Name / Bearbeiten] [Abbrechen][Speichern] │
├─────────────────────────────────────────────────────────┤
│  Einstellungen   Vorlagen   Freigabe                     │
│  ─────────────  (Underline-Tabs, slate-50 Hintergrund)  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  rounded-xl bg-white p-6 shadow-sm               │   │
│  │  [Tab-Inhalt]                                     │   │
│  └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│ mobile footer (lg:hidden):                               │
│ [Abbrechen][Sammlung speichern]                          │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Detaillierte Verbesserungen

---

### 4.1 Header-Struktur angleichen (P1, P2, P8)

**Problem:** `CollectionEdit` rendert H1/Subtitle im Body und lässt den Header leer. Actions liegen unten in der Form-Card. Kein Mobile Footer.

**Lösung:** Breadcrumbs und Actions in den Header hochziehen — exakt wie `PromptEdit`:

```tsx
// collection-edit.tsx (Ziel)
return (
  <ItemDetailsEdit data-testid="collection-edit">
    <ItemDetailsEditHeader>
      {breadcrumbs()}
      <div className="ml-auto hidden lg:flex" data-testid="header-actions">
        {actions()}
      </div>
    </ItemDetailsEditHeader>
    <ItemDetailsEditContent>
      <ItemDetailsEditBody>{body()}</ItemDetailsEditBody>
    </ItemDetailsEditContent>
    {/* Mobile Footer — identisch zu PromptEdit */}
    <div
      className="flex justify-end border-t border-slate-200 bg-white px-6 py-3 lg:hidden"
      data-testid="footer-actions"
    >
      {actions()}
    </div>
  </ItemDetailsEdit>
);
```

**Entfernen:**
- `header()`-Funktion mit H1/Subtitle komplett entfernen
- `<ItemDetailsEditBreadcrumbs>` entfernen (Breadcrumbs gehen in den Header)
- `isSubmitting`-State nach oben in `CollectionEdit` heben (via Callback-Prop aus `CollectionEditForm`, wie `PromptEdit` mit `onSubmit`)

---

### 4.2 Submit-Button-Stil angleichen (P3)

**Problem:** Button verwendet Default-Variant ohne explizite Farbe.

**Lösung:** `bg-blue-700 hover:bg-blue-800` — exakt wie `PromptEdit`:

```tsx
// Vorher (in CollectionEditForm):
<Button type="submit" disabled={isSubmitting}>
  Speichern
</Button>

// Nachher (in CollectionEdit, wie PromptEdit):
<Button
  type="submit"
  form="collection-edit-form"
  disabled={isSubmitting}
  className="cursor-pointer bg-blue-700 hover:bg-blue-800"
  data-testid="save-btn"
>
  {isSubmitting ? (
    <><Loader className="h-4 w-4 animate-spin" />
    {isEdit ? "Wird gespeichert..." : "Wird erstellt..."}</>
  ) : (
    isEdit ? "Sammlung speichern" : "Sammlung erstellen"
  )}
</Button>
```

---

### 4.3 Card-Stil angleichen (P4)

**Problem:** `CollectionEditForm`, `CollectionPrompts` und `CollectionOther` verwenden shadcn `<Card><CardContent>`. `PromptEdit` verwendet `rounded-xl bg-white p-6 shadow-sm`.

**Lösung:** shadcn Card durch direktes Div ersetzen in allen drei Section-Komponenten:

```tsx
// Vorher:
<Card data-testid="collection-edit-form">
  <CardContent>
    ...
  </CardContent>
</Card>

// Nachher:
<div className="rounded-xl bg-white p-6 shadow-sm" data-testid="collection-edit-form">
  ...
</div>
```

Gilt für: `collection-edit-form.tsx`, `collection-prompts.tsx`, `collection-other.tsx`.

---

### 4.4 Tab-Stil: Box → Underline (P5)

**Problem:** Box-style Tabs (`bg-slate-50` auf TabsList und Triggern) erzeugen eine visuelle Insel. Auf Seiten-Ebene wirken Underline-Tabs natürlicher und sind das Standard-Muster für Page-Tabs in dieser App.

**Lösung:** Underline-Tab-Stil via Tailwind-Overrides:

```tsx
<Tabs defaultValue={tab} onValueChange={setTab}>
  <TabsList className="mb-6 h-auto w-full gap-0 rounded-none border-b border-slate-200 bg-transparent px-0">
    <TabsTrigger
      value="general"
      className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm
                 shadow-none data-[state=active]:border-blue-600
                 data-[state=active]:bg-transparent data-[state=active]:text-blue-700"
      data-testid="tab-general-btn"
    >
      Einstellungen
    </TabsTrigger>
    {/* analog für "templates" und "other" */}
  </TabsList>
  ...
</Tabs>
```

```
Vorher (box):                    Nachher (underline):
┌──────┬──────┬──────┐          Einstellungen  Vorlagen  Freigabe
│Einst.│Vorlag│Freig.│          ─────────────
└──────┴──────┴──────┘          (blauer Unterstrich aktiver Tab)
```

---

### 4.5 Create-Modus Konsistenz + Flow nach Erstellen (P7)

**Problem:** Im Create-Modus gibt es keine Tabs — nach dem Erstellen wechselt das Layout zu einem Tab-UI. Das Gehirn muss sich neu orientieren.

**Lösung:** Tabs auch im Create-Modus anzeigen, Tab 2 und 3 als `disabled`. Nach erfolgreichem Erstellen automatisch zu Tab "Vorlagen" weiterleiten.

```tsx
// Tabs immer rendern, disabled im Create-Modus:
const body = () => (
  <Tabs defaultValue={tab} onValueChange={setTab}>
    <TabsList ...>
      <TabsTrigger value="general">Einstellungen</TabsTrigger>
      <TabsTrigger
        value="templates"
        disabled={!isEdit}
        title={!isEdit ? "Zuerst Sammlung erstellen" : undefined}
        className={!isEdit ? "cursor-not-allowed opacity-40" : ""}
      >
        Vorlagen
      </TabsTrigger>
      <TabsTrigger
        value="other"
        disabled={!isEdit}
        title={!isEdit ? "Zuerst Sammlung erstellen" : undefined}
        className={!isEdit ? "cursor-not-allowed opacity-40" : ""}
      >
        Freigabe
      </TabsTrigger>
    </TabsList>
    ...
  </Tabs>
);

// Nach Erstellen — Redirect zu Tab "Vorlagen":
router.push(`/collections/${result.data.id}/edit?tab=templates`);
```

Tab-State via `nuqs` (bereits im Stack):

```tsx
// Für URL-State (optional, aber konsistent mit App-Pattern):
const [tab, setTab] = useQueryState('tab', { defaultValue: 'general' })
```

---

### 4.6 Color Picker — Inline statt OS-Dialog (P6)

**Problem:** `<input type="color">` öffnet den OS-Farb-Dialog — inkonsistent zwischen Plattformen, kein Inline-Feedback.

**Lösung:** Neue `ColorPicker`-Komponente mit kuratierten Farben + Hex-Eingabe. Kein externer Dependency nötig:

```tsx
// src/components/shared/widgets/color-picker.tsx
const PRESET_COLORS = [
  "#EF4444","#F97316","#EAB308","#22C55E",
  "#3B82F6","#8B5CF6","#EC4899","#14B8A6",
  "#64748B","#0EA5E9","#A855F7","#F43F5E",
];

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => (
  <div className="space-y-3">
    <div className="flex flex-wrap gap-2">
      {PRESET_COLORS.map(color => (
        <button
          key={color}
          type="button"
          className={cn(
            "h-7 w-7 rounded-full ring-offset-2 transition-all hover:scale-110",
            value === color && "ring-2 ring-slate-900"
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
    <div className="flex items-center gap-2">
      <div className="h-7 w-7 shrink-0 rounded-md border" style={{ background: value }} />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="font-mono text-sm"
        placeholder="#000000"
        maxLength={7}
      />
    </div>
  </div>
);
```

```
Vorher:            Nachher:
[OS-Dialog-Btn]    ● ● ● ● ● ●
                   ● ● ● ● ● ●
                   ████ #3B82F6
```

---

### 4.7 Destructive-Variant für Routine-Aktion entfernen (P9)

**Problem:** Der "Deaktivieren"-Button in `CollectionOther` verwendet `variant="destructive"` (rot). Rot ist für endgültiges Löschen reserviert — das Privat-Schalten ist eine umkehrbare Einstellung.

**Lösung:**

```tsx
// Vorher:
variant={isPublic ? "destructive" : "outline"}
// Text: "Deaktivieren" / "Aktivieren"

// Nachher:
variant="outline"
// Text: isPublic ? "Privat machen" : "Öffentlich machen"
```

---

### 4.8 Sticky Headers Z-Index in Vorlagen-Liste (P11)

**Problem:** Beide Section-Header in `CollectionPrompts` verwenden `sticky top-0` ohne `z-index`. Beim Scrollen im Container können sie übereinander rutschen.

**Lösung:**

```tsx
// Beide sticky Headers:
<div className="sticky top-0 z-10 rounded-lg bg-slate-50 px-3 py-2 ...">
  In dieser Sammlung ({promptIds.length})
</div>
```

Außerdem: Scroll-Container braucht einen expliziten Stacking-Context, damit `z-10` innerhalb funktioniert:

```tsx
// Container:
<div className="relative max-h-130 overflow-y-auto bg-white" ...>
```

---

### 4.9 Add/Remove-Button Touch-Kompatibilität (P12)

**Problem:** `group-hover:hidden` / `group-hover:inline` funktioniert auf Touch-Geräten nicht.

**Lösung:** Hover-Trick durch klare Zustandstexte ersetzen:

```tsx
// Vorher:
<Check className="... group-hover:hidden" />
<X className="hidden ... group-hover:inline" />

// Nachher: explizite Button-Labels
<Button variant={isIn ? "secondary" : "outline"} size="sm" ...>
  {isPending ? (
    <Loader className="h-3.5 w-3.5 animate-spin" />
  ) : isIn ? (
    "Entfernen"
  ) : (
    "Hinzufügen"
  )}
</Button>
```

---

### 4.10 Empty State mit Hinweis (P13)

**Problem:** "Noch keine Vorlagen hinzugefügt" ohne Orientierung, wo man anfangen soll.

**Lösung:**

```tsx
<div className="flex flex-col items-center py-8 text-slate-400">
  <FolderOpen className="mb-2 h-8 w-8 opacity-40" />
  <p className="text-sm">Noch leer</p>
  <p className="text-xs">Füge unten Vorlagen hinzu ↓</p>
</div>
```

---

### 4.11 Bestätigungs-Dialog beim Privat-Schalten (P14)

**Problem:** Ein Klick auf "Privat machen" invalidiert sofort alle bestehenden Share-Links ohne Warnung.

**Lösung:** shadcn `AlertDialog` (bereits im Projekt) beim Deaktivieren anzeigen:

```tsx
{isPublic && (
  <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Sammlung privat machen?</AlertDialogTitle>
        <AlertDialogDescription>
          Der öffentliche Link wird ungültig. Personen mit dem Link
          können die Sammlung nicht mehr öffnen.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
        <AlertDialogAction onClick={handleTogglePublic}>
          Privat machen
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)}
```

---

## 5. Priorisierung

### 🔴 Sofort umsetzen — Konsistenz mit PromptEdit

| #  | Änderung                                      | Aufwand | Begründung                          |
|----|-----------------------------------------------|---------|-------------------------------------|
| K1 | H1/Subtitle entfernen                         | XS      | Sieht aus wie andere App            |
| K2 | Actions in Header + Mobile Footer             | S       | Kern-Pattern von PromptEdit         |
| K3 | Submit-Button `bg-blue-700`                   | XS      | Visuelle Hierarchie der ganzen App  |
| K4 | shadcn Card → `rounded-xl bg-white shadow-sm` | XS      | Visuelles Gewicht angleichen        |
| K5 | Underline-Tabs statt Box-Tabs                 | S       | Natürlich auf Seiten-Ebene          |

### 🟠 Danach — Feature-Qualität

| #  | Änderung                                     | Aufwand | Begründung                           |
|----|----------------------------------------------|---------|--------------------------------------|
| F1 | Color Picker Komponente                      | M       | Native Input unpolished, inkonsistent|
| F2 | Create-Modus: Tabs disabled + Redirect-Flow  | S       | Eliminiert Layout-Bruch nach Erstellen|
| F3 | Destructive-Variant entfernen                | XS      | Falsche Alarm-Semantik               |
| F4 | Sticky Headers z-index Fix                   | XS      | Scroll-Bug                           |
| F5 | Add/Remove-Button Touch-fix                  | S       | Touch-Geräte funktionieren nicht     |

### 🟡 Nice-to-have

| #  | Änderung                          | Aufwand | Begründung                             |
|----|-----------------------------------|---------|----------------------------------------|
| N1 | Empty State mit Hinweis-Text      | XS      | Kleiner UX-Gewinn                      |
| N2 | Bestätigungs-Dialog Privat-Schalten| S      | Einmalige Warnung, schützt vor Unfall  |

---

## 6. Betroffene Dateien

| Datei                                             | Änderungen                                                              |
|---------------------------------------------------|-------------------------------------------------------------------------|
| `collection-edit.tsx`                             | H1/Subtitle entfernen; Actions in Header + Mobile Footer; Tabs immer rendern |
| `collection-edit-form.tsx`                        | Actions entfernen; `isSubmitting` via Callback nach oben; `id`-Attr auf `<form>`; Card-Stil |
| `collection-prompts.tsx`                          | Card-Stil; sticky z-10; Add/Remove-Button Text-Labels                   |
| `collection-other.tsx`                            | Card-Stil; `variant="outline"` statt destructive; AlertDialog           |
| `src/components/shared/widgets/color-picker.tsx`  | Neue Komponente                                                         |
| `src/components/shared/widgets/index.tsx`         | ColorPicker exportieren                                                 |

---

## 7. Zusammenfassung

Die wichtigsten fünf Änderungen für 80% des Gewinns:

1. **K1–K3 (XS-Aufwand):** H1 weg, Submit-Button blau, Card-Stil angleichen — drei Mini-Fixes, die die Seite sofort erkennbar in dieselbe App einordnen
2. **K2 (S-Aufwand):** Actions in den sticky Header — eliminiert das Scrollproblem und erzeugt dasselbe Verhaltensmuster wie PromptEdit
3. **F2 (S-Aufwand):** Create-Modus mit disabled Tabs + Redirect-Flow — eliminiert den Layout-Bruch nach dem Erstellen

Der Rest ist Iteration. Mit K1–K3 + K2 gehört die Seite erkennbar zur selben App.
