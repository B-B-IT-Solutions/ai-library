---
name: Catalog Domain Architecture Decision
description: PromptTemplateDescriptor ist user-private — Explore-Feed basiert auf separatem CatalogEntry-Modell; User kopiert Einträge in eigene Library
type: project
---

Templates (`PromptTemplateDescriptor`) sind immer an einen User gebunden (`userId` Pflichtfeld, jede Repository-Methode filtert darauf). Sie sind persönliche, private Assets — kein öffentliches Discovery-Konzept.

Der Explore-Feed (P1) basiert daher auf einem **eigenständigen Catalog-Domain**:
- `CatalogEntry` — kein userId, admin-verwaltet, status DRAFT/PUBLISHED/ARCHIVED
- `CatalogEntryField` — Felder-Definitionen, analog zu `PromptTemplateField`
- `CatalogCategory` — globale Taxonomie (nicht per-User wie `PromptTemplateCategory`)

**Kernworkflow:** Nutzer kopiert Catalog-Eintrag → `copyCatalogEntryToUserLibrary()` → erstellt neue `PromptTemplateDescriptor` owned by userId → User besitzt vollständig unabhängige Kopie.

**Why:** Nutzer verwies darauf, dass Templates nicht für Explore "missbraucht" werden sollen. Templates sind Nutzer-eigene Werkzeuge; der Catalog ist Platform-Content. Saubere Domain-Trennung verhindert Kopplung und Komplexität.

**How to apply:** 
- Nie `PromptTemplateDescriptor.isDiscoverable` oder ähnliche Flags vorschlagen — das Modell ist nicht dafür designed
- Explore-Features immer im `CatalogEntry`-Namespace planen
- Kopier-Aktion (`copyCatalogEntryToUserLibrary`) ist das einzige Verbindungsstück zwischen Catalog und User-Template-Domain
- Kategorie-Features für Explore immer in `CatalogCategory` (global), nicht `PromptTemplateCategory` (per-user)
