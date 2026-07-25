# Feature-Spezifikation: Prompt-Text-Versionierung

**Feature-ID:** TBD (nächste verfügbare AI-XXX)
**Datum:** 2026-07-25
**Status:** Spezifiziert, bereit zur Implementierung
**Ziel-Tiers:** BASIC + PRO (Zugriff und Erstellung)
**Abhängigkeiten:** `Prompt`/`PromptContent`-Modell, Prompt-Editor (`src/components/prompts/detail/edit/`), Subscription-Tier-System (`src/lib/subscription/access-control.ts`)

---

## 1. Überblick & Job-to-be-done

**Problem:** Der Prompt-Text (`PromptContent.content`) wird beim Speichern hart überschrieben — es existiert aktuell **keine** Historie. Ein Blick in `prompt.user.repository.ts` (`pUpdatePrompt`) zeigt ein einfaches `content: { update: { content: data.content } } }`; die vorherige Fassung ist nach dem Speichern unwiederbringlich verloren. Das widerspricht einem der in den Verkaufsunterlagen genannten Kern-Differenzierungsmerkmale ("Versionsverlauf verhindert Prompt-Drift") und ist ein zentraler, wiederkehrender Schmerzpunkt bei iterativer Prompt-Arbeit: Nutzer verbessern einen Prompt schrittweise, verschlechtern ihn versehentlich und können nicht zu einer früher funktionierenden Fassung zurück.

**Betroffene Segmente (Priorität):**

1. **Entwickler & Prompt-Engineers** — iterieren am häufigsten, brauchen Nachvollziehbarkeit ("was hat vorhin funktioniert?")
2. **Content-Creator & Marketer** — testen Ton/Formulierung über mehrere Anläufe, wollen risikofrei experimentieren
3. **Freelancer/Consultants** — passen denselben Prompt für verschiedene Kontexte an und wollen nicht versehentlich eine kundenspezifische Fassung verlieren

**Lösung:** Der bestehende "Speichern"-Button im Prompt-Editor wird zu einem Split-Button: Das primäre Segment speichert wie bisher (keine Version), ein Chevron öffnet ein Dropdown mit der zusätzlichen Option "Speichern als neue Version". Wählt der Nutzer diese Option, wird zunächst der **bisherige** Prompt-Text als Sicherungspunkt in der Historie abgelegt, **bevor** der neu eingegebene Text live gesetzt wird. Versionierung ist damit nie automatisch — sie entsteht ausschließlich durch diese explizite Auswahl — und sie sichert immer den Stand, der gerade abgelöst wird, nicht das Ergebnis der aktuellen Bearbeitung. Details und Begründung in §3.3, UI-Umsetzung in §5.1.

**Abgrenzung:** Versioniert wird ausschließlich `PromptContent.content` (der eigentliche Prompt-Text mit Platzhaltern). Titel, Beschreibung, Kategorien, Modell und Formularfelder (`PromptField`) werden **nicht** versioniert — das bleibt Full-Vision-Scope (siehe §14). Diese Eingrenzung deckt sich mit der Nutzeranfrage ("Text des Prompts versionieren") und hält den MVP-Schnitt sauber.

---

## 2. User Stories

| #   | Story                                                                                                                                                          | Tier   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| V-1 | Als Nutzer möchte ich beim Speichern zwischen dem normalen "Speichern" und einer zusätzlichen Option "Speichern als neue Version" wählen können, damit nicht jede kleine Korrektur automatisch die Historie aufbläht. | BASIC+ |
| V-2 | Als Nutzer möchte ich beim Markieren als Version optional eine kurze Notiz hinterlassen, damit ich später weiß, was diese Fassung ausmacht.                 | BASIC+ |
| V-3 | Als Nutzer möchte ich eine Liste aller von mir bewusst gesetzten Versionen meines Prompt-Texts sehen, mit Zeitpunkt und Notiz.                               | BASIC+ |
| V-4 | Als Nutzer möchte ich den Inhalt einer früheren Version ansehen können, ohne sie sofort zu übernehmen.                                                       | BASIC+ |
| V-5 | Als Nutzer möchte ich eine frühere Version wiederherstellen, damit ich zu einer Fassung zurück kann, die besser funktioniert hat.                            | BASIC+ |
| V-6 | Als Nutzer möchte ich beim Wiederherstellen die Wahl haben, ob die aktuelle (noch unversionierte) Fassung vorher als Version gesichert wird, damit ich nichts verliere, aber auch nicht zwingend jeden Zwischenstand behalten muss. | BASIC+ |
| V-7 | Als Nutzer möchte ich gewarnt werden, wenn eine wiederhergestellte Version Platzhalter enthält, die es in meinen aktuellen Feldern nicht mehr gibt.           | BASIC+ |
| V-8 | Als FREE-Nutzer möchte ich sowohl in der Sidebar als auch im Editor sehen, dass Versionierung existiert und ein Bezahl-Feature ist (statt es komplett versteckt zu bekommen), damit ich den Wert einer Upgrade-Entscheidung beurteilen kann.   | FREE   |
| V-9 | Als BASIC-Nutzer möchte ich verstehen, dass nur die letzten 20 Versionen aufbewahrt werden, damit ich nicht überrascht werde, wenn ältere fehlen.            | BASIC  |

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

### 3.3 Kernprinzip: Version = Snapshot des BISHERIGEN Inhalts, gesichert bevor er überschrieben wird

> Beim Klick auf "Speichern als neue Version" wird zunächst der *bisherige* Text als Sicherungspunkt archiviert, bevor die neue Fassung live geht. Das entspricht dem vertrauten Mental Model von Versionierungswerkzeugen ("bevor ich etwas überschreibe, wird das Alte aufgehoben, damit ich zurück kann") und macht die Funktion zu einem echten Sicherheitsnetz für riskante Änderungen.

`PromptContent.content` bleibt wie bisher die **aktuelle, live editierbare Fassung** und wird bei **jedem** Speichern aktualisiert — unabhängig davon, ob eine Version erzeugt wird. `PromptContentVersion` ist eine vom Nutzer **explizit ausgelöste** Momentaufnahme des Inhalts, der gerade **abgelöst** wird, ausgelöst über den Split-Button im Editor (siehe §5.1):

- Klickt der Nutzer **"Speichern"** → nur `PromptContent.content` wird aktualisiert, **keine** neue Zeile in `PromptContentVersion`. Der bisherige Text ist danach unwiederbringlich überschrieben.
- Klickt der Nutzer **"Speichern als neue Version"** → der **bisherige** Inhalt von `PromptContent.content` (also der Stand *vor* dieser Bearbeitung) wird zuerst als neue `PromptContentVersion`-Zeile archiviert; **danach** wird `PromptContent.content` auf den neuen, gerade eingegebenen Text aktualisiert. Der neue Text selbst erscheint zu diesem Zeitpunkt **nicht** als eigene Version — er ist einfach die "Aktuelle Fassung", bis er seinerseits durch einen weiteren Klick auf "Speichern als neue Version" archiviert wird.
- Praktische Konsequenz: Um eine bestimmte Fassung wirklich in der Historie zu sichern, muss der Nutzer *vor der nächsten* riskanten Änderung auf "Speichern als neue Version" klicken (also gewissermaßen "jetzigen Stand sichern, bevor ich weiter experimentiere") — nicht nachträglich, wenn ihm eine Fassung gefällt. Das ist ein Lernkurven-Aspekt, den Onboarding/Tooltip adressieren sollten (siehe §5.1, Tooltip-Text).
- Das bedeutet auch: Zwischen zwei Versionen kann die "aktuelle" Fassung bereits mehrfach unversioniert verändert worden sein (via einfaches "Speichern"). Das ist weiterhin gewollt — die Historie zeigt bewusst gesetzte Sicherungspunkte, nicht jede Zwischenbearbeitung.

**Restore folgt exakt derselben Regel** — deshalb bietet der Restore-Dialog aktiv an, den aktuellen (um Wiederherstellen abzulösenden) Stand vor dem Überschreiben noch als Version zu sichern (siehe §5.4, V-6). Restore ist technisch **derselbe Vorgang** wie ein normales Speichern mit aktivierter Versionierung, nur dass `content` dabei der Wert der wiederherzustellenden Version ist. Es gibt dadurch **nur eine** Snapshot-Regel im gesamten System (siehe §6.3).

### 3.4 Modell-Regeln & Invarianten

| Regel                                                                                       | Begründung                                                                 |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Version wird **ausschließlich** erzeugt, wenn der Nutzer explizit auf "Speichern als neue Version" klickt (`saveAsVersion = true`) | Kernentscheidung dieser Spec — keine automatische Versionierung bei jedem Save |
| Eine explizit ausgelöste Version wird auch dann erzeugt, wenn sich der Content seit der letzten Version nicht geändert hat | Respektiert die bewusste Nutzerabsicht (z.B. reine Notiz "Für Kunde X final freigegeben" ohne Textänderung); UI zeigt dazu einen informativen, nicht blockierenden Hinweis |
| `versionNumber` ist fortlaufend pro Prompt, beginnend bei 1                                   | Nachvollziehbare Reihenfolge, unabhängig von `createdAt`-Kollisionen        |
| Versions-Insert + Update von `PromptContent.content` laufen in **einer DB-Transaktion**        | Verhindert Inkonsistenz bei Teilausfall (Version gespeichert, Content nicht) |
| `onDelete: Cascade` von `Prompt` auf `PromptContentVersion`                                    | Löschen eines Prompts entfernt vollständig dessen Historie                  |
| FREE-Nutzer sehen das Split-Button-Chevron und den Menüeintrag "Speichern als neue Version", können ihn aber nicht anklicken (`disabled`) | Feature-Discoverability als Upgrade-Anreiz: FREE-Nutzer sollen wissen, dass es Versionsverlauf gibt, statt es komplett zu verstecken. `saveAsVersion` kann dadurch clientseitig ohnehin nicht auf `true` gesetzt werden — serverseitiger Guard bleibt trotzdem als Bypass-Schutz bestehen |
| Das Split-Button-Chevron existiert nur im Bearbeiten-Modus (`isEdit = true`), nicht bei der Neuanlage eines Prompts | Für einen noch nie gespeicherten Prompt gibt es keine sinnvolle "erste Version" zu markieren — die Historie beginnt frühestens beim ersten Edit |

---

## 4. Subscription-Limits

Erweiterung von `TIER_FEATURES` in `src/lib/subscription/access-control.ts`:

```typescript
export type TierFeatures = {
  // ...bestehende Felder...
  canAccessVersionHistory: boolean; // umfasst sowohl "Version erstellen" als auch "ansehen/wiederherstellen"
  maxStoredPromptVersions: number; // -1 = unbegrenzt
};

export const TIER_FEATURES: Record<DSubscriptionTier, TierFeatures> = {
  FREE: {
    // ...
    canAccessVersionHistory: false,
    maxStoredPromptVersions: 0,
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
| Split-Button-Option "Speichern als neue Version" im Editor | 👁 sichtbar, 🔒 deaktiviert (Lock-Icon) |           ✅           |       ✅        |
| Versionsverlauf ansehen                     | 🔒 (Upgrade-CTA)  |           ✅           |       ✅        |
| Version wiederherstellen                    | 🔒 (Upgrade-CTA)  |           ✅           |       ✅        |
| Aufbewahrte Versionen pro Prompt            |         —         | max. **20** (rotierend) | ✅ unbegrenzt   |
| Änderungsnotiz erfassen                     | 🔒 (nicht sichtbar) |           ✅           |       ✅        |

**Enforcement:**

- Da FREE-Nutzer die Versionierungs-Option im UI gar nicht sehen, ist ein serverseitiger Guard trotzdem zwingend (Bypass-Schutz): `updatePrompt` ignoriert `saveAsVersion: true` serverseitig bei FREE-Tier (kein Fehler, aber kein Snapshot — analog zu "silently ignored" bei nicht verfügbaren Features) **oder** wirft `SubscriptionAccessError`, falls `saveAsVersion` explizit per API-Bypass gesendet wird. Empfehlung: harter Fehler (`VERSION_HISTORY_UPGRADE_REQUIRED`), damit kein stiller Datenverlust der Nutzerabsicht entsteht und die Upgrade-Notwendigkeit klar kommuniziert wird.
- `getPromptVersions()` / `getPromptVersion()` / `restorePromptVersion()` prüfen `canAccessFeature(tier, "canAccessVersionHistory")`; bei FREE liefert die Liste nur `{ locked: true }`, da FREE-Nutzer grundsätzlich keine Versionen erzeugen können.
- Rotation (BASIC, max. 20): Nach jedem expliziten Versions-Insert prüft der Service die Anzahl vorhandener Versionen für den Prompt; bei > 20 werden die ältesten (niedrigste `versionNumber`) über das Limit hinaus gelöscht.

---

## 5. UI — Editor-Integration

### 5.1 "Speichern als neue Version" als Split-Button-Option von "Speichern"

**Dateien:** `src/components/prompts/detail/edit/prompt-edit.tsx` (Buttons), `src/components/prompts/detail/edit/form/prompt-form.tsx` (Submit-Logik), `src/components/prompts/detail/edit/form/sections/prompt-text.tsx` (optionale Notiz)

"Speichern als neue Version" ist keine gleichrangige eigene Schaltfläche, sondern eine **Split-Button-Option** des bestehenden "Speichern"-Buttons — sowohl im Desktop-Header als auch im Mobile-Footer von `prompt-edit.tsx` (dort werden `cancelBtn()`/`submitBtn()` bereits heute dupliziert gerendert, siehe bestehende `actions()`-Funktion):

```
[Abbrechen]   [ Speichern | ▾ ]
                            └─ Speichern als neue Version
```

- Der Split-Button besteht aus zwei zusammenhängenden Segmenten: links das breite, primäre Segment **"Speichern"** (unverändertes Verhalten, erzeugt keine Version), rechts ein schmales Chevron-Segment, das ein Dropdown-Menü (`DropdownMenu`/`DropdownMenuTrigger`/`DropdownMenuContent`, bestehendes shadcn/Radix-Muster wie z.B. in `prompt-more-options-button.tsx`) mit genau einem Eintrag öffnet: **"Speichern als neue Version"**.
- Klick auf das primäre Segment ("Speichern") speichert wie gehabt, ohne Version.
- Klick auf den Menüeintrag "Speichern als neue Version" archiviert zuerst den **bisherigen** Content als neue `PromptContentVersion` und speichert **danach** den Prompt inkl. des neuen, gerade eingegebenen Contents (Regel siehe §3.3). Hilfetext im Menüeintrag (`DropdownMenuItem`, kleine sekundäre Zeile oder Tooltip): _"Sichert deinen aktuellen Stand in der Versionshistorie, bevor deine Änderung gespeichert wird."_
- **Technische Umsetzung:** Das primäre Segment bleibt ein natives `<button type="submit" form={formId} name="intent" value="normal">`, identisch zum bisherigen `submitBtn()`-Muster (HTML-`form`-Attribut, kein Zugriff auf die React-Hook-Form-Instanz von `prompt-edit.tsx` aus nötig). Der Menüeintrag im Dropdown ist kein natives Submit-Element; sein `onSelect`-Handler löst stattdessen einen Klick auf ein zweites, visuell verstecktes (`className="hidden"`, per Ref referenziertes) `<button type="submit" form={formId} name="intent" value="version">` aus. Beide Buttons hängen am selben `<form id={formId}>` und lösen dieselbe Formularvalidierung aus — es gibt weiterhin nur **ein** Formular.
- **Unterscheidung im `onSubmit`-Handler** (`prompt-form.tsx`): React Hook Forms `handleSubmit(onSubmit)` reicht das native Submit-Event durch; `event.nativeEvent.submitter` (Standard-DOM-API) identifiziert anhand des `name`/`value`-Attributs (`value="version"` vs. `value="normal"`), welcher der beiden Submit-Elemente den Submit ausgelöst hat. Daraus wird `saveAsVersion: boolean` abgeleitet und **getrennt von den Formulardaten** als dritter Parameter übergeben: `updatePrompt(id, data, { saveAsVersion, versionNote })` — `data` (das RHF-Formularobjekt, `DPromptUpdate`) enthält `saveAsVersion`/`versionNote` zu keinem Zeitpunkt.
- **Notizfeld:** Unterhalb des bestehenden `FormMDEditor` (Feld `content`) in `prompt-text.tsx` bleibt ein optionales, eingeklapptes Feld erhalten (`+ Notiz hinzufügen`, Feld `versionNote`, max. 500 Zeichen), unabhängig vom Split-Button immer sichtbar/befüllbar. Der Wert wird nur ausgewertet, wenn tatsächlich über den Menüeintrag "Speichern als neue Version" gespeichert wurde.
- **Sichtbarkeit — Create-Modus:** Das Chevron-Segment wird nur gerendert, wenn `isEdit === true` (kein Sinn bei Neuanlage, siehe §3.4). Im Create-Modus (`/prompts/new`) reduziert sich der Split-Button für **alle** Tiers auf einen einzelnen, regulären "Prompt erstellen"-Button ohne Chevron.
- **Sichtbarkeit — FREE-Tier:** Im Bearbeiten-Modus wird das Chevron-Segment für **alle** Tiers gerendert, also auch für FREE — das Feature soll sichtbar/discoverable sein, nicht komplett versteckt. Für FREE ist der Menüeintrag "Speichern als neue Version" jedoch `disabled` (kein `onSelect`, keine Wirkung bei Klick), zusätzlich mit einem `Lock`-Icon (lucide-react) markiert. Ein Tooltip bzw. eine kleine sekundäre Zeile im Menüeintrag erklärt: _"Ab BASIC verfügbar"_ + optional Link zu `/subscription/pricing`. Implementierungshinweis: Radix' `data-disabled`-Styling setzt i.d.R. `pointer-events: none` auf das `DropdownMenuItem` selbst — für einen funktionierenden Hover-Tooltip auf einem disabled Item muss der Tooltip-Trigger auf einem umschließenden `<span>` mit eigenem `pointer-events: auto` sitzen (bekanntes Radix-Muster für "disabled with tooltip").
- **Ladezustand:** Der gesamte Split-Button wird während `isSubmitting` deaktiviert (bestehendes Verhalten von `submitBtn()`). Das primäre Segment zeigt weiterhin "Wird gespeichert..." unabhängig davon, welches der beiden Segmente den Submit ausgelöst hat — UI-Detail ohne Produktauswirkung, dem Entwickler überlassen.

### 5.2 Einstiegspunkt: Sidebar-Button "Versionsverlauf"

**Datei:** `src/components/prompts/detail/view/sidebar/prompt-sidebar.tsx`

Neuer Button analog zu `EditPromptButton`/`DownloadPromptButton`:

```tsx
<VersionHistoryButton prompt={prompt} />
```

Position: zwischen `EditPromptButton` und `DownloadPromptButton`. Zeigt Badge mit Versionsanzahl, wenn > 0 (z.B. "Versionsverlauf · 4").

**FREE-Zustand:** Button bleibt sichtbar (konsistent mit dem sichtbaren, aber deaktivierten Split-Button-Chevron im Editor, siehe §5.1), öffnet aber ein Upgrade-Prompt: _"Versionsverlauf ist ab BASIC verfügbar. Speichere bewusste Checkpoints deines Prompt-Texts und kehre jederzeit zu einer früheren Fassung zurück."_ + CTA-Button zu `/subscription/pricing`.

### 5.3 Versionsverlauf-Panel (Sheet)

**Neue Komponente:** `src/components/prompts/detail/versioning/version-history-sheet.tsx`

Layout (Sheet von rechts, analog zu bestehenden Radix/shadcn-Sheet-Patterns im Projekt):

```
┌─────────────────────────────────────────┐
│  Versionsverlauf                    [✕]  │
├─────────────────────────────────────────┤
│  ● Aktuelle Fassung                      │
│    zuletzt bearbeitet vor 2 Stunden      │
│    (ggf. neuer als die letzte Version)   │
│                                           │
│  ○ Version 4 · vor 2 Tagen               │
│    "Ton auf 'locker' angepasst"          │
│    [Ansehen]  [Wiederherstellen]         │
│                                           │
│  ○ Version 3 · vor 1 Woche               │
│    (keine Notiz)                         │
│    [Ansehen]  [Wiederherstellen]         │
│                                           │
│  ...                                     │
│                                           │
│  [Weitere laden]  (falls > 1 Seite)      │
└─────────────────────────────────────────┘
```

- Jeder Eintrag zeigt: relative Zeitangabe (date-fns v4, wie im übrigen Projekt üblich), Notiz (falls vorhanden, sonst `"(keine Notiz)"` in `text-muted-foreground`).
- Hinweistext unter "Aktuelle Fassung", wenn seit der letzten Version unversionierte Änderungen gespeichert wurden: _"Seit Version 4 wurden Änderungen gespeichert, die nicht als eigene Version markiert sind."_ — macht das explizite Modell transparent und erinnert an die Option aus §5.1.
- **"Ansehen":** öffnet den Inhalt dieser Version read-only (z.B. in einem zweiten, überlagernden Panel oder Accordion-Expand direkt in der Liste) — via `MDRenderer`, identisch zur Darstellung im `PromptForm`-View-Modus.
- **"Wiederherstellen":** löst Bestätigungsdialog aus (§5.4).
- BASIC-Hinweis am Fuß der Liste, wenn Gesamtzahl ≥ 15: _"Es werden nur die letzten 20 Versionen aufbewahrt. Upgrade auf PRO für unbegrenzte Historie."_

### 5.4 Wiederherstellen-Flow

```
Klick "Wiederherstellen" auf Version 3
  → Bestätigungsdialog:
     "Version 3 wiederherstellen?"

     ☑ Aktuelle Fassung vorher als neue Version sichern
        (empfohlen — sonst gehen seit der letzten Version gespeicherte,
         unversionierte Änderungen unwiderruflich verloren)

     [Abbrechen]  [Wiederherstellen]

  → Server Action restorePromptVersion(promptId, versionId, { keepCurrentAsVersion: boolean })
  → Bei Erfolg: Sheet schließt, Toast "Version 3 wiederhergestellt",
    Editor/View lädt aktualisierten Content
```

- Checkbox **"Aktuelle Fassung vorher als neue Version sichern"** ist **standardmäßig aktiviert** (einziger Ort in dieser Spec, an dem eine Versionierungs-Option vorausgewählt ist) — das ist die einzige Stelle, an der tatsächlicher, unwiderruflicher Datenverlust droht (die "aktuelle, unversionierte" Fassung existiert sonst nirgends). Der Nutzer kann bewusst abwählen, wenn er die aktuelle Fassung für irrelevant hält.
- Wird die Checkbox aktiv gelassen, entsteht dieselbe Art Versions-Zeile wie beim Klick auf "Speichern als neue Version" im Editor (§3.3/§5.1) — der Restore-Dialog ist lediglich ein zweiter Aufrufer derselben zugrundeliegenden Regel ("bisherigen Content sichern, bevor er überschrieben wird"), nur mit einer System-Notiz (`"Automatisch gesichert vor Wiederherstellen von Version 3"`), falls der Nutzer keine eigene Notiz einträgt.

**Variablen-Mismatch-Warnung (V-7):** Nach erfolgreichem Restore (oder bereits im Bestätigungsdialog, client-seitig) wird die wiederherzustellende `content`-Fassung durch die bereits vorhandene Utility `extractVariablesFromContent` (`src/components/prompts/detail/edit/form/utils/variables.ts`) gejagt und mit den aktuellen `PromptField`/`GlobalPromptField`-Namen abgeglichen (dieselbe Logik wie `resolveVariableStatus` in `src/components/prompts/detail/edit/form/tabs/utils.ts`, bereits produktiv im "Platzhalter"-Tab für neu erkannte Variablen). Ergebnis wird als Warn-Box im Bestätigungsdialog angezeigt, **blockiert aber nicht**:

```
⚠ Diese Version enthält Platzhalter, die aktuell nicht als Felder definiert
  sind: {{alte_variable}}. Diese werden nach dem Wiederherstellen im
  "Platzhalter"-Tab als neu erkannt angezeigt.
```

---

## 6. Server Actions, Services & Repositories

### 6.1 Server Actions (`src/data/actions/prompt/prompt.user.actions.ts`)

| Action                                                          | Beschreibung                                                                                       |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `getPromptVersions(promptId, query)`                             | Paginierte Liste (`Page<DPromptVersion>`). Bei FREE: `{ locked: true }` ohne Inhalte.                 |
| `getPromptVersion(promptId, versionId)`                          | Einzelne Version inkl. `content`, für "Ansehen". Ownership-Check. Gated hinter `canAccessVersionHistory`. |
| `restorePromptVersion(promptId, versionId, { keepCurrentAsVersion })` | Übernimmt `version.content` als neuen `PromptContent.content`. Sichert optional (Default: ja) die aktuelle Fassung vorher als neue Version. Gated hinter `canAccessVersionHistory`. |

`updatePrompt(descriptorId, data)` (bestehende Action) wird um einen **dritten, optionalen Parameter** `versionOptions` erweitert — `saveAsVersion` und `versionNote` sind bewusst **nicht** Teil von `data: DPromptUpdate`. `DPromptUpdate` beschreibt ausschließlich die editierbaren Felder des Prompts (Titel, Beschreibung, Content, Felder, …); ob und wie dieser Save zusätzlich einen Versions-Snapshot auslöst, ist eine Verhaltensoption des Aufrufs, kein Attribut des Prompts selbst — beide sollten daher nicht im selben Objekt vermischt werden:

```typescript
updatePrompt(
  descriptorId: string,
  data: DPromptUpdate,
  versionOptions?: DPromptUpdateOptions
): Promise<ActionResult>
```

### 6.2 Service (`src/data/services/prompt/prompt.user.service.ts`)

```typescript
async updatePrompt(
  userId: string,
  descriptorId: string,
  data: DPromptUpdate,
  versionOptions?: DPromptUpdateOptions
) {
  const prompt = await this.getPrompt(userId, descriptorId);
  if (!prompt) throw new Error("TemplateDescriptor not found");

  if (versionOptions?.saveAsVersion) {
    const tier = await this.subscriptionService.getUserTier(userId);
    if (!canAccessFeature(tier, "canAccessVersionHistory")) {
      throw new SubscriptionAccessError(
        "Versionierung ist ab BASIC verfügbar.",
        "canAccessVersionHistory"
      );
    }
  }

  await this.repository.pUpdatePromptWithVersioning(userId, descriptorId, data, versionOptions);
}

async restorePromptVersion(
  userId: string,
  promptId: string,
  versionId: string,
  keepCurrentAsVersion: boolean = true
) {
  const tier = await this.subscriptionService.getUserTier(userId);
  if (!canAccessFeature(tier, "canAccessVersionHistory")) {
    throw new SubscriptionAccessError(
      "Versionsverlauf ist ab BASIC verfügbar.",
      "canAccessVersionHistory"
    );
  }

  const version = await this.repository.pGetPromptVersion(userId, promptId, versionId);
  if (!version) throw new Error("Version not found");

  // Läuft durch exakt dieselbe Speicher-Pipeline wie ein normales Speichern mit
  // "Speichern als neue Version" — pUpdatePromptWithVersioning sichert IMMER den
  // bisherigen Content, bevor der neue (hier: version.content) geschrieben wird.
  // Kein Sonderfall nötig, siehe §6.3.
  await this.repository.pUpdatePromptWithVersioning(
    userId,
    promptId,
    { content: version.content } as Partial<DPromptUpdate>,
    {
      saveAsVersion: keepCurrentAsVersion,
      versionNote: keepCurrentAsVersion
        ? `Automatisch gesichert vor Wiederherstellen von Version ${version.versionNumber}`
        : undefined,
    }
  );
}
```

> **Wichtig:** Beim Restore wird die Version **vor** dem Überschreiben aus der aktuellen `PromptContent.content` gebildet (nicht aus `version.content`!) — die Reihenfolge in `pUpdatePromptWithVersioning` (§6.3) sorgt dafür automatisch: Sie liest immer zuerst den bisherigen Content und sichert genau diesen, bevor der übergebene neue Content (`data.content`, hier = `version.content`) geschrieben wird. Das gilt identisch für den normalen Editor-Save.

### 6.3 Repository (`src/data/repositories/prompt/prompt.user.repository.ts`)

`pUpdatePrompt` wird zu `pUpdatePromptWithVersioning` erweitert und übernimmt dasselbe Prinzip: `data` bleibt reine Content-/Feld-Nutzlast, die Versionierungs-Steuerung ist ein eigener Parameter.

```typescript
async pUpdatePromptWithVersioning(
  userId: string,
  descriptorId: string,
  data: DPromptUpdate,
  versionOptions?: DPromptUpdateOptions
) {
  return this.prisma.$transaction(async (tx) => {
    if (versionOptions?.saveAsVersion) {
      // Immer der BISHERIGE Content wird zur Version — unabhängig davon, ob der
      // Aufruf vom normalen Editor-Save oder von restorePromptVersion() kommt.
      // Dadurch entfällt jede Sonderfall-Unterscheidung: eine einzige Regel für
      // beide Aufrufer (siehe §3.3).
      const current = await tx.promptContent.findUnique({
        where: { promptId: descriptorId },
      });

      const lastVersion = await tx.promptContentVersion.findFirst({
        where: { promptId: descriptorId },
        orderBy: { versionNumber: "desc" },
      });
      const nextVersionNumber = (lastVersion?.versionNumber ?? 0) + 1;

      await tx.promptContentVersion.create({
        data: {
          promptId: descriptorId,
          versionNumber: nextVersionNumber,
          content: current!.content, // der Stand VOR dieser Änderung
          note: versionOptions.versionNote || null,
        },
      });

      await this.rotateVersionsIfNeeded(tx, userId, descriptorId);
    }

    // ... bestehendes Update von title/description/model/categories/fields/globalFields ...

    return tx.prompt.update({
      where: { id: descriptorId },
      data: {
        /* ...bestehende Felder..., */
        content: { update: { content: data.content } }, // der NEUE Content wird live gesetzt
      },
    });
  });
}
```

> Da immer der bisherige Content gesichert wird, braucht `pUpdatePromptWithVersioning` keine Unterscheidung danach, ob der Aufruf vom Editor-Save oder von `restorePromptVersion()` (§6.2) kommt — Letzteres ruft dieselbe Methode einfach mit `data = { content: version.content }` auf.

### 6.4 Service-Invarianten

| Regel                                                                              | Error-Code                          |
| ------------------------------------------------------------------------------------ | -------------------------------------- |
| Jede Version-Action prüft `prompt.userId === session.user.id`                       | `403 Forbidden`                       |
| `saveAsVersion: true` bei FREE (egal ob im Editor-Save oder Restore)                 | `VERSION_HISTORY_UPGRADE_REQUIRED`     |
| `getPromptVersion`/`restorePromptVersion` bei FREE                                   | `VERSION_HISTORY_UPGRADE_REQUIRED`     |
| Versions-Insert + Content-Update laufen atomar (`$transaction`)                     | Rollback bei Fehler                    |

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

export type DPromptVersionSummary = Omit<DPromptVersion, "content">; // für Listenansicht ohne Volltext

export type DPromptVersionsResult =
  | { locked: true } // FREE
  | { locked: false; page: Page<DPromptVersionSummary>; hasUnversionedChanges: boolean }; // BASIC/PRO

// DPromptUpdateOptions ist bewusst GETRENNT von DPromptUpdate (siehe §12 für das
// zugehörige Zod-Schema promptVersionOptionsSchema, aus dem dieser Typ abgeleitet wird).
// DPromptUpdate bildet ausschließlich die editierbaren Prompt-Felder ab (Titel,
// Beschreibung, Content, Fields, ...); ob ein Save zusätzlich einen Versions-Snapshot
// auslöst, ist keine Eigenschaft des Prompts, sondern eine Verhaltensoption des
// jeweiligen Funktionsaufrufs. DPromptUpdate/updatePromptSchema bleiben dadurch
// unverändert von diesem Feature.
export type DPromptUpdateOptions = z.infer<typeof promptVersionOptionsSchema>;
```

`hasUnversionedChanges` speist den Hinweistext aus §5.3 ("Seit Version 4 wurden Änderungen gespeichert, die nicht als eigene Version markiert sind") — Ableitung: `PromptContent.updatedAt` (sofern vorhanden) bzw. Vergleich von `PromptContent.content` mit `content` der neuesten `PromptContentVersion`.

> **Hinweis:** `PromptContent` hat aktuell kein `updatedAt`-Feld (siehe `prisma/schema.prisma`, Zeilen 124–131) — für einen exakten Zeitstempel der letzten unversionierten Änderung müsste `PromptContent` um `updatedAt DateTime @updatedAt` ergänzt werden. Alternativ genügt für die MVP-Anzeige ein reiner String-Vergleich (`content !== letzteVersion.content`) ohne Zeitstempel-Anspruch — siehe §14.

---

## 8. Acceptance Criteria

### AC-1: Normales Speichern erzeugt keine Version (Standardverhalten)

```
Given:  Prompt existiert mit content = "Text A"
  And:  Nutzer ist BASIC oder PRO
When:   Nutzer ändert content auf "Text B" und klickt den Button "Speichern"
Then:   PromptContent.content ist jetzt "Text B"
  And:  Keine neue PromptContentVersion wird erzeugt
```

### AC-2: Explizite Versionierung über Split-Button-Option — der BISHERIGE Text wird zur Version

```
Given:  Prompt existiert mit content = "Text A"
  And:  Nutzer ist BASIC oder PRO
When:   Nutzer ändert content auf "Text B", öffnet das Split-Button-Dropdown
        und wählt "Speichern als neue Version"
Then:   PromptContent.content ist jetzt "Text B" (der neue, live editierte Text)
  And:  Eine neue PromptContentVersion wird erzeugt mit content = "Text A"
        (der BISHERIGE Text, nicht "Text B"), versionNumber = 1
  And:  "Text B" erscheint im Versionsverlauf-Sheet als "Aktuelle Fassung",
        nicht als eigene nummerierte Version
```

### AC-3: Änderungsnotiz wird an die archivierte (bisherige) Version gehängt

```
Given:  Nutzer ist BASIC oder PRO, Prompt hat content = "Text A"
When:   Nutzer ändert den Text, öffnet "+ Notiz hinzufügen", trägt
        "Vor Ton-Anpassung gesichert" ein, wählt im Split-Button-Dropdown
        "Speichern als neue Version"
Then:   Die neu erzeugte PromptContentVersion (mit content = "Text A") hat
        note = "Vor Ton-Anpassung gesichert"
```

### AC-4: Version ohne inhaltliche Änderung wird trotzdem erzeugt

```
Given:  Prompt existiert mit content = "Text A", letzte Version (Nr. 3) hat ebenfalls
        content = "Text A"
When:   Nutzer trägt Notiz "Für Kunde final freigegeben" ein (ohne den Text zu ändern)
        und wählt im Split-Button-Dropdown "Speichern als neue Version"
Then:   Eine neue PromptContentVersion (Nr. 4) wird erzeugt mit content = "Text A"
        (identisch zum bisherigen und zum weiterhin unveränderten aktuellen Stand)
        und note = "Für Kunde final freigegeben"
```

### AC-4b: Notiz ohne Auswahl von "Speichern als neue Version" bleibt wirkungslos

```
Given:  Nutzer hat im optionalen Notizfeld "Ton angepasst" eingetragen
When:   Nutzer klickt stattdessen das primäre Split-Button-Segment "Speichern"
Then:   PromptContent.content wird aktualisiert
  And:  Keine PromptContentVersion wird erzeugt, die Notiz wird nirgends gespeichert
```

### AC-5: Split-Button-Chevron für FREE sichtbar, aber Option deaktiviert

```
Given:  Nutzer ist FREE
When:   Nutzer öffnet den Prompt-Editor (Bearbeiten-Modus)
Then:   Der Split-Button wird inkl. Chevron gerendert (identisch zu BASIC/PRO)
  And:  Öffnet der Nutzer das Dropdown, ist der Eintrag "Speichern als neue Version"
        sichtbar, mit Lock-Icon markiert und als disabled dargestellt
  And:  Ein Klick auf den Eintrag löst keinen Submit aus und hat keine Wirkung
  And:  Hover über den Eintrag zeigt einen Tooltip/Hinweis "Ab BASIC verfügbar"
```

### AC-5b: Split-Button-Chevron im Create-Modus nicht sichtbar

```
Given:  Nutzer ist BASIC oder PRO
When:   Nutzer öffnet den Editor für einen neuen Prompt (/prompts/new)
Then:   Nur ein regulärer Button "Prompt erstellen" wird gerendert, ohne Chevron/Dropdown
```

### AC-6: Versionierungs-Bypass bei FREE serverseitig blockiert

```
Given:  Nutzer ist FREE
When:   Nutzer ruft die Server Action updatePrompt(id, data, { saveAsVersion: true })
        direkt auf (API-Bypass, versionOptions als dritter Parameter manipuliert)
Then:   Server antwortet mit Error VERSION_HISTORY_UPGRADE_REQUIRED
  And:  Content wird NICHT gespeichert (gesamte Transaktion schlägt fehl)
```

### AC-7: Versionsverlauf ansehen (BASIC/PRO)

```
Given:  Prompt hat 3 gespeicherte Versionen
  And:  Nutzer ist BASIC oder PRO
When:   Nutzer klickt "Versionsverlauf" in der Sidebar
Then:   Sheet öffnet sich mit "Aktuelle Fassung" + 3 historischen Einträgen (neueste zuerst)
  And:  Jeder Eintrag zeigt Zeitpunkt und Notiz (oder "(keine Notiz)")
```

### AC-8: Versionsverlauf gesperrt (FREE)

```
Given:  Nutzer ist FREE
When:   Nutzer klickt "Versionsverlauf" in der Sidebar
Then:   Upgrade-Hinweis wird angezeigt: "Versionsverlauf ist ab BASIC verfügbar..."
  And:  Kein Versionsinhalt wird an den Client übertragen
```

### AC-9: Version wiederherstellen mit Sicherung der aktuellen Fassung (Default)

```
Given:  Prompt hat aktuellen content = "Text C" (unversioniert seit Version 2)
  And:  Version 2 mit content = "Text B" existiert
  And:  Nutzer ist BASIC oder PRO
When:   Nutzer klickt "Wiederherstellen" bei Version 2, lässt die Checkbox
        "Aktuelle Fassung vorher sichern" aktiviert, bestätigt
Then:   Eine neue PromptContentVersion (Nr. 3) wird erzeugt mit content = "Text C"
        und einer automatischen Notiz
  And:  PromptContent.content wird zu "Text B"
  And:  Toast "Version 2 wiederhergestellt" erscheint
```

### AC-10: Version wiederherstellen ohne Sicherung der aktuellen Fassung

```
Given:  Prompt hat aktuellen content = "Text C" (unversioniert)
  And:  Version 2 mit content = "Text B" existiert
When:   Nutzer klickt "Wiederherstellen" bei Version 2, deaktiviert die Checkbox
        "Aktuelle Fassung vorher sichern", bestätigt
Then:   PromptContent.content wird zu "Text B"
  And:  KEINE neue PromptContentVersion wird erzeugt
  And:  "Text C" ist ab sofort unwiederbringlich verloren (keine Warnung mehr nötig,
        da bereits im Dialog kommuniziert)
```

### AC-11: Wiederherstellen bei FREE blockiert

```
Given:  Nutzer ist FREE
When:   Nutzer versucht restorePromptVersion(...) direkt aufzurufen (API-Bypass)
Then:   Server antwortet mit Error VERSION_HISTORY_UPGRADE_REQUIRED, upgradeRequired: true
```

### AC-12: Variablen-Mismatch-Warnung beim Restore

```
Given:  Version 2 enthält "{{alte_variable}}" im Text
  And:  Aktuelle PromptFields enthalten kein Feld "alte_variable"
When:   Nutzer öffnet den Bestätigungsdialog für "Wiederherstellen" von Version 2
Then:   Warn-Box zeigt: "Diese Version enthält Platzhalter, die aktuell nicht als
        Felder definiert sind: {{alte_variable}}"
  And:  "Wiederherstellen"-Button bleibt trotzdem aktiv (nicht blockierend)
```

### AC-13: BASIC-Rotation bei 20 Versionen

```
Given:  Nutzer ist BASIC, Prompt hat bereits 20 gespeicherte Versionen
When:   Nutzer erstellt (explizit) eine 21. Version
Then:   Die älteste Version (versionNumber = 1) wird automatisch gelöscht
  And:  Es existieren weiterhin genau 20 Versionen
```

### AC-14: Kein Rotation-Limit bei PRO

```
Given:  Nutzer ist PRO, Prompt hat 50 gespeicherte Versionen
When:   Nutzer erstellt (explizit) eine 51. Version
Then:   Keine Version wird gelöscht
```

---

## 9. Edge Cases & Fehler-Zustände

| Situation                                                                 | Verhalten                                                                                                     |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Prompt wird gelöscht                                                        | `onDelete: Cascade` — alle `PromptContentVersion`-Zeilen werden mitgelöscht                                    |
| Nutzer klickt "Speichern als neue Version", der (bisherige) Content ist identisch zur letzten Version | Version wird trotzdem erzeugt (siehe AC-4) — respektiert explizite Nutzerabsicht, kein Dedup-Block            |
| Nutzer restored eine Version, deren `content` identisch zur aktuellen Fassung ist | Restore läuft trotzdem durch; optionale Sicherung erzeugt ggf. eine inhaltlich identische neue Version — kein Sonderfall nötig |
| Zwei Browser-Tabs speichern gleichzeitig, beide mit `saveAsVersion: true`   | Last-write-wins auf `PromptContent`; beide Saves erzeugen jeweils einen eigenen, korrekten Versions-Snapshot (Transaktion verhindert Nummern-Kollision) |
| Nutzer speichert mehrfach unversioniert (Text A → B → C via "Speichern"), dann einmal mit "Speichern als neue Version" (→ Text D) | Nur der letzte unversionierte Stand direkt vor dem Versionierungs-Klick ("Text C") wird zur Version — die dazwischenliegenden Stände (A, B) sind nicht einzeln rekonstruierbar (bewusste Design-Konsequenz des expliziten Modells, siehe §3.3) |
| Prompt wird über Workflow-Step (`PROMPT_REF`) referenziert und Content per Restore geändert | Workflow-Runner liest `content` live (`getPromptGenerationData`) — Restore wirkt sich sofort auf laufende/künftige Workflow-Ausführungen aus. Kein Blocker, aber dokumentierter Hinweis (siehe §13) |
| Prompt ist Teil eines gekauften Marketplace-Produkts (`ProductItem`)        | `ProductItem.templateId` verweist live auf den Prompt — Käufer sehen nach einem Restore ebenfalls die wiederhergestellte Fassung. Kein Snapshot-Mechanismus für Marketplace-Käufe vorhanden (siehe offene Frage §13) |
| BASIC-Nutzer upgradet auf PRO nach Rotation                                 | Bereits rotierte (gelöschte) Versionen sind nicht wiederherstellbar — nur ab dem Upgrade-Zeitpunkt wächst die Historie unbegrenzt weiter |
| FREE-Nutzer upgradet auf BASIC/PRO                                          | Keine rückwirkende Historie vorhanden (da FREE nie Versionen erzeugen konnte) — Historie beginnt bei der ersten expliziten Versionierung nach dem Upgrade |
| `getPromptVersion` für gelöschte/fremde Version aufgerufen                  | 404 / Ownership-Error, analog zu bestehenden Prompt-Actions                                                    |
| Nutzer wählt "Speichern als neue Version" bei einem invaliden Formular (z.B. Pflichtfeld leer) | Wie beim regulären "Speichern": Formularvalidierung greift zuerst (HTML-`form`-Attribut-Bindung löst dieselbe RHF-Validierung aus), Submit wird verhindert, keine Version erzeugt |
| Dropdown-Menü des Split-Buttons ist geöffnet, Nutzer klickt außerhalb | Menü schließt sich (Standard-`DropdownMenu`-Verhalten), kein Submit wird ausgelöst |
| FREE-Nutzer navigiert per Tastatur zum disabled Menüeintrag "Speichern als neue Version" | Fokussierbar bleiben (nicht `tabIndex={-1}`), aber `Enter`/`Space` lösen keinen Submit aus; Tooltip-Inhalt muss auch per Tastaturfokus (nicht nur Hover) erreichbar sein (Barrierefreiheit) |

---

## 10. Implementierungs-Reihenfolge

1. **Prisma-Schema:** `PromptContentVersion`-Modell + Relation auf `Prompt`, Migration, Client generieren
2. **Domain Types:** `DPromptVersion`, `DPromptVersionsResult`, `DPromptUpdateOptions` (eigenes, von `DPromptUpdate`/`updatePromptSchema` getrenntes Schema `promptVersionOptionsSchema`, siehe §12) — `updatePromptSchema` bleibt unverändert
3. **Tier-Konfiguration:** `TIER_FEATURES` um `canAccessVersionHistory` + `maxStoredPromptVersions` erweitern (inkl. Tests in `access-control.test.ts`)
4. **Repository:** `pUpdatePromptWithVersioning(userId, descriptorId, data, versionOptions?)` (Transaktion, explizites Insert nur bei `versionOptions?.saveAsVersion`, Rotation), `pGetPromptVersions`, `pGetPromptVersion`
5. **Service:** `updatePrompt` um dritten Parameter `versionOptions?: DPromptUpdateOptions` + Tier-Gate ergänzen, `restorePromptVersion` mit Tier-Gate + `keepCurrentAsVersion`-Logik
6. **Server Actions:** `getPromptVersions`, `getPromptVersion`, `restorePromptVersion`
7. **UI — Editor:** Split-Button "Speichern" (primäres Segment) mit Dropdown-Option "Speichern als neue Version" in `prompt-edit.tsx` (Header + Mobile-Footer), verstecktes zweites Submit-Element + submitter-basierte Unterscheidung im `onSubmit`-Handler von `prompt-form.tsx`, optionale Notiz in `prompt-text.tsx`; Chevron im Create-Modus für alle Tiers ausgeblendet, im Edit-Modus für FREE sichtbar aber mit disabled Menüeintrag (Lock-Icon + Tooltip)
8. **UI — Sidebar & Sheet:** `VersionHistoryButton`, `version-history-sheet.tsx`, Ansehen-/Wiederherstellen-Flow (inkl. Checkbox "Aktuelle Fassung sichern"), Variablen-Mismatch-Warnung
9. **Unit- und Integrationstests:** Repository (kein Insert ohne `saveAsVersion`, Rotation), Service (Tier-Gates), Actions, Komponenten (Sheet-States: leer, gesperrt, mit Einträgen; Split-Button-Chevron sichtbar/ausgeblendet je Tier und Modus; korrekte `submitter`-Erkennung bei beiden Submit-Elementen)

---

## 11. MVP vs. Full Vision

| Bereich                        | MVP (diese Spezifikation)                                     | Full Vision                                                                 |
| -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Versionierter Umfang             | Nur `PromptContent.content`                                       | Auch Titel, Beschreibung, Felder (`PromptField`) versioniert                    |
| Auslöser                         | Split-Button-Option "Speichern als neue Version" (sichert bisherigen Content) | Zusätzlich: automatische "Zwischenspeicherung" alle X Minuten als optionale, separat abschaltbare Einstellung für Power-User |
| "Seit letzter Version geändert"-Hinweis | Einfacher String-Vergleich (kein exakter Zeitstempel, da `PromptContent` aktuell kein `updatedAt` besitzt) | `PromptContent.updatedAt` ergänzen für exakte Zeitangabe im Hinweistext          |
| Vergleich                        | Einzelne Version ansehen (Volltext)                               | Side-by-side-Diff mit Zeilen-Highlighting (z.B. via `diff`-Library)             |
| Restore-Auswirkung auf Marketplace/Workflows | Kein Snapshot zum Kaufzeitpunkt, live-Referenz (dokumentierter Edge Case) | Kaufzeitpunkt-Snapshot für Marketplace-Produkte; Versions-Pinning in Workflow-Steps |
| Rotation                         | Hartes Limit bei BASIC (20), kein manuelles Pinning                | Nutzer kann einzelne Versionen vor Rotation schützen ("anpinnen")               |
| Sharing                          | Historie ist privat, nicht Teil von Collection-Sharing-Tokens      | Öffentliche Collection-Viewer könnten (optional) Versionsverlauf einsehen        |

---

## 12. Zod-Schema-Ergänzung (Referenz)

**Datei:** `src/data/types/validators/prompt.ts`

`updatePromptSchema` (und damit `DPromptUpdate`) bleibt **unverändert** — dieses Feature fügt dort keine Felder hinzu. Stattdessen ein eigenes, kleines Schema für die Versionierungs-Steuerung:

```typescript
export const promptVersionOptionsSchema = z.object({
  saveAsVersion: z.boolean().default(false),
  versionNote: z.string().max(500).optional(),
});

export type DPromptUpdateOptions = z.infer<typeof promptVersionOptionsSchema>;
```

Wird in der Server Action `updatePrompt(descriptorId, data, versionOptions)` unabhängig von `updatePromptSchema` validiert (z.B. `promptVersionOptionsSchema.optional().parse(versionOptions)`).

---

## 13. Offene Fragen (zur Entscheidung, nicht vorweggenommen)

| #   | Frage                                                                                             | Empfehlung (unverbindlich)                                                                                       |
| --- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | Soll der disabled Menüeintrag "Speichern als neue Version" bei Klick (statt komplett wirkungslos zu sein) einen Upgrade-Hinweis/Toast auslösen, statt sich nur per Tooltip beim Hover zu erklären? | Für MVP wie spezifiziert: rein disabled + Tooltip, kein Klick-Handler. Ein klickbarer Upgrade-Toast wäre eine zusätzliche Konversions-Chance direkt im Editor und könnte nach Launch anhand der Klickrate auf den bereits vorhandenen Sidebar-CTA (§5.2) evaluiert werden |
| 2   | Soll die Checkbox "Aktuelle Fassung vorher sichern" im Restore-Dialog wirklich standardmäßig aktiviert sein, obwohl das Feature sonst konsequent "opt-in" ist? | Ja, empfohlen als einzige Ausnahme — hier droht echter, unwiderruflicher Datenverlust (siehe §5.4), das rechtfertigt eine sichere Voreinstellung |
| 3   | Soll Restore eines Prompts, der aktiv in Workflow-Steps referenziert wird, einen Warnhinweis zeigen ("Wird in 2 Workflows verwendet")? | Sinnvolle Ergänzung, aber kein Blocker für MVP — als Folgekarte nach Launch prüfen                              |
| 4   | Marketplace-Käufer und Content-Änderungen nach Kauf: rechtlich/vertrauensrelevant?                 | Sollte vor Launch mit Marketplace-Verantwortlichem geklärt werden — ggf. reicht ein Hinweis "Verkäufer kann Inhalt nach Kauf ändern" in den AGB/Produktdetails, statt technischer Lösung im MVP |
| 5   | Ist das BASIC-Limit von 20 Versionen im expliziten Modell noch treffend, oder zu niedrig/hoch bemessen, da Versionen jetzt seltener entstehen? | Vorerst beibehalten und nach Launch anhand echter Nutzungsdaten (Ø Versionen pro Prompt bei BASIC) validieren   |
| 6   | Reicht ein einfaches, immer sichtbares Notizfeld im Editor, oder sollte die Dropdown-Option "Speichern als neue Version" einen kurzen Bestätigungs-Dialog mit Notizfeld öffnen (statt sofort zu speichern)? | MVP: kein Dialog, sofortiges Speichern wie beim primären Segment — geringste Friktion. Ein Dialog wäre expliziter, kostet aber einen zusätzlichen Klick bei jeder Versionierung; als Full-Vision-Option offen halten, falls Nutzertests zeigen, dass Notizen sonst zu oft leer bleiben |
| 7   | Soll der zuletzt über das Dropdown gewählte Modus ("mit Version") für den nächsten Save als neuer Standard des primären Segments übernommen werden (analog zu manchen Split-Button-Patterns, z.B. Slack)? | Nein für MVP — das primäre Segment bleibt immer "Speichern" ohne Version, um Überraschungen zu vermeiden; könnte als Full-Vision-Option evaluiert werden |
