# UI Design Guidelines

> **Zweck:** Diese Richtlinie definiert verbindliche Standards für die Implementierung von UI-Komponenten in diesem Projekt. Sie basiert auf den tatsächlichen Mustern im Code und ist vor jeder neuen Komponente zu lesen.
>
> **Sprache:** Alle sichtbaren UI-Texte sind auf **Deutsch (de-DE)**. Englische Strings in der UI sind ein Fehler.

---

## 1. Komponentenstruktur

### Server vs. Client Components

- **Standard:** Server Component — kein `"use client"` ohne Grund
- **`"use client"` ist nötig wenn:** `useState`, `useEffect`, Event-Handler, Browser-APIs, React Query Hooks, `useTransition`
- Interaktive Teile als kleine Client-Komponenten isolieren; der Rest bleibt Server

```tsx
// ✅ Richtig — nur der interaktive Teil ist Client
// collection-card.tsx (Server Component)
import { DeleteCollectionButton } from "./buttons/delete-collection-button"; // "use client"

// ❌ Falsch — ganze Seite unnötig als Client
"use client";
export default function CollectionsPage() { ... }
```

### Props & TypeScript

- Props immer explizit typisieren — kein `any`, kein ungetyptes `object`
- Optionale Props mit `?` markieren und sinnvolle Defaults setzen
- `data-testid` als optionaler Prop in jeder Komponente anbieten: `"data-testid"?: string`

```tsx
type Props = {
  title: string;
  description?: string;
  "data-testid"?: string;
};
```

### Compound Component Pattern

Für komplexe Layout-Strukturen das Compound-Pattern verwenden (wie `ItemDetailsView`):

```tsx
// src/components/shared/wrappers/item-details/item-details-view.tsx
<ItemDetailsView>
  <ItemDetailsViewHeader>...</ItemDetailsViewHeader>
  <ItemDetailsViewContent>
    <ItemDetailsViewBreadcrumbs>...</ItemDetailsViewBreadcrumbs>
    <ItemDetailsViewBody>...</ItemDetailsViewBody>
  </ItemDetailsViewContent>
</ItemDetailsView>
```

Vorteil: Layout-Struktur ist explizit und wiederverwendbar ohne Props-Drilling.

### Barrel Exports

Jedes Feature-Verzeichnis exportiert über `index.tsx`:

```tsx
// src/components/collections/buttons/index.tsx
export { CreateCollectionButton } from "./create-collection-button";
export { DeleteCollectionButton } from "./delete-collection-button";
export { EditCollectionButton } from "./edit-collection-button";
```

---

## 2. Formulare

### Widget-Komponenten — immer verwenden

**Niemals** rohe `FormField`-Blöcke direkt in Feature-Komponenten. Stattdessen ausschließlich die fertigen Widgets aus `src/components/shared/widgets/`:

| Widget                | Verwendung                         |
| --------------------- | ---------------------------------- |
| `<FormInput>`         | Text, Email, Zahl, Passwort        |
| `<FormTextArea>`      | Mehrzeiliger Text                  |
| `<FormSelect>`        | Auswahl aus Liste                  |
| `<FormRadio>`         | Einzelauswahl (sichtbare Optionen) |
| `<FormCheckBox>`      | Ja/Nein-Auswahl                    |
| `<FormDynamicValues>` | Dynamische Werteliste              |
| `<FormMdEditor>`      | Rich-Text (Markdown via Tiptap)    |

```tsx
// ✅ Richtig
import { FormInput, FormSelect, FormTextArea } from "@/components/shared/widgets";

<FormInput
  name="title"
  label="Titel"
  placeholder="z. B. E-Mail-Betreff Generator"
  required
  control={form.control}
/>

// ❌ Falsch — roher FormField-Block
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Titel</FormLabel>
      <FormControl><Input {...field} /></FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Pflichtfelder

- `required` prop setzen → zeigt automatisch rotes `*` nach dem Label
- Validierung via Zod-Schema im `useForm`-Hook definieren

### Submit-Button

Immer mit Ladezustand — kein stummes Warten nach dem Klick:

```tsx
<Button type="submit" disabled={isPending} className="cursor-pointer">
  {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
  Speichern
</Button>
```

### Formular-Layout

- Felder in logischer Reihenfolge (wichtigstes zuerst)
- Abbrechen-Button immer **vor** dem Speichern-Button (links / sekundär)
- Submit-Button ist visuell dominant (primäre Variante)

```tsx
<div className="flex gap-2 justify-end">
  <Button variant="outline" type="button" onClick={onCancel}>Abbrechen</Button>
  <Button type="submit" disabled={isPending}>Speichern</Button>
</div>
```

---

## 3. Zustände — Loading, Empty, Error

Jede Komponente, die Daten lädt, **muss** alle drei Zustände behandeln.

### Loading — Skeleton

Skeleton-Komponenten aus `src/components/shared/skeletons.tsx` verwenden. Nie einfach "Loading..." Text.

```tsx
// Vorhandene Skeletons:
<TemplateCardSkeleton />
<ProductCardSkeleton />
<OrderCardSkeleton />
<CartItemSkeleton />
<PageHeaderSkeleton />
```

Neue Skeletons nach demselben Muster — `animate-pulse` + `bg-slate-200` (primär) / `bg-slate-100` (sekundär):

```tsx
// Neues Skeleton-Element
<div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
<div className="h-4 w-full animate-pulse rounded bg-slate-100" />
```

### Empty State

Muster: Icon + Heading + beschreibender Text + CTA-Button:

```tsx
<div className="flex flex-col items-center gap-4 py-12 text-center">
  <Folder className="h-12 w-12 text-slate-300" />
  <div>
    <h3 className="font-semibold text-slate-900">Keine Sammlungen vorhanden</h3>
    <p className="mt-1 text-sm text-slate-500">Erstelle deine erste Sammlung.</p>
  </div>
  <CreateCollectionButton />
</div>
```

### Error State

Fehler immer dem Nutzer zeigen — nie still schlucken:

- Formularfehler: inline unter dem Feld via `<FormMessage />`
- Server Action Fehler: `toast.error("Fehlermeldung")` via sonner
- Seitenweite Fehler: `error.tsx` im Route-Segment

---

## 4. Destructive Actions (Löschen)

**Immer** `DeleteDropdownMenuItem` aus `src/components/shared/dropdowns/delete-dropdown-menu-item.tsx` verwenden. Keine eigenen Lösch-Dialoge bauen.

```tsx
<DeleteDropdownMenuItem
  label="Löschen"
  dialog={{
    title: "Sammlung löschen?",
    description: "Diese Aktion kann nicht rückgängig gemacht werden. Die Sammlung wird dauerhaft entfernt.",
  }}
  onDelete={handleDelete}
/>
```

**Regeln für Lösch-Dialoge:**

- Titel: Frage mit `?` → z. B. „Vorlage löschen?"
- Beschreibung: Konsequenz benennen — was geht verloren?
- Bestätigen-Button: `bg-red-600 hover:bg-red-700`, Label „Löschen"
- Abbrechen-Button: neutral/outline, Label „Abbrechen"

---

## 5. Farben & Design-Tokens

Das Projekt verwendet ein vollständiges semantisches Token-System (definiert in `src/assets/styles/globals.css`).
**Semantische Tokens haben immer Vorrang vor hardcodierten Tailwind-Farben** (z. B. `slate-*`).
Slate-Klassen direkt zu schreiben umgeht das Theme-System und bricht Dark Mode.

### Semantische Tokens — Pflicht

| Verwendung                    | ✅ Token                                 | ❌ Nicht verwenden                     |
| ----------------------------- | ---------------------------------------- | -------------------------------------- |
| Haupttext / Überschriften     | `text-foreground`                        | `text-slate-900`                       |
| Sekundärtext / Beschreibungen | `text-muted-foreground`                  | `text-slate-500`, `text-slate-600`     |
| Text auf Karten               | `text-card-foreground`                   | `text-slate-900` auf `bg-white`        |
| Seitenhintergrund             | `bg-background`                          | `bg-white`, `bg-slate-50`              |
| Karten-Hintergrund            | `bg-card`                                | `bg-white`                             |
| Gedämpfte Flächen / Chips     | `bg-muted`                               | `bg-slate-100`, `bg-slate-50`          |
| Standard-Rahmen               | `border-border`                          | `border-slate-200`, `border-slate-300` |
| Primäre CTA-Buttons           | `bg-primary text-primary-foreground`     | —                                      |
| Sekundäre Buttons/Badges      | `bg-secondary text-secondary-foreground` | —                                      |
| Destructive (Löschen, Fehler) | `bg-destructive text-destructive`        | `bg-red-600`                           |
| Focus-Ring                    | `ring-ring`                              | `ring-slate-*`                         |

### Statusfarben — Ausnahmen (kein Token vorhanden)

Für Ampel-Semantik (Erfolg, Warnung) gibt es keine semantischen Tokens — hier sind Tailwind-Farben erlaubt:

| Verwendung           | Klasse                           |
| -------------------- | -------------------------------- |
| Erfolg / Bestätigung | `text-green-600` / `bg-green-50` |
| Warnung              | `text-amber-600` / `bg-amber-50` |

### Skeleton / Shimmer-Effekte

Skeleton-Elemente repräsentieren keine Inhaltssemantik — hier `bg-muted` verwenden:

```tsx
// ✅ Richtig
<div className="h-5 w-3/4 animate-pulse rounded bg-muted" />

// Für schwächere Skelette (z. B. Textzeilen)
<div className="h-4 w-full animate-pulse rounded bg-muted/60" />
```

---

## 6. Karten (Cards)

Basis-Muster für Content-Karten:

```tsx
<Card className="gap-0 rounded-lg border border-slate-300 bg-white p-4 hover:shadow-md transition-shadow">
  <CardHeader className="p-0 gap-2 mb-3">...</CardHeader>
  <CardContent className="p-0 grid gap-2">...</CardContent>
</Card>
```

### Klickbare Karten

Link als Wrapper um den klickbaren Bereich. Aktionsmenü separat (nicht Teil des Links):

```tsx
// Muster aus collection-card.tsx
<div className="group relative ...">
  {/* Aktionsmenü — nur bei Hover sichtbar */}
  <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
    <MoreOptionsButton ... />
  </div>

  {/* Klickbarer Hauptbereich */}
  <Link href={`/collections/${id}`} className="flex flex-1 flex-col gap-3">
    ...
  </Link>
</div>
```

### Aktionsmenü auf Karten

Immer `MoreOptionsButton`-Pattern mit `DropdownMenu`:

- Trigger: `<Button variant="outline" size="icon-sm">` mit `<MoreVertical />`
- Inhalt: `Edit`-Item + `<DropdownMenuSeparator />` + `Delete`-Item
- Sichtbarkeit: `opacity-0 group-hover:opacity-100` (hover-only)

---

## 7. Icons

- Ausschließlich `lucide-react` — keine anderen Icon-Bibliotheken
- Standardgrößen:

| Kontext                        | Klasse                     |
| ------------------------------ | -------------------------- |
| Inline in Text / Buttons       | `h-4 w-4`                  |
| Karten-Icons, größere Bereiche | `h-5 w-5`                  |
| Empty-State Illustrations      | `h-12 w-12 text-slate-300` |
| Ladeindikator (Spinner)        | `h-4 w-4 animate-spin`     |

- Icons haben **keinen** eigenen semantischen Wert → `aria-hidden` oder im Button via sichtbares Label / Tooltip abgesichert

---

## 8. Tooltips für Icon-only-Buttons

Jeder Button ohne sichtbares Text-Label **muss** einen Tooltip haben:

```tsx
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline" size="icon" aria-label="Kopieren">
      <Copy className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>In Zwischenablage kopieren</TooltipContent>
</Tooltip>
```

Tooltip-Text: Deutsch, beschreibend, imperativ (z. B. „Kopieren", „Bearbeiten", „Löschen").

---

## 9. Barrierefreiheit (Accessibility)

### Pflicht für jede Komponente

- [ ] `data-testid` auf jedem interaktiven Element und wichtigen Container
- [ ] Icon-only Buttons: `aria-label` **und** Tooltip
- [ ] Formular-Inputs: immer `<FormLabel>` — nie nur Placeholder als Label
- [ ] Klickbare Elemente: `cursor-pointer` Klasse setzen
- [ ] Buttons in Formularen: explizit `type="button"` oder `type="submit"` setzen (kein Default-Verhalten)

### Heading-Hierarchie

- Eine `h1` pro Seite (Seitentitel)
- Abschnitte: `h2`, Unterabschnitte: `h3`
- Nie Heading-Ebenen überspringen (von h1 direkt auf h3)

### Keyboard Navigation

- Alle interaktiven Elemente per Tab erreichbar
- Modals/Dialoge: Fokus wird beim Öffnen ins Modal gesetzt (Radix AlertDialog macht das automatisch)
- Dropdown-Menüs: per Tastatur navigierbar (Radix DropdownMenu macht das automatisch)

### Farbkontrast

- Text auf Hintergrund: min. **4,5:1** (Normal), min. **3:1** (Groß/Bold)
- Slate-900 auf Weiß / Slate-50: ✅ ausreichend
- Slate-300 auf Weiß: ❌ nur für dekorative Elemente (kein Text)

---

## 10. Sprache & Texte

**Alle sichtbaren UI-Texte sind auf Deutsch.** Keine englischen Strings im JSX.

| ✅ Deutsch | ❌ Englisch |
| ---------- | ----------- |
| Speichern  | Save        |
| Abbrechen  | Cancel      |
| Löschen    | Delete      |
| Bearbeiten | Edit        |
| Laden...   | Loading...  |
| Erstellen  | Create      |
| Suchen     | Search      |

**Aktion-Labels**: Imperativ-Form, konkret:

- „Sammlung erstellen" statt „Neu"
- „Vorlage löschen" statt „Löschen bestätigen"
- „Änderungen speichern" statt „OK"

**Singular/Plural** korrekt handhaben:

```tsx
{count === 1 ? "1 Vorlage" : `${count} Vorlagen`}
```

---

## 11. Layout-Wrapper

| Kontext                 | Wrapper                                                              |
| ----------------------- | -------------------------------------------------------------------- |
| Authentifizierte Seiten | `<AuthenticatedLayoutWrapper>` — stellt Sidebar + TrialBanner bereit |
| Öffentliche Seiten      | `<PublicLayoutWrapper>` — sticky Header + Footer                     |
| Detail-Ansicht (View)   | `ItemDetailsView` + Sub-Komponenten                                  |
| Detail-Ansicht (Edit)   | `ItemDetailsEdit` + Sub-Komponenten                                  |

Nie eigene Layout-Wrapper bauen — bestehende verwenden.

---

## 12. Toasts (Benachrichtigungen)

Toasts via `sonner` — ausschließlich für Feedback nach Aktionen:

```tsx
import { toast } from "sonner";

// Erfolg
toast.success("Sammlung wurde gespeichert.");

// Fehler
toast.error("Speichern fehlgeschlagen. Bitte versuche es erneut.");
```

**Regeln:**

- Erfolgs-Toast: nach jeder erfolgreichen Server Action
- Fehler-Toast: bei unerwarteten Fehlern (außer Formularvalidierung)
- Kein Toast für reine Navigation (z. B. nach Weiterleitung)
- Text: vollständige Sätze mit Punkt, auf Deutsch

---

## 13. Interaktive Zustände

Jedes interaktive Element braucht alle relevanten Zustände:

| Zustand         | Umsetzung                                                           |
| --------------- | ------------------------------------------------------------------- |
| Default         | Basisstil                                                           |
| Hover (Karten)  | `hover:shadow-md transition-shadow`                                 |
| Hover (Buttons) | via shadcn `Button` Variante                                        |
| Focus           | via shadcn / Tailwind `focus-visible:ring-*`                        |
| Disabled        | `disabled:opacity-50 disabled:cursor-not-allowed` (shadcn Standard) |
| Loading         | `disabled={isPending}` + `<Loader className="animate-spin" />`      |

---

## Checkliste vor dem PR

Vor jedem Pull Request mit UI-Änderungen:

- [ ] Alle Texte auf Deutsch?
- [ ] Alle drei Zustände implementiert: Loading (Skeleton), Empty, Error?
- [ ] Formularfelder nutzen Widget-Komponenten aus `src/components/shared/widgets/`?
- [ ] Icon-only Buttons haben `aria-label` + Tooltip?
- [ ] Destructive Actions nutzen `DeleteDropdownMenuItem`?
- [ ] Submit-Buttons haben Ladezustand?
- [ ] `data-testid` auf allen wichtigen Elementen?
- [ ] Keine neuen englischen Strings in der UI?
- [ ] `cursor-pointer` auf klickbaren Elementen?
