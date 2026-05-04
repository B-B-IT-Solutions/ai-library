# Product Description: Public Explore / Discovery Feed

**Feature ID:** AI-112  
**Priority:** P1 — Critical Growth Feature  
**Effort:** Medium  
**Status:** Specification  
**Date:** 2026-05-04

---

## 1. Executive Summary

Die Plattform hat aktuell keinen öffentlichen Einstiegspunkt für unangemeldete Nutzer, der Inhalte entdeckbar macht. Ohne ihn: kein organisches Wachstum, kein SEO-Indexing, kein viraler Akquisitionsloop.

Der Explore-Feed bei `/explore` schließt diese kritische Lücke. Er basiert auf einem **eigenständigen Catalog-Domain** — vollständig getrennt von den persönlichen User-Templates. Nutzer können Catalog-Einträge entdecken und mit einem Klick als **persönliche Kopie** in ihre eigene Library übernehmen.

---

## 2. Kernproblem: Zwei unterschiedliche Domains

Das Herzstück dieser Entscheidung ist die saubere Trennung zweier Konzepte, die bisher implizit über `PromptTemplateDescriptor` laufen:

|                               | **User Template**                   | **Catalog Entry**                   |
| ----------------------------- | ----------------------------------- | ----------------------------------- |
| **Eigentümer**                | Einzelner User (`userId`)           | Plattform (Admin-verwaltet)         |
| **Zweck**                     | Persönlicher Workflow, privat       | Öffentliche Vorlage zur Inspiration |
| **Sichtbarkeit**              | Privat (nur der Nutzer selbst)      | Öffentlich, auth-frei               |
| **Bearbeitbar durch Nutzer?** | Ja, vollständig                     | Nein (nur lesen / kopieren)         |
| **Kategorisierung**           | Per-User (`PromptTemplateCategory`) | Global, admin-verwaltet             |
| **Aktuelles Modell**          | `PromptTemplateDescriptor`          | **Neu: `CatalogEntry`**             |

**Das Problem mit dem alten Ansatz:** `PromptTemplateDescriptor` hat immer eine `userId` — jede Repository-Methode filtert zwingend nach User. Dieses Modell für öffentliche Discovery zu missbrauchen würde beide Konzepte korrumpieren und zukünftige Entwicklung erschweren.

**Die Lösung:** Ein eigenes `CatalogEntry`-Modell ohne User-Ownership.

---

## 3. Strategischer Kontext

### Warum dies Priority 1 ist

| Problem                                       | Auswirkung                                  |
| --------------------------------------------- | ------------------------------------------- |
| Keine auth-freie Startseite mit echtem Inhalt | 100% der neuen Nutzer sehen keine Templates |
| Keine SEO-indexierbaren Inhaltsseiten         | Zero organischer Suchtraffic                |
| Kein viraler Einstiegspunkt                   | Kein Sharing-Loop, kein Referral-Traffic    |
| Kein "Ausprobieren bevor registrieren"        | Hohe Hürde für Neukunden-Konversion         |

### Competitive Gap

- **FlowGPT** (10M+ User): Gewinnt fast ausschließlich über Discovery-Feed — aber ohne Creator-Monetarisierung und ohne strukturierte Templates
- **PromptBase** (220K+ Prompts): Dominiert SEO mit indexierten Einzelseiten — aber nur Rohtext, keine Form-Felder
- **Diese Plattform**: Stärkstes Template-Format (Typed Form Fields) — aber bisher null öffentliche Einstiegsoberfläche

**Ziel:** FlowGPTs Discovery-UX + PromptBases SEO, realisiert auf Basis des überlegenen Catalog-Formats mit strukturierten Feldern.

---

## 4. User Stories

### Primär — Unangemeldeter Entdecker

> **Als** unangemeldeter Nutzer,  
> **möchte ich** einen öffentlichen Feed mit AI-Prompt-Vorlagen nach Kategorie browsen und durchsuchen,  
> **damit ich** das passende Template finde und entscheide, ob ich mich registriere.

### Primär — Registrierter Nutzer, der übernimmt

> **Als** angemeldeter Nutzer,  
> **möchte ich** einen Catalog-Eintrag mit einem Klick als eigene Vorlage in meine Library kopieren,  
> **damit ich** ihn dort unabhängig nach meinen Bedürfnissen anpassen kann.

### Sekundär — SEO / Suchmaschinen-Traffic

> **Als** Google-Nutzer, der nach "[Aufgabe] AI Prompt" sucht,  
> **möchte ich** eine dedizierte, schnell ladende Seite für eine konkrete Vorlage finden,  
> **damit ich** sie direkt nutzen oder in meine Library übernehmen kann.

### Sekundär — Admin / Content Manager

> **Als** Admin,  
> **möchte ich** Catalog-Einträge verwalten (erstellen, bearbeiten, veröffentlichen, depublizieren),  
> **damit ich** die Qualität und Relevanz des öffentlichen Feeds steuere.

---

## 5. Feature-Scope

### In Scope (MVP)

| Feature                            | Beschreibung                                                             |
| ---------------------------------- | ------------------------------------------------------------------------ |
| Route `/explore`                   | Auth-freie Server Component Seite                                        |
| Catalog-Grid                       | Responsive Karten-Ansicht der `CatalogEntry`-Objekte                     |
| Kategorie-Filter                   | Filter nach `CatalogCategory` (globale Taxonomie)                        |
| Volltextsuche                      | Suche in Titel und Beschreibung                                          |
| Sort: Neueste                      | Standard nach `publishedAt DESC`                                         |
| Sort: Beliebt                      | Nach `copyCount DESC`                                                    |
| Detailseite `/explore/[slug]`      | SEO-optimierte Einzelseite pro Catalog-Eintrag                           |
| Preview der Felder                 | Anzeige der Form-Felder (Labels, Typen) ohne Ausführung                  |
| "In meine Library" — Kopier-Aktion | Für eingeloggte Nutzer: erstellt eigene `PromptTemplateDescriptor`-Kopie |
| Unauthenticated CTA                | "Registrieren um zu übernehmen" → `/auth/sign-up`                        |
| `copyCount`-Tracking               | Inkrementierung bei jeder erfolgreichen Kopier-Aktion                    |
| SEO Metadata                       | `generateMetadata` pro Catalog-Eintrag                                   |

### Out of Scope (MVP)

| Feature                          | Begründung                               | Priorität |
| -------------------------------- | ---------------------------------------- | --------- |
| In-Platform Prompt Testing       | Eigene Initiative P2                     | P2        |
| Admin-UI für Catalog-Verwaltung  | Initialer Seed via Script + Datenbank    | Post-MVP  |
| Rating / Bewertungen             | Erfordert eigene Infrastruktur           | P7        |
| "Ähnliche Vorlagen"-Empfehlungen | ML-basiert                               | Future    |
| Public Collections im Feed       | Separate Entry Points existieren bereits | v2        |
| Catalog-Kommentare               | Community-Feature                        | Future    |

---

## 6. Funktionale Anforderungen

### 6.1 Routing

| Route             | Auth  | Rendering              | Beschreibung                       |
| ----------------- | ----- | ---------------------- | ---------------------------------- |
| `/explore`        | Keine | SSR (Server Component) | Übersichts-Feed                    |
| `/explore/[slug]` | Keine | SSR (Server Component) | Detailseite eines Catalog-Eintrags |

**URL-Parameter auf `/explore` (via `nuqs`):**

| Parameter  | Typ                     | Default    | Beschreibung             |
| ---------- | ----------------------- | ---------- | ------------------------ |
| `q`        | `string`                | `""`       | Volltextsuche            |
| `category` | `string`                | `""`       | Kategorie-Slug           |
| `sort`     | `"newest" \| "popular"` | `"newest"` | Sortierfeld              |
| `page`     | `number`                | `0`        | Seitennummer (0-indexed) |

### 6.2 Kopier-Aktion: "In meine Library übernehmen"

Der kritische Workflow, der die beiden Domains sauber verbindet:

```
Nutzer klickt "In meine Library übernehmen"
  ├── Nicht eingeloggt → Redirect zu /auth/sign-up?redirect=/explore/[slug]
  └── Eingeloggt →
        1. Server Action: copyCatalogEntryToUserLibrary(catalogEntryId, userId)
        2. Lädt CatalogEntry + CatalogFields aus DB
        3. Ruft TemplateRepository.pCreatePromptTemplateDescriptor() auf
           mit CatalogEntry-Daten als DPromptTemplateUpdate
        4. Erstellt neue PromptTemplateDescriptor + PromptTemplate + PromptTemplateFields
           — vollständig owned by userId
        5. Inkrementiert CatalogEntry.copyCount
        6. Gibt neue PromptTemplateDescriptor.id zurück
        7. Toast: "Vorlage wurde in deine Library übernommen"
           + Link "Jetzt anzeigen" → /templates/[newId]
```

**Wichtige Eigenschaften der Kopie:**

- Die Kopie ist vollständig unabhängig vom Original — Änderungen am Catalog-Eintrag betreffen bestehende Kopien nicht
- Keine Referenz zurück zum Catalog-Eintrag (kein `sourceCatalogId` im MVP — User besitzt die Kopie bedingungslos)
- Kategorien werden als neue `PromptTemplateCategory` für den User angelegt (via `connectOrCreate`, wie bei `pCreatePromptTemplateDescriptor` bereits implementiert)
- Ein Nutzer kann denselben Eintrag mehrfach kopieren (Duplikat-Check optional in v2)

### 6.3 Sichtbarkeit & Content-Management

Nur Catalog-Einträge mit `status = PUBLISHED` erscheinen im Feed und auf Detailseiten.

Status-Lifecycle:

```
DRAFT → PUBLISHED → ARCHIVED
          ↑              |
          └──────────────┘ (re-publish möglich)
```

### 6.4 Kategorisierung

`CatalogCategory` ist eine **admin-verwaltete globale Taxonomie** — nicht an User gebunden. Jeder `CatalogEntry` kann einer Kategorie zugeordnet sein.

Beispiel-Kategorien für initialen Seed:

- Marketing & Content
- Coding & Development
- Business & Strategy
- Research & Analysis
- E-Mail & Kommunikation
- SEO & Performance
- Kreatives Schreiben
- Produktivität

---

## 7. Datenmodell

### 7.1 Neue Schema-Modelle

```prisma
// Globale Kategorie-Taxonomie für den Explore-Feed
model CatalogCategory {
  id          String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String         @unique @db.VarChar(250)
  slug        String         @unique @db.VarChar(250)
  description String?        @db.VarChar(500)
  order       Int            @default(0)
  entries     CatalogEntry[]
  createdAt   DateTime       @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt   DateTime       @updatedAt @map("updated_at")

  @@map("catalog_category")
}

enum CatalogEntryStatus {
  DRAFT
  PUBLISHED
  ARCHIVED

  @@map("catalog_entry_status")
}

// Plattform-verwaltete, öffentliche Vorlage — KEIN userId
model CatalogEntry {
  id               String             @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  slug             String             @unique @db.VarChar(250)  // für /explore/[slug] Route
  title            String             @db.VarChar(250)
  description      String             @db.VarChar(750)
  recommendedModel String             @map("recommended_model") @db.VarChar(250)
  content          String             @db.Text                  // Template-Inhalt mit {{variable}}-Platzhaltern
  status           CatalogEntryStatus @default(DRAFT)
  categoryId       String?            @map("category_id") @db.Uuid
  copyCount        Int                @default(0)               @map("copy_count")
  publishedAt      DateTime?          @map("published_at") @db.Timestamp(6)
  createdAt        DateTime           @default(now())           @map("created_at") @db.Timestamp(6)
  updatedAt        DateTime           @updatedAt                @map("updated_at")

  category CatalogCategory?   @relation(fields: [categoryId], references: [id])
  fields   CatalogEntryField[]

  @@index([status])
  @@index([categoryId])
  @@index([copyCount])
  @@map("catalog_entry")
}

// Typisierte Felder für einen Catalog-Eintrag
// Struktur analog zu PromptTemplateField — aber ohne promptTemplateId-Kopplung
model CatalogEntryField {
  id             String                  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  catalogEntryId String                  @map("catalog_entry_id") @db.Uuid
  name           String                  @db.VarChar(100)
  label          String                  @db.VarChar(250)
  description    String?                 @db.VarChar(500)
  type           PromptTemplateFieldType                  // Enum wiederverwenden
  required       Boolean                 @default(true)
  order          Int                     @default(0)
  defaultValue   String?                 @map("default_value") @db.Text
  options        Json?                   @db.JsonB

  catalogEntry CatalogEntry @relation(fields: [catalogEntryId], references: [id], onDelete: Cascade)

  @@unique([catalogEntryId, name])
  @@index([catalogEntryId])
  @@map("catalog_entry_field")
}
```

### 7.2 Was sich NICHT ändert

`PromptTemplateDescriptor`, `PromptTemplate`, `PromptTemplateField`, `PromptTemplateCategory` — **keine Änderungen**. Diese Models bleiben vollständig auf User-Ownership ausgerichtet. Der Catalog ist ein vollständig additive Domain.

### 7.3 Domain-Typen

**Neue Datei:** `src/data/types/domain/catalog.d.ts`

```typescript
export type DCatalogEntryStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type DExploreSortMode = "newest" | "popular";

export type DCatalogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
};

export type DCatalogEntryField = {
  id: string;
  catalogEntryId: string;
  name: string;
  label: string;
  description: string | null;
  type: DPromptTemplateFieldType;   // Import aus prompt.template.d.ts
  required: boolean;
  order: number;
  defaultValue: string | null;
  options?: string[];
};

export type DCatalogEntry = {
  id: string;
  slug: string;
  title: string;
  description: string;
  recommendedModel: string;
  content: string;
  status: DCatalogEntryStatus;
  category: DCatalogCategory | null;
  fields: DCatalogEntryField[];
  copyCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DCatalogEntrySummary = Omit<DCatalogEntry, "content">;

export type DCatalogEntriesPage = Page<DCatalogEntrySummary>;

export type DCatalogEntriesFilter = {
  search?: string;
  categorySlug?: string;
};

export type DCatalogEntriesPageQuery = {
  pagination?: Pagination;
  sort?: DExploreSortMode;
  filter?: DCatalogEntriesFilter;
};
```

---

## 8. Technisches Design

### 8.1 Datenzugriffsschicht

#### Repository

**Neue Datei:** `src/data/repositories/catalog/catalog.repository.ts`

```typescript
export class CatalogRepository {
  // Paginierte Liste für /explore (nur PUBLISHED)
  async pGetPublishedEntriesPage(
    query: DCatalogEntriesPageQuery
  ): Promise<DCatalogEntriesPage>

  // Einzeleintrag für /explore/[slug] (nur PUBLISHED)
  async pGetPublishedEntryBySlug(
    slug: string
  ): Promise<DCatalogEntry | null>

  // Alle Kategorien (für Filter-Bar)
  async pGetCategories(): Promise<DCatalogCategory[]>

  // copyCount inkrementieren (fire & forget)
  async pIncrementCopyCount(catalogEntryId: string): Promise<void>
}
```

#### Service

**Neue Datei:** `src/data/services/catalog/catalog.service.ts`

```typescript
export class CatalogService {
  async getPublishedEntriesPage(
    query: DCatalogEntriesPageQuery
  ): Promise<DCatalogEntriesPage>

  async getPublishedEntryBySlug(slug: string): Promise<DCatalogEntry | null>

  async getCategories(): Promise<DCatalogCategory[]>

  // Kopier-Logik: Catalog → User-Template
  async copyEntryToUserLibrary(
    catalogEntryId: string,
    userId: string
  ): Promise<DPromptTemplateDescriptor>
    // 1. Lädt CatalogEntry mit Fields
    // 2. Mapped zu DPromptTemplateUpdate
    // 3. Ruft templateRepository.pCreatePromptTemplateDescriptor() auf
    // 4. Inkrementiert copyCount (fire & forget)
    // 5. Gibt neuen Descriptor zurück
}
```

> **Abhängigkeit:** `CatalogService` braucht Zugang zu `TemplateRepository` für die Kopier-Operation. Der `ServiceFactory` verdrahtet diese Abhängigkeit.

#### Server Actions

**Neue Datei:** `src/data/actions/catalog/catalog.actions.ts`

```typescript
"use server";

// Öffentlich — kein Auth-Check
export const getCatalogEntriesPage = async (
  query: DCatalogEntriesPageQuery
): Promise<DCatalogEntriesPage>

export const getCatalogEntryBySlug = async (
  slug: string
): Promise<DCatalogEntry | null>

export const getCatalogCategories = async (): Promise<DCatalogCategory[]>

// Auth-geschützt
export const copyCatalogEntryToUserLibrary = async (
  catalogEntryId: string
): Promise<{ success: true; templateId: string } | { success: false; error: string }>
  // Auth-Check via auth() — wirft wenn nicht eingeloggt
  // Gibt templateId der neuen Kopie zurück
```

### 8.2 ServiceFactory-Erweiterung

**Datei:** `src/data/services/service.factory.ts`

```typescript
// Neues privates Feld
private catalogService?: CatalogService;

// Neue Methode
getCatalogService(): CatalogService {
  if (!this.catalogService) {
    this.catalogService = new CatalogService(
      this.repositories.catalogRepository(),
      this.repositories.templateRepository()   // für die Kopier-Operation
    );
  }
  return this.catalogService;
}
```

### 8.3 RepositoryFactory-Erweiterung

**Datei:** `src/data/repositories/index.ts`

```typescript
catalogRepository(): CatalogRepository {
  return new CatalogRepository(this.prisma);
}
```

### 8.4 Verzeichnisstruktur (neu)

```
src/data/repositories/catalog/
  ├── catalog.repository.ts
  ├── catalog.mapper.ts        # DB-Typen → Domain-Typen
  └── index.ts

src/data/services/catalog/
  ├── catalog.service.ts
  ├── catalog.service.test.ts
  └── index.ts

src/data/actions/catalog/
  ├── catalog.actions.ts
  ├── catalog.actions.test.ts
  └── index.ts

src/data/types/domain/
  └── catalog.d.ts             # Neue Domain-Typen
```

### 8.5 Pages & Komponenten

#### Neue Pages

```
src/app/(public)/explore/
  ├── page.tsx           # /explore — Feed-Übersicht (Server Component)
  ├── page.test.tsx
  ├── loading.tsx        # Suspense Skeleton
  └── [slug]/
      ├── page.tsx       # /explore/[slug] — Detailseite (Server Component)
      ├── page.test.tsx
      └── loading.tsx
```

#### Neue Komponenten

```
src/components/explore/
  ├── index.tsx
  ├── explore-feed.tsx              # Client Component: URL-State (nuqs), Filter, Grid
  ├── explore-filter-bar.tsx        # Kategorie-Pills + Suche + Sort-Dropdown
  ├── explore-entry-grid.tsx        # Responsive Grid
  ├── explore-entry-card.tsx        # Karte: Titel, Beschreibung, Kategorie, Felder-Anzahl
  ├── explore-entry-card.test.tsx
  ├── explore-entry-detail.tsx      # Detailansicht auf /explore/[slug]
  ├── explore-copy-button.tsx       # "In meine Library" CTA — Auth-aware
  ├── explore-copy-button.test.tsx
  └── explore-empty-state.tsx
```

#### `explore-entry-card.tsx` — Zeigt:

- Titel
- Beschreibungs-Snippet (2 Zeilen)
- Kategorie-Badge
- Modell-Badge (z.B. "GPT-4o")
- Anzahl Felder als Indikator: "4 Felder" (erklärt das einzigartige Feature ohne Worte)
- Kopier-Anzahl (optional, wenn > 0): "47× übernommen"
- CTA: "Ansehen" → `/explore/[slug]`

#### `explore-copy-button.tsx` — Auth-aware:

| Zustand                        | Darstellung                                | Aktion                                             |
| ------------------------------ | ------------------------------------------ | -------------------------------------------------- |
| Unangemeldet                   | "Registrieren um zu übernehmen" (outlined) | → `/auth/sign-up?redirect=/explore/[slug]`         |
| Eingeloggt, noch nicht kopiert | "In meine Library übernehmen" (primary)    | `copyCatalogEntryToUserLibrary(id)` → Toast + Link |
| Loading                        | Disabled + Spinner                         | —                                                  |
| Bereits kopiert (v2)           | "Bereits in Library" (ghost, disabled)     | —                                                  |

#### `/explore/[slug]` Detailseite — zeigt:

- Vollständiger Titel + Beschreibung
- Kategorie + Modell
- **Alle Formularfelder mit Labels, Typ und Beschreibung** (read-only Preview — kein Input)
- Prominente Kopier-CTA
- "Mehr aus dieser Kategorie" — Kacheln (3-4 Related Entries)

### 8.6 SEO

**`/explore`:**

```typescript
export const metadata: Metadata = {
  title: "KI Prompt-Vorlagen entdecken",
  description: "Entdecke kuratierte AI-Prompt-Vorlagen mit strukturierten Feldern...",
};
```

- `revalidate = 300` (5 Minuten Cache)
- Pagination: `?page=N` mit `rel="prev"` / `rel="next"`

**`/explore/[slug]`:**

```typescript
export const generateMetadata = async ({ params }): Promise<Metadata> => {
  const entry = await getCatalogEntryBySlug(params.slug);
  return {
    title: entry.title,
    description: entry.description,
    openGraph: { title: entry.title, description: entry.description },
  };
};
```

- Vollständig statisch renderbar (SSR, kein Client-State)
- Slug ist human-readable und keyword-reich: `/explore/email-kampagne-copywriting-gpt4`

---

## 9. Implementierungs-Reihenfolge

```
Phase 1 — Daten-Fundament
  1.1  Schema: CatalogCategory, CatalogEntry, CatalogEntryField
  1.2  Migration + Seed: Kategorien + erste Catalog-Einträge (10+)
  1.3  Domain-Typen: src/data/types/domain/catalog.d.ts
  1.4  Repository: CatalogRepository
  1.5  Service: CatalogService (inkl. copyEntryToUserLibrary-Logik)
  1.6  ServiceFactory + RepositoryFactory erweitern
  1.7  Server Actions: catalog.actions.ts

Phase 2 — UI-Komponenten
  2.1  ExploreCopyButton (Auth-aware, Toast-Feedback)
  2.2  ExploreEntryCard
  2.3  ExploreEntryGrid + ExploreEmptyState
  2.4  ExploreFilterBar (Kategorie-Pills, Suche, Sort)
  2.5  ExploreFeed (Client Component, URL-State via nuqs)
  2.6  ExploreEntryDetail (Detailansicht)

Phase 3 — Pages & Integration
  3.1  /explore page.tsx (Server Component)
  3.2  /explore/[slug] page.tsx (Server Component + generateMetadata)
  3.3  loading.tsx Skeletons für beide Routes
  3.4  Navigation-Link in Public Layout

Phase 4 — Tests & SEO
  4.1  Unit-Tests Repository, Service, Actions
  4.2  Unit-Tests Komponenten
  4.3  Sitemap-Erweiterung für /explore/[slug] Seiten
```

---

## 10. Test-Anforderungen

Gemäß Projekt-Konvention (99% Line/Statement, 98.2% Branch Coverage):

### Repository

- `pGetPublishedEntriesPage` — filtert nur `PUBLISHED`, nicht `DRAFT`/`ARCHIVED`
- `pGetPublishedEntriesPage` — Suche nach Titel/Beschreibung
- `pGetPublishedEntriesPage` — Kategorie-Filter via Slug
- `pGetPublishedEntriesPage` — Sort `popular` = nach `copyCount DESC`
- `pGetPublishedEntriesPage` — Sort `newest` = nach `publishedAt DESC`
- `pGetPublishedEntryBySlug` — gibt `null` für DRAFT/ARCHIVED zurück
- `pIncrementCopyCount` — inkrementiert korrekt

### Service

- `copyEntryToUserLibrary` — erstellt korrekte `DPromptTemplateUpdate` aus `CatalogEntry`
- `copyEntryToUserLibrary` — Felder werden korrekt übernommen (Type, Label, Order etc.)
- `copyEntryToUserLibrary` — inkrementiert `copyCount` nach erfolgreichem Create
- `copyEntryToUserLibrary` — wirft wenn `CatalogEntry` nicht existiert

### Actions

- `copyCatalogEntryToUserLibrary` — gibt `{ success: false }` zurück wenn nicht eingeloggt
- `getCatalogEntriesPage` — gibt `EMPTY_PAGE` bei Fehler zurück
- `getCatalogEntryBySlug` — gibt `null` bei ungültigem Slug zurück

### Komponenten

- `ExploreCopyButton` — rendert "Registrieren"-CTA wenn unauthenticated
- `ExploreCopyButton` — ruft Action auf und zeigt Toast bei Erfolg
- `ExploreEntryCard` — rendert Titel, Kategorie, Felder-Anzahl
- `ExploreFilterBar` — Suchfeld und Kategorie-Auswahl funktionieren

---

## 11. Seed-Daten für Launch

Vor dem Launch müssen mindestens 10 Catalog-Einträge (PUBLISHED) vorhanden sein, verteilt auf ≥ 3 Kategorien. Empfohlene initiale Einträge:

| Titel                           | Kategorie              | Felder                                 |
| ------------------------------- | ---------------------- | -------------------------------------- |
| Blog-Post Outline erstellen     | Marketing & Content    | Thema, Zielgruppe, Tonalität           |
| Professionelle E-Mail schreiben | E-Mail & Kommunikation | Empfänger, Anlass, Wunschergebnis      |
| Code Review Feedback            | Coding & Development   | Sprache, Code-Snippet, Fokus           |
| Wettbewerbsanalyse              | Business & Strategy    | Eigenes Produkt, Konkurrent, Markt     |
| LinkedIn-Beitrag                | Marketing & Content    | Thema, persönliche Erfahrung, CTA      |
| Bug-Report Beschreibung         | Coding & Development   | Fehler, Schritte, Erwartetes Verhalten |
| Produktbeschreibung für Shop    | Marketing & Content    | Produkt, Features, Zielgruppe          |
| Meeting-Zusammenfassung         | Produktivität          | Teilnehmer, Themen, Beschlüsse         |
| Keyword-Cluster erstellen       | SEO & Performance      | Haupt-Keyword, Branche, Suchintention  |
| Research-Prompt                 | Research & Analysis    | Fachbereich, Forschungsfrage, Kontext  |

Seed-Script: `prisma/seeds/catalog.seed.ts` — ausgeführt via `npm run db:datainit`.

---

## 12. Offene Fragen

| #   | Frage                                                                             | Empfehlung                                                             |
| --- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | Kann ein Nutzer denselben Catalog-Eintrag mehrfach in seine Library kopieren?     | MVP: Ja (keine Duplikat-Prüfung). v2: Warnung, kein Hard-Block         |
| 2   | Soll der Explore-Link in der Auth-Navigation erscheinen (für eingeloggte Nutzer)? | Ja, als "Entdecken" — führt nach `/explore`                            |
| 3   | Soll `revalidate` oder vollständiges dynamisches Rendering?                       | `revalidate = 300` (5 Min.) für Feed; Detailseiten `revalidate = 3600` |
| 4   | Wer kann Catalog-Einträge erstellen?                                              | MVP: Nur via direktem DB-Seed/Script. Admin-UI als separates Feature   |
| 5   | Soll die Kopie beim User eine "Quelle"-Referenz (`sourceCatalogId`) behalten?     | MVP: Nein — der User besitzt die Kopie vollständig. Erleichtert Impl.  |

---

## 13. Erfolgsmetriken

| Metrik                            | Baseline | Ziel (30 Tage post-Launch)        |
| --------------------------------- | -------- | --------------------------------- |
| Unique Visits `/explore`          | 0        | > 200/Woche organisch             |
| SEO-Impressions `/explore/[slug]` | 0        | Messbar steigend (Search Console) |
| Kopier-Aktionen                   | 0        | > 50 Kopien total                 |
| Sign-up Conversion aus Explore    | n/a      | > 2% der Explore-Besucher         |
| Catalog-Einträge (PUBLISHED)      | 0        | ≥ 10 bei Launch                   |

---

## 14. Risiken

| Risiko                                                 | Wahrscheinlichkeit | Impact  | Mitigation                                                                                        |
| ------------------------------------------------------ | ------------------ | ------- | ------------------------------------------------------------------------------------------------- |
| Zu wenige Catalog-Einträge bei Launch → dünner Feed    | Mittel             | Hoch    | Seed-Script vor Launch ausführen; ≥ 10 Einträge Minimum                                           |
| SEO-Indexing dauert Wochen                             | Hoch               | Niedrig | Früh deployen; SEO ist ein Langzeitspiel                                                          |
| Nutzer verwechseln Catalog mit ihren eigenen Templates | Niedrig            | Mittel  | Klare UX-Trennung: Explore hat eigenes Nav, eigenes Layout, "Kopieren"-Sprache statt "Bearbeiten" |
| Schema-Komplexität durch neue Tabellen                 | Niedrig            | Niedrig | Additive Migration, keine bestehenden Tabellen geändert                                           |
