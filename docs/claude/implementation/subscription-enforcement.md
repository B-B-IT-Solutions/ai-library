# Product Description: Subscription Enforcement & 14-Tage-Trial

**Feature ID:** AI-138  
**Priority:** P0 — Revenue Critical  
**Effort:** Medium  
**Status:** Specification  
**Date:** 2026-05-16

---

## 1. Executive Summary

Die Subscription-Infrastruktur ist vollständig gebaut — Tier-Definitionen, Guards, Stripe-Webhooks — aber in keiner einzigen Server Action aktiv aufgerufen. Jeder Nutzer bekommt damit de facto unbegrenzten PRO-Zugang für immer, ohne jemals bezahlen zu müssen. Das Feature schließt diese Lücke durch zwei zusammenhängende Mechanismen:

1. **14-Tage-Trial:** Jeder neue Nutzer erhält nach der Registrierung 14 Tage vollständigen PRO-Zugang ohne Kreditkarte.
2. **Plan-Auswahl nach Trial-Ablauf:** Endet der Trial ohne aktives Abo, wird der Nutzer zur Planauswahl aufgefordert. Er kann zwischen FREE, BASIC und PRO wählen — auch FREE ist eine bewusste Entscheidung.
3. **Tier-Limits in Server Actions:** FREE-, BASIC- und PRO-Tier-Grenzen werden in allen mutierenden Server Actions aktiv durchgesetzt.

---

## 2. User Journey

### Phase 1: Trial (Tage 1–14)

```
Registrierung
  → trialEndsAt = now() + 14 Tage (in DB gespeichert)
  → Nutzer erhält PRO-Tier-Zugang (unlimited Templates, alle Features)
  → Trial-Banner im Layout: "Noch X Tage kostenlos – danach Abo wählen"
```

### Phase 2a: Trial abgelaufen, kein Plan gewählt

```
Nutzer öffnet eine geschützte Seite (z.B. /templates)
  → Authenticated Layout prüft Trial + Subscription-Status
  → Trial abgelaufen, noch kein Plan gewählt
  → Plan-Gate: Layout rendert <TrialExpiredGate> statt page children
     → Zeigt Planauswahl (FREE / BASIC / PRO) direkt eingebettet
     → FREE: sofortiger Zugang, Tier-Limits greifen ab diesem Moment
     → BASIC / PRO: Stripe Checkout → nach Rückkehr Zugang mit Tier-Limits
     → Kein Zugang zu irgendeiner App-Funktion bis Plan gewählt
```

### Phase 2b: Abo aktiv (BASIC oder PRO)

```
Nutzer erstellt ein neues Template
  → Server Action prüft: tier + aktuelle Anzahl Templates
  → BASIC: maxPrompts = 50 → bei Limit: SubscriptionAccessError → Toast + Upgrade-CTA
  → PRO: unlimited → kein Block
```

---

## 3. Zustandsmodell

| Zustand                             | Bedingung                                                                | Tier      | App-Zugang                                        |
| ----------------------------------- | ------------------------------------------------------------------------ | --------- | ------------------------------------------------- |
| Trial aktiv                         | `trialEndsAt > now()`, kein Plan gewählt                                 | PRO       | Voll                                              |
| Trial abgelaufen, kein Plan gewählt | `trialEndsAt <= now()`, `planChosenAt = NULL`                            | —         | Plan-Gate                                         |
| FREE gewählt                        | `planChosenAt != NULL`, kein aktives Abo                                 | FREE      | Voll, mit Limits (5 Templates, 3 Library-Items)   |
| BASIC aktiv                         | Abo `status = ACTIVE`, Plan `tier = BASIC`                               | BASIC     | Voll, mit Limits (50 Templates, 20 Library-Items) |
| PRO aktiv                           | Abo `status = ACTIVE`, Plan `tier = PRO`                                 | PRO       | Voll, unlimited                                   |
| Abo gekündigt, Laufzeit noch offen  | `status = CANCELED`, `currentPeriodEnd > now()`                          | laut Plan | Voll bis Ablauf                                   |
| Abo abgelaufen, kein Plan gewählt   | `status = CANCELED`, `currentPeriodEnd <= now()`, `planChosenAt = NULL`  | —         | Plan-Gate                                         |
| Abo abgelaufen, FREE als Fallback   | `status = CANCELED`, `currentPeriodEnd <= now()`, `planChosenAt != NULL` | FREE      | Voll, mit FREE-Limits                             |

> **FREE-Tier:** FREE ist eine bewusste Nutzerwahl nach Trial-Ablauf — nicht ein technisches Fallback. Ein Nutzer der FREE wählt, bekommt sofortigen Zugang mit den definierten Limits. Er kann jederzeit upgraden. Ein Nutzer dessen bezahltes Abo ausläuft und der `planChosenAt` bereits gesetzt hat, fällt automatisch auf FREE zurück (kein erneuter Plan-Gate).

---

## 4. Schema-Änderung

### 4.1 `User`-Modell erweitern

**Datei:** `prisma/schema.prisma`

```prisma
model User {
  // ... bestehende Felder ...
  trialEndsAt   DateTime? @map("trial_ends_at") @db.Timestamp(6)   // NEU
  planChosenAt  DateTime? @map("plan_chosen_at") @db.Timestamp(6)  // NEU: gesetzt wenn Nutzer bewusst einen Plan wählt (inkl. FREE)
}
```

**Migration:** Additive, kein Breaking Change. Bestehende Nutzer erhalten `trialEndsAt = NULL` und `planChosenAt = NULL`.

> **Wichtig für bestehende Nutzer:** Nutzer mit `trialEndsAt = NULL` und `planChosenAt = NULL` aber ohne aktives Abo würden in den Plan-Gate fallen. Vor dem Go-Live des Paywalls muss ein einmaliges Migration-Script für bestehende Nutzer laufen: entweder `planChosenAt = now()` setzen (sie fallen auf FREE) oder ihr Abo verifizieren.

### 4.2 Domain-Typ erweitern

**Datei:** `src/data/types/domain/user.d.ts` (oder wo `DUser`/`DLoginUser` definiert ist)

```typescript
export type DLoginUser = {
  // ... bestehende Felder ...
  trialEndsAt: Date | null;   // NEU
  planChosenAt: Date | null;  // NEU
};
```

---

## 5. `getUserTier()` — Logik-Update

**Datei:** `src/data/services/subscription/subscription.service.ts`

Aktuelle Logik:

```typescript
async getUserTier(userId: string): Promise<DSubscriptionTier> {
  const subscription = await this.subscriptionRepo.pGetSubscription({ userId });
  if (subscription && subscription.status === "ACTIVE") return subscription.plan.tier;
  return "FREE";
}
```

Neue Logik:

```typescript
async getUserTier(userId: string): Promise<DSubscriptionTier> {
  const subscription = await this.subscriptionRepo.pGetSubscription({ userId });

  // Aktives Abo → Abo-Tier
  if (subscription?.status === "ACTIVE") return subscription.plan.tier;

  // Gekündigtes Abo noch in der Laufzeit → weiterhin Abo-Tier
  if (
    subscription?.status === "CANCELED" &&
    subscription.currentPeriodEnd &&
    isFuture(subscription.currentPeriodEnd)
  ) {
    return subscription.plan.tier;
  }

  // Trial noch aktiv → PRO (voller Zugang)
  const user = await this.userRepo.pGetById(userId);
  if (user?.trialEndsAt && isFuture(user.trialEndsAt)) return "PRO";

  // Nutzer hat bewusst einen Plan gewählt (inkl. FREE nach Trial) → FREE
  // planChosenAt wird auch gesetzt wenn Nutzer FREE wählt oder ein abgelaufenes Abo hatte
  if (user?.planChosenAt) return "FREE";

  // Kein Plan gewählt, Trial abgelaufen → FREE (Plan-Gate greift im Layout davor)
  return "FREE";
}
```

> **Hinweis:** `getUserTier()` braucht Zugang zum `UserRepository`. Die Methode bekommt eine zweite Abhängigkeit — alternativ kann `trialEndsAt`/`planChosenAt` direkt über einen Join mitgeladen werden.

### `hasActiveAccess()` — ebenfalls anpassen

```typescript
async hasActiveAccess(userId: string): Promise<boolean> {
  const subscription = await this.subscriptionRepo.pGetSubscription({ userId });

  if (subscription?.status === "ACTIVE") return true;

  if (
    subscription?.status === "CANCELED" &&
    subscription.currentPeriodEnd &&
    isFuture(subscription.currentPeriodEnd)
  ) return true;

  const user = await this.userRepo.pGetById(userId);

  // Trial noch aktiv → Zugang
  if (user?.trialEndsAt && isFuture(user.trialEndsAt)) return true;

  // Nutzer hat nach Trial-Ablauf bewusst einen Plan gewählt (inkl. FREE) → Zugang
  if (user?.planChosenAt) return true;

  // Trial abgelaufen, kein Plan gewählt → Plan-Gate
  return false;
}
```

---

## 6. Registrierung: Trial setzen

**Datei:** `src/data/actions/auth/` (Sign-Up Server Action)

Bei erfolgreicher Nutzer-Erstellung:

```typescript
import { addDays } from "date-fns";

// Beim Erstellen des Users in der DB:
await userRepository.pCreate({
  // ... bestehende Felder ...
  trialEndsAt: addDays(new Date(), 14),
});
```

---

## 7. Paywall im Authenticated Layout

**Datei:** `src/app/(authenticated)/layout.tsx`

Das authenticated Layout ist ein Server Component und hat Zugang zu Session + DB. Hier greift der Paywall-Check.

```typescript
// src/app/(authenticated)/layout.tsx
import { auth } from "@/lib/auth";
import { ServiceFactory } from "@/data/services";
import { TrialExpiredGate } from "@/components/subscription/trial-expired-gate";

export default async function AuthenticatedLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in");

  const factory = new ServiceFactory(prisma);
  const subscriptionService = factory.getSubscriptionService();
  const hasAccess = await subscriptionService.hasActiveAccess(session.user.id);

  if (!hasAccess) {
    return <TrialExpiredGate />;
  }

  return (
    <>
      <TrialBanner userId={session.user.id} />
      {children}
    </>
  );
}
```

> **Ausnahme:** Die Route `/settings/subscription` (und ggf. Checkout/Stripe-Return) muss vom Paywall **ausgenommen** sein — sonst kann der Nutzer kein Abo abschliessen. Dies wird via Route-Check im Layout oder durch ein separates Layout für `/settings/subscription` gelöst.

---

## 8. Trial-Banner

**Datei:** `src/components/subscription/trial-banner.tsx`

Erscheint im authenticated Layout solange der Trial aktiv ist und noch kein bezahltes Abo besteht.

**Verhalten:**

- Zeigt "Noch X Tage kostenlos – danach Abo erforderlich" als dismissible Banner
- Bei X ≤ 3 Tagen: gelbes/oranges Styling (Dringlichkeit)
- Bei X = 0 oder abgelaufen: wird vom Paywall ersetzt, Banner verschwindet
- CTA: "Jetzt Abo wählen" → `/settings/subscription`

```typescript
// Pseudo-Implementierung
const daysLeft = differenceInDays(user.trialEndsAt, new Date());

if (daysLeft > 3) → blauer Info-Banner
if (daysLeft <= 3 && daysLeft > 0) → oranger Warn-Banner
if (hasActiveSubscription) → kein Banner
```

---

## 9. `<TrialExpiredGate>` — Plan-Gate-Komponente

**Datei:** `src/components/subscription/trial-expired-gate.tsx`

Ersetzt den App-Inhalt wenn Trial abgelaufen und noch kein Plan gewählt wurde.

**Inhalt:**

- Überschrift: "Deine kostenlose Testphase ist abgelaufen"
- Kurzer Text: "Wähle einen Plan um weiterzumachen."
- Drei Planauswahl-Karten: **FREE**, **BASIC**, **PRO**
- **FREE-Karte:** "Kostenlos starten" — direkte Server Action setzt `planChosenAt = now()`, kein Checkout; sofortiger Zugang mit FREE-Limits (5 Templates, 3 Library-Items)
- **BASIC/PRO-Karten:** CTA leitet zu Stripe Checkout via bestehende Subscription-Actions
- Kein Zurück-Button, kein Nav-Zugang zur App bis Plan gewählt

**Neue Server Action für FREE-Wahl:**

```typescript
// src/data/actions/subscription/subscription.actions.ts
export const chooseFreeplan = async (): Promise<ActionResult> => {
  const user = await requireUser();
  await userRepository.pUpdate(user.id, { planChosenAt: new Date() });
  revalidatePath("/");
  return { success: true };
};
```

Nach Ausführung: `hasActiveAccess()` gibt `true` zurück → Layout rendert App statt Gate.

---

## 10. Tier-Limits in Server Actions

### 10.1 Neue Guard-Funktion für count-basierte Limits

**Datei:** `src/lib/subscription/server-guards.ts`

`requireSubscriptionAccess` prüft nur Boolean-Features. Für `maxPrompts` und `maxLibraryItems` (count-basiert) brauchen wir eine Erweiterung:

```typescript
export const requireCountLimit = async (
  feature: FeatureName,
  currentCount: number
): Promise<void> => {
  const user = await requireUser();
  const subscriptionService = getSubscriptionService();
  const tier = await subscriptionService.getUserTier(user.id);

  if (hasReachedLimit(tier, feature, currentCount)) {
    const limit = getFeatureLimit(tier, feature);
    throw new SubscriptionAccessError(
      `Limit erreicht: Dein Plan (${tier}) erlaubt maximal ${limit} Einträge für "${feature}". Bitte upgrade dein Abo.`,
      feature
    );
  }
};
```

### 10.2 `createTemplateDescriptor` — Guard hinzufügen

**Datei:** `src/data/actions/prompt/prompt.user.actions.ts`

```typescript
export const createTemplateDescriptor = async (
  data: DPromptUpdate
): Promise<ActionResult> => {
  try {
    const user = await requireUser();
    const service = getService();

    // NEU: Limit prüfen bevor Insert
    const currentCount = await service.getTemplateCount(user.id);
    await requireCountLimit("maxPrompts", currentCount);

    await service.createTemplateDescriptor(user.id, data);
    return { success: true, message: "Vorlage erfolgreich erstellt" };
  } catch (error) {
    if (error instanceof SubscriptionAccessError) {
      return { success: false, message: error.message, upgradeRequired: true };
    }
    // ... bestehende Error-Handling-Logik
  }
};
```

> `getTemplateCount(userId)` muss in `TemplateService` ergänzt werden — zählt alle `PromptTemplateDescriptor`-Einträge des Users.

### 10.3 Library-Item-Limit

Analog zu `maxPrompts` — der entsprechende Server Action für "Catalog-Eintrag in Library übernehmen" (`copyCatalogEntryToUserLibrary`) muss `requireCountLimit("maxLibraryItems", currentLibraryCount)` aufrufen.

### 10.4 Limit-Anzeige in der UI

**Wo:** Templates-Dashboard (`/templates`) und Library-Ansicht

**Was:** Fortschrittsanzeige "12 / 50 Vorlagen" (BASIC) oder "12 / ∞" (PRO/Trial) — gibt dem Nutzer Sichtbarkeit über sein Limit.

**Beim Erreichen des Limits:**

- Erstell-Button disabled + Tooltip: "Limit erreicht"
- Toast beim Server-Action-Fehler: "Du hast dein Template-Limit erreicht. Upgrade auf PRO für unbegrenzte Vorlagen."
- CTA-Button: "Jetzt upgraden" → `/settings/subscription`

---

## 11. `ActionResult` — Erweiterung

**Datei:** `src/data/types/common/action-result.d.ts` (oder analog)

Um dem Client mitzuteilen dass ein Upgrade-CTA gezeigt werden soll:

```typescript
export type ActionResult = {
  success: boolean;
  message: string;
  upgradeRequired?: boolean;  // NEU — Client zeigt Upgrade-Modal
};
```

---

## 12. Implementierungs-Reihenfolge

```
Phase 1 — Datenfundament
  1.1  Schema: trialEndsAt auf User hinzufügen
  1.2  Migration generieren und ausführen
  1.3  Domain-Typ DLoginUser um trialEndsAt erweitern
  1.4  UserRepository: pGetById gibt trialEndsAt zurück
  1.5  SubscriptionService: getUserTier() + hasActiveAccess() um Trial-Logik erweitern
  1.6  SubscriptionService: getTrialStatus(userId) → { isActive, daysLeft, endsAt }
  1.7  Tests für getUserTier() (Trial aktiv, Trial abgelaufen, Trial + Abo gleichzeitig)

Phase 2 — Registrierung
  2.1  Sign-Up Action: trialEndsAt = now() + 14 Tage beim User-Create setzen
  2.2  Tests für Sign-Up Action

Phase 3 — Plan-Gate & Layout
  3.1  hasActiveAccess() im Authenticated Layout aufrufen
  3.2  chooseFreeplan() Server Action ergänzen (setzt planChosenAt)
  3.3  <TrialExpiredGate> Komponente bauen (FREE / BASIC / PRO Karten)
  3.4  Route-Ausnahme für /settings/subscription sicherstellen
  3.5  Tests für TrialExpiredGate + chooseFreeplan()

Phase 4 — Trial-Banner
  4.1  getTrialStatus() Server Action (auth-geschützt)
  4.2  <TrialBanner> Komponente (dismissible, tagesgenaue Anzeige, Dringlichkeits-Styling)
  4.3  Banner ins Authenticated Layout einbinden
  4.4  Tests für TrialBanner

Phase 5 — Server Action Guards
  5.1  requireCountLimit() in server-guards.ts ergänzen
  5.2  TemplateService.getTemplateCount(userId) ergänzen
  5.3  createTemplateDescriptor: requireCountLimit("maxPrompts", count) einbauen
  5.4  copyCatalogEntryToUserLibrary: requireCountLimit("maxLibraryItems", count) einbauen
  5.5  ActionResult um upgradeRequired erweitern
  5.6  Tests für requireCountLimit() + Guards

Phase 6 — Limit-UI
  6.1  Template-Count laden und im Dashboard anzeigen (X / 50 Vorlagen)
  6.2  Erstell-Button bei Limit deaktivieren + Tooltip
  6.3  Toast bei SubscriptionAccessError mit Upgrade-CTA
```

---

## 13. Test-Anforderungen

### SubscriptionService

- `getUserTier()` — Trial aktiv → PRO
- `getUserTier()` — Trial abgelaufen, kein Abo → FREE
- `getUserTier()` — Trial abgelaufen, BASIC Abo aktiv → BASIC
- `getUserTier()` — Trial abgelaufen, PRO Abo aktiv → PRO
- `getUserTier()` — Abo CANCELED, Laufzeit noch offen → laut Plan
- `hasActiveAccess()` — Trial aktiv → true
- `hasActiveAccess()` — Trial abgelaufen, kein Plan gewählt → false
- `hasActiveAccess()` — Trial abgelaufen, FREE gewählt (`planChosenAt` gesetzt) → true
- `hasActiveAccess()` — Abo ACTIVE → true

### Server Guards

- `requireCountLimit()` — unter Limit → kein Error
- `requireCountLimit()` — genau am Limit → SubscriptionAccessError
- `requireCountLimit()` — PRO (unlimited = -1) → kein Error

### Server Actions

- `createTemplateDescriptor` — unter Limit → erstellt erfolgreich
- `createTemplateDescriptor` — Limit erreicht → `{ success: false, upgradeRequired: true }`
- `createTemplateDescriptor` — PRO-User → kein Limit-Check nötig (unlimited)

### Komponenten

- `TrialBanner` — zeigt korrekte Tage an
- `TrialBanner` — ≤ 3 Tage → Warn-Styling
- `TrialBanner` — kein Trial (Abo aktiv) → rendert nichts
- `TrialExpiredGate` — zeigt alle drei Planauswahl-Karten (FREE, BASIC, PRO)
- `TrialExpiredGate` — zeigt keinen App-Inhalt
- `TrialExpiredGate` — FREE-Karte ruft `chooseFreeplan()` auf und gibt Zugang
- `chooseFreeplan()` — setzt `planChosenAt`, danach gibt `hasActiveAccess()` `true` zurück

---

## 14. Offene Fragen

| #   | Frage                                                                              | Empfehlung                                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Was passiert mit bestehenden Nutzern (trialEndsAt = NULL) die noch kein Abo haben? | Post-Migration prüfen: entweder manuell Abo nachpflegen oder eine Ausnahme für `trialEndsAt = NULL` + kein Abo definieren (z.B. als "alteingesessener Nutzer" behandeln) |
| 2   | Kann der Trial verlängert werden (z.B. für Support-Fälle)?                         | Ja — `trialEndsAt` direkt in DB anpassen (Admin-Funktion, kein UI nötig im MVP)                                                                                          |
| 3   | Soll Trial-Status in der Session (JWT) gecacht werden?                             | Nein im MVP — DB-Abfrage im Layout reicht; bei Performance-Problemen später in Session-Token cachen                                                                      |
| 4   | Was passiert wenn Stripe-Checkout abbricht?                                        | Bestehende Logik bleibt — `Subscription.status = INCOMPLETE` bedeutet kein aktives Abo, Paywall greift                                                                   |
| 5   | Soll der Paywall modal oder fullscreen sein?                                       | Fullscreen (Layout-Replacement) — verhindert versehentlichen Feature-Zugang via direkter URL                                                                             |
