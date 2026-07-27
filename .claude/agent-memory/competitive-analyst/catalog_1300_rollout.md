---
name: Catalog Scale-Up to 1300 Prompts — Rollout Tracker
description: Fortschritt und Ansatz beim Ausbau des Explore-Katalogs von 17 auf ein Ziel von 1300 Prompts, in Tranchen statt Massen-Generierung
type: project
---

Ziel (User, 2026-07-27): Insgesamt 1.300 Prompts im Explore-Katalog anbieten
(`prisma/seeds/catalog.ts`), um mit `prompta.ch` (1.083+) und `promptarchiv.de` (1.036+) auf
Augenhöhe zu sein, siehe [[explore_de_competitors]].

## Entscheidung: Tranchen statt Ein-Schritt-Generierung

1.300 individuelle, hochwertige Prompts in einem Rutsch zu erzeugen ist inhaltlich nicht
seriös möglich, ohne in generische Mad-Libs-Varianten abzurutschen — genau das Problem, das
`aipromptgalaxy.de` (500K+ Prompts, unkuratiert) als Wettbewerbsschwäche hat, siehe
[[competitor_weaknesses]]. Deshalb: Ausbau in überschaubaren, inhaltlich durchdachten Tranchen
pro Kategorie statt automatisierter Vervielfältigung.

## Fortschritt

- **Tranche 1 (2026-07-27):** 17 → 57 Einträge. 4 neue Kategorien vollständig befüllt
  (je 10 Einträge): HR & Recruiting, Kundenservice & Support, Vertrieb & Sales,
  Bewerbung & Karriere. Kategorien-Gesamtzahl: 11 (7 bestehend + 4 neu).
- Verbleibend bis 1.300: **~1.243 Einträge**.

## Bekannte Schieflage (vor UND nach Tranche 1 relevant)

Marketing & Content hatte vor Tranche 1 9 von 17 Einträgen (53%). Bei weiterem Ausbau nicht nur
neue Kategorien befüllen, sondern auch bestehende dünne Kategorien auffüllen: Business & Strategy,
Research & Analysis, SEO & Performance, Produktivität hatten je nur 1 Eintrag vor Tranche 1.

## Noch offene, empfohlene neue Kategorien (aus vorheriger Wettbewerbsanalyse)

Bewerbung & Karriere, HR & Recruiting, Kundenservice & Support, Vertrieb & Sales sind jetzt
umgesetzt. Noch offen: **Bildung & Lernen**, **Finanzen & Buchhaltung**,
**Kreativität & Ideenfindung** (alle explizit aus `prompta.ch`/`promptarchiv.de`-Taxonomien
abgeleitet, siehe [[explore_de_competitors]]).

## Technische Randnotiz

Beim Hinzufügen neuer Einträge: Nicht jedes Feld-Objekt muss eine `description`-Property haben —
die Seed-Mapping-Logik in `initCatalogData` (`prisma/seeds/catalog.ts`, Ende der Datei) liest
`description` bereits defensiv über einen Type-Cast aus (`(f as { description?: string
}).description ?? null`), analog zum bestehenden `options`-Cast. Das wurde in Tranche 1 so
angepasst, weil viele neue Felder ohne discription-Text schlanker/klarer waren. Vor weiteren
Tranchen: Slugs auf Eindeutigkeit prüfen (`grep -o 'slug: "[a-z0-9-]*"' prisma/seeds/catalog.ts |
sort | uniq -d`), da `upsert` bei Duplikaten sonst still überschreibt statt neue Einträge anzulegen.

**Why:** Verhindert, dass eine zukünftige Session denkt, das Ziel sei bereits erreicht oder dass
die verbleibenden ~1.243 Einträge in einem Schritt erzeugt werden sollten.

**How to apply:** Bei Fortsetzung: (1) aktuellen Stand in diesem File nachschlagen bevor eine neue
Tranche geplant wird, (2) abwechselnd neue Kategorien UND bestehende dünne Kategorien auffüllen,
(3) nach jeder Tranche Duplikat-Check + `npm run test -- --testPathPatterns="catalog"` +
`npx eslint prisma/seeds/catalog.ts` laufen lassen, (4) diese Datei mit neuem Stand aktualisieren.
