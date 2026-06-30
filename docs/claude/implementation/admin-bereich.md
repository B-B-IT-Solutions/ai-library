# Admin-Bereich Spezifikation

## Überblick

Der Admin-Bereich bietet privilegierten Nutzern (`role === "admin"`) zentralen Zugriff zur Verwaltung aller Inhalte und Nutzer der Plattform. Er wird als neues Route-Segment `src/app/(admin)/admin/` implementiert und folgt denselben Architekturmustern wie der bestehende authentifizierte Bereich.

---

## Schutz & Zugriffskontrolle

**Middleware-Erweiterung** — Die bestehende NextAuth-Middleware (`auth.ts`) wird um eine Admin-Rollprüfung ergänzt:

- Alle Routen unter `/admin/**` erfordern `session.user.role === "admin"`
- Nicht-Admin-Nutzer werden auf `/` weitergeleitet
- Unauthentifizierte Nutzer werden auf `/auth/sign-in` weitergeleitet

**Layout** (`src/app/(admin)/admin/layout.tsx`) — Eigene Layout-Wrapper-Komponente mit Admin-Seitenleiste, getrennt vom `AuthenticatedLayoutWrapper`.

---

## Seitenstruktur & Routen

```
/admin                          → Dashboard (KPIs & Überblick)
/admin/users                    → Nutzerverwaltung (Liste)
/admin/users/[id]               → Nutzerdetail
/admin/catalog                  → Katalog-Einträge (Liste)
/admin/catalog/new              → Neuer Katalogeintrag
/admin/catalog/[id]/edit        → Katalogeintrag bearbeiten
/admin/catalog/categories       → Katalog-Kategorien verwalten
/admin/products                 → Produkte (Liste)
/admin/products/new             → Neues Produkt
/admin/products/[id]/edit       → Produkt bearbeiten
/admin/orders                   → Alle Bestellungen
/admin/orders/[id]              → Bestelldetail
/admin/subscriptions            → Alle Abonnements
/admin/subscription-plans       → Abo-Pläne konfigurieren
```

---

## Module im Detail

### 1. Dashboard (`/admin`)

**Zweck:** Schnellübersicht über den Plattformstatus.

**KPI-Karten:**

- Gesamtnutzer / neue Nutzer (letzte 30 Tage)
- Aktive Abonnements (aufgeschlüsselt nach Tier: FREE / BASIC / PRO)
- Umsatz (Bestellungen letzte 30 Tage, Summe)
- Ausstehende Bestellungen (Status `PENDING`)
- Veröffentlichte Katalog-Einträge / DRAFT-Einträge

**Implementierung:** Direkte Prisma-Aggregationsabfragen in einer neuen `AdminDashboardRepository`, zugänglich via `RepositoryFactory.adminDashboardRepository()`.

---

### 2. Nutzerverwaltung (`/admin/users`)

**Liste:**

- Paginierte Tabelle mit: Name, E-Mail, Rolle, Abo-Tier, `createdAt`, E-Mail-Verifizierungsstatus
- Suche/Filter nach: Name/E-Mail (Text), Rolle, Abo-Tier, E-Mail-Verifizierungsstatus
- Sortierung nach: `createdAt`, Name, Abo-Tier

**Detailseite (`/admin/users/[id]`):**

- Alle User-Felder (readonly)
- Rolle ändern: `user` ↔ `admin` (Server Action `updateUserRole`)
- Aktuelles Abonnement anzeigen (Plan, Status, Laufzeit)
- Abo-History-Tabelle (`SubscriptionHistory`)
- Bestellhistorie (Liste aller Orders)

**Server Actions** (`src/data/actions/admin/user.admin.actions.ts`):

```ts
updateUserRole(userId: string, role: "user" | "admin"): ActionResult<void>
```

**Repository** — Neue Methoden in `UserRepository`:

- `pGetUsersPage(query)` — paginiert mit Filtern
- `pGetUserWithDetails(id)` — User + Subscription + Orders

---

### 3. Katalog-Verwaltung (`/admin/catalog`)

Der Katalog (`CatalogEntry` / `CatalogCategory`) ist die Datenquelle für den öffentlichen Explore-Bereich. Derzeit gibt es keine Verwaltungsoberfläche.

**Eintrags-Liste:**

- Paginierte Tabelle: Titel, Kategorie, Status (`DRAFT` / `PUBLISHED` / `ARCHIVED`), `copyCount`, `publishedAt`, `createdAt`
- Filter: Status, Kategorie
- Bulk-Aktionen: Status ändern (DRAFT → PUBLISHED, PUBLISHED → ARCHIVED)

**Formular (Erstellen/Bearbeiten):**

| Feld               | Typ                | Validierung                                                                  |
| ------------------ | ------------------ | ---------------------------------------------------------------------------- |
| `title`            | Text               | max 250 Zeichen, pflicht                                                     |
| `slug`             | Text               | URL-safe, eindeutig, auto-generiert aus Titel                                |
| `description`      | Textarea           | max 750 Zeichen, pflicht                                                     |
| `recommendedModel` | Text               | max 250 Zeichen, pflicht                                                     |
| `status`           | Select             | DRAFT / PUBLISHED / ARCHIVED                                                 |
| `categoryId`       | Select             | Optional, aus `CatalogCategory`                                              |
| `content`          | Rich-Text (Tiptap) | Prompt-Inhalt                                                                |
| `fields`           | Dynamic List       | Name, Label, Typ, Pflichtfeld, Reihenfolge — identisch zum Template-Formular |

**Status-Workflow:**

- `DRAFT` → `PUBLISHED`: Setzt `publishedAt = now()`
- `PUBLISHED` → `ARCHIVED`: Eintrag bleibt in DB, erscheint nicht mehr im Explore

**Kategorien-Verwaltung (`/admin/catalog/categories`):**

- CRUD-Tabelle: Name, Slug, Beschreibung, Reihenfolge (`order`)
- Inline-Editierung oder Modal-Formular

**Server Actions** (`src/data/actions/admin/catalog.admin.actions.ts`):

```ts
createCatalogEntry(input): ActionResult<{ id: string }>
updateCatalogEntry(id, input): ActionResult<void>
updateCatalogEntryStatus(id, status): ActionResult<void>
deleteCatalogEntry(id): ActionResult<void>
createCatalogCategory(input): ActionResult<void>
updateCatalogCategory(id, input): ActionResult<void>
deleteCatalogCategory(id): ActionResult<void>
```

**Repository-Erweiterung** (`CatalogRepository`):

- `pGetEntriesPage(query)` — alle Statuse (nicht nur PUBLISHED)
- `pCreateEntry(data)`
- `pUpdateEntry(id, data)`
- `pDeleteEntry(id)`

---

### 4. Produktverwaltung (`/admin/products`)

Produkte (`Product`) sind Bundles oder Einzeltemplates im Marketplace.

**Liste:**

- Tabelle: Name, Typ (`TEMPLATE` / `BUNDLE`), Preis, Status, Anzahl enthaltener Templates, `createdAt`
- Filter: Status, Typ

**Formular (Erstellen/Bearbeiten):**

| Feld             | Typ              | Validierung                                 |
| ---------------- | ---------------- | ------------------------------------------- |
| `name`           | Text             | max 250 Zeichen                             |
| `description`    | Rich-Text        | pflicht                                     |
| `price`          | Number (Decimal) | ≥ 0                                         |
| `discountAmount` | Number           | optional, ≤ `price`                         |
| `type`           | Select           | TEMPLATE / BUNDLE                           |
| `status`         | Select           | ACTIVE / INACTIVE / ARCHIVED                |
| `features`       | Dynamic List     | Icon, Titel, Beschreibung, Reihenfolge      |
| `useCases`       | Dynamic List     | Kategorie, Beschreibung, Tags, Reihenfolge  |
| `examples`       | Dynamic List     | Titel, Inhalt, Reihenfolge                  |
| `instructions`   | Dynamic List     | Schritt, Titel, Beschreibung                |
| `productItems`   | Multi-Select     | Auswahl von Templates (`Prompt`) aus der DB |

**Server Actions** (`src/data/actions/admin/product.admin.actions.ts`):

```ts
createProduct(input): ActionResult<{ id: string }>
updateProduct(id, input): ActionResult<void>
updateProductStatus(id, status): ActionResult<void>
deleteProduct(id): ActionResult<void>
```

**Repository** — Neue `AdminProductRepository`:

- `pGetProductsPage(query)` — alle Status
- `pCreateProduct(data)` — inkl. Features, UseCases, Examples, Instructions, Items
- `pUpdateProduct(id, data)`

---

### 5. Bestellverwaltung (`/admin/orders`)

**Liste:**

- Paginierte Tabelle: Bestell-ID (kurz), Nutzer-E-Mail, Status, Betrag, `createdAt`
- Filter: Status (`PENDING` / `COMPLETED` / `FAILED` / `REFUNDED`), Datumsbereich
- Sortierung: `createdAt` (default: neueste zuerst)

**Detailseite (`/admin/orders/[id]`):**

- Bestellkopf: ID, Status, Gesamtbetrag, Zahlungsmethode, Stripe-IDs
- Nutzerreferenz (klickbar → Nutzerdetail)
- Positionen-Tabelle: Produktname, Typ, Menge, Preis
- Status manuell ändern: `PENDING` → `COMPLETED` / `FAILED` / `REFUNDED`

**Server Action** (`src/data/actions/admin/order.admin.actions.ts`):

```ts
updateOrderStatus(orderId: string, status: OrderStatus): ActionResult<void>
```

---

### 6. Abonnement-Übersicht (`/admin/subscriptions`)

**Liste:**

- Paginierte Tabelle: Nutzer-E-Mail, Plan-Tier, Billing-Intervall, Status, `currentPeriodEnd`, `cancelAtPeriodEnd`
- Filter: Tier, Status, `cancelAtPeriodEnd`

**Kein direktes Editieren** — Abos werden via Stripe-Webhooks verwaltet; diese Seite dient nur der Einsicht.

---

### 7. Abo-Pläne (`/admin/subscription-plans`)

**Liste/Edit:**

- Tabelle der drei Pläne (FREE / BASIC / PRO) — da `tier` unique ist, kein Erstellen/Löschen
- Bearbeitbares Formular je Plan: Name, Beschreibung, monatlicher Preis, jährlicher Preis, `isActive`, Features (JSON-Array)
- Stripe-IDs (readonly, zur Referenz)

**Server Action** (`src/data/actions/admin/subscription-plan.admin.actions.ts`):

```ts
updateSubscriptionPlan(id: string, input: SubscriptionPlanInput): ActionResult<void>
```

---

## Implementierungs-Schichten

### Neue Dateien (Kurzübersicht)

```
src/app/(admin)/
  admin/
    layout.tsx
    page.tsx                                  ← Dashboard
    users/page.tsx
    users/[id]/page.tsx
    catalog/page.tsx
    catalog/new/page.tsx
    catalog/[id]/edit/page.tsx
    catalog/categories/page.tsx
    products/page.tsx
    products/new/page.tsx
    products/[id]/edit/page.tsx
    orders/page.tsx
    orders/[id]/page.tsx
    subscriptions/page.tsx
    subscription-plans/page.tsx

src/components/admin/
  layout/                                     ← Admin-Sidebar, Admin-Nav
  dashboard/                                  ← KpiCard, DashboardStats
  users/                                      ← UserTable, UserDetail
  catalog/                                    ← CatalogEntryForm, CatalogTable, CategoryManager
  products/                                   ← ProductForm, ProductTable
  orders/                                     ← OrderTable, OrderDetail
  subscriptions/                              ← SubscriptionTable
  subscription-plans/                         ← PlanEditor

src/data/actions/admin/
  user.admin.actions.ts
  catalog.admin.actions.ts
  product.admin.actions.ts
  order.admin.actions.ts
  subscription-plan.admin.actions.ts

src/data/repositories/
  user/user.repository.ts                     ← pGetUsersPage, pGetUserWithDetails ergänzen
  catalog/catalog.repository.ts               ← CRUD-Methoden ergänzen
  product/product.admin.repository.ts         ← neu
  admin-dashboard/                            ← neu, KPI-Aggregationen
```

### Sicherheitsregel für alle Admin-Actions

Jede Server Action im Admin-Bereich muss als erstes `requireAdminUser()` aufrufen — eine neue Hilfsfunktion in `src/data/actions/auth-utils.ts`:

```ts
export const requireAdminUser = async () => {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
};
```

---

## Offene Fragen vor der Implementierung

1. **Rollenvergabe beim ersten Admin:** Wie wird der erste Admin-Nutzer angelegt? (Direkt per DB-Seed / `db:datainit`, oder soll ein separater Mechanismus existieren?)
2. **Stripe-Produkt-Synchronisation:** Sollen Preisänderungen bei `SubscriptionPlan` automatisch via Stripe API propagiert werden, oder nur lokal in der DB?
3. **Bild-/Asset-Upload für Produkte:** Sind Produktbilder geplant? Falls ja, welcher Storage-Anbieter?
4. **Audit-Log:** Sollen Admin-Aktionen protokolliert werden (wer hat was wann geändert)?
