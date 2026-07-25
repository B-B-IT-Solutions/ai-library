# Feature-Spezifikation: Prompt-Text-Versionierung

**Feature-ID:** TBD (nächste verfügbare AI-XXX)
**Datum:** 2026-07-25
**Status:** Spezifiziert, bereit zur Implementierung
**Ziel-Tiers:** BASIC + PRO (Zugriff), Datenerfassung für alle Tiers (siehe §4)
**Abhängigkeiten:** `Prompt`/`PromptContent`-Modell, Prompt-Editor (`src/components/prompts/detail/edit/`), Subscription-Tier-System (`src/lib/subscription/access-control.ts`)

---

## 1. Überblick & Job-to-be-done

**Problem:** Der Prompt-Text (`PromptContent.content`) wird beim Speichern hart überschrieben — es existiert aktuell **keine** Historie. Ein Blick in `prompt.user.repository.ts` (`pUpdatePrompt`) zeigt ein einfaches `content: { update: { content: data.content } } }`; die vorherige Fassung ist nach dem Speichern unwiederbringlich verloren. Das widerspricht einem der in den Verkaufsunterlagen genannten Kern-Differenzierungsmerkmale ("Versionsverlauf verhindert Prompt-Drift") und ist ein zentraler, wiederkehrender Schmerzpunkt bei iterativer Prompt-Arbeit: Nutzer verbessern einen Prompt schrittweise, verschlechtern ihn versehentlich und können nicht zu einer früher funktionierenden Fassung zurück.

**Betroffene Segmente (Priorität):**

1. **Entwickler & Prompt-Engineers** — iterieren am häufigsten, brauchen Nachvollziehbarkeit ("was hat vorhin funktioniert?")
2. **Content-Creator & Marketer** — testen Ton/Formulierung über mehrere Anläufe, wollen risikofrei experimentieren
3. **Freelancer/Consultants** — passen denselben Prompt für verschiedene Kontexte an und wollen nicht versehentlich eine kundenspezifische Fassung verlieren

**Lösung:** Jede inhaltliche Änderung am Prompt-Text erzeugt automatisch einen Snapshot der vorherigen Fassung. Der Nutzer kann den Verlauf einsehen, eine frühere Version ansehen und wiederherstellen — ohne einen zusätzlichen manuellen Schritt beim Speichern. Ein optionales Notizfeld erlaubt es (v.a. Power-Usern), Änderungen zu kommentieren.

**Abgrenzung:** Versioniert wird ausschließlich `PromptContent.content` (der eigentliche Prompt-Text mit Platzhaltern). Titel, Beschreibung, Kategorien, Modell und Formularfelder (`PromptField`) werden **nicht** versioniert — das bleibt Full-Vision-Scope (siehe §14). Diese Eingrenzung deckt sich mit der Nutzeranfrage ("Text des Prompts versionieren") und hält den MVP-Schnitt sauber.

---

## 2. User Stories

| #   | Story                                                                                                                                                          | Tier                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| V-1 | Als Nutzer möchte ich, dass jede gespeicherte Änderung am Prompt-Text automatisch eine neue Version erzeugt, ohne dass ich daran denken muss.                | Alle (Erfassung), BASIC+ (Nutzung) |
| V-2 | Als Nutzer möchte ich beim Speichern optional eine kurze Notiz hinterlassen, damit ich später weiß, warum ich diese Änderung gemacht habe.                   | BASIC+                   |
| V-3 | Als Nutzer möchte ich eine Liste aller früheren Versionen meines Prompt-Texts sehen, mit Zeitpunkt und Notiz.                                                | BASIC+                   |
| V-4 | Als Nutzer möchte ich den Inhalt einer früheren Version ansehen können, ohne sie sofort zu übernehmen.                                                       | BASIC+                   |
| V-5 | Als Nutzer möchte ich eine frühere Version wiederherstellen, damit ich zu einer Fassung zurück kann, die besser funktioniert hat.                            | BASIC+                   |
| V-6 | Als Nutzer möchte ich gewarnt werden, wenn eine wiederhergestellte Version Platzhalter enthält, die es in meinen aktuellen Feldern nicht mehr gibt.           | BASIC+                   |
| V-7 | Als FREE-Nutzer möchte ich sehen, dass Versionsverlauf existiert (Anzahl gespeicherter Versionen), aber zum Ansehen/Wiederherstellen auf BASIC/PRO upgraden. | FREE                      |
| V-8 | Als BASIC-Nutzer möchte ich verstehen, dass nur die letzten 20 Versionen aufbewahrt werden, damit ich nicht überrascht werde, wenn ältere fehlen.            | BASIC                    |

---

## 3. Datenmodell

### 3.1 Neues Prisma-Modell

```prisma
model PromptContentVersion {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  promptId      String   @map("prompt_id") @db.Uuid
  versionNumber Int      @map("version_number")
  content       String   @map("content") @db.Text
  note          String?  @db.VarChar(500)
  createdAt     DateTime @default(now()) @map("created_at") @db.Timestamp(6)

  prompt Prompt @relation(fields: [promptId], references: [id], onDelete: Cascade)

  @@unique([promptId, versionNumber])
  @@index([promptId])
  @@map("prompt_content_version")
}
```

### 3.2 Änderung an bestehendem Modell

```prisma
// model Prompt — neue Relation hinzufügen:
contentVersions PromptContentVersion[]
```

### 3.3 Kernprinzip: Snapshot des ALTEN Zustands, nicht des neuen

`PromptContent.content` bleibt wie bisher die **aktuelle, live editierbare Fassung**. `PromptContentVersion` ist ein **Append-only-Log vergangener Zustände**. Beim Speichern wird — falls sich `content` tatsächlich ändert — der **bisherige** Inhalt als neue Version weggeschrieben, bevor der neue Inhalt in `PromptContent` geschrieben wird. Das hat zwei Vorteile:

- Keine Datenmigration nötig: Bestehende Prompts brauchen keine "Version 1"-Rückwirkung; ihre Historie beginnt einfach beim nächsten Save.
- **Wiederherstellen ist kein Sonderfall** — es ist technisch identisch zu einem normalen Speichern mit `content = versionX.content`, läuft also durch dieselbe Snapshot-Logik (inkl. Absicherung des aktuellen Standes vor dem Überschreiben). Der Nutzer kann also nie versehentlich Inhalte durch ein Restore endgültig verlieren.

### 3.4 Modell-Regeln & Invarianten

| Regel                                                                                       | Begründung                                                                 |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Version wird nur erzeugt, wenn `newContent !== currentContent` (String-Vergleich nach Trim)  | Vermeidet Rausch-Einträge bei Saves ohne inhaltliche Textänderung           |
| `versionNumber` ist fortlaufend pro Prompt, beginnend bei 1                                   | Nachvollziehbare Reihenfolge, unabhängig von `createdAt`-Kollisionen        |
| Snapshot + Update von `PromptContent.content` laufen in **einer DB-Transaktion**              | Verhindert Inkonsistenz bei Teilausfall (Version gespeichert, Content nicht) |
| `onDelete: Cascade` von `Prompt` auf `PromptContentVersion`                                    | Löschen eines Prompts entfernt vollständig dessen Historie                  |
| Versionszeilen werden **unabhängig vom Tier des Nutzers** geschrieben (siehe §4 für Ausnahme BASIC-Rotation) | FREE-Nutzer verlieren beim Upgrade keine Historie, die "im Hintergrund" bereits entstanden ist — siehe Monetarisierungs-Hinweis in §4 |

---

## 4. Subscription-Limits

Erweiterung von `TIER_FEATURES` in `src/lib/subscription/access-control.ts`:

```typescript
export type TierFeatures = {
  // ...bestehende Felder...
  canAccessVersionHistory: boolean;
  maxStoredPromptVersions: number; // -1 = unbegrenzt, 0 = keine Rotation (alles behalten)
};

export const TIER_FEATURES: Record<DSubscriptionTier, TierFeatures> = {
  FREE: {
    // ...
    canAccessVersionHistory: false,
    maxStoredPromptVersions: -1, // wird weiterhin gespeichert, nur UI-Zugriff gesperrt
  },
  BASIC: {
    // ...
    canAccessVersionHistory: true,
    maxStoredPromptVersions: 20,
  },
  PRO: {
    // ...
    canAccessVersionHistory: true,
    maxStoredPromptVersions: -1,
  },
};
```

| Feature                                    |      FREE       |        BASIC         |      PRO      |
| ------------------------------------------- | :--------------: | :-------------------: | :------------: |
| Versionen werden im Hintergrund gespeichert |        ✅        |           ✅           |       ✅        |
| Versionsverlauf ansehen                     | 🔒 (Upgrade-CTA)  |           ✅           |       ✅        |
| Version wiederherstellen                    | 🔒 (Upgrade-CTA)  |           ✅           |       ✅        |
| Aufbewahrte Versionen pro Prompt            |    unbegrenzt¹    | max. **20** (rotierend) | ✅ unbegrenzt   |
| Änderungsnotiz erfassen                     | 🔒 (Upgrade-CTA)  |           ✅           |       ✅        |

¹ FREE-Nutzer sammeln unbegrenzt Versionen, ohne Zugriff — das ist bewusst ein Upgrade-Hebel (siehe §13, offene Entscheidung).

**Enforcement:**

- `getPromptVersions()`-Server-Action prüft `canAccessFeature(tier, "canAccessVersionHistory")`; bei FREE liefert sie **nur die Anzahl**, nicht den Inhalt (`{ locked: true, count: number }`), damit die UI "12 Versionen gespeichert — Upgrade zum Ansehen" zeigen kann, ohne Content-Leaks an FREE-Nutzer.
- `restorePromptVersion()` wirft `SubscriptionAccessError` bei FREE, analog zum bestehenden Muster in `subscription-enforcement.md` (`upgradeRequired: true` im `ActionResult`).
- Rotation (BASIC, max. 20): Nach jedem Snapshot-Insert prüft der Service die Anzahl vorhandener Versionen für den Prompt; bei > 20 werden die ältesten (niedrigste `versionNumber`) über das Limit hinaus gelöscht. **Nur für BASIC**, nicht für FREE (siehe Fußnote ¹) oder PRO.

---

## 5. UI — Editor-Integration

### 5.1 Optionale Änderungsnotiz

**Datei:** `src/components/prompts/detail/edit/form/sections/prompt-text.tsx`

Unterhalb des bestehenden `FormMDEditor` (Feld `content`) wird ein **eingeklapptes** optionales Textfeld ergänzt (kein Pflichtfeld, kein zusätzlicher Klick im Regelfall):

```
[Prompt-Text-Editor — unverändert]

▸ Änderungsnotiz hinzufügen (optional)
```

- Klick auf den Link/Chevron blendet ein einzeiliges Input-Feld ein: `versionNote` (max. 500 Zeichen).
- Wird **nicht** auf `Prompt`/`PromptContent` persistiert, sondern nur an die neu erzeugte `PromptContentVersion`-Zeile gehängt (siehe §6). Kein Schema-Change an `updatePromptSchema`-Pflichtfeldern nötig — additive, optionale Erweiterung von `DPromptUpdate`.
- Für FREE-Nutzer: Feld ist nicht sichtbar (kein Wert für sie, da sie ohnehin keinen Zugriff auf die Historie haben) — vermeidet Verwirrung ("wozu eine Notiz, die ich nie sehe").

### 5.2 Einstiegspunkt: Sidebar-Button "Versionsverlauf"

**Datei:** `src/components/prompts/detail/view/sidebar/prompt-sidebar.tsx`

Neuer Button analog zu `EditPromptButton`/`DownloadPromptButton`:

```tsx
<VersionHistoryButton prompt={prompt} />
```

Position: zwischen `EditPromptButton` und `DownloadPromptButton`. Zeigt Badge mit Versionsanzahl, wenn > 0 (z.B. "Versionsverlauf · 7").

**FREE-Zustand:** Button bleibt sichtbar (Discoverability!), öffnet aber ein Upgrade-Prompt statt der Liste: _"12 Versionen gespeichert. Upgrade auf BASIC, um deinen Versionsverlauf anzusehen und wiederherzustellen."_ + CTA-Button zu `/subscription/pricing`. Das folgt demselben Muster wie der Workflows-Sidebar-Eintrag für FREE (siehe `workflows-feature-spec.md` §5.2/§11 AC-10).

### 5.3 Versionsverlauf-Panel (Sheet)

**Neue Komponente:** `src/components/prompts/detail/versioning/version-history-sheet.tsx`

Layout (Sheet von rechts, analog zu bestehenden Radix/shadcn-Sheet-Patterns im Projekt):

```
┌─────────────────────────────────────────┐
│  Versionsverlauf                    [✕]  │
├─────────────────────────────────────────┤
│  ● Aktuelle Version                      │
│    zuletzt bearbeitet vor 2 Stunden      │
│                                           │
│  ○ Version 6 · vor 2 Stunden             │
│    "Ton auf 'locker' angepasst"          │
│    [Ansehen]  [Wiederherstellen]         │
│                                           │
│  ○ Version 5 · vor 1 Tag                 │
│    (keine Notiz)                         │
│    [Ansehen]  [Wiederherstellen]         │
│                                           │
│  ...                                     │
│                                           │
│  [Weitere laden]  (falls > 1 Seite)      │
└─────────────────────────────────────────┘
```

- Jeder Eintrag zeigt: relative Zeitangabe (date-fns v4, wie im übrigen Projekt üblich), Notiz (falls vorhanden, sonst `"(keine Notiz)"` in `text-muted-foreground`).
- **"Ansehen":** öffnet den Inhalt dieser Version read-only (z.B. in einem zweiten, überlagernden Panel oder Accordion-Expand direkt in der Liste) — via `MDRenderer`, identisch zur Darstellung im `PromptForm`-View-Modus.
- **"Wiederherstellen":** löst Bestätigungsdialog aus (§5.4).
- BASIC-Hinweis am Fuß der Liste, wenn Gesamtzahl ≥ 15: _"Es werden nur die letzten 20 Versionen aufbewahrt. Upgrade auf PRO für unbegrenzte Historie."_

### 5.4 Wiederherstellen-Flow

```
Klick "Wiederherstellen" auf Version 5
  → Bestätigungsdialog:
     "Version 5 wiederherstellen?"
     "Die aktuelle Fassung wird automatisch als neue Version gesichert,
      bevor Version 5 übernommen wird — es geht nichts verloren."
     [Abbrechen]  [Wiederherstellen]

  → Server Action restorePromptVersion(promptId, versionId)
  → Bei Erfolg: Sheet schließt, Toast "Version 5 wiederhergestellt",
    Editor/View lädt aktualisierten Content
```

**Variablen-Mismatch-Warnung (V-6):** Nach erfolgreichem Restore (oder bereits im Bestätigungsdialog, client-seitig) wird die wiederherzustellende `content`-Fassung durch die bereits vorhandene Utility `extractVariablesFromContent` (`src/components/prompts/detail/edit/form/utils/variables.ts`) gejagt und mit den aktuellen `PromptField`/`GlobalPromptField`-Namen abgeglichen (dieselbe Logik wie `resolveVariableStatus` in `src/components/prompts/detail/edit/form/tabs/utils.ts`, bereits produktiv im "Platzhalter"-Tab für neu erkannte Variablen). Ergebnis wird als Warn-Box im Bestätigungsdialog angezeigt, **blockiert aber nicht** (analog zum bestehenden "neue Variable erkannt"-Badge — informativ, nicht hart validierend):

```
⚠ Diese Version enthält Platzhalter, die aktuell nicht als Felder definiert
  sind: {{alte_variable}}. Diese werden nach dem Wiederherstellen im
  "Platzhalter"-Tab als neu erkannt angezeigt.
```

---

## 6. Server Actions, Services & Repositories

Neue Schicht analog zu bestehenden Prompt-Patterns:

### 6.1 Server Actions (`src/data/actions/prompt/prompt.user.actions.ts`)

| Action                                        | Beschreibung                                                                                       |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `getPromptVersions(promptId, query)`           | Paginierte Liste (`Page<DPromptVersion>`). Bei FREE: `{ locked: true, count }` statt Inhalten.       |
| `getPromptVersion(promptId, versionId)`        | Einzelne Version inkl. `content`, für "Ansehen". Ownership-Check. Gated hinter `canAccessVersionHistory`. |
| `restorePromptVersion(promptId, versionId)`    | Übernimmt `version.content` als neuen `PromptContent.content` — läuft durch dieselbe Snapshot-Logik wie `updatePrompt`. Gated hinter `canAccessVersionHistory`. |

`updatePrompt(descriptorId, data)` (bestehende Action) wird um das optionale `versionNote`-Feld in `DPromptUpdate` erweitert — kein neuer Action-Name nötig.

### 6.2 Service (`src/data/services/prompt/prompt.user.service.ts`)

```typescript
async updatePrompt(userId: string, descriptorId: string, data: DPromptUpdate) {
  const prompt = await this.getPrompt(userId, descriptorId);
  if (!prompt) throw new Error("TemplateDescriptor not found");

  await this.repository.pUpdatePromptWithVersioning(
    userId,
    descriptorId,
    data // enthält optional data.versionNote
  );
}

async restorePromptVersion(userId: string, promptId: string, versionId: string) {
  const tier = await this.subscriptionService.getUserTier(userId);
  if (!canAccessFeature(tier, "canAccessVersionHistory")) {
    throw new SubscriptionAccessError(
      "Versionsverlauf ist ab BASIC verfügbar.",
      "canAccessVersionHistory"
    );
  }

  const version = await this.repository.pGetPromptVersion(userId, promptId, versionId);
  if (!version) throw new Error("Version not found");

  // Läuft durch denselben Snapshot-Pfad wie ein normales Speichern:
  await this.repository.pUpdatePromptWithVersioning(userId, promptId, {
    content: version.content,
    versionNote: `Wiederhergestellt aus Version ${version.versionNumber}`,
  } as Partial<DPromptUpdate>);
}
```

### 6.3 Repository (`src/data/repositories/prompt/prompt.user.repository.ts`)

`pUpdatePrompt` wird zu `pUpdatePromptWithVersioning` erweitert (oder intern um einen Versionierungs-Schritt ergänzt):

```typescript
async pUpdatePromptWithVersioning(
  userId: string,
  descriptorId: string,
  data: DPromptUpdate
) {
  return this.prisma.$transaction(async (tx) => {
    const current = await tx.promptContent.findUnique({
      where: { promptId: descriptorId },
    });

    const contentChanged =
      current && current.content.trim() !== data.content.trim();

    if (contentChanged) {
      const lastVersion = await tx.promptContentVersion.findFirst({
        where: { promptId: descriptorId },
        orderBy: { versionNumber: "desc" },
      });
      const nextVersionNumber = (lastVersion?.versionNumber ?? 0) + 1;

      await tx.promptContentVersion.create({
        data: {
          promptId: descriptorId,
          versionNumber: nextVersionNumber,
          content: current!.content, // Snapshot des ALTEN Inhalts
          note: data.versionNote || null,
        },
      });

      // BASIC-Rotation: älteste über Limit hinaus löschen
      await this.rotateVersionsIfNeeded(tx, userId, descriptorId);
    }

    // ... bestehendes Update von title/description/model/categories/fields/globalFields ...

    return tx.prompt.update({
      where: { id: descriptorId },
      data: {
        /* ...bestehende Felder..., */
        content: { update: { content: data.content } },
      },
    });
  });
}
```

### 6.4 Service-Invarianten

| Regel                                                                              | Error-Code                     |
| ------------------------------------------------------------------------------------ | -------------------------------- |
| Jede Version-Action prüft `prompt.userId === session.user.id`                       | `403 Forbidden`                  |
| `getPromptVersion`/`restorePromptVersion` bei FREE                                   | `VERSION_HISTORY_UPGRADE_REQUIRED` |
| Snapshot + Content-Update laufen atomar (`$transaction`)                            | Rollback bei Fehler               |

---

## 7. Domain Types (`src/data/types/domain/prompt.d.ts`)

```typescript
export type DPromptVersion = {
  id: string;
  promptId: string;
  versionNumber: number;
  content: string;
  note: string | null;
  createdAt: string;
};

export type DPromptVersionSummary = Omit<DPromptVersion, "content">; // für Listenansicht ohne Volltext, falls Payload-Größe relevant wird

export type DPromptVersionsResult =
  | { locked: true; count: number } // FREE
  | { locked: false; page: Page<DPromptVersionSummary> }; // BASIC/PRO

// Erweiterung des bestehenden Update-Typs (additiv, optional):
// updatePromptSchema erhält: versionNote: z.string().max(500).optional()
```

---

## 8. Acceptance Criteria

### AC-1: Automatischer Snapshot bei Textänderung

```
Given:  Prompt existiert mit content = "Alt-Text"
  And:  Nutzer ist BASIC oder PRO
When:   Nutzer ändert content im Editor auf "Neu-Text" und speichert
Then:   Eine neue PromptContentVersion wird erzeugt mit content = "Alt-Text", versionNumber = 1
  And:  PromptContent.content ist jetzt "Neu-Text"
```

### AC-2: Kein Snapshot ohne inhaltliche Änderung

```
Given:  Prompt existiert mit content = "Text"
When:   Nutzer öffnet den Editor, ändert nur den Titel, speichert
Then:   Keine neue PromptContentVersion wird erzeugt
```

### AC-3: Änderungsnotiz wird an die Version gehängt

```
Given:  Nutzer ist BASIC oder PRO, ändert den Prompt-Text
When:   Nutzer öffnet "Änderungsnotiz hinzufügen", trägt "Ton angepasst" ein, speichert
Then:   Die neu erzeugte PromptContentVersion hat note = "Ton angepasst"
```

### AC-4: Versionsverlauf ansehen (BASIC/PRO)

```
Given:  Prompt hat 3 gespeicherte Versionen
  And:  Nutzer ist BASIC oder PRO
When:   Nutzer klickt "Versionsverlauf" in der Sidebar
Then:   Sheet öffnet sich mit "Aktuelle Version" + 3 historischen Einträgen (neueste zuerst)
  And:  Jeder Eintrag zeigt Zeitpunkt und Notiz (oder "(keine Notiz)")
```

### AC-5: Versionsverlauf gesperrt (FREE)

```
Given:  Prompt hat 3 gespeicherte Versionen
  And:  Nutzer ist FREE
When:   Nutzer klickt "Versionsverlauf" in der Sidebar
Then:   Upgrade-Hinweis wird angezeigt: "3 Versionen gespeichert. Upgrade auf BASIC..."
  And:  Kein Versionsinhalt wird an den Client übertragen
```

### AC-6: Version wiederherstellen

```
Given:  Prompt hat aktuellen content = "Neu-Text"
  And:  Version 1 mit content = "Alt-Text" existiert
  And:  Nutzer ist BASIC oder PRO
When:   Nutzer klickt "Wiederherstellen" bei Version 1, bestätigt den Dialog
Then:   PromptContent.content wird zu "Alt-Text"
  And:  Eine neue PromptContentVersion (versionNumber 2) wird erzeugt mit content = "Neu-Text"
  And:  Toast "Version 1 wiederhergestellt" erscheint
```

### AC-7: Wiederherstellen bei FREE blockiert

```
Given:  Nutzer ist FREE
When:   Nutzer versucht restorePromptVersion(...) direkt aufzurufen (API-Bypass)
Then:   Server antwortet mit Error VERSION_HISTORY_UPGRADE_REQUIRED, upgradeRequired: true
```

### AC-8: Variablen-Mismatch-Warnung beim Restore

```
Given:  Version 1 enthält "{{alte_variable}}" im Text
  And:  Aktuelle PromptFields enthalten kein Feld "alte_variable"
When:   Nutzer öffnet den Bestätigungsdialog für "Wiederherstellen" von Version 1
Then:   Warn-Box zeigt: "Diese Version enthält Platzhalter, die aktuell nicht als
        Felder definiert sind: {{alte_variable}}"
  And:  "Wiederherstellen"-Button bleibt trotzdem aktiv (nicht blockierend)
```

### AC-9: BASIC-Rotation bei 20 Versionen

```
Given:  Nutzer ist BASIC, Prompt hat bereits 20 gespeicherte Versionen
When:   Nutzer speichert eine weitere inhaltliche Änderung
Then:   Eine 21. Version wird erzeugt
  And:  Die älteste Version (versionNumber = 1) wird automatisch gelöscht
  And:  Es existieren weiterhin genau 20 Versionen
```

### AC-10: Kein Rotation-Limit bei PRO

```
Given:  Nutzer ist PRO, Prompt hat 50 gespeicherte Versionen
When:   Nutzer speichert eine weitere inhaltliche Änderung
Then:   Eine 51. Version wird erzeugt, keine wird gelöscht
```

---

## 9. Edge Cases & Fehler-Zustände

| Situation                                                                 | Verhalten                                                                                                     |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Prompt wird gelöscht                                                        | `onDelete: Cascade` — alle `PromptContentVersion`-Zeilen werden mitgelöscht                                    |
| Nutzer restored eine Version, deren `content` identisch zum aktuellen ist   | Kein neuer Snapshot (greift dieselbe Dedup-Regel wie AC-2); Toast "Kein Unterschied zur aktuellen Version" statt "wiederhergestellt" |
| Zwei Browser-Tabs speichern gleichzeitig                                    | Last-write-wins auf `PromptContent`; beide Saves erzeugen jeweils einen eigenen, korrekten Versions-Snapshot (Transaktion verhindert Nummern-Kollision) |
| Prompt wird über Workflow-Step (`PROMPT_REF`) referenziert und Content per Restore geändert | Workflow-Runner liest `content` live (`getPromptGenerationData`) — Restore wirkt sich sofort auf laufende/künftige Workflow-Ausführungen aus. Kein Blocker, aber dokumentierter Hinweis im Bestätigungsdialog erwägenswert (siehe §13) |
| Prompt ist Teil eines gekauften Marketplace-Produkts (`ProductItem`)        | `ProductItem.templateId` verweist live auf den Prompt — Käufer sehen nach einem Restore ebenfalls die wiederhergestellte Fassung, nicht die zum Kaufzeitpunkt aktuelle. Kein Snapshot-Mechanismus für Marketplace-Käufe vorhanden (siehe offene Frage §13) |
| BASIC-Nutzer upgradet auf PRO nach Rotation                                 | Bereits rotierte (gelöschte) Versionen sind nicht wiederherstellbar — nur ab dem Upgrade-Zeitpunkt wächst die Historie unbegrenzt weiter |
| FREE-Nutzer upgradet auf BASIC/PRO                                          | Sofortiger Zugriff auf die bereits im Hintergrund gesammelte volle Historie (kein Datenverlust durch Tier-Wechsel) |
| `getPromptVersion` für gelöschte/fremde Version aufgerufen                  | 404 / Ownership-Error, analog zu bestehenden Prompt-Actions                                                    |

---

## 10. Implementierungs-Reihenfolge

1. **Prisma-Schema:** `PromptContentVersion`-Modell + Relation auf `Prompt`, Migration, Client generieren
2. **Domain Types:** `DPromptVersion`, `DPromptVersionsResult`; `updatePromptSchema` um optionales `versionNote` erweitern
3. **Tier-Konfiguration:** `TIER_FEATURES` um `canAccessVersionHistory` + `maxStoredPromptVersions` erweitern (inkl. Tests in `access-control.test.ts`)
4. **Repository:** `pUpdatePromptWithVersioning` (Transaktion, Dedup, Rotation), `pGetPromptVersions`, `pGetPromptVersion`
5. **Service:** `updatePrompt` auf neue Repository-Methode umstellen, `restorePromptVersion` mit Tier-Gate ergänzen
6. **Server Actions:** `getPromptVersions`, `getPromptVersion`, `restorePromptVersion`
7. **UI — Editor:** Optionale Änderungsnotiz in `prompt-text.tsx`
8. **UI — Sidebar & Sheet:** `VersionHistoryButton`, `version-history-sheet.tsx`, Ansehen-/Wiederherstellen-Flow, Variablen-Mismatch-Warnung (Wiederverwendung von `extractVariablesFromContent`/`resolveVariableStatus`)
9. **Unit- und Integrationstests:** Repository (Dedup, Rotation, Transaktion), Service (Tier-Gate), Actions, Komponenten (Sheet-States: leer, gesperrt, mit Einträgen)

---

## 11. MVP vs. Full Vision

| Bereich                        | MVP (diese Spezifikation)                                     | Full Vision                                                                 |
| -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Versionierter Umfang             | Nur `PromptContent.content`                                       | Auch Titel, Beschreibung, Felder (`PromptField`) versioniert                    |
| Vergleich                        | Einzelne Version ansehen (Volltext)                               | Side-by-side-Diff mit Zeilen-Highlighting (z.B. via `diff`-Library)             |
| Benennung                        | Automatische Nummerierung + optionale Freitext-Notiz              | Benannte Meilenstein-Versionen ("Tagged Versions", z.B. "Für Kunde X finalisiert") |
| Restore-Auswirkung auf Marketplace/Workflows | Kein Snapshot zum Kaufzeitpunkt, live-Referenz (dokumentierter Edge Case) | Kaufzeitpunkt-Snapshot für Marketplace-Produkte; Versions-Pinning in Workflow-Steps |
| Rotation                         | Hartes Limit bei BASIC (20), kein manuelles Pinning                | Nutzer kann einzelne Versionen vor Rotation schützen ("anpinnen")               |
| Sharing                          | Historie ist privat, nicht Teil von Collection-Sharing-Tokens      | Öffentliche Collection-Viewer könnten (optional) Versionsverlauf einsehen        |

---

## 12. Zod-Schema-Ergänzung (Referenz)

**Datei:** `src/data/types/validators/prompt.ts`

```typescript
export const updatePromptSchema = z.object({
  // ...bestehende Felder...
  versionNote: z.string().max(500).optional(),
});
```

---

## 13. Offene Fragen (zur Entscheidung, nicht vorweggenommen)

| #   | Frage                                                                                             | Empfehlung (unverbindlich)                                                                                       |
| --- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | Sollen FREE-Nutzer wirklich unbegrenzt Versionen im Hintergrund ansammeln (Storage-Kosten vs. Upgrade-Hebel)? | Ja, mit einer Obergrenze zur Kostenkontrolle (z.B. still bei 50 kappen, ohne UI-Hinweis) — starker Upgrade-Anreiz ("bereits 50 Versionen gespeichert"), vertretbares Storage-Volumen bei reinem Text |
| 2   | Soll `versionNote` an BASIC/PRO gekoppelt sein oder für alle (auch FREE, ohne Sichtbarkeit) erfassbar sein? | Wie spezifiziert: nur BASIC/PRO sehen/nutzen das Feld — vermeidet Verwirrung bei FREE                            |
| 3   | Soll Restore eines Prompts, der aktiv in Workflow-Steps referenziert wird, einen Warnhinweis zeigen ("Wird in 2 Workflows verwendet")? | Sinnvolle Ergänzung, aber kein Blocker für MVP — als Folgekarte nach Launch prüfen                              |
| 4   | Marketplace-Käufer und Content-Änderungen nach Kauf: rechtlich/vertrauensrelevant?                 | Sollte vor Launch mit Marketplace-Verantwortlichem geklärt werden — ggf. reicht ein Hinweis "Verkäufer kann Inhalt nach Kauf ändern" in den AGB/Produktdetails, statt technischer Lösung im MVP |
