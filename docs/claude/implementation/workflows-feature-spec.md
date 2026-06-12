# Feature-Spezifikation: Prompt-Workflows

**Datum:** 2026-06-11
**Status:** Bereit zur Implementierung
**Ziel-Tiers:** BASIC + PRO
**Abhängigkeiten:** Templates (`/templates`, `Prompt`-Modell), `UsePromptForm`-Komponente, Subscription-Gate

---

## 1. Überblick & Job-to-be-done

**Problem:** Nutzer führen komplexe KI-Aufgaben aus, die mehrere Prompts in bestimmter Reihenfolge erfordern (z.B.: Briefing → Erstentwurf → Review-Anweisungen → Finalisierung). Aktuell fehlt eine Struktur: Sie verlieren den Faden, wissen nicht welcher Prompt als Nächstes kommt, und können diesen Prozess nicht speichern und wiederverwenden.

**Lösung:** Workflows sind benannte, gerichtete Schritt-Sequenzen mit optionalen Verzweigungspunkten. Der Nutzer erstellt den Workflow einmal im Editor und führt ihn beliebig oft im Runner aus — geführt, Schritt für Schritt, mit Kopierfunktion für jedes KI-Tool.

**Abgrenzung zu Follow-up-Prompts:** Follow-ups (auf `Prompt0`) sind simple, geordnete Texte an einem einzelnen Prompt. Workflows sind eigenständige Objekte, die beliebige Templates (oder Standalone-Texte) mit Verzweigungslogik verknüpfen. Sie ersetzen Follow-ups nicht, sondern adressieren einen anderen Use-Case.

**Runner-Modus:** Copy & Paste only — die App führt keine KI-API-Aufrufe durch. Der Nutzer kopiert den generierten Prompt und fügt ihn manuell in sein KI-Tool ein.

---

## 2. User Stories

| #   | Story                                                                                                                                                                | Tier   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| W-1 | Als BASIC/PRO-Nutzer möchte ich einen Workflow erstellen, dem ich einen Titel und eine Beschreibung gebe, damit andere (und ich selbst) verstehen, wozu er dient.    | BASIC+ |
| W-2 | Als BASIC/PRO-Nutzer möchte ich Schritte hinzufügen — entweder als Referenz auf ein Template aus meiner Bibliothek oder als eigenständigen Prompt-Text.              | BASIC+ |
| W-3 | Als BASIC/PRO-Nutzer möchte ich für jeden Schritt definieren, welche Schritte als Nächstes möglich sind (mit einem beschreibenden Label pro Wahl).                   | BASIC+ |
| W-4 | Als BASIC/PRO-Nutzer möchte ich einen Workflow im Runner-Modus ausführen, der mich Schritt für Schritt führt — mit Formularfeldern, Vorschau und Kopierfunktion.     | BASIC+ |
| W-5 | Als BASIC/PRO-Nutzer möchte ich im Runner nach dem Kopieren eines Prompts aus mehreren möglichen nächsten Schritten wählen, je nach Output meines KI-Tools.          | BASIC+ |
| W-6 | Als BASIC/PRO-Nutzer möchte ich im Runner zurückgehen können, damit ich Fehler korrigieren oder eine andere Wahl treffen kann.                                       | BASIC+ |
| W-7 | Als FREE-Nutzer, der die Sidebar sieht, möchte ich verstehen, dass Workflows ein Bezahl-Feature sind, damit ich den Wert einer Upgrade-Entscheidung beurteilen kann. | FREE   |

---

## 3. Datenmodell

### 3.1 Neue Prisma-Modelle

```prisma
model Workflow {
  id          String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId      String         @map("user_id") @db.Uuid
  title       String         @db.VarChar(250)
  description String?        @db.VarChar(750)
  createdAt   DateTime       @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt   DateTime       @updatedAt @map("updated_at")

  user  User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  steps WorkflowStep[]

  @@index([userId])
  @@map("workflow")
}

model WorkflowStep {
  id         String           @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  workflowId String           @map("workflow_id") @db.Uuid
  title      String           @db.VarChar(250)
  hint       String?          @db.VarChar(750)
  type       WorkflowStepType
  templateId String?          @map("template_id") @db.Uuid
  content    String?          @db.Text
  isStart    Boolean          @default(false) @map("is_start")
  position   Int              @default(0)
  createdAt  DateTime         @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt  DateTime         @updatedAt @map("updated_at")

  workflow      Workflow           @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  template      Prompt?            @relation(fields: [templateId], references: [id], onDelete: SetNull)
  outgoingEdges WorkflowStepEdge[] @relation("EdgeFrom")
  incomingEdges WorkflowStepEdge[] @relation("EdgeTo")

  @@index([workflowId])
  @@map("workflow_step")
}

enum WorkflowStepType {
  PROMPT_REF
  STANDALONE

  @@map("workflow_step_type")
}

model WorkflowStepEdge {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  fromStepId String   @map("from_step_id") @db.Uuid
  toStepId   String   @map("to_step_id") @db.Uuid
  label      String   @db.VarChar(250)
  order      Int      @default(0)
  createdAt  DateTime @default(now()) @map("created_at") @db.Timestamp(6)

  fromStep WorkflowStep @relation("EdgeFrom", fields: [fromStepId], references: [id], onDelete: Cascade)
  toStep   WorkflowStep @relation("EdgeTo",   fields: [toStepId],   references: [id], onDelete: Cascade)

  @@unique([fromStepId, toStepId])
  @@index([fromStepId])
  @@index([toStepId])
  @@map("workflow_step_edge")
}
```

### 3.2 Änderungen an bestehenden Modellen

```prisma
// model Prompt — neue Relation hinzufügen:
workflowSteps WorkflowStep[]

// model User — neue Relation hinzufügen:
workflows Workflow[]
```

### 3.3 Modell-Regeln & Invarianten

| Regel                                                         | Begründung                                              |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| Genau 1 Step mit `isStart = true` pro Workflow                | Eindeutiger Einstiegspunkt für den Runner               |
| `PROMPT_REF`-Step: `templateId` gesetzt, `content` ist `null` | Datenkonsistenz                                         |
| `STANDALONE`-Step: `content` gesetzt, `templateId` ist `null` | Datenkonsistenz                                         |
| Kein Zyklus im Graphen (gerichteter azyklischer Graph, DAG)   | Runner würde sonst in Endlosschleife laufen             |
| `fromStepId ≠ toStepId` auf jeder Edge                        | Self-Loop ist kein valider Pfad                         |
| `UNIQUE(fromStepId, toStepId)`                                | Keine Duplikat-Kanten zwischen denselben zwei Schritten |

---

## 4. Subscription-Limits

| Feature                      |   FREE    |    BASIC    |      PRO      |
| ---------------------------- | :-------: | :---------: | :-----------: |
| Workflows-Eintrag in Sidebar | Lock-Icon |     ✅      |      ✅       |
| Workflow erstellen           |    ❌     | max. **5**  | ✅ unbegrenzt |
| Steps pro Workflow           |     —     | max. **10** | ✅ unbegrenzt |
| Workflow ausführen (Runner)  |    ❌     |     ✅      |      ✅       |

**Enforcement:**

- **FREE → Sidebar-Klick:** Redirect auf `/subscription/pricing` oder Upgrade-Modal anzeigen. `/workflows` und alle Sub-Routen sind nicht zugänglich.
- **BASIC bei Workflow-Limit (5):** `+ Neuer Workflow`-Button ist `disabled`, Tooltip: _"Upgrade auf PRO für unbegrenzte Workflows"_.
- **BASIC bei Step-Limit (10) im Editor:** `+ Schritt hinzufügen`-Button ist `disabled`, Tooltip: _"Maximale Schrittanzahl erreicht (10/10). Upgrade auf PRO."_
- Beide Limits werden zusätzlich **serverseitig** geprüft und mit definierten Error-Codes abgelehnt (`WORKFLOW_LIMIT_REACHED`, `STEP_LIMIT_REACHED`).

---

## 5. Routen & Navigation

### 5.1 Neue Routen

Alle unter `src/app/(authenticated)/(prompts)/`:

```
workflows/page.tsx              → Workflow-Liste
workflows/new/page.tsx          → Workflow erstellen (leerer Editor)
workflows/[id]/edit/page.tsx    → Workflow bearbeiten (Editor befüllt)
workflows/[id]/run/page.tsx     → Workflow ausführen (Runner)
```

### 5.2 Sidebar-Eintrag

In `src/components/shared/sidebar/menus.tsx`, `navigationMenu1` ergänzen:

```typescript
{
  id: "/workflows",
  title: "Workflows",
  icon: GitBranch, // lucide-react
  url: "/workflows",
}
```

Position: nach `/templates` ("Prompts"), vor `/collections` ("Sammlungen").

---

## 6. Workflow-Liste (`/workflows`)

**Typ:** Server Component — lädt Workflows des eingeloggten Nutzers (neueste zuerst).

### Layout

```
[H1: "Workflows"]                    [Button: "+ Neuer Workflow"]

[Limit-Anzeige nur für BASIC: "3 / 5 Workflows verwendet"]

[Grid aus WorkflowCards]
```

### WorkflowCard

- **Titel** (1 Zeile, Truncate)
- **Beschreibung** (max. 2 Zeilen, Truncate, `text-muted-foreground`)
- **Metadaten:** Anzahl Schritte · "Zuletzt bearbeitet [Datum]"
- **Aktionen (Dropdown `...`):** Bearbeiten (`/workflows/[id]/edit`), Ausführen (`/workflows/[id]/run`), Löschen (mit Bestätigungs-Dialog)
- **Primärer CTA:** Button "Ausführen" → `/workflows/[id]/run`

### Empty State

Icon `GitBranch`, Überschrift _"Noch keine Workflows"_, Text _"Verbinde mehrere Prompts zu einem geführten Prozess."_, CTA-Button _"+ Ersten Workflow erstellen"_.

---

## 7. Workflow-Editor

Gilt für `/workflows/new` (leerer Zustand) und `/workflows/[id]/edit` (befüllter Zustand).

### 7.1 Layout (zwei Spalten)

```
┌──────────────────────────┬────────────────────────────────────┐
│  LINKE SPALTE (1/3)      │  RECHTE SPALTE (2/3)               │
│                          │                                     │
│  Workflow-Metadaten      │  Schritt-Detail-Editor              │
│  (Titel, Beschreibung)   │  (leer, wenn kein Schritt gewählt)  │
│                          │                                     │
│  Schritt-Liste           │                                     │
│  (visuelle Übersicht)    │                                     │
│                          │                                     │
│  [+ Schritt hinzufügen]  │                                     │
│                          │                                     │
│  [▶ Workflow ausführen]  │                                     │
└──────────────────────────┴────────────────────────────────────┘
```

### 7.2 Workflow-Metadaten (linke Spalte, oben)

| Feld         | Typ      | Pflicht | Validierung      |
| ------------ | -------- | :-----: | ---------------- |
| Titel        | Input    |   ✅    | max. 250 Zeichen |
| Beschreibung | Textarea |   ❌    | max. 750 Zeichen |

Eigener "Speichern"-Button für den Metadaten-Block.

### 7.3 Schritt-Liste (linke Spalte, mitte)

Jeder Schritt als Karte:

```
┌─────────────────────────────────────────────────────────┐
│  [● Start]  Schritt-Titel                    [✏] [⋮]   │
│  Badge: "Template" / "Eigenständig"                     │
│  Template-Name (wenn PROMPT_REF)                      │
│                                                         │
│  → "Label A" → Schritt X                               │
│  → "Label B" → Schritt Y                               │
└─────────────────────────────────────────────────────────┘
```

**Visuelle Badges:**

| Zustand                                                   | Badge                               |
| --------------------------------------------------------- | ----------------------------------- |
| Ist Startschritt                                          | `[Start]` (blau)                    |
| Keine ausgehenden Verbindungen                            | `[Ende]` (grau)                     |
| Keine eingehenden Verbindungen **und** nicht Startschritt | `[Nicht verbunden]` (gelb, Warnung) |

**Aktionen per Step (Dropdown `⋮`):**

- "Als Startschritt setzen" (setzt alle anderen auf `isStart = false`)
- "Schritt löschen" (Bestätigungs-Dialog, Hinweis dass Verbindungen zu/von diesem Schritt ebenfalls gelöscht werden)

Klick auf `✏` oder auf die Karte → Schritt wird in die rechte Spalte geladen.

### 7.4 Schritt-Detail-Editor (rechte Spalte)

#### Basis-Felder

| Feld                              | Typ                                          | Pflicht | Validierung                                                           |
| --------------------------------- | -------------------------------------------- | :-----: | --------------------------------------------------------------------- |
| Titel                             | Input                                        |   ✅    | max. 250 Zeichen                                                      |
| Hinweis (Hint)                    | Textarea                                     |   ❌    | max. 750 Zeichen; wird dem Nutzer im Runner als Kontext-Box angezeigt |
| Typ                               | Toggle: "Template-Referenz" / "Eigenständig" |   ✅    | —                                                                     |
| Template (nur wenn PROMPT_REF)    | Combobox/Picker: Suche in eigenen Templates  |   ✅    | Template muss existieren                                              |
| Prompt-Text (nur wenn STANDALONE) | Rich-Text-Editor (Tiptap)                    |   ✅    | min. 1 Zeichen                                                        |
| Ist Startschritt                  | Checkbox                                     |    —    | Max. 1 pro Workflow; Aktivieren hebt den bisherigen Start auf         |

#### Sektion "Nächste Schritte" (Verbindungen)

```
Nächste Schritte
────────────────────────────────────────────────────────────
[ Label: "Weiter"        ]  →  [ Schritt auswählen ▼ ]  [🗑]
[ Label: "Alternative"   ]  →  [ Schritt auswählen ▼ ]  [🗑]

[ + Verbindung hinzufügen ]
────────────────────────────────────────────────────────────
```

- **Label:** Freitext, required, max. 250 Zeichen — beschreibt die Wahl für den Nutzer im Runner (z.B. _"Output ist gut"_, _"Nochmal versuchen"_, _"Ja"_, _"Nein"_).
- **Ziel-Schritt:** Dropdown aller anderen Steps dieses Workflows.
- **Verboten:** Self-Loop (`fromStep = toStep`), Duplikat-Kanten (gleicher from+to), Zyklen.
- **`+ Verbindung hinzufügen`:** Fügt eine neue leere Zeile (Label + Ziel-Dropdown) hinzu.

#### Speichern

- Eigener "Speichern"-Button pro Schritt in der rechten Spalte.
- Kein Auto-Save im MVP.

### 7.5 Gesamtvalidierung vor dem Speichern

Validierung beim Speichern eines Schritts (inkl. Edges):

| Bedingung                                     | Fehlermeldung                                              |
| --------------------------------------------- | ---------------------------------------------------------- |
| Titel leer                                    | _"Titel ist erforderlich"_                                 |
| `PROMPT_REF` ohne `templateId`                | _"Bitte ein Template auswählen"_                           |
| `STANDALONE` ohne `content`                   | _"Prompt-Text darf nicht leer sein"_                       |
| Edge ohne Label                               | _"Bitte ein Label für diese Verbindung eingeben"_          |
| Edge ohne Ziel-Schritt                        | _"Bitte einen Zielschritt für diese Verbindung auswählen"_ |
| Duplikat-Kante (gleicher Zielschritt zweimal) | _"Dieser Schritt ist bereits als Ziel eingetragen"_        |
| Zyklus erkannt                                | _"Diese Verbindung erzeugt eine Endlosschleife"_           |

**Zyklus-Erkennung:** DFS vom `isStart`-Step. Wenn ein bereits im aktuellen Pfad besuchter Knoten erneut erreicht wird → Zyklus. Muss **serverseitig** validiert werden (nicht nur client-seitig).

---

## 8. Workflow-Runner (`/workflows/[id]/run`)

### 8.1 Layout

Fokussierter Vollbild-Modus — kein App-Sidebar, kein App-Header (eigenes Layout).

```
┌──────────────────────────────────────────────────────────────┐
│  [← Zurück]   Workflow-Titel                  [✕ Beenden]   │
│  ────────────────────────────────────────────────────────    │
│  Pfad: Schritt A  →  Schritt B  →  [Schritt C]              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Hinweis-Box, wenn hint vorhanden]                          │
│                                                              │
│  [UsePromptForm — wenn PROMPT_REF]                         │
│  ODER                                                        │
│  [Standalone-Prompt-Ansicht — wenn STANDALONE]               │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  Wie möchtest du weiter?                                     │
│  [Button: "Label A"]   [Button: "Label B"]                   │
│  (oder: "✓ Workflow abgeschlossen" wenn keine Edges)         │
│                                                              │
│  [← Zurück zum vorherigen Schritt]  (nur wenn history > 0)  │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Schritt-Rendering

**Wenn `type = PROMPT_REF` und Template vorhanden:**

Lädt `DPromptGenerationData` via `getPromptGenerationData(templateId)` (bestehende Server Action).
Rendert **`UsePromptForm`** aus `src/components/prompt-templating/use-prompt/use-prompt-form.tsx` — identisch zur bestehenden Verwendung im Template-Detail. Felder werden live ausgefüllt, Vorschau aktualisiert sich, Copy- und "In KI öffnen"-Buttons sind enthalten.

**Wenn `type = PROMPT_REF` aber Template gelöscht (`templateId` gesetzt, Template aber nicht mehr auffindbar):**

Warning-Box: _"Das verknüpfte Template wurde gelöscht. Dieser Schritt kann nicht ausgeführt werden."_
Die "Nächste Schritte"-Buttons bleiben aktiv — der Nutzer kann diesen Schritt überspringen.

**Wenn `type = STANDALONE`:**

Zeigt `content` als formatierter Text via `MDRenderer` in `rounded-lg bg-slate-100 p-5`.
Copy-Button (identisch zu `PromptText`-Komponente).

### 8.3 Hinweis-Box

Wird angezeigt wenn `step.hint` vorhanden:

```html
<div
   class="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800"
>
   ℹ [Hinweis-Text]
</div>
```

### 8.4 Navigations-Logik (Client-State, kein DB)

```typescript
type RunnerState = {
  historyStack: string[]; // stepIds in Besuchsreihenfolge
  currentIndex: number;   // Index in historyStack
};

// Initialisierung:
{ historyStack: [startStepId], currentIndex: 0 }

// Wahl treffen (Edge folgen):
historyStack.push(nextStepId);
currentIndex++;

// Zurück:
currentIndex--;
// Stack bleibt erhalten — kein Vorwärts-Button in MVP
```

**Pfad-Anzeige:** Zeigt `historyStack[0..currentIndex]` als Breadcrumb-artige Kette der Step-Titel an. Aktueller Schritt ist hervorgehoben.

### 8.5 Abschluss-Zustand

Wenn der aktuelle Step keine ausgehenden Edges hat:

```
✓ Workflow abgeschlossen

[Button: "Von vorne starten"]    [Button: "Schliessen"]
```

- "Von vorne starten" → setzt State zurück auf `{ historyStack: [startStepId], currentIndex: 0 }`
- "Schliessen" → navigiert zurück zu `/workflows`

---

## 9. Server Actions, Services & Repositories

Neue Schicht analog zu bestehenden Patterns (RepositoryFactory → ServiceFactory → Server Actions):

### 9.1 Server Actions (`src/actions/workflow/`)

| Action                                 | Beschreibung                                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `createWorkflow(data)`                 | Erstellt Workflow. Prüft BASIC-Limit (5).                                                             |
| `updateWorkflow(id, data)`             | Aktualisiert Titel/Beschreibung. Ownership-Check.                                                     |
| `deleteWorkflow(id)`                   | Löscht Workflow + alle Steps + alle Edges (Cascade). Ownership-Check.                                 |
| `getWorkflows()`                       | Alle Workflows des eingeloggten Nutzers (Liste, neueste zuerst).                                      |
| `getWorkflow(id)`                      | Einzelner Workflow mit Steps + Edges. Ownership-Check.                                                |
| `createWorkflowStep(workflowId, data)` | Fügt Step hinzu. Prüft BASIC-Step-Limit (10).                                                         |
| `updateWorkflowStep(id, data)`         | Aktualisiert Step-Felder inkl. Edges (ersetzt alle Edges des Steps). Inkl. Zyklus-Validierung.        |
| `deleteWorkflowStep(id)`               | Löscht Step + alle zugehörigen Edges (in- und outgoing).                                              |
| `setStartStep(workflowId, stepId)`     | Setzt `isStart = true` für `stepId`, `false` für alle anderen Steps desselben Workflows. Transaktion. |
| `getWorkflowForRunner(id)`             | Workflow + Steps + Edges + `templateTitle` (denormalisiert). Read-only. Ownership-Check.              |

### 9.2 Service-Invarianten

| Regel                                                                                   | Error-Code               |
| --------------------------------------------------------------------------------------- | ------------------------ |
| Jede mutierende Action prüft `workflow.userId === session.user.id`                      | `403 Forbidden`          |
| Vor `createWorkflow`: Zählt bestehende Workflows des Nutzers; wenn ≥ 5 und Tier = BASIC | `WORKFLOW_LIMIT_REACHED` |
| Vor `createWorkflowStep`: Zählt Steps des Workflows; wenn ≥ 10 und Tier = BASIC         | `STEP_LIMIT_REACHED`     |
| In `updateWorkflowStep` beim Hinzufügen einer Edge: DFS-Zyklus-Check                    | `CYCLE_DETECTED`         |

---

## 10. Domain Types (`src/data/types/domain/workflow.d.ts`)

```typescript
export type DWorkflow = {
  id: string;
  title: string;
  description: string | null;
  stepCount: number;
  updatedAt: string;
  createdAt: string;
};

export type DWorkflowStepType = "PROMPT_REF" | "STANDALONE";

export type DWorkflowStep = {
  id: string;
  workflowId: string;
  title: string;
  hint: string | null;
  type: DWorkflowStepType;
  templateId: string | null;
  templateTitle: string | null; // denormalisiert für UI-Anzeige
  content: string | null;
  isStart: boolean;
  position: number;
  outgoingEdges: DWorkflowStepEdge[];
};

export type DWorkflowStepEdge = {
  id: string;
  fromStepId: string;
  toStepId: string;
  label: string;
  order: number;
};

export type DWorkflowDetail = DWorkflow & {
  steps: DWorkflowStep[];
};

export type DWorkflowsUsage = {
  current: number;
  limit: number; // -1 = unbegrenzt (PRO)
};
```

---

## 11. Acceptance Criteria

### AC-1: Workflow erstellen (BASIC/PRO)

```
Given:  Nutzer ist BASIC oder PRO
  And:  Hat < 5 Workflows (BASIC) / beliebig (PRO)
When:   Nutzer klickt "+ Neuer Workflow" auf /workflows
Then:   Leerer Editor öffnet sich unter /workflows/new
  And:  Titel-Feld ist fokussiert
  And:  Noch keine Schritte vorhanden
  And:  "Speichern"-Button ist disabled bis Titel eingegeben
```

### AC-2: BASIC-Workflow-Limit

```
Given:  Nutzer ist BASIC
  And:  Hat bereits 5 Workflows
When:   Nutzer öffnet /workflows
Then:   "+ Neuer Workflow"-Button ist disabled
  And:  Tooltip: "Upgrade auf PRO für unbegrenzte Workflows"

When:   Nutzer sendet POST-Request direkt (API-Bypass)
Then:   Server antwortet mit Error WORKFLOW_LIMIT_REACHED
```

### AC-3: Schritt vom Typ PROMPT_REF hinzufügen

```
Given:  Nutzer ist im Workflow-Editor
When:   Nutzer klickt "+ Schritt hinzufügen"
  And:  Wählt "Template-Referenz" als Typ
  And:  Wählt ein Template aus dem Picker
  And:  Gibt einen Schritt-Titel ein
  And:  Klickt "Speichern"
Then:   Schritt erscheint in der Schritt-Liste
  And:  Schritt zeigt den Template-Namen
  And:  type = PROMPT_REF, templateId ist korrekt gesetzt
```

### AC-4: Verzweigung konfigurieren (2 Ausgänge)

```
Given:  Workflow-Editor mit Schritten A, B und C
When:   Nutzer wählt Schritt A im Editor
  And:  Fügt Verbindung "Weiter" → Schritt B hinzu
  And:  Fügt Verbindung "Alternative" → Schritt C hinzu
  And:  Speichert Schritt A
Then:   Schritt A zeigt 2 ausgehende Verbindungen in der Übersicht
  And:  "Weiter → Schritt B" und "Alternative → Schritt C" sind sichtbar
  And:  2 WorkflowStepEdge-Datensätze wurden gespeichert
```

### AC-5: Zyklus-Prävention

```
Given:  Workflow mit Steps A → B → C (linear)
When:   Nutzer versucht in Schritt C eine Verbindung zu Schritt A zu setzen
  And:  Klickt "Speichern"
Then:   Speichern schlägt fehl
  And:  Fehlermeldung "Diese Verbindung erzeugt eine Endlosschleife" wird angezeigt
  And:  Keine WorkflowStepEdge wurde gespeichert
```

### AC-6: Runner — Schritt ausführen (PROMPT_REF)

```
Given:  Nutzer öffnet /workflows/[id]/run
  And:  Erster Schritt ist PROMPT_REF mit 2 Variablen
When:   Seite lädt
Then:   UsePromptForm mit 2 Feldern wird angezeigt
  And:  Vorschau zeigt den Prompt-Text mit ungefüllten Platzhaltern

When:   Nutzer füllt beide Felder aus
Then:   Vorschau aktualisiert sich live mit den ausgefüllten Werten

When:   Nutzer klickt "Kopieren"
Then:   Gefüllter Prompt-Text liegt in der Zwischenablage
  And:  Button wechselt für 2 Sekunden zu "Kopiert!"
```

### AC-7: Runner — Verzweigung wählen

```
Given:  Nutzer ist auf Schritt A im Runner
  And:  Schritt A hat 2 Verbindungen: "Weiter" → B, "Alternative" → C
When:   Nutzer klickt "Weiter"
Then:   Runner wechselt zu Schritt B
  And:  Pfad-Anzeige zeigt "Schritt A → [Schritt B]"
  And:  "← Zurück"-Button wird eingeblendet
```

### AC-8: Runner — Zurück navigieren

```
Given:  Nutzer hat Pfad A → B → C zurückgelegt (currentIndex = 2)
When:   Nutzer klickt "← Zurück"
Then:   currentIndex = 1, Schritt B wird angezeigt
  And:  Formularfelder von Schritt B sind leer (kein State-Restore in MVP)

When:   Nutzer klickt erneut "← Zurück"
Then:   currentIndex = 0, Schritt A wird angezeigt
  And:  "← Zurück"-Button ist disabled oder ausgeblendet
```

### AC-9: Runner — Template gelöscht

```
Given:  Schritt X referenziert Template T
  And:  Template T wurde gelöscht
When:   Nutzer erreicht Schritt X im Runner
Then:   Warning-Box wird angezeigt: "Das verknüpfte Template wurde gelöscht."
  And:  Nächste-Schritte-Buttons sind weiterhin aktiv
  And:  Nutzer kann ohne Ausführen dieses Schritts fortfahren
```

### AC-10: FREE-Nutzer — Zugriffssperre

```
Given:  Nutzer hat FREE-Tier
When:   Nutzer klickt auf "Workflows" in der Sidebar
Then:   Nutzer wird zu /subscription/pricing weitergeleitet
  OR:   Upgrade-Modal wird angezeigt
  And:  /workflows und alle Sub-Routen sind nicht direkt zugänglich
```

### AC-11: Runner — Workflow abgeschlossen

```
Given:  Nutzer befindet sich auf einem Schritt ohne ausgehende Edges
Then:   Keine "Nächste Schritte"-Buttons werden angezeigt
  And:  "✓ Workflow abgeschlossen" wird angezeigt
  And:  Buttons "Von vorne starten" und "Schliessen" sind sichtbar

When:   Nutzer klickt "Von vorne starten"
Then:   Runner setzt zurück auf { historyStack: [startStepId], currentIndex: 0 }
```

---

## 12. Edge Cases & Fehler-Zustände

| Situation                                                              | Verhalten                                                                                       |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Runner aufgerufen, kein `isStart`-Step im Workflow                     | Server: 400-Error. UI: _"Kein Startschritt definiert."_ + Link zum Editor                       |
| Runner aufgerufen, Workflow hat 0 Steps                                | UI: _"Dieser Workflow enthält noch keine Schritte."_ + Link zum Editor                          |
| Step wird gelöscht, der als Ziel in einer Edge referenziert wird       | `onDelete: Cascade` auf `WorkflowStepEdge` — Edges werden automatisch mitgelöscht               |
| BASIC-Nutzer upgradet auf PRO, hat > 5 Workflows                       | Alle Workflows bleiben erhalten; Limit wird nicht rückwirkend erzwungen                         |
| Template wird umbenannt, das in einem Step referenziert wird           | Step zeigt immer den aktuellen Titel — `templateTitle` wird beim Laden live abgefragt           |
| Nutzer hat 2 Browser-Tabs mit demselben Editor offen                   | Last-write-wins; kein Konflikt-Management in MVP                                                |
| Workflow mit Schritten aber ohne `isStart`-Step wird über API geöffnet | Editor zeigt `[Nicht verbunden]`-Warnung auf allen Steps + Banner _"Kein Startschritt gesetzt"_ |

---

## 13. Implementierungs-Reihenfolge

1. **Prisma-Schema:** Neue Modelle + Relationen, Migration ausführen, Client generieren
2. **Domain Types:** `src/data/types/domain/workflow.d.ts`
3. **Repository + Service + Actions:** CRUD inkl. Zyklus-Validierung und Subscription-Limit-Checks
4. **Workflow-Liste `/workflows`:** Page + WorkflowCard + Empty State + Subscription-Gate
5. **Workflow-Editor `/workflows/new` + `[id]/edit`:** Metadaten-Editor + Schritt-Liste + Schritt-Detail-Panel
6. **Runner `/workflows/[id]/run`:** Client-State, PROMPT_REF + STANDALONE Rendering, Navigations-Logik
7. **Sidebar-Eintrag** + FREE-Gate
8. **Unit- und Integrationstests** (Services/Validierung, CRUD, Editor + Runner Komponenten)

---

## 14. MVP vs. Full Vision

| Bereich                        | MVP (diese Spezifikation)                             | Full Vision                                               |
| ------------------------------ | ----------------------------------------------------- | --------------------------------------------------------- |
| Editor-UX                      | Formular-basierter Editor (Step-Liste + Detail-Panel) | Visueller Canvas-Editor (z.B. ReactFlow) mit Drag & Drop  |
| Sharing                        | Privat only                                           | Teilen via Token (wie Collections), Marketplace-Workflows |
| Runner-State                   | Kein Persistenz — geht bei Reload verloren            | Session wird gespeichert (DB oder localStorage)           |
| Variables über Schritte hinweg | Nicht unterstützt                                     | `{{step_1_output}}` in späteren Schritten verwendbar      |
| Collaboration                  | —                                                     | Team-Workflows, Permissions                               |
| Explore-Katalog                | —                                                     | Öffentliche Workflow-Vorlagen                             |
