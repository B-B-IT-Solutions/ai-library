# Implementation Spec: „Prompt anwenden" auf Explore Detail-Page und Karte

**Feature:** Prompt-Launcher Integration in `/explore`  
**Abhängigkeit:** Explore-Feed (AI-112) — bereits implementiert  
**Aufwand:** Low–Medium  
**Datum:** 2026-05-07

---

## Kontext

Der `UseTemplateDialog` mit dem „Öffnen In"-Flow existiert bereits vollständig in `src/components/prompt-templates/`. Er soll an zwei Stellen im Explore-Bereich eingebunden werden:

1. **Detail-Page** `/explore/[slug]` — Content bereits vorhanden, Dialog öffnet sofort
2. **Karte** `ExploreEntryCard` — Content wird erst beim Klick nachgeladen (lazy), dann Dialog öffnen

Dafür werden **zwei separate Button-Komponenten** gebaut:

| Komponente | Kontext | Verhalten |
|------------|---------|-----------|
| `CatalogEntryUseButton` | Detail-Page | Content vorhanden → Dialog öffnet direkt |
| `CatalogEntryUseLazyButton` | Karte | Click → Server Action → Dialog öffnet nach Laden |

---

## Shared: Type-Adapter Utility

Beide Buttons brauchen denselben Adapter von `DCatalogEntryWithContent` zu den Typen des `UseTemplateDialog`. Um Duplikation zu vermeiden, kommt der Adapter in eine gemeinsame Datei.

### Neue Datei: `src/components/explore/buttons/catalog-entry-use.utils.ts`

```ts
import {
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";
import {
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateDescriptor,
} from "@/data/types/domain/prompt.template";

export const toCatalogEntryDescriptor = (
   entry: DCatalogEntryWithContent
): DPromptTemplateDescriptor => ({
   id: entry.id,
   title: entry.title,
   description: entry.description,
   recommendedModel: entry.recommendedModel,
   categories: entry.category ? [{ name: entry.category.name }] : [],
   promptTemplateId: entry.id,
   isFavorite: false,
   updatedAt: entry.updatedAt,
   createdAt: entry.createdAt,
});

export const toCatalogEntryTemplateData = (
   entry: DCatalogEntryWithContent
): DPromptTemplateDataPromptGeneration => ({
   template: {
      id: entry.id,
      content: entry.content,
      fields: entry.fields.map((f) => ({ ...f, promptTemplateId: f.catalogEntryId })),
      globalFieldIds: [],
      updatedAt: entry.updatedAt,
      createdAt: entry.createdAt,
   },
   allFields: entry.fields.map((f) => ({ ...f, promptTemplateId: f.catalogEntryId })),
});
```

> **Hinweis:** `DCatalogEntryField` und `DPromptTemplateField` sind strukturell fast identisch — der einzige Unterschied ist `catalogEntryId` vs. `promptTemplateId`. Der Spread `{ ...f, promptTemplateId: f.catalogEntryId }` erledigt das Mapping vollständig.

---

## Button 1: `CatalogEntryUseButton` (Detail-Page)

### Neue Datei: `src/components/explore/buttons/catalog-entry-use-button.tsx`

Client Component. Content ist bereits vorhanden — Dialog öffnet sofort beim Klick.

**Props:**
```ts
type Props = {
   entry: DCatalogEntryWithContent;
};
```

**State:**
```ts
const [isOpen, setIsOpen] = useState(false);
```

**Render:**
```tsx
"use client";

export const CatalogEntryUseButton = ({ entry }: Props) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <>
         <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            data-testid="catalog-entry-use-btn"
         >
            <Wand2 className="mr-2 h-4 w-4" />
            Prompt anwenden
         </Button>

         {isOpen && (
            <UseTemplateDialog
               descriptor={toCatalogEntryDescriptor(entry)}
               templateData={toCatalogEntryTemplateData(entry)}
               onCancel={() => setIsOpen(false)}
            />
         )}
      </>
   );
};
```

**Imports:**
- `UseTemplateDialog` aus `@/components/prompt-templates`
- `toCatalogEntryDescriptor`, `toCatalogEntryTemplateData` aus `./catalog-entry-use.utils`
- `DCatalogEntryWithContent` aus `@/data/types/domain/catalog`
- `Button` aus `@/components/shadcn/button`
- `Wand2` aus `lucide-react`
- `useState` aus `react`

---

### Neue Datei: `src/components/explore/buttons/catalog-entry-use-button.test.tsx`

| Test | Was geprüft wird |
|------|-----------------|
| Button wird gerendert | `data-testid="catalog-entry-use-btn"` ist im DOM |
| Dialog nicht sichtbar beim Laden | `use-template-dialog` ist initial nicht im DOM |
| Klick öffnet Dialog | Nach `userEvent.click` ist `use-template-dialog` im DOM |
| Dialog schließt bei `onCancel` | Nach Dialog-Schließen ist `use-template-dialog` nicht mehr im DOM |
| Snapshot | Grundzustand (Dialog geschlossen) |

Testdaten: `dtestData.dCatalogEntryWithContent(1)`

---

## Button 2: `CatalogEntryUseLazyButton` (Karte)

### Neue Datei: `src/components/explore/buttons/catalog-entry-use-lazy-button.tsx`

Client Component. Lädt den Content beim ersten Klick via Server Action nach, dann öffnet der Dialog.

**Props:**
```ts
type Props = {
   slug: string;
   recommendedModel: string; // für Tooltip/Accessibility, optional
};
```

**State:**
```ts
const [isLoading, setIsLoading] = useState(false);
const [entry, setEntry] = useState<DCatalogEntryWithContent | null>(null);
const [isOpen, setIsOpen] = useState(false);
```

**Handler:**
```ts
const handleClick = async () => {
   setIsLoading(true);
   const data = await getPublishedCatalogEntryBySlug(slug);
   setIsLoading(false);

   if (data) {
      setEntry(data);
      setIsOpen(true);
   } else {
      toast.error("Vorlage konnte nicht geladen werden");
   }
};
```

**Render:**
```tsx
"use client";

export const CatalogEntryUseLazyButton = ({ slug }: Props) => {
   // ... state ...

   return (
      <>
         <Button
            onClick={handleClick}
            disabled={isLoading}
            variant="default"
            size="sm"
            className="flex-1"
            data-testid="catalog-entry-use-lazy-btn"
         >
            {isLoading ? (
               <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
               <Wand2 className="mr-1.5 h-3.5 w-3.5" />
            )}
            Anwenden
         </Button>

         {isOpen && entry && (
            <UseTemplateDialog
               descriptor={toCatalogEntryDescriptor(entry)}
               templateData={toCatalogEntryTemplateData(entry)}
               onCancel={() => {
                  setIsOpen(false);
                  setEntry(null);
               }}
            />
         )}
      </>
   );
};
```

**Imports:**
- `UseTemplateDialog` aus `@/components/prompt-templates`
- `getPublishedCatalogEntryBySlug` aus `@/data/actions/catalog`
- `toCatalogEntryDescriptor`, `toCatalogEntryTemplateData` aus `./catalog-entry-use.utils`
- `DCatalogEntryWithContent` aus `@/data/types/domain/catalog`
- `Button` aus `@/components/shadcn/button`
- `Wand2`, `Loader2` aus `lucide-react`
- `toast` aus `sonner`
- `useState` aus `react`

---

### Neue Datei: `src/components/explore/buttons/catalog-entry-use-lazy-button.test.tsx`

| Test | Was geprüft wird |
|------|-----------------|
| Button wird gerendert | `data-testid="catalog-entry-use-lazy-btn"` ist im DOM |
| Klick triggert `getPublishedCatalogEntryBySlug` | Mock wird mit `slug` aufgerufen |
| Loading-Zustand während Fetch | Button ist `disabled` während des Ladens |
| Erfolgreicher Fetch öffnet Dialog | `use-template-dialog` erscheint nach erfolgreichem Fetch |
| Fehlgeschlagener Fetch zeigt Toast | `toast.error` wird aufgerufen wenn Action `null` zurückgibt |
| Dialog schließt bei `onCancel` | Dialog verschwindet, `entry`-State wird zurückgesetzt |
| Snapshot | Grundzustand (nicht loading, Dialog geschlossen) |

**Mock für die Server Action:**
```ts
jest.mock("@/data/actions/catalog", () => ({
   getPublishedCatalogEntryBySlug: jest.fn(),
}));
```

---

## Änderung: `src/components/explore/buttons/index.tsx`

```ts
export { CatalogEntryCopyButton } from "./catalog-entry-copy-button";
export { CatalogEntryUseButton } from "./catalog-entry-use-button";
export { CatalogEntryUseLazyButton } from "./catalog-entry-use-lazy-button";
```

---

## Änderung: `CatalogEntryView` (Detail-Page)

### Datei: `src/components/explore/detail/view/catalog-entry-view.tsx`

`CatalogEntryView` ist eine **Server Component** — bleibt so. Die neuen Client Components werden importiert und eingebunden.

**Import erweitern:**
```ts
import { CatalogEntryCopyButton, CatalogEntryUseButton } from "../../buttons";
```

**`header()` — CTA-Bereich:**

`CatalogEntryUseButton` kommt **vor** `CatalogEntryCopyButton` (primäre Aktion für Erstbesucher ist das direkte Verwenden):

```tsx
<div className="flex flex-wrap gap-3">
   <CatalogEntryUseButton entry={entry} />
   <CatalogEntryCopyButton
      catalogEntryId={entry.id}
      slug={entry.slug}
      isAuthenticated={isAuthenticated}
   />
</div>
```

**`cta()` — Bottom CTA:**

```tsx
<div className="mt-4 flex justify-center gap-3">
   <CatalogEntryUseButton entry={entry} />
   <CatalogEntryCopyButton
      catalogEntryId={entry.id}
      slug={entry.slug}
      isAuthenticated={isAuthenticated}
   />
</div>
```

### Tests: `catalog-entry-view.test.tsx`

Hilfsfunktion ergänzen:
```ts
const assertUseBtnRendered = () => {
   const header = screen.getByTestId("header");
   const cta = screen.getByTestId("cta");
   assertInDocument(getByTestId(header, "catalog-entry-use-btn"));
   assertInDocument(getByTestId(cta, "catalog-entry-use-btn"));
};
```

In allen bestehenden `it()`-Blöcken `assertUseBtnRendered()` aufrufen.

**Snapshot löschen:**
`src/components/explore/detail/view/__snapshots__/catalog-entry-view.test.tsx.snap`

---

## Änderung: `ExploreEntryCard` (Karte)

### Datei: `src/components/explore/lists/items/explore-entry-card.tsx`

`ExploreEntryCard` ist eine **Server Component** — bleibt so. `CatalogEntryUseLazyButton` ist der Client-Teil.

**Import ergänzen:**
```ts
import { CatalogEntryUseLazyButton } from "@/components/explore/buttons";
```

**`CardFooter` — aktuell ein einzelner Button, neu: zwei Buttons nebeneinander:**

```tsx
<CardFooter className="pt-0">
   <div className="flex w-full gap-2">
      <CatalogEntryUseLazyButton slug={slug} />
      <Button asChild variant="outline" size="sm" className="flex-1">
         <Link
            href={`/explore/${slug}`}
            className="flex items-center gap-1.5"
         >
            <BookOpen className="h-3.5 w-3.5" />
            Ansehen
         </Link>
      </Button>
   </div>
</CardFooter>
```

> **Layout-Logik:** Beide Buttons nehmen mit `flex-1` gleich viel Platz ein. `CatalogEntryUseLazyButton` nutzt `variant="default"` (primär), `Ansehen` nutzt `variant="outline"` (sekundär).

### Tests: `explore-entry-card.test.tsx`

Neue Tests ergänzen:
```ts
it("ExploreEntryCard - renders use lazy button - test", async () => {
   const entry = dtestData.dCatalogEntry(1);
   render(<ExploreEntryCard entry={entry} />);

   await waitFor(() => {
      assertInDocument(screen.getByTestId("catalog-entry-use-lazy-btn"));
   });
});
```

Bestehende Snapshot-Tests laufen nach dem Löschen des Snapshots neu durch.

**Snapshot löschen:**
`src/components/explore/lists/items/__snapshots__/explore-entry-card.test.tsx.snap`

---

## Dateien-Übersicht

| Aktion | Datei |
|--------|-------|
| **Neu erstellen** | `src/components/explore/buttons/catalog-entry-use.utils.ts` |
| **Neu erstellen** | `src/components/explore/buttons/catalog-entry-use-button.tsx` |
| **Neu erstellen** | `src/components/explore/buttons/catalog-entry-use-button.test.tsx` |
| **Neu erstellen** | `src/components/explore/buttons/catalog-entry-use-lazy-button.tsx` |
| **Neu erstellen** | `src/components/explore/buttons/catalog-entry-use-lazy-button.test.tsx` |
| **Ändern** | `src/components/explore/buttons/index.tsx` |
| **Ändern** | `src/components/explore/detail/view/catalog-entry-view.tsx` |
| **Ändern** | `src/components/explore/detail/view/catalog-entry-view.test.tsx` |
| **Ändern** | `src/components/explore/lists/items/explore-entry-card.tsx` |
| **Ändern** | `src/components/explore/lists/items/explore-entry-card.test.tsx` |
| **Löschen** | `src/components/explore/detail/view/__snapshots__/catalog-entry-view.test.tsx.snap` |
| **Löschen** | `src/components/explore/lists/items/__snapshots__/explore-entry-card.test.tsx.snap` |

---

## Was explizit NICHT geändert wird

- `UseTemplateDialog` / `UseTemplateForm` — keine Änderungen
- Server Actions / Services / Repository — keine Änderungen
- `getPublishedCatalogEntryBySlug` wird unverändert wiederverwendet
- Auth-Logik — der Dialog benötigt keine Authentifizierung

---

## Akzeptanzkriterien

### Detail-Page (`/explore/[slug]`)
- [ ] „Prompt anwenden"-Button erscheint im Header-CTA (vor dem Copy-Button)
- [ ] „Prompt anwenden"-Button erscheint im Bottom-CTA (vor dem Copy-Button)
- [ ] Klick öffnet Dialog sofort (kein Laden nötig)
- [ ] Formularfelder stimmen mit den Feldern des Catalog-Eintrags überein

### Karte (`/explore`)
- [ ] „Anwenden"-Button erscheint auf jeder Karte neben „Ansehen"
- [ ] Klick zeigt Loading-Zustand (Button disabled + Spinner)
- [ ] Dialog öffnet nach erfolgreichem Laden des Contents
- [ ] Fehlerfall zeigt `toast.error`

### Beide Kontexte
- [ ] Live-Vorschau rendert Prompt korrekt mit ausgefüllten Werten
- [ ] „Öffnen In"-Dropdown öffnet gewähltes KI-Tool mit fertigem Prompt
- [ ] Copy-Button kopiert fertigen Prompt in Zwischenablage
- [ ] Dialog schließt korrekt (X, Escape, außerhalb klicken)
- [ ] Alle Tests grün, Coverage-Thresholds eingehalten (99% Lines, 98.2% Branches)
