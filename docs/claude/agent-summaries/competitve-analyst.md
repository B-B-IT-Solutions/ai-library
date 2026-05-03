● Hier sind die vollständigen Ergebnisse der Wettbewerbsanalyse (Stand: Mai 2026):

---

Markt-Überblick 2026

Der Markt für AI-Prompt-Plattformen ist $2,51 Mrd. gross (CAGR 29,5% bis $7 Mrd. 2030) — und hat noch keinen klaren Marktführer. Das ist die
Chance.

┌────────────┬────────────────┬───────────────────────────────────────────────────────┐
│ Konkurrent │ User │ Schwäche │
├────────────┼────────────────┼───────────────────────────────────────────────────────┤
│ PromptBase │ 220K+ Listings │ Kein Testing vor Kauf, kein Abo, keine Workflows │
├────────────┼────────────────┼───────────────────────────────────────────────────────┤
│ FlowGPT │ 10M+ │ Kein Creators-Monetisierung, kein Struktur │
├────────────┼────────────────┼───────────────────────────────────────────────────────┤
│ AIPRM │ 2M+ │ Nur ChatGPT-Extension, kein eigenes Prompt-Management │
├────────────┼────────────────┼───────────────────────────────────────────────────────┤
│ PromptHero │ — │ Nur Bild-Prompts, kein Workflow-Use-Case │
└────────────┴────────────────┴───────────────────────────────────────────────────────┘

---

Unfaire Vorteile dieser App (niemand hat das)

1. Typed Template Form Fields — STÄRKSTER MOAT. Alle Konkurrenten = Copy-Paste-Textblobs. Diese App = strukturierte Formulare mit
   typisierten Feldern. Nicht-technische User können komplexe Prompts ohne Prompt-Engineering benutzen. Sehr schwer zu kopieren (erfordert
   Schemaarchitektur).
2. Prompt Versioning — Kein Marketplace-Konkurrent hat das. Kritisch für Teams (Audit, Rollback, A/B).
3. Follow-up Prompts / Prompt Chains — Sequentielle Workflows. Kein Konkurrent hat das strukturiert.
4. Hybrid Revenue Model (Abo + Marketplace) — Architektonisch komplex. PromptBase = nur Einzelkauf. FlowGPT = nur Credits. Diese App hat
   beides kombiniert. Erzeugt doppelte Netzwerkeffekte.
5. Public Collection Sharing ohne Auth (/p/collections/{token}) — Infrastruktur ist fertig, wird aber noch nicht als Wachstumsmotor genutzt.
   Grösster ungenutzter Hebel.

---

Was jetzt gebaut werden soll (priorisiert)

Priorität 1 — Public Explore/Discovery Feed (Aufwand: Mittel)

Route /explore, keine Auth nötig. Trending + kuratierte Templates, Kategorien, Suche. Das ist der fehlende virale
Akquisitions-Einstiegspunkt. Ohne das gibt es keinen organischen Wachstums-Loop. Generiert ausserdem SEO-indexierbare Seiten pro Template.

Priorität 2 — In-Platform Prompt Testing / Live Preview (Aufwand: Mittel)

"Test"-Button auf Templates: Felder ausfüllen → Prompt rendert → an LLM senden → Output inline anzeigen. Macht den Typed-Form-Field-Vorteil
sichtbar erlebbar. Löst das grösste PromptBase-Problem: Nutzer "kaufen blind". Direkte Auswirkung auf Konversionsrate.

Priorität 3 — Viral Sharing für Einzelne Prompts (Aufwand: Gering)

Route /p/prompts/{token}. Auth-freie Preview-Seite mit Formularfeldern + "Use this prompt"-CTA. Erweitert die bereits gebaute
Collection-Sharing-Infrastruktur auf einzelne Prompts. Jeder geteilte Prompt = Akquisitions-Funnel.

Priorität 4 — Creator Dashboard mit Analytics (Aufwand: Mittel)

Sales, Revenue, View-to-Buy-Conversion pro Prompt, Trending-Suchanfragen ohne gute Ergebnisse. Schliesst die Angebots-Seite: mehr
Premium-Creator = bessere Retention auf der Nutzer-Seite.

Priorität 5 — Team Workspaces (Aufwand: Hoch)

Shared Workspaces, Rollen, geteilte Templates, Team-Billing (CHF 29–49/User/Monat). 1 Team-Account (CHF 200–400/mo) = 20–40 PRO-Einzelabos
bei gleichem Support-Aufwand. Der B2B-Weg.

Priorität 6 — API-Zugang für Entwickler (Aufwand: Mittel)

REST API für eigene Prompts/Templates. Als PRO-Feature oder Add-on. Erzeugt Integration-Lock-in.

Priorität 7 — Output-Qualitäts-Rating (Aufwand: Hoch)

After Test-Run: 1–5-Sterne-Bewertung, versions-spezifisch. Löst das marktweite Qualitätsproblem — kein Konkurrent hat das gelöst.

---

Positioning (3 validierte Botschaften)

Für breite Consumer-Akquisition:

▎ "Don't copy. Just fill in. Start."
▎ Zielgruppe: Marketing, Content Creator, Freelancer — Profis die AI produktiv nutzen wollen, ohne Prompt-Engineering-Expertise.

Für Teams/B2B:

▎ "Your team uses the same prompts. Versioned like code."
▎ Zielgruppe: Kleine Teams, Agenturen die AI als Arbeitswerkzeug brauchen.

Gegen PromptBase direkt:

▎ "Prompts you buy. Prompts you subscribe to. Prompts you build."
▎ Zielgruppe: Power User die sowohl eine kuratierte Bibliothek als auch eigene Workflow-Prompts brauchen.

---

Wichtigste Erkenntnis in einem Satz

▎ Der grösste Hebel ist nicht mehr Features bauen, sondern den bestehenden technischen Vorsprung durch einen öffentlichen Explore-Feed und
▎ In-Platform Testing sichtbar und erlebbar machen — denn für neue Nutzer ist die Qualität der Plattform aktuell schlicht nicht erkennbar.
