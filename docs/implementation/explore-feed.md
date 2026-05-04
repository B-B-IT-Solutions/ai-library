# Product Description: Public Explore / Discovery Feed

**Feature ID:** AI-112  
**Priority:** P1 — Critical Growth Feature  
**Effort:** Medium  
**Status:** Specification  
**Author:** Competitive Analyst Agent  
**Date:** 2026-05-04

---

## 1. Executive Summary

Die Plattform hat aktuell keinen öffentlichen Einstiegspunkt für unangemeldete Nutzer, der Templates entdeckbar macht. Das bedeutet: kein organisches Wachstum, kein SEO-Indexing für Inhalte, kein viraler Loop. Die einzige öffentliche Seite (`/p/marketplace`) zeigt Produkte (Bundles), keine Templates.

Der Explore-Feed bei `/explore` schließt diese kritische Lücke. Er ist das **fehlende Akquisitions-Gateway**: Auth-frei, indexierbar, filterbar — und der erste Schritt zu einem organischen Wachstumsloop.

**Warum jetzt?** FlowGPT gewinnt mit 10M+ Usern fast ausschließlich über Discovery. PromptBase dominiert SEO mit 220K+ indexierten Prompt-Seiten. Ohne eine Discover-Oberfläche bleibt die Plattform unsichtbar für alle Nutzer, die noch kein Account haben — d.h. potenziell 100% der neuen Nutzer.

---

## 2. Strategischer Kontext

### Warum dies Priority 1 ist

| Problem | Auswirkung |
|---|---|
| Keine auth-freie Startseite mit echtem Inhalt | Nutzer ohne Account sehen keine Templates |
| Keine SEO-indexierbaren Template-Seiten unter eigenem URL-Schema | Zero organic traffic für Template-Inhalte |
| Kein viraler Einstiegspunkt | Kein Sharing-Loop, kein Referral-Traffic |
| Keine Kategorisierung / Discovery-Logik | Nutzer können nicht browsen, nur direkt navigieren |

### Competitive Gap

- **FlowGPT** hat einen vollständigen Discovery-Feed mit Trending, Kategorien, Suche — aber ohne Monetarisierung für Creators
- **PromptBase** hat SEO-optimierte Einzelseiten für jeden Prompt — aber kein strukturiertes Template-Format (nur Rohtext)
- **Diese Plattform** hat das stärkste Template-Format (typed form fields) — aber bisher keine öffentliche Einstiegsoberfläche

**Ziel:** Bestes aus beiden Welten — FlowGPTs Discovery-UX + PromptBases SEO-Ansatz, kombiniert mit dem einzigartigen Template-Format dieser Plattform.

---

## 3. User Stories

### Primäre User Story — Unangemeldeter Entdecker

> **Als** unangemeldeter Nutzer, der nach AI-Prompts sucht,  
> **möchte ich** eine Übersicht verfügbarer Templates nach Kategorie browsen und nach Keywords suchen,  
> **damit ich** das passende Template finde und entscheide, ob ich mich registriere.

### Sekundäre User Stories

> **Als** angemeldeter Nutzer  
> **möchte ich** den Explore-Feed als Inspirationsquelle für neue Templates nutzen,  
> **damit ich** Templates entdecke, die ich noch nicht kenne und direkt in meine Library hinzufügen kann.

> **Als** Google-Nutzer, der nach "[Aufgabe] AI Prompt" sucht,  
> **möchte ich** eine dedizierte, schnell ladende Seite für ein konkretes Template finden,  
> **damit ich** das Template direkt nutzen oder kaufen kann (bereits existierende `/p/templates/[id]` Seiten).

> **Als** Plattform-Administrator  
> **möchte ich** steuern, welche Templates im öffentlichen Explore-Feed erscheinen,  
> **damit ich** Qualität und Relevanz des Feeds sicherstelle.

---

## 4. Feature-Scope

### In Scope (MVP)

| Feature | Beschreibung |
|---|---|
| Route `/explore` | Auth-freie Server Component Seite |
| Template-Grid | Responsive Karten-Ansicht mit Titel, Beschreibung, Kategorie, Modell-Badge |
| Kategorie-Filter | Filterleiste mit den wichtigsten Kategorien |
| Volltextsuche | Suche nach Titel und Beschreibung |
| Sort: Newest | Standard-Sortierung nach `createdAt DESC` |
| Sort: Popular | Sortierung nach `viewCount DESC` |
| SEO Metadata | `<title>`, `<description>`, `og:image`-ready per Seite |
| CTA für unangemeldete Nutzer | "Anmelden um Template zu verwenden" / "Registrieren" |
| Pagination | Cursor-basiert oder page-basiert, 20 Items pro Seite |
| `isDiscoverable`-Flag | Neues Feld auf `PromptTemplateDescriptor`, steuert Sichtbarkeit im Feed |
| `viewCount`-Tracking | Inkrementierung bei jedem Aufruf von `/p/templates/[id]` |

### Out of Scope (MVP)

| Feature | Begründung | Zugehörige Priorität |
|---|---|---|
| In-Platform Prompt Testing im Feed | Eigene Priority-2-Feature | P2 |
| Rating-System / Sterne-Bewertungen | Erfordert Rating-Infrastruktur | P7 |
| "Ähnliche Templates"-Empfehlungen | ML-basiert, zu komplex für MVP | Future |
| Creator-Profile-Seiten | Eigene Initiative | Future |
| Infinite Scroll | Pagination reicht für MVP | v2 |
| Öffentliche Collections im Feed | Eigene Entry Points (`/p/collections/[token]`) bereits vorhanden | v2 |

---

## 5. Funktionale Anforderungen

### 5.1 Routing

```
Route:          /explore
Layout:         (public) — kein Auth-Guard
Auth:           Keine erforderlich. Session optional (für "Bereits in Library"-Badge)
Rendering:      Server Component (SSR für SEO)
```

**URL-Parameter (via `nuqs`):**

| Parameter | Typ | Default | Beschreibung |
|---|---|---|---|
| `q` | `string` | `""` | Suchbegriff |
| `category` | `string` | `""` | Kategorie-Filter (Slug) |
| `sort` | `"newest" \| "popular"` | `"newest"` | Sortierfeld |
| `page` | `number` | `0` | Seitennummer (0-indexed, wie bestehende Pagination) |

### 5.2 Template-Sichtbarkeit

Nur Templates mit `isDiscoverable = true` dürfen im Explore-Feed erscheinen. Dieses Flag wird gesetzt durch:

1. **Admin-Aktion**: Admins können beliebige Templates auf `isDiscoverable = true` setzen
2. **Marketplace-Verknüpfung**: Templates, die Teil eines aktiven `Product` (Status `ACTIVE`) sind, werden automatisch als discoverable behandelt (entweder via Flag oder via JOIN-Logik)

> **Designentscheidung**: Das `isDiscoverable`-Flag gibt dem Admin maximale Kontrolle über die Qualität des Feeds. Automatisches Opt-In via Marketplace-Zugehörigkeit verhindert, dass Marketplace-Templates manuell einzeln freigeschalten werden müssen.

### 5.3 Kategorisierung

**Problem:** `PromptTemplateCategory` ist aktuell per-User — es gibt keine globale Taxonomie.

**Lösung für MVP:** Neue Tabelle `ExploreCategory` mit admin-verwalteten globalen Kategorien. Templates können einer `ExploreCategory` zugewiesen werden. Die Zuweisung erfolgt via Admin-UI oder bei Marketplace-Verknüpfung.

**Alternative (Fallback falls Scope zu groß):** Distinct-Aggregation der bestehenden `PromptTemplateCategory.name`-Werte aller `isDiscoverable`-Templates. Weniger kontrolliert, aber null Schema-Änderungen für die Kategorie-Infrastruktur.

> **Empfehlung MVP:** Die Fallback-Variante für die erste Iteration — keine neue Tabelle, Kategorien emergieren aus dem bestehenden System. In v2 durch eine explizite `ExploreCategory`-Taxonomie ersetzen.

### 5.4 Popularitäts-Tracking

Der `viewCount` wird inkrementiert wenn:
- Die `/p/templates/[id]` Seite aufgerufen wird
- Throttling: Max 1 Increment pro Session+Template (verhindert Inflation durch Refreshes)

Implementierung: Fire-and-forget Server Action, non-blocking, kein await im Page-Render-Pfad.

### 5.5 Conversion-CTAs

| Nutzer-Zustand | CTA auf Template-Karte | CTA auf Template-Detailseite |
|---|---|---|
| Unangemeldet | "Vorlage ansehen" → `/p/templates/[id]` | "Anmelden um zu verwenden" → `/auth/sign-in` |
| Angemeldet (kein Zugang) | "Kaufen" oder "Abonnement upgraden" | Direkt zur Kaufseite |
| Angemeldet (Zugang via Abo/Kauf) | "In Library" Badge | "Verwenden" → `/templates/[id]` |

---

## 6. Technisches Design

### 6.1 Schema-Änderungen

```prisma
model PromptTemplateDescriptor {
  // Bestehende Felder ...
  
  // NEU:
  isDiscoverable Boolean @default(false) @map("is_discoverable")
  viewCount      Int     @default(0)     @map("view_count")
}
```

**Migration:**
- `isDiscoverable = false` für alle bestehenden Templates (safe default)
- Admin-Script zum Bulk-Setzen für alle Templates die Teil aktiver Produkte sind
- `viewCount = 0` für alle bestehenden Templates

```
npm run db:migrate
```

### 6.2 Repository-Erweiterung

**Datei:** `src/data/repositories/template/template.public.repository.ts`

Neue Methode `pGetExploreTemplateDescriptorsPage`:

```typescript
async pGetExploreTemplateDescriptorsPage(
  query: DExploreTemplateDescriptorsPageQuery
): Promise<DTemplateDescriptorsPage>
```

Im Unterschied zu `pGetPublicTemplateDescriptorsPage`:
- Kein `collectionIds`-Filter erforderlich
- Filtert immer auf `isDiscoverable: true`
- Unterstützt `sort: "popular"` via `orderBy: { viewCount: 'desc' }`
- Kein `userId`-Filter (öffentlich, alle Nutzer)

Neue Methode `pIncrementViewCount`:

```typescript
async pIncrementViewCount(descriptorId: string): Promise<void> {
  await this.prisma.promptTemplateDescriptor.update({
    where: { id: descriptorId },
    data: { viewCount: { increment: 1 } },
  });
}
```

Neue Methode `pGetExploreCategories`:

```typescript
async pGetExploreCategories(): Promise<string[]>
// Gibt distinct Kategorienamen aller isDiscoverable=true Templates zurück
```

### 6.3 Service-Erweiterung

**Datei:** `src/data/services/template/template.public.service.ts`

```typescript
async getExploreTemplateDescriptorsPage(
  query: DExploreTemplateDescriptorsPageQuery
): Promise<DTemplateDescriptorsPage>

async getExploreCategories(): Promise<string[]>

async incrementTemplateViewCount(descriptorId: string): Promise<void>
```

Der Service delegiert direkt ans Repository. Keine zusätzliche Businesslogik nötig (kein collectionId-Check wie beim bestehenden `getPublicTemplateDescriptorsPage`).

### 6.4 Server Actions

**Datei:** `src/data/actions/template/template.public.actions.ts` — neue Exports:

```typescript
// Öffentliche Explore-Liste
export const getExploreTemplateDescriptorsPage = async (
  query: DExploreTemplateDescriptorsPageQuery
): Promise<DTemplateDescriptorsPage>

// Kategorien für Filter
export const getExploreCategories = async (): Promise<string[]>

// View-Count Increment (Fire & Forget, non-blocking)
export const incrementTemplateViewCount = async (
  descriptorId: string
): Promise<void>
```

**Typen — neue Datei oder Erweiterung von** `src/data/types/domain/prompt.template.d.ts`:

```typescript
export type DExploreSortMode = "newest" | "popular";

export type DExploreTemplateDescriptorsFilter = {
  search?: string;
  category?: string;
};

export type DExploreTemplateDescriptorsPageQuery = PageQuery<DExploreTemplateDescriptorsFilter> & {
  sort?: DExploreSortMode;
};
```

### 6.5 Repository Utils

**Datei:** `src/data/repositories/template/utils.ts`

`resolveOrderBy` um `popular` Sort-Mode erweitern:

```typescript
// sort: { field: 'viewCount', order: 'desc' } → popular
// sort: { field: 'createdAt', order: 'desc' } → newest (default)
```

`resolveWhereInput` um `isDiscoverable: true`-Filter und `category`-Filter erweitern.

### 6.6 Page-Komponente

**Neue Datei:** `src/app/(public)/explore/page.tsx`

```
src/app/(public)/explore/
  ├── page.tsx           # Server Component
  ├── page.test.tsx      # Unit-Test
  └── loading.tsx        # Suspense-Fallback
```

```typescript
// page.tsx — Struktur
export const generateMetadata = (): Metadata => ({
  title: "Explore AI Prompt Templates",
  description: "Entdecke kuratierte KI-Prompt-Vorlagen für Marketing, Content, SEO und mehr.",
});

export default async function ExplorePage({ searchParams }: PageProps) {
  const { q, category, sort, page } = await searchParams;

  const [templatesPage, categories] = await Promise.all([
    getExploreTemplateDescriptorsPage({ /* query */ }),
    getExploreCategories(),
  ]);

  return <ExploreView templates={templatesPage} categories={categories} />;
}
```

### 6.7 React-Komponenten

```
src/components/explore/
  ├── index.tsx                    # Barrel export
  ├── explore-view.tsx             # Top-Level View-Komponente
  ├── explore-filter-bar.tsx       # Kategorie-Pills + Suche + Sort-Dropdown
  ├── explore-template-grid.tsx    # Grid mit Template-Karten
  ├── explore-template-card.tsx    # Einzelne Template-Karte
  └── explore-empty-state.tsx      # Kein Ergebnis-Zustand
```

**`explore-view.tsx`** — Client Component (für URL-State-Sync via `nuqs`)

**`explore-filter-bar.tsx`** — Enthält:
- Suchfeld (debounced, 300ms)
- Kategorie-Pills (horizontal scrollbar auf Mobile)
- Sort-Dropdown ("Neueste" / "Beliebt")

**`explore-template-card.tsx`** — Zeigt:
- Template-Titel
- Beschreibungs-Snippet (2 Zeilen, gekürzt)
- Kategorien als Badge(s)
- Modell-Badge (z.B. "GPT-4o")
- Anzahl Form-Felder als Indikator ("3 Felder")
- "Ansehen" CTA → `/p/templates/[id]`

**Bestehende Komponenten wiederverwenden:**
- `template-item-card-public.tsx` als Basis oder direkt einsetzen (prüfen ob ausreichend)
- `template-items-grid-public.tsx` als Grid-Container

### 6.8 View-Count Integration in `/p/templates/[id]`

**Datei:** `src/app/(public)/p/templates/[id]/page.tsx`

Nach dem Laden des Templates: Fire-and-forget Call via `incrementTemplateViewCount`. Non-blocking — kein `await` im kritischen Render-Pfad.

```typescript
// In PublicTemplatePage — NACH dem Laden des Templates
// Non-blocking, kein await
void incrementTemplateViewCount(descriptor.id);
```

> **Hinweis:** Für Throttling (1 Increment pro Session) in v2 implementieren. MVP: Einfaches Increment bei jedem Seitenaufruf — ausreichend für initiale Trend-Signale.

### 6.9 Navigation

Explore-Link in der Public-Navigation (`/p` Layout) hinzufügen:

**Datei:** `src/app/(public)/p/layout.tsx` oder die entsprechende Nav-Komponente.

---

## 7. SEO-Anforderungen

### 7.1 `/explore` Seite

```html
<title>KI Prompt Vorlagen entdecken | [Platform Name]</title>
<meta name="description" content="Entdecke kuratierte KI-Prompt-Vorlagen...">
<link rel="canonical" href="https://domain.com/explore">
```

- Seite ist statisch renderable (SSR mit `cache: 'force-cache'` für 5-10 Minuten)
- Pagination via `?page=N` — `rel="prev"` / `rel="next"` Links setzen
- Kategoriefilter-URLs sind shareable und indexierbar

### 7.2 `/p/templates/[id]` Seiten (bereits vorhanden, optimieren)

Die Einzelseiten existieren bereits mit `generateMetadata`. Sicherstellen:
- `og:title` = Template-Titel
- `og:description` = Template-Beschreibung
- `og:image` = Plattform-Standard OG-Image (oder template-spezifisch in v2)
- Strukturierte Daten (`application/ld+json`, Typ `HowTo` oder `CreativeWork`) — optional v2

### 7.3 Sitemaps

Neue Seiten in Sitemap aufnehmen:
- `/explore` (statisch)
- Alle `/p/templates/[id]` mit `isDiscoverable = true` (dynamisch generiert)

---

## 8. Datenmodell-Zusammenfassung

### Änderungen an bestehenden Tabellen

| Tabelle | Neues Feld | Typ | Default | Zweck |
|---|---|---|---|---|
| `prompt_template_descriptor` | `is_discoverable` | `Boolean` | `false` | Steuerung ob Template im Explore-Feed erscheint |
| `prompt_template_descriptor` | `view_count` | `Int` | `0` | Popularitäts-Signal für Trending-Sort |

### Keine neuen Tabellen im MVP

Die Kategorie-Lösung über distinct-Aggregation bestehender `PromptTemplateCategory`-Namen erfordert keine neue Tabelle.

---

## 9. Admin-Anforderungen

Für den Launch müssen Templates manuell oder per Script als `isDiscoverable = true` markiert werden.

**Seed-Script / Migration-Script:**

```sql
-- Alle Templates die Teil eines ACTIVE Products sind, discoverable machen
UPDATE prompt_template_descriptor ptd
SET is_discoverable = true
WHERE ptd.id IN (
  SELECT pi.template_id
  FROM product_item pi
  JOIN product p ON p.id = pi.product_id
  WHERE p.status = 'ACTIVE'
);
```

**Admin-UI (Out of Scope für diesen Scope, aber dokumentiert):**
- In der Admin-Ansicht für Templates: Toggle `isDiscoverable` per Template
- Bulk-Action: Alle Templates eines Produkts auf `isDiscoverable = true`

---

## 10. Implementierungs-Reihenfolge

```
Phase 1: Daten-Fundament (DB + Backend)
  1.1  Schema-Migration: isDiscoverable + viewCount Felder
  2.2  Seed-Script: Bestehende Marketplace-Templates discoverable machen
  1.3  Repository: pGetExploreTemplateDescriptorsPage, pIncrementViewCount, pGetExploreCategories
  1.4  Service: getExploreTemplateDescriptorsPage, getExploreCategories, incrementTemplateViewCount
  1.5  Actions: getExploreTemplateDescriptorsPage, getExploreCategories, incrementTemplateViewCount

Phase 2: UI-Komponenten
  2.1  ExploreTemplateCard — Karten-Komponente
  2.2  ExploreFilterBar — Filter + Suche + Sort
  2.3  ExploreTemplateGrid — Grid-Container
  2.4  ExploreView — Top-Level View mit URL-State (nuqs)
  2.5  ExploreEmptyState — Leer-Zustand

Phase 3: Page & Integration
  3.1  /explore Page — Server Component
  3.2  loading.tsx — Skeleton Suspense Fallback
  3.3  View-Count Increment in /p/templates/[id]
  3.4  Navigation-Link in Public Layout

Phase 4: SEO & Tests
  4.1  generateMetadata für /explore
  4.2  Sitemap-Erweiterung
  4.3  Unit-Tests für alle neuen Actions, Services, Repositories
  4.4  Unit-Tests für alle neuen Komponenten
```

---

## 11. Test-Anforderungen

Gemäß Projekt-Konvention (99% Line/Statement Coverage, 98.2% Branch Coverage):

### Repository Tests

- `pGetExploreTemplateDescriptorsPage` — filtert auf `isDiscoverable: true`
- `pGetExploreTemplateDescriptorsPage` — filtert korrekt nach `search`, `category`
- `pGetExploreTemplateDescriptorsPage` — sortiert nach `viewCount` bei `popular`-Sort
- `pGetExploreTemplateDescriptorsPage` — sortiert nach `createdAt` bei `newest`-Sort
- `pIncrementViewCount` — inkrementiert `viewCount` korrekt
- `pGetExploreCategories` — gibt distinct Kategorienamen zurück

### Service Tests

- Delegation an Repository korrekt
- `getExploreTemplateDescriptorsPage` mit leerer Result-Fallback

### Action Tests

- `getExploreTemplateDescriptorsPage` — returned `EMPTY_PAGE` bei Fehler
- `incrementTemplateViewCount` — graceful error handling (fire & forget, darf nicht werfen)

### Component Tests

- `ExploreTemplateCard` — rendert Titel, Beschreibung, Kategorien
- `ExploreFilterBar` — Kategorie-Auswahl, Suche, Sort-Änderung
- `ExploreView` — rendert Grid + FilterBar
- `ExplorePage` (page.test.tsx) — rendert Seite mit gemockten Actions

---

## 12. Erfolgsmetriken

| Metrik | Baseline | Ziel (30 Tage post-Launch) |
|---|---|---|
| Organischer Traffic auf `/explore` | 0 | > 200 unique Visits/Woche |
| `/p/templates/[id]` SEO-Impressions | niedrig | Messbar steigend (Google Search Console) |
| Sign-up Conversion aus `/explore` | n/a | > 2% der Explore-Besucher |
| Bounce-Rate auf Explore | n/a | < 65% |
| Templates mit `isDiscoverable = true` bei Launch | 0 | ≥ 10 (alle aktiven Marketplace-Templates) |

---

## 13. Abhängigkeiten & Risiken

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|---|---|---|---|
| Zu wenige `isDiscoverable`-Templates bei Launch → leere/dünne Seite | Mittel | Hoch | Seed-Script vor Launch sicherstellen; Admin-UI für schnelle Freigabe |
| `viewCount`-Inflation durch Bot-Traffic | Niedrig | Mittel | Throttling in v2; MVP-Daten sind ohnehin Anfangswerte |
| Kategorie-Aggregation zu unstrukturiert (emergente Kategorienamen = inkonsistent) | Mittel | Niedrig | Akzeptables MVP-Risiko; in v2 durch `ExploreCategory`-Taxonomie lösen |
| SEO-Indexing dauert länger als erwartet | Hoch (Google braucht Zeit) | Niedrig | Früh deployen, auch wenn Feature noch nicht fertig kommuniziert |

---

## 14. Offene Fragen

1. **Platform Name für SEO-Titles?** → Muss in `generateMetadata` eingetragen werden.
2. **Welche Templates sollen bei Launch discoverable sein?** → Alle aktiven Marketplace-Produkte? Nur handverlesene? → Admin-Entscheidung vor Seed-Script.
3. **Soll der Explore-Link in der Haupt-Navigation erscheinen (auch für eingeloggte Nutzer)?** → Empfehlung: Ja, als "Entdecken" Link.
4. **Soll `/explore` mit `revalidate` oder vollständig dynamisch gerendert werden?** → Empfehlung: `revalidate = 300` (5 Minuten) für Performance, da sich der Feed nicht sekündlich ändert.
