# Implementation Spec: „Prompt anwenden" Button auf Explore Detail-Page

**Feature:** Prompt-Launcher Integration in `/explore/[slug]`  
**Abhängigkeit:** Explore-Feed (AI-112) — bereits implementiert  
**Aufwand:** Low  
**Datum:** 2026-05-07

---

## Kontext

Die Detail-Page `/explore/[slug]` zeigt Formularfelder eines Catalog-Eintrags bisher nur als **statische Metadaten** (Label, Typ, Beschreibung). Der `UseTemplateDialog` mit dem voll funktionsfähigen „Öffnen In"-Flow existiert bereits in `src/components/prompt-templates/`.

Ziel: Einen „Prompt anwenden"-Button auf der Detail-Page hinzufügen, der diesen Dialog öffnet — sodass Nutzer den Prompt direkt ausfüllen und in ihrem KI-Tool verwenden können, ohne ihn zuerst in ihre Library kopieren zu müssen.

---

## Was zu implementieren ist

### 1. Neue Datei: `src/components/explore/buttons/catalog-entry-use-button.tsx`

Client Component. Verwaltet den Dialog-Open-State und enthält den Type-Adapter.

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

**Type-Adapter** (inline in dieser Datei, kein separates File nötig):

`DCatalogEntryWithContent` → `DPromptTemplateDataPromptGeneration`:
```ts
const toTemplateData = (entry: DCatalogEntryWithContent): DPromptTemplateDataPromptGeneration => ({
   template: {
      id: entry.id,
      content: entry.content,
      fields: entry.fields.map(f => ({ ...f, promptTemplateId: f.catalogEntryId })),
      globalFieldIds: [],
      updatedAt: entry.updatedAt,
      createdAt: entry.createdAt,
   },
   allFields: entry.fields.map(f => ({ ...f, promptTemplateId: f.catalogEntryId })),
});
```

`DCatalogEntryWithContent` → `DPromptTemplateDescriptor`:
```ts
const toDescriptor = (entry: DCatalogEntryWithContent): DPromptTemplateDescriptor => ({
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
```

**Render:**
```tsx
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
         descriptor={toDescriptor(entry)}
         templateData={toTemplateData(entry)}
         onCancel={() => setIsOpen(false)}
      />
   )}
</>
```

**Imports die benötigt werden:**
- `UseTemplateDialog` aus `@/components/prompt-templates`
- `DPromptTemplateDataPromptGeneration`, `DPromptTemplateDescriptor` aus `@/data/types/domain/prompt.template`
- `DCatalogEntryWithContent` aus `@/data/types/domain/catalog`
- `Button` aus `@/components/shadcn/button`
- `Wand2` aus `lucide-react`
- `useState` aus `react`

---

### 2. Änderung: `src/components/explore/buttons/index.tsx`

Den neuen Button exportieren:

```ts
export { CatalogEntryCopyButton } from "./catalog-entry-copy-button";
export { CatalogEntryUseButton } from "./catalog-entry-use-button";   // neu
```

---

### 3. Änderung: `src/components/explore/detail/view/catalog-entry-view.tsx`

**Achtung:** `CatalogEntryView` ist eine **Server Component** (kein `"use client"`). Das bleibt so. Der neue Button ist ein Client Component und wird wie `CatalogEntryCopyButton` importiert.

**Zwei Stellen anpassen:**

#### 3a. Header-CTA (`header()` Funktion)

Die bestehende `<div className="flex flex-wrap gap-3">` enthält aktuell nur `CatalogEntryCopyButton`. Den neuen Button **davor** einfügen (primäre Aktion für Erstbesucher):

```tsx
<div className="flex flex-wrap gap-3">
   <CatalogEntryUseButton entry={entry} />          {/* neu — davor */}
   <CatalogEntryCopyButton
      catalogEntryId={entry.id}
      slug={entry.slug}
      isAuthenticated={isAuthenticated}
   />
</div>
```

#### 3b. Bottom-CTA (`cta()` Funktion)

Gleiches Muster — den Use-Button vor dem Copy-Button hinzufügen:

```tsx
<div className="mt-4 flex justify-center gap-3">
   <CatalogEntryUseButton entry={entry} />          {/* neu — davor */}
   <CatalogEntryCopyButton
      catalogEntryId={entry.id}
      slug={entry.slug}
      isAuthenticated={isAuthenticated}
   />
</div>
```

**Import hinzufügen:**
```ts
import { CatalogEntryCopyButton, CatalogEntryUseButton } from "../../buttons";
```

---

### 4. Tests

#### 4a. Neue Datei: `src/components/explore/buttons/catalog-entry-use-button.test.tsx`

Folgende Fälle testen:

| Test | Was geprüft wird |
|------|-----------------|
| „Prompt anwenden"-Button wird gerendert | `data-testid="catalog-entry-use-btn"` ist im DOM |
| Button öffnet Dialog bei Klick | Nach `userEvent.click(btn)` ist `use-template-dialog` im DOM |
| Dialog schließt bei `onCancel` | `onCancel` schließt Dialog (über `onOpenChange`) |
| Snapshot-Test | Komponente rendert korrekt |

Testdaten: `dtestData.dCatalogEntryWithContent(1)` liefert bereits ein valides `DCatalogEntryWithContent`-Objekt.

#### 4b. Änderung: `src/components/explore/detail/view/catalog-entry-view.test.tsx`

In den bestehenden Tests die neuen Assertions hinzufügen:

```ts
// Hilfsfunktion ergänzen:
const assertUseBtnRendered = () => {
   const header = screen.getByTestId("header");
   const cta = screen.getByTestId("cta");
   const headerUseBtn = getByTestId(header, "catalog-entry-use-btn");
   const ctaUseBtn = getByTestId(cta, "catalog-entry-use-btn");
   assertInDocument(headerUseBtn);
   assertInDocument(ctaUseBtn);
};
```

In allen bestehenden `it()`-Blöcken `assertUseBtnRendered()` aufrufen.

**Snapshots löschen** damit sie neu generiert werden:
- `src/components/explore/detail/view/__snapshots__/catalog-entry-view.test.tsx.snap`

---

## Dateien-Übersicht

| Aktion | Datei |
|--------|-------|
| **Neu erstellen** | `src/components/explore/buttons/catalog-entry-use-button.tsx` |
| **Neu erstellen** | `src/components/explore/buttons/catalog-entry-use-button.test.tsx` |
| **Ändern** | `src/components/explore/buttons/index.tsx` |
| **Ändern** | `src/components/explore/detail/view/catalog-entry-view.tsx` |
| **Ändern** | `src/components/explore/detail/view/catalog-entry-view.test.tsx` |
| **Löschen** | `src/components/explore/detail/view/__snapshots__/catalog-entry-view.test.tsx.snap` |

---

## Was explizit NICHT geändert wird

- `UseTemplateDialog` — keine Änderungen
- `UseTemplateForm` — keine Änderungen
- Datenbank / Server Actions / Services — keine Änderungen
- Auth-Logik — der Dialog benötigt keine Authentifizierung (analog zum bestehenden Verhalten)
- `ExploreEntryCard` (Listenansicht) — kein Button auf der Karte; der Flow ist: Karte → Detail-Page → Dialog

---

## Verhalten des Dialogs im Explore-Kontext

Der `UseTemplateDialog` funktioniert ohne Anpassungen, weil:
- Er keine User-spezifischen Daten benötigt (kein `userId`, kein Auth-State)
- `isFavorite: false` im Descriptor ist ein gültiger Default
- `globalFieldIds: []` ist korrekt — Catalog-Einträge haben keine global geteilten Felder
- `recommendedModel` aus dem Catalog-Eintrag steuert welches KI-Tool im Dropdown als erstes vorgeschlagen wird

---

## Akzeptanzkriterien

- [ ] „Prompt anwenden"-Button erscheint im Header-CTA-Bereich der Detail-Page
- [ ] „Prompt anwenden"-Button erscheint im Bottom-CTA-Bereich der Detail-Page
- [ ] Klick öffnet `UseTemplateDialog` mit korrekt gefüllten Formularfeldern
- [ ] Formularfelder entsprechen den Feldern des Catalog-Eintrags (Label, Typ, Pflichtfeld, Optionen)
- [ ] Live-Vorschau rendert den Prompt korrekt mit ausgefüllten Werten
- [ ] „Öffnen In"-Dropdown öffnet das gewählte KI-Tool mit dem fertigen Prompt
- [ ] „Kopieren"-Button kopiert den fertigen Prompt in die Zwischenablage
- [ ] Dialog schließt sich korrekt (X-Button, Escape, außerhalb klicken)
- [ ] Alle Tests grün, Coverage-Thresholds eingehalten
