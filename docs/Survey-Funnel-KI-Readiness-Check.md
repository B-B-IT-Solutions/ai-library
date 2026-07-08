# Survey-Funnel: KI-Readiness-Check

Stufe 1 der Wertleiter — kostenloses Self-Assessment. Entwicklerfertige Spezifikation. Status: erste Version zum Ausprobieren, wird nach ersten Daten angepasst.

## Zweck

Einstiegspunkt in den Funnel. Erzeugt Selbsterkenntnis ("wo stehe ich wirklich?"), qualifiziert den Lead über sein Segment, sammelt E-Mail-Adresse und leitet — je nach Ergebnis-Stufe — zur passenden nächsten Wertleiter-Stufe weiter.

## Flow-Übersicht

1. Hook/Intro-Screen ("2-Minuten-Check")
2. Segmentierungsfrage
3. 8 Kernfragen (eine nach der anderen, mit Fortschrittsbalken) — Fragetext und Antworten hängen vom gewählten Segment ab
4. Kurzer "Analysiere deine Antworten"-Moment
5. E-Mail-Gate ("Wohin dürfen wir dein Ergebnis schicken?")
6. Ergebnis-Screen: Stufe + Score + 1–2 persönliche Hebel + CTA zur nächsten Wertleiter-Stufe

Wichtig: Ergebnis wird direkt auf der Seite angezeigt, nicht nur per Mail — sonst zu hoher Absprung vorm E-Mail-Gate.

## Intro-Screen

**Headline:** "Wie gut hast du KI wirklich in deinen Alltag integriert?"

**Subline:** "Mach den kostenlosen 2-Minuten-Check und erfahre, wo du stehst — und was dein nächster Schritt sein sollte."

**Button:** "Jetzt Check starten →"

**Trust-Line unter dem Button:** "Dauert ca. 2 Minuten · Kostenlos · Sofort-Ergebnis"

## Schritt 0 — Segmentierung

Frage: **"Was beschreibt deine Situation am besten?"**

| Option                                         | Segment-Code |
| ---------------------------------------------- | ------------ |
| Ich führe mein eigenes (kleines) Unternehmen   | `solo`       |
| Ich bin angestellt und nutze KI für meinen Job | `employee`   |
| Ich berate oder coache andere                  | `coach`      |
| Etwas anderes                                  | `default`    |

Das Segment steuert Fragetext und Antwortoptionen (konkrete Beispiele passend zum Alltag), nicht die Punktzahl-Logik dahinter — jede Frage hat pro Segment weiterhin 4 Antworten mit 1–4 Punkten in der gleichen Bedeutung (1 = niedrig/ungenutzt, 4 = hoch/systematisch). Dadurch bleibt das Scoring segmentübergreifend vergleichbar.

## Schritt 1 — Die 8 Kernfragen je Segment

Jede Frage: `id` (Dimension), Fragetext, 4 Antworten mit Punktwert. Reihenfolge ist in allen Segmenten identisch (Frage 1–8), nur Formulierung/Beispiele ändern sich.

---

### Segment `solo` — Solo-/Kleinunternehmer

**1. `freq` — Nutzungshäufigkeit**
"Wie oft nutzt du KI-Tools wie Claude aktuell für dein Business?"

| Punkte | Antwort                                                              |
| ------ | -------------------------------------------------------------------- |
| 1      | Nie oder kaum                                                        |
| 2      | Ein paar Mal im Monat, z. B. für einzelne Texte                      |
| 3      | Mehrmals pro Woche, z. B. für Angebote, Content, Kundenkommunikation |
| 4      | Täglich, fester Bestandteil meines Arbeitsalltags                    |

**2. `prompting` — Prompting-Qualität**
"Wie sehen deine Anfragen an die KI typischerweise aus, wenn du z. B. ein Angebot, eine E-Mail oder einen Social-Media-Post erstellen lässt?"

| Punkte | Antwort                                                                           |
| ------ | --------------------------------------------------------------------------------- |
| 1      | Kurze, allgemeine Anfrage ohne viel Kontext ("Schreib mir ein Angebot")           |
| 2      | Ich gebe manchmal Kontext (z. B. Kundenname), aber nicht systematisch             |
| 3      | Ich gebe meist Kontext zu Kunde, Ziel und gewünschtem Format                      |
| 4      | Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ |

**3. `tooling` — Werkzeugverständnis**
"Weißt du, wann du einfachen Chat vs. automatisierte Workflows für wiederkehrende Business-Aufgaben einsetzen solltest?"

| Punkte | Antwort                                                                      |
| ------ | ---------------------------------------------------------------------------- |
| 1      | Kenne den Unterschied nicht wirklich                                         |
| 2      | Nutze nur den einfachen Chat, auch für wiederkehrende Aufgaben               |
| 3      | Kenne den Unterschied, nutze weiterführende Funktionen aber selten           |
| 4      | Wechsle bewusst zwischen Chat und automatisierten Workflows, je nach Aufgabe |

**4. `files` — Dateien & Wissen**
"Wie arbeitest du mit deinen eigenen Geschäftsunterlagen (z. B. Preislisten, Angebote, Kundendaten) in der KI?"

| Punkte | Antwort                                                                         |
| ------ | ------------------------------------------------------------------------------- |
| 1      | Ich lade nie eigene Dateien hoch                                                |
| 2      | Gelegentlich, einzelne Dateien, z. B. mal ein Angebot als Vorlage               |
| 3      | Regelmäßig, auch strukturiert, z. B. in einem Projekt/Wissensordner             |
| 4      | Systematisch — eigene Wissensbasis mit Preisen, Ton, Vorlagen, wiederverwendbar |

**5. `automation` — Automatisierung**
"Automatisierst du mit KI wiederkehrende Business-Aufgaben (z. B. Angebote, Reports, Social-Media-Planung)?"

| Punkte | Antwort                                                                   |
| ------ | ------------------------------------------------------------------------- |
| 1      | Noch nie darüber nachgedacht                                              |
| 2      | Idee vorhanden, aber nicht umgesetzt                                      |
| 3      | Ein bis zwei Automatisierungen im Einsatz, z. B. ein wöchentlicher Report |
| 4      | Mehrere feste Automatisierungen, die regelmäßig Zeit sparen               |

**6. `integration` — Tool-Integration**
"Ist deine KI mit deinen Business-Tools verbunden (z. B. E-Mail, Kalender, Buchhaltung, CRM)?"

| Punkte | Antwort                                                       |
| ------ | ------------------------------------------------------------- |
| 1      | Nein, komplett isoliert                                       |
| 2      | Nein, aber ich sehe den Nutzen                                |
| 3      | Eine Verbindung eingerichtet, z. B. E-Mail oder Kalender      |
| 4      | Mehrere Tools verbunden — KI ist Teil meines Geschäftssystems |

**7. `quality` — Qualitätskontrolle**
"Wie gehst du mit KI-Ergebnissen um, bevor du sie an Kunden versendest oder veröffentlichst?"

| Punkte | Antwort                                                       |
| ------ | ------------------------------------------------------------- |
| 1      | Übernehme meist direkt, ohne zu prüfen                        |
| 2      | Prüfe nur bei wichtigen Kunden/Anlässen kurz                  |
| 3      | Prüfe meist gründlich und passe an mein Business an           |
| 4      | Habe einen festen Prüf-/Freigabeprozess, bevor etwas rausgeht |

**8. `timesaving` — Zeitersparnis**
"Wie viel Zeit sparst du aktuell realistisch pro Woche in deinem Business durch KI-Einsatz?"

| Punkte | Antwort                  |
| ------ | ------------------------ |
| 1      | Keine, oder kaum spürbar |
| 2      | Unter 1 Stunde           |
| 3      | 1–3 Stunden              |
| 4      | Mehr als 3 Stunden       |

---

### Segment `employee` — Angestellte

**1. `freq` — Nutzungshäufigkeit**
"Wie oft nutzt du KI-Tools wie Claude aktuell in deinem Job?"

| Punkte | Antwort                                                   |
| ------ | --------------------------------------------------------- |
| 1      | Nie oder kaum                                             |
| 2      | Ein paar Mal im Monat                                     |
| 3      | Mehrmals pro Woche, z. B. für E-Mails, Recherche, Reports |
| 4      | Täglich, fester Bestandteil meines Arbeitsalltags         |

**2. `prompting` — Prompting-Qualität**
"Wie sehen deine Anfragen an die KI typischerweise aus, wenn du z. B. eine E-Mail, ein Protokoll oder eine Zusammenfassung erstellen lässt?"

| Punkte | Antwort                                                                           |
| ------ | --------------------------------------------------------------------------------- |
| 1      | Kurze, allgemeine Anfrage ohne viel Kontext                                       |
| 2      | Ich gebe manchmal Kontext, aber nicht systematisch                                |
| 3      | Ich gebe meist Kontext zu Empfänger, Ziel und Format                              |
| 4      | Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ |

**3. `tooling` — Werkzeugverständnis**
"Weißt du, wann du einfachen Chat vs. automatisierte Workflows für wiederkehrende Aufgaben im Job einsetzen solltest?"

| Punkte | Antwort                                                            |
| ------ | ------------------------------------------------------------------ |
| 1      | Kenne den Unterschied nicht wirklich                               |
| 2      | Nutze nur den einfachen Chat                                       |
| 3      | Kenne den Unterschied, nutze weiterführende Funktionen aber selten |
| 4      | Wechsle bewusst zwischen Chat und automatisierten Workflows        |

**4. `files` — Dateien & Wissen**
"Wie arbeitest du mit internen Dokumenten (z. B. Reports, Vorlagen, Meeting-Notizen) in der KI?"

| Punkte | Antwort                                                                          |
| ------ | -------------------------------------------------------------------------------- |
| 1      | Ich lade nie eigene Dateien hoch                                                 |
| 2      | Gelegentlich, einzelne Dateien                                                   |
| 3      | Regelmäßig, auch strukturiert, z. B. in einem Projekt                            |
| 4      | Systematisch — eigene Wissensbasis mit Vorlagen und wiederverwendbaren Kontexten |

**5. `automation` — Automatisierung**
"Automatisierst du mit KI wiederkehrende Aufgaben in deinem Job (z. B. wöchentliche Reports, Status-Updates)?"

| Punkte | Antwort                                                     |
| ------ | ----------------------------------------------------------- |
| 1      | Noch nie darüber nachgedacht                                |
| 2      | Idee vorhanden, aber nicht umgesetzt                        |
| 3      | Ein bis zwei Automatisierungen im Einsatz                   |
| 4      | Mehrere feste Automatisierungen, die regelmäßig Zeit sparen |

**6. `integration` — Tool-Integration**
"Ist deine KI mit deinen Arbeits-Tools verbunden (z. B. E-Mail, Kalender, Slack, Drive)?"

| Punkte | Antwort                                                     |
| ------ | ----------------------------------------------------------- |
| 1      | Nein, komplett isoliert                                     |
| 2      | Nein, aber ich sehe den Nutzen                              |
| 3      | Eine Verbindung eingerichtet                                |
| 4      | Mehrere Tools verbunden — KI ist Teil meines Arbeitsalltags |

**7. `quality` — Qualitätskontrolle**
"Wie gehst du mit KI-Ergebnissen um, bevor du sie an Kolleg:innen oder Vorgesetzte weitergibst?"

| Punkte | Antwort                                 |
| ------ | --------------------------------------- |
| 1      | Übernehme meist direkt, ohne zu prüfen  |
| 2      | Prüfe nur bei wichtigen Anlässen kurz   |
| 3      | Prüfe meist gründlich und passe an      |
| 4      | Habe einen festen Prüf-/Freigabeprozess |

**8. `timesaving` — Zeitersparnis**
"Wie viel Zeit sparst du aktuell realistisch pro Woche in deinem Job durch KI-Einsatz?"

| Punkte | Antwort                  |
| ------ | ------------------------ |
| 1      | Keine, oder kaum spürbar |
| 2      | Unter 1 Stunde           |
| 3      | 1–3 Stunden              |
| 4      | Mehr als 3 Stunden       |

---

### Segment `coach` — Berater/Coach

**1. `freq` — Nutzungshäufigkeit**
"Wie oft nutzt du KI-Tools wie Claude aktuell in deiner Beratungs- oder Coaching-Tätigkeit?"

| Punkte | Antwort                                                             |
| ------ | ------------------------------------------------------------------- |
| 1      | Nie oder kaum                                                       |
| 2      | Ein paar Mal im Monat                                               |
| 3      | Mehrmals pro Woche, z. B. für Konzepte, Content, Klientenunterlagen |
| 4      | Täglich, fester Bestandteil meiner Arbeit                           |

**2. `prompting` — Prompting-Qualität**
"Wie sehen deine Anfragen an die KI typischerweise aus, wenn du z. B. ein Konzept, eine Workshop-Unterlage oder einen Beitrag erstellen lässt?"

| Punkte | Antwort                                                                           |
| ------ | --------------------------------------------------------------------------------- |
| 1      | Kurze, allgemeine Anfrage ohne viel Kontext                                       |
| 2      | Ich gebe manchmal Kontext, aber nicht systematisch                                |
| 3      | Ich gebe meist Kontext zu Zielgruppe, Ziel und Format                             |
| 4      | Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ |

**3. `tooling` — Werkzeugverständnis**
"Weißt du, wann du einfachen Chat vs. automatisierte Workflows für wiederkehrende Klientenarbeit einsetzen solltest?"

| Punkte | Antwort                                                            |
| ------ | ------------------------------------------------------------------ |
| 1      | Kenne den Unterschied nicht wirklich                               |
| 2      | Nutze nur den einfachen Chat                                       |
| 3      | Kenne den Unterschied, nutze weiterführende Funktionen aber selten |
| 4      | Wechsle bewusst zwischen Chat und automatisierten Workflows        |

**4. `files` — Dateien & Wissen**
"Wie arbeitest du mit deinen eigenen Unterlagen (z. B. Beratungskonzepte, Workshop-Material, Klientendaten) in der KI?"

| Punkte | Antwort                                                                                 |
| ------ | --------------------------------------------------------------------------------------- |
| 1      | Ich lade nie eigene Dateien hoch                                                        |
| 2      | Gelegentlich, einzelne Dateien                                                          |
| 3      | Regelmäßig, auch strukturiert, z. B. in einem Projekt                                   |
| 4      | Systematisch — eigene Wissensbasis mit Methoden, Vorlagen, wiederverwendbaren Kontexten |

**5. `automation` — Automatisierung**
"Automatisierst du mit KI wiederkehrende Aufgaben in deiner Beratung (z. B. Angebote, Follow-ups, Content)?"

| Punkte | Antwort                                                     |
| ------ | ----------------------------------------------------------- |
| 1      | Noch nie darüber nachgedacht                                |
| 2      | Idee vorhanden, aber nicht umgesetzt                        |
| 3      | Ein bis zwei Automatisierungen im Einsatz                   |
| 4      | Mehrere feste Automatisierungen, die regelmäßig Zeit sparen |

**6. `integration` — Tool-Integration**
"Ist deine KI mit deinen Tools verbunden (z. B. E-Mail, Kalender, CRM, Kursplattform)?"

| Punkte | Antwort                                                       |
| ------ | ------------------------------------------------------------- |
| 1      | Nein, komplett isoliert                                       |
| 2      | Nein, aber ich sehe den Nutzen                                |
| 3      | Eine Verbindung eingerichtet                                  |
| 4      | Mehrere Tools verbunden — KI ist Teil meines Beratungssystems |

**7. `quality` — Qualitätskontrolle**
"Wie gehst du mit KI-Ergebnissen um, bevor du sie an Klient:innen weitergibst oder veröffentlichst?"

| Punkte | Antwort                                                       |
| ------ | ------------------------------------------------------------- |
| 1      | Übernehme meist direkt, ohne zu prüfen                        |
| 2      | Prüfe nur bei wichtigen Klient:innen/Anlässen kurz            |
| 3      | Prüfe meist gründlich und passe an meine Methodik an          |
| 4      | Habe einen festen Prüf-/Freigabeprozess, bevor etwas rausgeht |

**8. `timesaving` — Zeitersparnis**
"Wie viel Zeit sparst du aktuell realistisch pro Woche in deiner Beratungstätigkeit durch KI-Einsatz?"

| Punkte | Antwort                  |
| ------ | ------------------------ |
| 1      | Keine, oder kaum spürbar |
| 2      | Unter 1 Stunde           |
| 3      | 1–3 Stunden              |
| 4      | Mehr als 3 Stunden       |

---

### Segment `default` — Generisch/Fallback ("Etwas anderes")

**1. `freq` — Nutzungshäufigkeit**
"Wie oft nutzt du KI-Tools wie Claude aktuell?"

| Punkte | Antwort                                                      |
| ------ | ------------------------------------------------------------ |
| 1      | Nie oder kaum                                                |
| 2      | Ein paar Mal im Monat                                        |
| 3      | Mehrmals pro Woche, z. B. für Texte, Recherche, Organisation |
| 4      | Täglich, fester Bestandteil meines Alltags                   |

**2. `prompting` — Prompting-Qualität**
"Wie sehen deine Anfragen (Prompts) an die KI typischerweise aus?"

| Punkte | Antwort                                                                           |
| ------ | --------------------------------------------------------------------------------- |
| 1      | Kurze, allgemeine Anfrage ohne viel Kontext                                       |
| 2      | Ich gebe manchmal Kontext, aber nicht systematisch                                |
| 3      | Ich gebe meist Kontext, Format und Ziel klar vor                                  |
| 4      | Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ |

**3. `tooling` — Werkzeugverständnis**
"Weißt du, wann du einfachen Chat vs. automatisierte Workflows einsetzen solltest?"

| Punkte | Antwort                                                            |
| ------ | ------------------------------------------------------------------ |
| 1      | Kenne den Unterschied nicht wirklich                               |
| 2      | Nutze nur den einfachen Chat                                       |
| 3      | Kenne den Unterschied, nutze weiterführende Funktionen aber selten |
| 4      | Wechsle bewusst zwischen Chat und automatisierten Workflows        |

**4. `files` — Dateien & Wissen**
"Wie arbeitest du mit deinen eigenen Dokumenten oder Daten in der KI?"

| Punkte | Antwort                                                        |
| ------ | -------------------------------------------------------------- |
| 1      | Ich lade nie eigene Dateien hoch                               |
| 2      | Gelegentlich, einzelne Dateien                                 |
| 3      | Regelmäßig, auch strukturiert, z. B. in Projekten              |
| 4      | Systematisch — eigene Wissensbasis, wiederverwendbare Kontexte |

**5. `automation` — Automatisierung**
"Automatisierst du mit KI wiederkehrende Aufgaben?"

| Punkte | Antwort                                                     |
| ------ | ----------------------------------------------------------- |
| 1      | Noch nie darüber nachgedacht                                |
| 2      | Idee vorhanden, aber nicht umgesetzt                        |
| 3      | Ein bis zwei Automatisierungen im Einsatz                   |
| 4      | Mehrere feste Automatisierungen, die regelmäßig Zeit sparen |

**6. `integration` — Tool-Integration**
"Ist deine KI mit deinen anderen Tools verbunden (z. B. E-Mail, Kalender, Drive)?"

| Punkte | Antwort                                              |
| ------ | ---------------------------------------------------- |
| 1      | Nein, komplett isoliert                              |
| 2      | Nein, aber ich sehe den Nutzen                       |
| 3      | Eine Verbindung eingerichtet                         |
| 4      | Mehrere Tools verbunden — KI ist Teil meines Systems |

**7. `quality` — Qualitätskontrolle**
"Wie gehst du mit KI-Ergebnissen um, bevor du sie nutzt oder versendest?"

| Punkte | Antwort                                 |
| ------ | --------------------------------------- |
| 1      | Übernehme meist direkt, ohne zu prüfen  |
| 2      | Prüfe nur bei wichtigen Dingen kurz     |
| 3      | Prüfe meist gründlich und passe an      |
| 4      | Habe einen festen Prüf-/Freigabeprozess |

**8. `timesaving` — Zeitersparnis**
"Wie viel Zeit sparst du aktuell realistisch pro Woche durch KI-Einsatz?"

| Punkte | Antwort                  |
| ------ | ------------------------ |
| 1      | Keine, oder kaum spürbar |
| 2      | Unter 1 Stunde           |
| 3      | 1–3 Stunden              |
| 4      | Mehr als 3 Stunden       |

---

## UI-Microcopy (Fragen- und Lade-Screens)

**Fortschrittsanzeige (über jeder Frage):** "Frage {n} von 8"

**Buttons je Frage:** Auswahl per Klick auf die Antwortkarte, danach automatisches Weiterspringen zur nächsten Frage (kein separater "Weiter"-Klick nötig — reduziert Abbrüche). Zusätzlich:

- "Zurück" — springt zur vorherigen Frage, vorherige Auswahl bleibt markiert
- Kein "Weiter"-Button nötig bei Auto-Advance; falls doch gewünscht: "Weiter →" (deaktiviert, bis eine Antwort gewählt ist)

**Lade-Screen (nach Frage 8, vor dem E-Mail-Gate):**

- Headline: "Wird analysiert …"
- Subline: "Wir werten deine Antworten aus und berechnen dein persönliches Ergebnis."
- Dauer: ca. 1,5–2 Sekunden, animierter Fortschrittsbalken oder Spinner (rein optisch, kein echter Ladevorgang nötig)

## Schritt 2 — Auswertung

**Score-Formel:** Summe aller 8 Antworten, segmentunabhängig. Bereich 8–32.

| Score | Stufe              | Kernbotschaft                                                                            |
| ----- | ------------------ | ---------------------------------------------------------------------------------------- |
| 8–14  | KI-Neuling 🌱      | Ganz am Anfang — guter Zeitpunkt für einen strukturierten Einstieg statt Trial-and-Error |
| 15–20 | KI-Anwender 🚀     | Nutzt KI punktuell, aber ohne System — größtes Potenzial liegt brach                     |
| 21–26 | Fortgeschritten 💪 | Gut integriert, aber Automatisierung/Integration ausbaufähig                             |
| 27–32 | KI-Profi 🏆        | KI ist System, nicht Zufall — Feinschliff & Skalierung als nächster Schritt              |

### Vollständiger Ergebnis-Text je Stufe

Der Fließtext ist segmentübergreifend identisch — die Personalisierung passiert über die Hebel-Tipps (siehe unten), nicht über 4×4 Textvarianten. Score-Anzeige immer: "Dein Score: {score}/32".

**8–14 · KI-Neuling 🌱**
"Du stehst noch ganz am Anfang deiner KI-Reise. Das ist kein Nachteil — im Gegenteil: Du kannst von Anfang an die richtigen Gewohnheiten aufbauen, statt dir später mühsame Ad-hoc-Nutzung abzugewöhnen. Mit ein paar gezielten Schritten sparst du schon bald spürbar Zeit."

**15–20 · KI-Anwender 🚀**
"Du nutzt KI bereits im Alltag — aber eher punktuell und ohne festes System. Genau da liegt dein größtes Potenzial: Mit etwas mehr Struktur bei Prompts, Dateien und wiederkehrenden Aufgaben holst du deutlich mehr aus der gleichen Zeit heraus."

**21–26 · Fortgeschrittene/r KI-Nutzer 💪**
"Du hast KI schon gut in deinen Alltag integriert und nutzt sie bewusst. Jetzt geht es darum, die letzten Prozentpunkte rauszuholen — vor allem bei Automatisierung und der Verbindung mit deinen anderen Tools."

**27–32 · KI-Profi / Automatisierer 🏆**
"Du gehörst zu den Top-Anwendern: KI ist bei dir System, nicht Zufall. Der nächste sinnvolle Schritt ist, dein Wissen zu verfeinern, zu skalieren — oder anderen beizubringen, was du bereits gelernt hast."

**Überschrift über den Hebeln (alle Stufen):** "Deine größten Hebel gerade:" gefolgt von 1–2 Tipps aus der Tabelle unten.

### Personalisierte Hebel

Die 1–2 am niedrigsten bewerteten Fragen (Dimensionen) werden zusätzlich zur Stufe ausgespielt — macht das Ergebnis individuell, auch bei gleicher Stufe. Bei Gleichstand: die zuerst gestellte Frage (niedrigere `id`-Reihenfolge) gewinnt. Tipp-Text ist je Segment leicht angepasst:

| Dimension     | `solo`                                                                                                                             | `employee`                                                                                                              | `coach`                                                                                                                          | `default`                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `freq`        | Baue dir eine feste Routine auf — z. B. 15 Minuten täglich für eine Business-Aufgabe                                               | Baue dir eine feste Routine auf — z. B. 15 Minuten täglich im Job                                                       | Baue dir eine feste Routine auf — z. B. 15 Minuten täglich in der Klientenarbeit                                                 | Baue dir eine feste Routine auf — z. B. 15 Minuten täglich mit einer wiederkehrenden Aufgabe                     |
| `prompting`   | Nutze konkrete Prompts mit Kontext zu Kunde, Rolle und Format — verbessert deine Ergebnisse sofort spürbar                         | Nutze konkrete Prompts mit Kontext, Rolle und Format — verbessert deine Ergebnisse sofort spürbar                       | Nutze konkrete Prompts mit Kontext zu Zielgruppe, Rolle und Format — verbessert deine Ergebnisse sofort spürbar                  | Nutze konkrete Prompts mit Kontext, Rolle und Format — verbessert deine Ergebnisse sofort spürbar                |
| `tooling`     | Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug für dein Business | Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug im Job | Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug in der Beratung | Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug |
| `files`       | Baue dir eine strukturierte Wissensbasis mit Preisen, Ton und Vorlagen auf                                                         | Baue dir eine strukturierte Wissensbasis mit Vorlagen und wiederkehrenden Kontexten auf                                 | Baue dir eine strukturierte Wissensbasis mit Methoden und Vorlagen auf                                                           | Baue dir eine strukturierte Wissensbasis auf, damit die KI deinen Kontext kennt                                  |
| `automation`  | Identifiziere eine wiederkehrende Business-Aufgabe und automatisiere sie testweise                                                 | Identifiziere eine wiederkehrende Aufgabe in deinem Job und automatisiere sie testweise                                 | Identifiziere eine wiederkehrende Aufgabe in deiner Beratung und automatisiere sie testweise                                     | Identifiziere eine wiederkehrende Aufgabe und automatisiere sie testweise                                        |
| `integration` | Verbinde deine KI mit mindestens einem weiteren Business-Tool, um Medienbrüche zu vermeiden                                        | Verbinde deine KI mit mindestens einem weiteren Arbeits-Tool, um Medienbrüche zu vermeiden                              | Verbinde deine KI mit mindestens einem weiteren Tool (CRM, Kursplattform), um Medienbrüche zu vermeiden                          | Verbinde deine KI mit mindestens einem weiteren Tool, um Medienbrüche zu vermeiden                               |
| `quality`     | Etabliere einen kurzen Prüf-Schritt, bevor Ergebnisse an Kunden rausgehen                                                          | Etabliere einen kurzen Prüf-Schritt, bevor Ergebnisse an Kolleg:innen rausgehen                                         | Etabliere einen kurzen Prüf-Schritt, bevor Ergebnisse an Klient:innen rausgehen                                                  | Etabliere einen kurzen Prüf-Schritt vor dem Versenden von KI-Ergebnissen                                         |
| `timesaving`  | Tracke bewusst, wo du im Business Zeit sparst — hilft, KI gezielter einzusetzen                                                    | Tracke bewusst, wo du im Job Zeit sparst — hilft, KI gezielter einzusetzen                                              | Tracke bewusst, wo du in der Beratung Zeit sparst — hilft, KI gezielter einzusetzen                                              | Tracke bewusst, wo du Zeit sparst — hilft, KI gezielter einzusetzen                                              |

## Schritt 3 — E-Mail-Gate

Nach den 8 Fragen und dem Lade-Screen, vor dem Ergebnis:

**Headline:** "Fast geschafft!"

**Subline:** "Wohin dürfen wir dein persönliches Ergebnis schicken?"

**Felder:**

- "Vorname" — optional, Platzhaltertext: "Wie dürfen wir dich nennen?"
- "E-Mail-Adresse" — Pflichtfeld, Platzhaltertext: "deine@email.de"

**Consent-Checkbox** (Pflicht, falls E-Mail-Marketing folgt): "Ich möchte gelegentlich Tipps zu KI-Produktivität per E-Mail erhalten. Abmeldung jederzeit möglich."
DSGVO/Double-Opt-in über das jeweilige E-Mail-Tool umsetzen — rechtlich zu prüfen, nicht Teil dieses Konzepts.

**Button:** "Ergebnis anzeigen →"

**Trust-Line unter dem Button:** "Kein Spam. Deine Daten sind sicher."

**Fehlermeldungen:**

- E-Mail leer oder ungültiges Format: "Bitte gib eine gültige E-Mail-Adresse ein."
- Consent-Checkbox nicht gesetzt (falls Pflicht): "Bitte bestätige, um dein Ergebnis zu erhalten."

## Schritt 4 — Ergebnis-Screen: Aufbau & CTA

**Reihenfolge auf dem Ergebnis-Screen:**

1. Stufen-Headline + Score ("Dein Score: {score}/32")
2. Visuelle Anzeige (z. B. Balken/Gauge von 8–32)
3. Ergebnis-Fließtext (siehe Schritt 2)
4. "Deine größten Hebel gerade:" + 1–2 Tipps
5. CTA-Button zur nächsten Wertleiter-Stufe
6. Sekundärer Link: "Check nochmal machen" (führt zurück zum Intro-Screen)

**CTA-Button-Text je Stufe** (Ziel-URL pro Stufe noch offen, siehe unten):

| Stufe           | Button-Text                               |
| --------------- | ----------------------------------------- |
| KI-Neuling      | "Zeig mir den Einstieg →"                 |
| KI-Anwender     | "Zeig mir, wie ich mehr rausholen kann →" |
| Fortgeschritten | "Zeig mir die nächsten Schritte →"        |
| KI-Profi        | "Sprich mit mir über die nächste Stufe →" |

Noch offen, welches konkrete Angebot dahinterliegt — Empfehlung: CTA-Ziel je Stufe variieren, damit es zur Ergebnis-Botschaft passt:

- Neuling/Anwender → niedrigschwelliger nächster Schritt (z. B. Einstiegs-Guide, Workshop)
- Fortgeschritten/Profi → höherwertiger nächster Schritt (z. B. 1:1-Call, Premium-Angebot)

Sobald die konkrete nächste Stufe der Wertleiter feststeht, hier die tatsächlichen Ziel-Links ergänzen (Button-Texte oben können so bleiben).

## Datenmodell (Hinweis für die Umsetzung)

Empfohlene Struktur, damit Segment × Frage × Antwort eindeutig referenzierbar ist:

```
segments: [solo, employee, coach, default]
questions: [freq, prompting, tooling, files, automation, integration, quality, timesaving]  // feste Reihenfolge 1–8

question(segment, questionId) -> { text: string, options: [{ label: string, score: 1|2|3|4 }, ...4] }

Score-Berechnung: totalScore = sum(score aller 8 Antworten)  // 8–32, unabhängig vom Segment
Tier: siehe Tabelle Schritt 2
Hebel: die 1-2 questionIds mit niedrigstem Score -> Tipp aus Tabelle "Personalisierte Hebel", Spalte = gewähltes Segment
```

## Offene Punkte zum Testen

- Tier-Grenzen (8–14 / 15–20 / 21–26 / 27–32) sind ein erster Wurf — nach echten Antworten ggf. verschieben
- Ob 8 Fragen die richtige Länge sind (Drop-off beobachten, ggf. auf 5–6 kürzen)
- Ob die Segmentierungsfrage den Abschluss verbessert oder nur zusätzliche Reibung erzeugt — A/B testen
- Konkretes Angebot/Ziel-URL pro Stufe hinter dem CTA-Button (Button-Texte stehen, Ziele fehlen noch)
- Ob Consent-Checkbox im E-Mail-Gate Pflicht oder optional ist (abhängig vom E-Mail-Tool/Double-Opt-in-Setup)
- Visuelles Design (Farben, Icons, Gauge-Darstellung) ist bewusst nicht Teil dieses Dokuments — reine Content-/Logik-Spezifikation
