# Feature-Spezifikation: Kategorisierung von Prompts

Bezieht sich auf: `src/components/prompts/detail/edit/form/sections/basic-info.tsx`,
`src/components/shared/widgets/form-dynamic-values.tsx`, `PromptCategory`-Modell
(`prisma/schema.prisma`), `prompt.user.{repository,service,actions}.ts`,
`categories-filter.tsx` (Prompts-Dashboard & Collections).

---

## 0. Ausgangslage (Ist-Zustand, verifiziert im Code)

Kategorien sind **keine kuratierte Taxonomie**, sondern ein freies Tag-System pro Nutzer:

- `PromptCategory` ist 1:1 an `userId` gebunden (`@@unique([userId, name])`) — jeder Nutzer
  pflegt seine eigene, isolierte Kategorienliste. Es gibt keine geteilte/globale Taxonomie
  wie im öffentlichen Katalog/Marketplace.
- Im Editor (`basic-info.tsx`) ist das Feld `categories` ein reines Freitext-Widget
  (`FormDynamicValues`): tippen → Enter/„Hinzufügen“ → Chip. Kein Autocomplete, keine
  Validierung außer „nicht leer“ und „exakt kein Duplikat in der aktuellen Werteliste“.
- **Der Backend-Baustein für Wiederverwendung existiert bereits, wird aber im Editor nicht
  genutzt:** `getPromptCategories()` (Server Action, `prompt.user.actions.ts:263`) liefert
  die tatsächlich in Benutzung befindlichen Kategorienamen des Nutzers (dedupliziert,
  sortiert). Aktuell wird diese Funktion ausschließlich für die Filter-Sidebar im
  Prompts-Dashboard und in `collection-view.tsx` aufgerufen — **nirgends beim Erstellen/
  Bearbeiten eines Prompts**, wo sie den größten Nutzen hätte.
- Es existiert eine zweite, technisch andere Quelle (`pGetPromptCategories` →
  `getPromptTemplateCategories`), die alle jemals angelegten `PromptCategory`-Zeilen liefert
  — inklusive **Karteileichen**: Beim Update wird `set: []` + `connectOrCreate` verwendet
  (`prompt.user.repository.ts:234-240`), d.h. eine Kategorie, die von allen Prompts entfernt
  wird, bleibt als verwaiste Zeile in der DB bestehen und würde in dieser Quelle weiter
  auftauchen.
- Validierung: `categories: z.array(z.string())` im Zod-Schema (`template.schema.ts:36`) —
  **keine Längenbegrenzung, keine Maximalanzahl, keine Normalisierung**. Die DB-Spalte ist
  `VarChar(250)`; ein zu langer Wert würde erst beim `INSERT` mit einem ungefangenen
  Prisma-Fehler auffallen, nicht clientseitig.
- `FormDynamicValues.handleAddValue` dedupliziert nur exakt (`includes`), case-sensitive.
  „Marketing“ und „marketing“ sind zwei verschiedene Kategorien — auch innerhalb desselben
  Prompts.

**Kernproblem:** Das System sieht wie „Kategorisierung“ aus, verhält sich aber wie ein
blindes Freitextfeld. Das ist der klassische Bottleneck **Prompt-/Taxonomie-Drift**: Nutzer
erfinden bei jedem Prompt neu Kategorienamen, weil sie nicht sehen, was sie bereits angelegt
haben. Die Filter-Sidebar (`categories-filter.tsx`), die genau diese Kategorien zur
Discovery nutzen soll, wird dadurch mit Near-Duplikaten verrauscht („Marketing“,
„marketing“, „Marketing Content“, „marketing “) und verliert ihren Zweck als
Navigationshilfe.

---

## 1. Betroffene Nutzer & Job-to-be-done

| Segment | Job-to-be-done |
|---|---|
| Power-User (Prompt Engineers) | Große Mengen eigener Prompts strukturieren und über Filter schnell wiederfinden |
| Knowledge Worker (Marketing/Support) | Prompts thematisch ablegen, ohne über Taxonomie nachdenken zu müssen |
| Team/Sharing-Kontext (Collections) | Kategorien als zusätzliche, konsistente Facette neben Collections nutzen |

Primär betroffen: Power-User und Knowledge Worker mit wachsender Prompt-Bibliothek (>15-20
Prompts) — bei kleinen Bibliotheken fällt Taxonomie-Drift kaum auf, wird aber zum
Skalierungsproblem.

---

## 2. Kritische Probleme (Ist / Soll / Begründung)

### 2.1 Keine Wiederverwendung bestehender Kategorien im Editor

| | |
|---|---|
| **Ist** | `FormDynamicValues` kennt nur den aktuellen Formularzustand. Bestehende Kategorien des Nutzers (`getPromptCategories()`) werden nie geladen. |
| **Soll** | Kombiniertes Autocomplete/Combobox-Feld: Tippen zeigt eine gefilterte Liste bereits existierender Kategorien des Nutzers (per Server Action nachgeladen, z.B. via React Query). Auswahl per Klick/Enter übernimmt den exakten, bereits existierenden Namen. Neue Kategorie nur, wenn kein Treffer existiert („+ Neu erstellen: „…“"). |
| **Begründung** | Verhindert Taxonomie-Drift an der Quelle — das ist die wirksamste und günstigste Intervention (Zero-Effort für den Nutzer, kein Vergessen bestehender Tags). |

### 2.2 Keine Normalisierung / Duplikatserkennung

| | |
|---|---|
| **Ist** | Vergleich ist exakt (case-sensitive, kein Trim von Mehrfach-Leerzeichen). „Marketing“ ≠ „marketing“ ≠ „ Marketing“. |
| **Soll** | Normalisierung bei Vergleich (trim, collapse whitespace, case-insensitive Vergleich) — Anzeige behält die vom Nutzer gewählte Schreibweise der zuerst angelegten Kategorie bei (analog zur DB-Unique-Regel, die aber aktuell case-sensitive ist und ebenfalls angepasst werden sollte, siehe 2.4). |
| **Begründung** | Ohne Normalisierung bleibt jedes Autocomplete wirkungslos, da Nutzer weiterhin Varianten anlegen können. |

### 2.3 Keine Begrenzung der Anzahl / Länge

| | |
|---|---|
| **Ist** | Unbegrenzte Anzahl an Kategorien pro Prompt, keine Zeichenbegrenzung im Zod-Schema trotz `VarChar(250)` in der DB. |
| **Soll** | Zod: `z.string().trim().min(1).max(50)` pro Kategorie, `z.array(...).max(5)` pro Prompt. Clientseitig: Eingabefeld deaktiviert/Hinweistext ab 5 Kategorien („Maximal 5 Kategorien pro Prompt“). |
| **Begründung** | Kategorien sollen grobe Struktur geben, keine Freitext-Beschreibung ersetzen. Zu viele Kategorien pro Prompt entwerten die Filterfunktion (jeder Prompt matcht auf fast jeden Filter). Verhindert zudem einen ungefangenen DB-Fehler bei > 250 Zeichen. |

### 2.4 Verwaiste Kategorien (Karteileichen) & inkonsistente Quellen

| | |
|---|---|
| **Ist** | Zwei Service-Methoden mit unterschiedlicher Semantik (`getPromptCategories` = tatsächlich genutzt, `getPromptTemplateCategories` = alle je erstellten, inkl. aktuell an keinem Prompt hängende) ohne erkennbare Namenskonvention, die den Unterschied klarmacht. |
| **Soll** | **Produktentscheidung (bestätigt):** Für das Autocomplete im Editor bewusst `getPromptTemplateCategories()` verwenden — also **alle** je vom Nutzer angelegten Kategorien, nicht nur die aktuell verknüpften. Begründung: Ein Nutzer, der eine Kategorie vorübergehend von allen Prompts entfernt hat, soll sie trotzdem wieder auswählen können, ohne sie neu zu tippen. Für die Filter-Sidebar (`categories-filter.tsx`) bleibt `getPromptCategories()` (nur tatsächlich verknüpfte) weiterhin die richtige Quelle, da dort nur Kategorien mit Treffern sinnvoll sind. Methoden sollten dennoch zur Klarheit umbenannt werden, z.B. `getAllCategoryNames()` (Editor/Autocomplete) vs. `getUsedCategoryNames()` (Filter). |
| **Begründung** | Die beiden Quellen haben unterschiedliche, beide legitime Anwendungsfälle — Editor-Autocomplete soll die volle „Gedächtnisliste“ des Nutzers zeigen, die Filter-Sidebar nur, was gerade etwas ergibt. |

---

## 3. Feature-Vision: Wie Kategorisierung funktionieren soll

### 3.1 Kategorien-Feld im Editor (MVP)

- Ersatz von `FormDynamicValues` durch eine **Combobox mit Mehrfachauswahl** (z.B. `cmdk`/
  Radix Combobox, konsistent mit vorhandenen shadcn/ui-Primitiven).
- Verhalten:
  - Tippen filtert die geladenen, bestehenden Kategorien des Nutzers (case-insensitive,
    „contains“-Match).
  - Bestehende Kategorie anklicken → wird als Chip übernommen (exakte gespeicherte
    Schreibweise, keine neue DB-Zeile).
  - Kein Treffer vorhanden → Option „➕ „Xyz“ als neue Kategorie anlegen“ erscheint als
    letzter Listeneintrag.
  - Bereits ausgewählte Kategorien werden aus der Vorschlagsliste ausgeblendet.
  - Jeder Chip zeigt optional die Nutzungshäufigkeit im Dropdown an (z.B. „Marketing · 12
    Prompts“), um Nutzer zur „kanonischen“, meistgenutzten Variante zu lenken statt zu neuen
    Varianten.
- Leerer Zustand (Nutzer hat noch keine Kategorie angelegt): Dropdown zeigt 4-6
  **vorgeschlagene Start-Kategorien** (z.B. „Marketing“, „Support“, „Coding“, „Recherche“,
  „Schreiben“, „Sonstiges“) statt einer leeren Liste — löst das Blank-Page-Problem beim
  ersten Prompt.

### 3.2 Kategorien-Verwaltung (Full Vision, nicht MVP)

Eigener Bereich (z.B. `/settings/categories` oder Tab in den Profileinstellungen), der die
Lücke schließt, dass ein Tippfehler oder eine gewünschte Umbenennung aktuell **pro Prompt
einzeln** korrigiert werden muss:

- Liste aller genutzten Kategorien mit Nutzungszähler.
- Umbenennen (wirkt sich auf alle verknüpften Prompts aus — einfaches `UPDATE` auf
  `PromptCategory.name`, keine Migration einzelner Prompts nötig, da Relation über
  Join-Tabelle läuft).
- Zusammenführen zweier Kategorien (Merge: alle Prompt-Verknüpfungen der Quelle auf das Ziel
  umhängen, Quelle löschen) — löst das Duplikat-Problem nachträglich, falls trotz
  Autocomplete Varianten entstanden sind.
- Löschen einer Kategorie (mit Bestätigungsdialog, zeigt Anzahl betroffener Prompts).

### 3.3 Nicht-Ziel / bewusst außerhalb des Scopes

- Keine Vereinheitlichung mit der öffentlichen Katalog-Taxonomie (Explore/Marketplace nutzt
  ein separates, redaktionell gepflegtes Kategorienmodell für öffentliche Inhalte). Eine
  Zusammenführung beider Systeme wäre ein eigenständiges, deutlich größeres Vorhaben und
  würde die Nutzer-Autonomie über private Kategorien einschränken.
- Keine automatische KI-Vorschlags-Kategorisierung (auto-tagging basierend auf
  Prompt-Inhalt) im MVP — vielversprechend als späteres PRO-Feature, aber hohe
  Implementierungskosten (Klassifikation, Kosten pro Aufruf) im Verhältnis zum Nutzen einer
  einfachen Autocomplete-Lösung. Als Backlog-Idee vermerkt.

---

## 4. User Stories & Akzeptanzkriterien (MVP)

### Story 1
**Als** Nutzer mit bestehenden Kategorien **möchte ich** beim Anlegen/Bearbeiten eines
Prompts aus meinen bereits verwendeten Kategorien auswählen können, **damit** ich keine
Duplikate durch abweichende Schreibweise erzeuge.

- **Given** ich habe bereits die Kategorien „Marketing“ und „Support“ angelegt
  **When** ich im Kategorien-Feld eines neuen Prompts „mark“ eintippe
  **Then** wird „Marketing“ als anklickbarer Vorschlag angezeigt (case-insensitive Match)
- **Given** ich wähle „Marketing“ aus dem Vorschlag
  **When** ich den Prompt speichere
  **Then** wird die bestehende `PromptCategory`-Zeile verknüpft, keine neue Zeile erstellt
- **Given** ich tippe „Vertrieb“ und es existiert keine passende Kategorie
  **When** die Vorschlagsliste keinen Treffer enthält
  **Then** erscheint die Option „➕ „Vertrieb“ als neue Kategorie anlegen“ als letzter Eintrag

### Story 2
**Als** Nutzer **möchte ich** nicht mehr als eine sinnvolle Anzahl Kategorien pro Prompt
vergeben können, **damit** Kategorien als Filter aussagekräftig bleiben.

- **Given** ein Prompt hat bereits 5 Kategorien
  **When** ich versuche, eine 6. hinzuzufügen
  **Then** wird das Eingabefeld deaktiviert und ein Hinweis „Maximal 5 Kategorien pro
  Prompt“ angezeigt
- **Given** ich gebe eine Kategorie mit 60 Zeichen ein
  **When** ich versuche sie zu übernehmen
  **Then** wird ein Validierungsfehler „Maximal 50 Zeichen“ angezeigt, bevor das Formular
  abgeschickt wird (clientseitig via Zod, kein Server-Roundtrip nötig)

### Story 3
**Als** Erstnutzer ohne bestehende Kategorien **möchte ich** Vorschläge sehen, **damit** ich
nicht vor einem leeren Feld stehe.

- **Given** ich habe noch nie eine Kategorie angelegt
  **When** ich das Kategorien-Feld fokussiere
  **Then** zeigt das Dropdown eine kuratierte Liste von 4-6 Standard-Kategorien
  (`["Marketing", "Support", "Coding", "Recherche", "Schreiben", "Sonstiges"]`) an

### Story 4
**Als** Nutzer **möchte ich** dass zwei fast identische Kategorien wie „Marketing“ und
„marketing “ als dieselbe behandelt werden, **damit** meine Filter-Sidebar nicht unnötig
aufgebläht wird.

- **Given** die Kategorie „Marketing“ existiert bereits
  **When** ich „ marketing“ (mit Leerzeichen, Kleinschreibung) eingebe und übernehmen will
  **Then** wird automatisch die bestehende „Marketing“-Kategorie verknüpft statt einer neuen
  Zeile

---

## 5. MVP vs. Full Vision

| | MVP (nächster Sprint) | Full Vision (Backlog) |
|---|---|---|
| Autocomplete im Editor | ✅ | — |
| Normalisierung/Dedupe | ✅ | — |
| Max. Anzahl & Länge (Zod) | ✅ | — |
| Vorschläge für Erstnutzer | ✅ | — |
| Nutzungszähler im Dropdown | ✅ (einfach, da `getPromptCategories` erweiterbar) | — |
| Eigene Kategorien-Verwaltung (Umbenennen/Merge/Löschen) | ❌ | ✅ |
| Cleanup verwaister `PromptCategory`-Zeilen | ❌ (Follow-up-Ticket) | ✅ |
| KI-gestützte Auto-Kategorisierung | ❌ | ✅ (Idee, PRO-Kandidat) |

---

## 6. Abhängigkeiten

- `src/data/types/validators/template/template.schema.ts` — Zod-Schema um `.max()`-Regeln
  erweitern (Breaking Change für bestehende Prompts mit >5 Kategorien: Migration/Cap beim
  nächsten Speichern nötig, nicht rückwirkend erzwingen).
- `src/data/actions/prompt/prompt.user.actions.ts` — `getPromptCategories()` bereits
  vorhanden und wiederverwendbar; ggf. um Nutzungszähler erweitern
  (`{ name: string; count: number }[]` statt `string[]`) — Breaking Change für bestehende
  Consumer (`prompts-dashboard.tsx`, `collection-view.tsx`), daher entweder neue Action
  hinzufügen oder Rückgabetyp an beiden Call-Sites anpassen.
- `src/components/shared/widgets/form-dynamic-values.tsx` — entweder erweitern (Prop für
  Vorschlagsliste) oder neue Komponente `form-combobox-values.tsx` einführen; `basic-info.tsx`
  entsprechend anpassen und Kategorien serverseitig laden (Parent-Server-Component von
  `prompt-form.tsx` müsste `getPromptCategories()` zusätzlich fetchen und als Prop/Query
  durchreichen).
- Kein Einfluss auf Collections, Marketplace oder Subscriptions-Subsysteme im MVP-Scope.

### 6.1 Zusätzlicher Fund: Ladehook bereits vorhanden, aber ungenutzt

`src/data/ts-queries/prompt/prompt.ts` enthält bereits `useLoadPromptTemplateCategories()`
(React-Query-Hook, `staleTime: 5min`, `placeholderData: keepPreviousData`), der auf
`getPromptTemplateCategories()` zeigt. Der Hook ist vollständig implementiert und getestet
(`prompt.test.ts:240`), wird aber **von keiner einzigen Komponente importiert** — exakt
dasselbe Muster wie der ungenutzte Backend-Endpunkt in Abschnitt 0. Nach der
Produktentscheidung in 2.4 ist das der **richtige** Endpunkt für das Editor-Autocomplete
(alle je angelegten Kategorien, nicht nur aktuell verknüpfte) — kein Umbiegen nötig.

**Umsetzung im Editor-Formular folgt jedoch nicht dem React-Query-Hook, sondern dem
bestehenden Muster von `globalFields` in genau diesem Formular:** `templates/new/page.tsx`
und `templates/[id]/edit/page.tsx` laden Referenzdaten (`getGlobalPromptFields()`) bereits
serverseitig per `Promise.all` und reichen sie als Prop bis zu `BasicInfo` durch — ohne
React-Query-Hydration. Für Konsistenz mit diesem Formular wird `getPromptTemplateCategories()`
ebenso serverseitig geladen und als `categories: string[]`-Prop durchgereicht
(`page.tsx` → `PromptEdit` → `PromptEditForm` → `BasicInfo`), statt den ungenutzten
Client-Hook zu aktivieren.

### 6.2 UI-Baustein: `FormSelectLoadableValues` als Vorlage, nicht 1:1 wiederverwendbar

`src/components/shared/widgets/form-select-loadable-values.tsx` ist die einzige bestehende
Command/Popover-Combobox im Projekt (aktuell genutzt für die Prompt-Auswahl in
Workflow-Steps, `step-form.tsx`) und liefert die richtige UI-Bausteine (shadcn `Command`,
`Popover`, `CommandInput` als Such-Feld, Lade-/Empty-State). Für Kategorien passt das Muster
strukturell, aber **nicht unverändert**, da drei Annahmen dort nicht zutreffen:

| Aspekt | `FormSelectLoadableValues` (Ist) | Kategorien-Feld (Bedarf) |
|---|---|---|
| Auswahl | Single-Select (ein `id`-Wert) | Multi-Select (Array von Strings, Chips) |
| Datenquelle | `useInfiniteQuery` gegen paginierte `Page<T>` (serverseitige Suche/Pagination, für potenziell große Datenmengen wie alle Prompts) | Kleine, vollständig geladene Liste (`getPromptCategories()` liefert bereits alle Namen auf einmal, kein Paging in der Action) → einfacher `useQuery` reicht, clientseitiges Filtern auf `search` genügt, `InfiniteScroll`-Wrapper wird nicht gebraucht |
| Neuanlage | Nicht vorgesehen (nur Auswahl aus bestehenden Items) | Muss möglich sein: „➕ „Xyz“ anlegen“ als zusätzlicher `CommandItem`, wenn `search` keinen Treffer hat |
| Item-Typ | `{ id, title }` | einfacher `string` (Name = Wert, kein separates Feld) |

**Empfehlung:** Neue, eigenständige Komponente (Arbeitstitel `form-combobox-multi-values.tsx`)
bauen, die die UI-Bausteine (`Command`, `Popover`, `CommandInput`) aus
`form-select-loadable-values.tsx` übernimmt, aber mit `useQuery` (nicht `useInfiniteQuery`)
gegen den Kategorien-Hook aus 6.1 arbeitet, Werte als Array via `useController` verwaltet
(wie bisher in `form-dynamic-values.tsx`) und einen zusätzlichen "Neu anlegen"-`CommandItem`
sowie die Normalisierungs-/Limit-Logik aus Abschnitt 2.2/2.3 in `handleSelect` kapselt.

---

## 7. Tier-Einordnung

Basis-Kategorisierung (Autocomplete, Normalisierung, Limits) ist eine **fundamentale
Organisationsfunktion** und sollte wie Collections für **alle Tiers (FREE/BASIC/PRO)**
verfügbar sein — sie senkt Reibung, nicht ARPU-relevant, und ist Voraussetzung dafür, dass
Nutzer überhaupt genug Prompts anlegen, um in höhere Tiers zu konvertieren.

Mögliche spätere Monetarisierungs-Hebel (nicht Teil dieses MVP, nur als Hinweis, da das
Produkt bereits ein Tier-Limit-Pattern für Prompt-Anzahl kennt, `DPromptsUsage`
`current/limit`):

- **Kategorien-Verwaltung (Rename/Merge, Abschnitt 3.2)** als Power-User-Produktivitätstool
  wäre ein plausibler **BASIC+**-Kandidat, analog zur Argumentation bei Workflows.
- **KI-Auto-Kategorisierung** wäre ein plausibler **PRO**-Kandidat (hohe wahrgenommene
  Wertigkeit, laufende Kosten pro Klassifikations-Call rechtfertigen Premium-Tier).

Diese Tier-Zuordnungen sind Vorschläge für eine spätere Diskussion, keine Entscheidung.
