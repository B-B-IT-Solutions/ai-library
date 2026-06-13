---
name: project-workflows-feature
description: Prompt-Workflows Feature — Branching, step-by-step prompt chains. BASIC+PRO only. Runner is copy-paste mode. Steps are PROMPT_REF or STANDALONE. Private only (MVP).
metadata:
   type: project
---

**Feature:** Prompt-Workflows — verknüpfte Prompt-Ketten mit Verzweigungen

**Status:** Spezifiziert, bereit zur Implementierung (2026-06-11)

**Why:** Nutzer führen komplexe KI-Aufgaben durch, die mehrere Prompts in Sequenz erfordern. Aktuell verlieren sie den Überblick, welcher Prompt als Nächstes kommt, und müssen den Prozess im Kopf halten.

**Key decisions (non-negotiable for MVP):**

- Runner = Copy & Paste only. Keine KI-API-Aufrufe aus der App.
- Steps: PROMPT_REF (aus Bibliothek) oder STANDALONE (Text direkt im Workflow)
- Branching: Nutzer wählt beim Runner aus mehreren nächsten Schritten (mit Labels)
- Privat only (kein Sharing, kein Marketplace in MVP)
- BASIC: max. 5 Workflows, max. 10 Steps/Workflow; PRO: unbegrenzt
- FREE: kein Zugriff auf Workflows
- Zyklen sind verboten (Validierung vor Save)

**How to apply:** Spec is in this file. Use as ground truth when reviewing implementation. [[project-app-identity]] [[project-revenue-model]]
