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
2. **Paywall nach Trial-Ablauf:** Endet der Trial ohne aktives Abo, wird der Nutzer hinter einem Hard-Paywall gesperrt bis er ein Abo abschliesst.
3. **Tier-Limits in Server Actions:** BASIC- und PRO-Tier-Grenzen werden in allen mutierenden Server Actions aktiv durchgesetzt.

---

## 2. User Journey

### Phase 1: Trial (Tage 1–14)

```
Registrierung
  → trialEndsAt = now() + 14 Tage (in DB gespeichert)
  → Nutzer erhält PRO-Tier-Zugang (unlimited Templates, alle Features)
  → Trial-Banner im Layout: "Noch X Tage kostenlos – danach Abo wählen"
```

### Phase 2a: Trial abgelaufen, kein Abo

```
Nutzer öffnet eine geschützte Seite (z.B. /templates)
  → Authenticated Layout prüft Trial + Subscription-Status
  → Trial abgelaufen, kein aktives Abo
  → Hard Paywall: Layout rendert <TrialExpiredGate> statt page children
     → Zeigt Abo-Auswahl (BASIC / PRO) direkt eingebettet
     → Kein Zugang zu irgendeiner App-Funktion bis Abo abgeschlossen
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

| Zustand                            | Bedingung                                        | Tier      | App-Zugang       |
| ---------------------------------- | ------------------------------------------------ | --------- | ---------------- |
| Trial aktiv                        | `trialEndsAt > now()`, kein Abo                  | PRO       | Voll             |
| Trial abgelaufen, kein Abo         | `trialEndsAt <= now()`, kein aktives Abo         | —         | Hard Paywall     |
| BASIC aktiv                        | Abo `status = ACTIVE`, Plan `tier = BASIC`       | BASIC     | Voll, mit Limits |
| PRO aktiv                          | Abo `status = ACTIVE`, Plan `tier = PRO`         | PRO       | Voll, unlimited  |
| Abo gekündigt, Laufzeit noch offen | `status = CANCELED`, `currentPeriodEnd > now()`  | laut Plan | Voll bis Ablauf  |
| Abo abgelaufen                     | `status = CANCELED`, `currentPeriodEnd <= now()` | —         | Hard Paywall     |

> **FREE-Tier:** Das bestehende FREE-Tier (5 Templates, 3 Library-Items) bleibt als technisches Fallback im Code, wird aber für Endnutzer nie aktiv erreicht — sie befinden sich entweder im Trial oder hinter dem Paywall.

---

## 4. Schema-Änderung

### 4.1 `User`-Modell erweitern

**Datei:** `prisma/schema.prisma`

```prisma
model User {
  // ... bestehende Felder ...
  trialEndsAt DateTime? @map("trial_ends_at") @db.Timestamp(6)   // NEU
}
```

**Migration:** Additive, kein Breaking Change. Bestehende Nutzer erhalten `trialEndsAt = NULL` → werden als "Trial abgelaufen" behandelt (Post-Migration müssen bestehende Nutzer direkt ein Abo wählen, es sei denn sie haben bereits eines).

> **Wichtig:** Für bestehende Nutzer mit `trialEndsAt = NULL` aber ohne Abo sollte ein Admin-Script prüfen ob ein Abo nachgetragen oder eine Ausnahme definiert werden muss, bevor der Paywall aktiv geschaltet wird.

### 4.2 Domain-Typ erweitern

**Datei:** `src/data/types/domain/user.d.ts` (oder wo `DUser`/`DLoginUser` definiert ist)

```typescript
export type DLoginUser = {
  // ... bestehende Felder ...
  trialEndsAt: Date | null;  // NEU
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

  // Kein Abo, Trial abgelaufen → FREE (technisches Fallback; Paywall greift davor)
  return "FREE";
}
```

> **Hinweis:** `getUserTier()` braucht Zugang zum `UserRepository`. Die Methode bekommt eine zweite Abhängigkeit — alternativ kann `trialEndsAt` direkt in der Subscription-Logik über einen Join mitgeladen werden.

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

  // Trial aktiv → Zugang
  const user = await this.userRepo.pGetById(userId);
  return !!(user?.trialEndsAt && isFuture(user.trialEndsAt));
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

## 9. `<TrialExpiredGate>` — Paywall-Komponente

**Datei:** `src/components/subscription/trial-expired-gate.tsx`

Ersetzt den App-Inhalt wenn Trial abgelaufen und kein Abo aktiv ist.

**Inhalt:**

- Überschrift: "Deine kostenlose Testphase ist abgelaufen"
- Kurzer Text: "Wähle ein Abo um weiterzumachen."
- Direkt eingebettete Abo-Auswahlkarten (BASIC / PRO) mit Preisen und Features
- CTA pro Karte: Leitet zu Stripe Checkout via bestehende Subscription-Actions
- Kein Zurück-Button, kein Nav-Zugang zur App

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

Phase 3 — Paywall & Layout
  3.1  hasActiveAccess() im Authenticated Layout aufrufen
  3.2  <TrialExpiredGate> Komponente bauen (statisch, Abo-Karten eingebettet)
  3.3  Route-Ausnahme für /settings/subscription sicherstellen
  3.4  Tests für TrialExpiredGate

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
- `hasActiveAccess()` — Trial abgelaufen, kein Abo → false
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
- `TrialExpiredGate` — zeigt Abo-Auswahl-Karten
- `TrialExpiredGate` — zeigt keinen App-Inhalt

---

## 14. Offene Fragen

| #   | Frage                                                                              | Empfehlung                                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Was passiert mit bestehenden Nutzern (trialEndsAt = NULL) die noch kein Abo haben? | Post-Migration prüfen: entweder manuell Abo nachpflegen oder eine Ausnahme für `trialEndsAt = NULL` + kein Abo definieren (z.B. als "alteingesessener Nutzer" behandeln) |
| 2   | Kann der Trial verlängert werden (z.B. für Support-Fälle)?                         | Ja — `trialEndsAt` direkt in DB anpassen (Admin-Funktion, kein UI nötig im MVP)                                                                                          |
| 3   | Soll Trial-Status in der Session (JWT) gecacht werden?                             | Nein im MVP — DB-Abfrage im Layout reicht; bei Performance-Problemen später in Session-Token cachen                                                                      |
| 4   | Was passiert wenn Stripe-Checkout abbricht?                                        | Bestehende Logik bleibt — `Subscription.status = INCOMPLETE` bedeutet kein aktives Abo, Paywall greift                                                                   |
| 5   | Soll der Paywall modal oder fullscreen sein?                                       | Fullscreen (Layout-Replacement) — verhindert versehentlichen Feature-Zugang via direkter URL                                                                             |
