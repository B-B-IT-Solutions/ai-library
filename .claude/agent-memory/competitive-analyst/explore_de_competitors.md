---
name: German-language Explore/Catalog Competitors
description: Deutschsprachige Nischenkonkurrenten für den /explore-Katalog (prompta.ch, promptarchiv.de, promptvorlage.de, aipromptgalaxy.de, getpromptlibrary.com) — separat vom englischsprachigen Markt (PromptBase/FlowGPT/AIPRM) in [[market_landscape_2026]]
type: project
---

Analysiert 2026-07-27 im Kontext von `docs/claude/implementation/explore-katalog-erweiterung-spec.md`.
Direkter Zielgruppen-Overlap (DACH, gleiche Sprache) — anderer Wettbewerbstyp als die
internationalen Marketplace-Player in [[market_landscape_2026]].

## Wettbewerber

**prompta.ch** — 1.083+ Prompts, komplett kostenlos, Navigation primär nach Ziel-Tool (57+ Tools:
ChatGPT/Claude/Midjourney/FLUX/Cursor), dann Use-Case. Starke redaktionelle Content-Strategie:
tägliche "Intelligence-Reports", Trend-Techniken (XML-Wrapper, Self-Correction Loops),
Tool-Vergleichsseiten, Live-Zähler als Social Proof, Newsletter.

**promptarchiv.de** — 1.036+ Prompts, deutsche UI/englische Prompt-Inhalte, Business-Abteilungs-
Taxonomie (HR, Buchhaltung, Kundenservice statt Tech-Jargon). Hybrid-Modell: Gratis-Teilmenge +
einmalig 12€ für Vollzugang (kein Abo). Free/Premium-Badge direkt auf der Karte, Prompt-Finder-
Wizard, FAQ, Blog.

**promptvorlage.de** — kleiner (6 Themenbereiche), komplett kostenlos. Besonderheit: interaktiver
Prompt-Generator (Tool, nicht nur Browse-Liste).

**aipromptgalaxy.de** — behauptet 500.000+ Prompts (ChatGPT/Claude/Gemini). Freemium mit
Tageslimit (5 kostenlose Prompts/Tag) — Scale als reines Verkaufsargument, Qualität ungeprüft.

**getpromptlibrary.com** — nur 127 kuratierte Prompts, aber jede Karte zeigt ein **statisches
Beispiel-Ergebnis** + "Pro-Tipps" zur Wirkweise. Doppel-Taxonomie: nach Jobrolle UND nach Aufgabe.
Mehrsprachig (7 Sprachen), komplett kostenlos, kein Signup.

## Muster über alle 5 hinweg

- Jeder bewirbt Menge/Scale als Vertrauenssignal (100er bis 500K+).
- Keiner hat strukturierte, typisierte Formularfelder — alle arbeiten mit Rohtext + manuellen
  `{platzhalter}`.
- Keiner bietet einen echten Live-Test (LLM-Call) vor Nutzung — höchstens ein statisches Beispiel
  (getpromptlibrary.com).
- Mehrere nutzen Tool-/Modell-Filterung als primäre oder sekundäre Navigationsachse — diese
  Plattform hat das nicht (`recommendedModel` ist reiner Anzeigetext, nicht filterbar).
- Mehrere nutzen redaktionellen Content (Blog/Guides/FAQ/Newsletter) als SEO- und
  Vertrauens-Layer zusätzlich zum reinen Katalog.

**Why:** Der /explore-Katalog dieser Plattform wirkt gegen diese Nischenkonkurrenten "dünn"
(28 Einträge vs. 100er–500K+), obwohl das Kernprodukt (typisierte Felder, Live-Test,
versionierbare Übernahme) technisch allen fünf überlegen ist. Siehe [[unfair_advantages]].

**How to apply:** Bei jeder Weiterentwicklung von `/explore` zuerst Discovery-Tiefe (Menge,
Sortierung, Filter) vor neuen Kernfeatures adressieren — sonst sehen Erstbesucher den
technischen Vorsprung nie. Siehe [[explore_gaps]] für konkrete, code-verifizierte Lücken.
