---
name: Multimedia AI Tool Integration — Deferred & Technically Non-Trivial
description: Decision to defer Bild-/Video-/Audio-Generator-Anbindung im Explore-Katalog; technische Begründung warum das kein triviales "Tool hinzufügen" ist
type: project
---

Entschieden 2026-07-27: Anbindung von Bild-/Video-/Audio-Generatoren (Midjourney, Sora, Suno,
Leonardo.ai, Stable-Diffusion-Frontends etc.) wird **für jetzt zurückgestellt**. Kann später
erweitert werden, ist aber kein Nebenprodukt des aktuellen Explore-Katalog-Ausbaus
(siehe [[explore_gaps]], `docs/claude/implementation/explore-katalog-erweiterung-spec.md`).

## Technischer Grund für die Zurückstellung

Code-verifiziert (`src/components/prompt-templating/use-prompt/ai-services.ts`,
`use-prompt-form.tsx`): Die aktuelle "In KI öffnen"-Funktion ist **kein** API-Call, sondern ein
Deep-Link mit Query-Parameter (`https://chatgpt.com/?q=<text>`), der das Chat-Eingabefeld des
Zieltools vorbefüllt. Das funktioniert nur, weil ChatGPT, Claude, Gemini und Perplexity zufällig
alle einen solchen (undokumentierten) Prefill-Parameter unterstützen.

Recherchiert 2026-07-27: Für Midjourney, Sora, Suno und Leonardo.ai gibt es **keine bestätigte
URL-Prefill-Unterstützung** (Midjourney ist primär Discord-Bot-basiert, Sora/Suno erfordern
Login/Abo ohne bekannten Query-Parameter, Stable-Diffusion-Ökosystem ist auf viele Frontends
fragmentiert). Jedes neue Tool wäre also kein Ein-Zeilen-Eintrag im `aiTools`-Array, sondern ein
eigener Recherche-Spike mit ungewissem Ausgang — vermutlich scheitert die Prefill-Annahme bei den
meisten Bild-/Video-/Audio-Tools.

Echte In-Platform-Generierung (tatsächlicher API-Call, Ergebnis direkt in der Plattform) wäre ein
komplett separates, deutlich größeres Vorhaben (API-Keys, Kosten pro Generierung, Asset-Speicherung,
Content-Moderation) — nicht Teil des Explore-Katalog-Scopes.

**Why:** Verhindert, dass eine zukünftige Konversation "Bild-Kategorie hinzufügen" als trivialen
Nebeneffekt der Text-Kategorie-Erweiterung einplant. Die Kategorie-Empfehlungen in
[[explore_gaps]] beschränken sich deshalb bewusst auf den Text-/Chat-Tool-Scope
(HR & Recruiting, Kundenservice & Support, Vertrieb & Sales, Bewerbung & Karriere, Bildung &
Lernen, Finanzen & Buchhaltung, Kreativität & Ideenfindung).

**How to apply:** Falls Bild-/Video-/Audio-Kategorien später doch gewünscht werden: (1) inhaltlicher
Aufbau der Kategorie (Prompt-Text + typisierte Felder wie Aspect Ratio, Stil, Negative-Prompt) ist
unabhängig möglich und kein Blocker, (2) "In KI öffnen"-Button nur für Tools mit bestätigtem
Prefill anbieten, sonst Fallback auf "Kopieren", (3) echte Generierung als eigenes Vorhaben
separat bewerten, nicht stillschweigend mit-scopen.
