# Implementierungs-Spezifikation: KI-Readiness-Check Survey

Technische Spec für die Umsetzung des Survey-Funnels. Inhaltliche Grundlage: `docs/Survey-Funnel-KI-Readiness-Check.md`.

---

## Dateistruktur

```
src/app/ki-readiness-check/
  page.tsx                          # Server Component (Metadata + Shell)

src/components/survey/
  SurveyContainer.tsx               # 'use client' — orchestriert alle Steps
  IntroScreen.tsx
  SegmentStep.tsx
  QuestionStep.tsx                  # wiederverwendet für alle 8 Fragen
  AnalysisLoader.tsx                # optischer Lade-Moment (~1,5 s)
  EmailGateStep.tsx
  ResultScreen.tsx
  ProgressBar.tsx

src/lib/
  survey-data.ts                    # typisierte Fragen/Antworten-Konstante (alle Segmente)
  survey-scoring.ts                 # calculateStage(), calculateLevers()
  survey-levers.ts                  # Hebel-Texte je Dimension × Segment

src/actions/
  survey.ts                         # submitSurvey Server Action

src/repositories/
  SurveyRepository.ts

prisma/schema.prisma                # + SurveySubmission-Modell
src/middleware.ts                   # /ki-readiness-check als public Route
```

---

## Prisma-Modell

```prisma
model SurveySubmission {
  id        String   @id @default(cuid())
  email     String
  firstName String?
  segment   String   // "solo" | "employee" | "coach" | "default"
  answers   Json     // { freq: 3, prompting: 2, tooling: 4, ... }
  total     Int      // Summe aller 8 Scores, Bereich 8–32
  stage     Int      // Ergebnis-Stufe 1–4
  createdAt DateTime @default(now())
}
```

Nach Änderung: `npm run db:migrate && npm run db:generate`

---

## TypeScript-Typen (`src/lib/survey-data.ts`)

```ts
export type Segment = 'solo' | 'employee' | 'coach' | 'default';

export type Dimension =
  | 'freq'
  | 'prompting'
  | 'tooling'
  | 'files'
  | 'automation'
  | 'integration'
  | 'quality'
  | 'timesaving';

export type Score = 1 | 2 | 3 | 4;

export type SurveyAnswers = Record<Dimension, Score>;

export interface AnswerOption {
  score: Score;
  label: string;
}

export interface Question {
  id: Dimension;
  text: string;
  answers: [AnswerOption, AnswerOption, AnswerOption, AnswerOption]; // immer genau 4
}

export type SurveyData = Record<Segment, [Question, Question, Question, Question, Question, Question, Question, Question]>;
// immer genau 8 Fragen je Segment — Reihenfolge identisch, nur Text/Beispiele variieren
```

---

## Survey-Daten-Konstante (vollständig)

```ts
// src/lib/survey-data.ts
export const SURVEY_DATA: SurveyData = {
  solo: [
    {
      id: 'freq',
      text: 'Wie oft nutzt du KI-Tools wie Claude aktuell für dein Business?',
      answers: [
        { score: 1, label: 'Nie oder kaum' },
        { score: 2, label: 'Ein paar Mal im Monat, z. B. für einzelne Texte' },
        { score: 3, label: 'Mehrmals pro Woche, z. B. für Angebote, Content, Kundenkommunikation' },
        { score: 4, label: 'Täglich, fester Bestandteil meines Arbeitsalltags' },
      ],
    },
    {
      id: 'prompting',
      text: 'Wie sehen deine Anfragen an die KI typischerweise aus, wenn du z. B. ein Angebot, eine E-Mail oder einen Social-Media-Post erstellen lässt?',
      answers: [
        { score: 1, label: 'Kurze, allgemeine Anfrage ohne viel Kontext ("Schreib mir ein Angebot")' },
        { score: 2, label: 'Ich gebe manchmal Kontext (z. B. Kundenname), aber nicht systematisch' },
        { score: 3, label: 'Ich gebe meist Kontext zu Kunde, Ziel und gewünschtem Format' },
        { score: 4, label: 'Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ' },
      ],
    },
    {
      id: 'tooling',
      text: 'Weißt du, wann du einfachen Chat vs. automatisierte Workflows für wiederkehrende Business-Aufgaben einsetzen solltest?',
      answers: [
        { score: 1, label: 'Kenne den Unterschied nicht wirklich' },
        { score: 2, label: 'Nutze nur den einfachen Chat, auch für wiederkehrende Aufgaben' },
        { score: 3, label: 'Kenne den Unterschied, nutze weiterführende Funktionen aber selten' },
        { score: 4, label: 'Wechsle bewusst zwischen Chat und automatisierten Workflows, je nach Aufgabe' },
      ],
    },
    {
      id: 'files',
      text: 'Wie arbeitest du mit deinen eigenen Geschäftsunterlagen (z. B. Preislisten, Angebote, Kundendaten) in der KI?',
      answers: [
        { score: 1, label: 'Ich lade nie eigene Dateien hoch' },
        { score: 2, label: 'Gelegentlich, einzelne Dateien, z. B. mal ein Angebot als Vorlage' },
        { score: 3, label: 'Regelmäßig, auch strukturiert, z. B. in einem Projekt/Wissensordner' },
        { score: 4, label: 'Systematisch — eigene Wissensbasis mit Preisen, Ton, Vorlagen, wiederverwendbar' },
      ],
    },
    {
      id: 'automation',
      text: 'Automatisierst du mit KI wiederkehrende Business-Aufgaben (z. B. Angebote, Reports, Social-Media-Planung)?',
      answers: [
        { score: 1, label: 'Noch nie darüber nachgedacht' },
        { score: 2, label: 'Idee vorhanden, aber nicht umgesetzt' },
        { score: 3, label: 'Ein bis zwei Automatisierungen im Einsatz, z. B. ein wöchentlicher Report' },
        { score: 4, label: 'Mehrere feste Automatisierungen, die regelmäßig Zeit sparen' },
      ],
    },
    {
      id: 'integration',
      text: 'Ist deine KI mit deinen Business-Tools verbunden (z. B. E-Mail, Kalender, Buchhaltung, CRM)?',
      answers: [
        { score: 1, label: 'Nein, komplett isoliert' },
        { score: 2, label: 'Nein, aber ich sehe den Nutzen' },
        { score: 3, label: 'Eine Verbindung eingerichtet, z. B. E-Mail oder Kalender' },
        { score: 4, label: 'Mehrere Tools verbunden — KI ist Teil meines Geschäftssystems' },
      ],
    },
    {
      id: 'quality',
      text: 'Wie gehst du mit KI-Ergebnissen um, bevor du sie an Kunden versendest oder veröffentlichst?',
      answers: [
        { score: 1, label: 'Übernehme meist direkt, ohne zu prüfen' },
        { score: 2, label: 'Prüfe nur bei wichtigen Kunden/Anlässen kurz' },
        { score: 3, label: 'Prüfe meist gründlich und passe an mein Business an' },
        { score: 4, label: 'Habe einen festen Prüf-/Freigabeprozess, bevor etwas rausgeht' },
      ],
    },
    {
      id: 'timesaving',
      text: 'Wie viel Zeit sparst du aktuell realistisch pro Woche in deinem Business durch KI-Einsatz?',
      answers: [
        { score: 1, label: 'Keine, oder kaum spürbar' },
        { score: 2, label: 'Unter 1 Stunde' },
        { score: 3, label: '1–3 Stunden' },
        { score: 4, label: 'Mehr als 3 Stunden' },
      ],
    },
  ],

  employee: [
    {
      id: 'freq',
      text: 'Wie oft nutzt du KI-Tools wie Claude aktuell in deinem Job?',
      answers: [
        { score: 1, label: 'Nie oder kaum' },
        { score: 2, label: 'Ein paar Mal im Monat' },
        { score: 3, label: 'Mehrmals pro Woche, z. B. für E-Mails, Recherche, Reports' },
        { score: 4, label: 'Täglich, fester Bestandteil meines Arbeitsalltags' },
      ],
    },
    {
      id: 'prompting',
      text: 'Wie sehen deine Anfragen an die KI typischerweise aus, wenn du z. B. eine E-Mail, ein Protokoll oder eine Zusammenfassung erstellen lässt?',
      answers: [
        { score: 1, label: 'Kurze, allgemeine Anfrage ohne viel Kontext' },
        { score: 2, label: 'Ich gebe manchmal Kontext, aber nicht systematisch' },
        { score: 3, label: 'Ich gebe meist Kontext zu Empfänger, Ziel und Format' },
        { score: 4, label: 'Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ' },
      ],
    },
    {
      id: 'tooling',
      text: 'Weißt du, wann du einfachen Chat vs. automatisierte Workflows für wiederkehrende Aufgaben im Job einsetzen solltest?',
      answers: [
        { score: 1, label: 'Kenne den Unterschied nicht wirklich' },
        { score: 2, label: 'Nutze nur den einfachen Chat' },
        { score: 3, label: 'Kenne den Unterschied, nutze weiterführende Funktionen aber selten' },
        { score: 4, label: 'Wechsle bewusst zwischen Chat und automatisierten Workflows' },
      ],
    },
    {
      id: 'files',
      text: 'Wie arbeitest du mit internen Dokumenten (z. B. Reports, Vorlagen, Meeting-Notizen) in der KI?',
      answers: [
        { score: 1, label: 'Ich lade nie eigene Dateien hoch' },
        { score: 2, label: 'Gelegentlich, einzelne Dateien' },
        { score: 3, label: 'Regelmäßig, auch strukturiert, z. B. in einem Projekt' },
        { score: 4, label: 'Systematisch — eigene Wissensbasis mit Vorlagen und wiederverwendbaren Kontexten' },
      ],
    },
    {
      id: 'automation',
      text: 'Automatisierst du mit KI wiederkehrende Aufgaben in deinem Job (z. B. wöchentliche Reports, Status-Updates)?',
      answers: [
        { score: 1, label: 'Noch nie darüber nachgedacht' },
        { score: 2, label: 'Idee vorhanden, aber nicht umgesetzt' },
        { score: 3, label: 'Ein bis zwei Automatisierungen im Einsatz' },
        { score: 4, label: 'Mehrere feste Automatisierungen, die regelmäßig Zeit sparen' },
      ],
    },
    {
      id: 'integration',
      text: 'Ist deine KI mit deinen Arbeits-Tools verbunden (z. B. E-Mail, Kalender, Slack, Drive)?',
      answers: [
        { score: 1, label: 'Nein, komplett isoliert' },
        { score: 2, label: 'Nein, aber ich sehe den Nutzen' },
        { score: 3, label: 'Eine Verbindung eingerichtet' },
        { score: 4, label: 'Mehrere Tools verbunden — KI ist Teil meines Arbeitsalltags' },
      ],
    },
    {
      id: 'quality',
      text: 'Wie gehst du mit KI-Ergebnissen um, bevor du sie an Kolleg:innen oder Vorgesetzte weitergibst?',
      answers: [
        { score: 1, label: 'Übernehme meist direkt, ohne zu prüfen' },
        { score: 2, label: 'Prüfe nur bei wichtigen Anlässen kurz' },
        { score: 3, label: 'Prüfe meist gründlich und passe an' },
        { score: 4, label: 'Habe einen festen Prüf-/Freigabeprozess' },
      ],
    },
    {
      id: 'timesaving',
      text: 'Wie viel Zeit sparst du aktuell realistisch pro Woche in deinem Job durch KI-Einsatz?',
      answers: [
        { score: 1, label: 'Keine, oder kaum spürbar' },
        { score: 2, label: 'Unter 1 Stunde' },
        { score: 3, label: '1–3 Stunden' },
        { score: 4, label: 'Mehr als 3 Stunden' },
      ],
    },
  ],

  coach: [
    {
      id: 'freq',
      text: 'Wie oft nutzt du KI-Tools wie Claude aktuell in deiner Beratungs- oder Coaching-Tätigkeit?',
      answers: [
        { score: 1, label: 'Nie oder kaum' },
        { score: 2, label: 'Ein paar Mal im Monat' },
        { score: 3, label: 'Mehrmals pro Woche, z. B. für Konzepte, Content, Klientenunterlagen' },
        { score: 4, label: 'Täglich, fester Bestandteil meiner Arbeit' },
      ],
    },
    {
      id: 'prompting',
      text: 'Wie sehen deine Anfragen an die KI typischerweise aus, wenn du z. B. ein Konzept, eine Workshop-Unterlage oder einen Beitrag erstellen lässt?',
      answers: [
        { score: 1, label: 'Kurze, allgemeine Anfrage ohne viel Kontext' },
        { score: 2, label: 'Ich gebe manchmal Kontext, aber nicht systematisch' },
        { score: 3, label: 'Ich gebe meist Kontext zu Zielgruppe, Ziel und Format' },
        { score: 4, label: 'Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ' },
      ],
    },
    {
      id: 'tooling',
      text: 'Weißt du, wann du einfachen Chat vs. automatisierte Workflows für wiederkehrende Klientenarbeit einsetzen solltest?',
      answers: [
        { score: 1, label: 'Kenne den Unterschied nicht wirklich' },
        { score: 2, label: 'Nutze nur den einfachen Chat' },
        { score: 3, label: 'Kenne den Unterschied, nutze weiterführende Funktionen aber selten' },
        { score: 4, label: 'Wechsle bewusst zwischen Chat und automatisierten Workflows' },
      ],
    },
    {
      id: 'files',
      text: 'Wie arbeitest du mit deinen eigenen Unterlagen (z. B. Beratungskonzepte, Workshop-Material, Klientendaten) in der KI?',
      answers: [
        { score: 1, label: 'Ich lade nie eigene Dateien hoch' },
        { score: 2, label: 'Gelegentlich, einzelne Dateien' },
        { score: 3, label: 'Regelmäßig, auch strukturiert, z. B. in einem Projekt' },
        { score: 4, label: 'Systematisch — eigene Wissensbasis mit Methoden, Vorlagen, wiederverwendbaren Kontexten' },
      ],
    },
    {
      id: 'automation',
      text: 'Automatisierst du mit KI wiederkehrende Aufgaben in deiner Beratung (z. B. Angebote, Follow-ups, Content)?',
      answers: [
        { score: 1, label: 'Noch nie darüber nachgedacht' },
        { score: 2, label: 'Idee vorhanden, aber nicht umgesetzt' },
        { score: 3, label: 'Ein bis zwei Automatisierungen im Einsatz' },
        { score: 4, label: 'Mehrere feste Automatisierungen, die regelmäßig Zeit sparen' },
      ],
    },
    {
      id: 'integration',
      text: 'Ist deine KI mit deinen Tools verbunden (z. B. E-Mail, Kalender, CRM, Kursplattform)?',
      answers: [
        { score: 1, label: 'Nein, komplett isoliert' },
        { score: 2, label: 'Nein, aber ich sehe den Nutzen' },
        { score: 3, label: 'Eine Verbindung eingerichtet' },
        { score: 4, label: 'Mehrere Tools verbunden — KI ist Teil meines Beratungssystems' },
      ],
    },
    {
      id: 'quality',
      text: 'Wie gehst du mit KI-Ergebnissen um, bevor du sie an Klient:innen weitergibst oder veröffentlichst?',
      answers: [
        { score: 1, label: 'Übernehme meist direkt, ohne zu prüfen' },
        { score: 2, label: 'Prüfe nur bei wichtigen Klient:innen/Anlässen kurz' },
        { score: 3, label: 'Prüfe meist gründlich und passe an meine Methodik an' },
        { score: 4, label: 'Habe einen festen Prüf-/Freigabeprozess, bevor etwas rausgeht' },
      ],
    },
    {
      id: 'timesaving',
      text: 'Wie viel Zeit sparst du aktuell realistisch pro Woche in deiner Beratungstätigkeit durch KI-Einsatz?',
      answers: [
        { score: 1, label: 'Keine, oder kaum spürbar' },
        { score: 2, label: 'Unter 1 Stunde' },
        { score: 3, label: '1–3 Stunden' },
        { score: 4, label: 'Mehr als 3 Stunden' },
      ],
    },
  ],

  default: [
    {
      id: 'freq',
      text: 'Wie oft nutzt du KI-Tools wie Claude aktuell?',
      answers: [
        { score: 1, label: 'Nie oder kaum' },
        { score: 2, label: 'Ein paar Mal im Monat' },
        { score: 3, label: 'Mehrmals pro Woche, z. B. für Texte, Recherche, Organisation' },
        { score: 4, label: 'Täglich, fester Bestandteil meines Alltags' },
      ],
    },
    {
      id: 'prompting',
      text: 'Wie sehen deine Anfragen (Prompts) an die KI typischerweise aus?',
      answers: [
        { score: 1, label: 'Kurze, allgemeine Anfrage ohne viel Kontext' },
        { score: 2, label: 'Ich gebe manchmal Kontext, aber nicht systematisch' },
        { score: 3, label: 'Ich gebe meist Kontext, Format und Ziel klar vor' },
        { score: 4, label: 'Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ' },
      ],
    },
    {
      id: 'tooling',
      text: 'Weißt du, wann du einfachen Chat vs. automatisierte Workflows einsetzen solltest?',
      answers: [
        { score: 1, label: 'Kenne den Unterschied nicht wirklich' },
        { score: 2, label: 'Nutze nur den einfachen Chat' },
        { score: 3, label: 'Kenne den Unterschied, nutze weiterführende Funktionen aber selten' },
        { score: 4, label: 'Wechsle bewusst zwischen Chat und automatisierten Workflows' },
      ],
    },
    {
      id: 'files',
      text: 'Wie arbeitest du mit deinen eigenen Dokumenten oder Daten in der KI?',
      answers: [
        { score: 1, label: 'Ich lade nie eigene Dateien hoch' },
        { score: 2, label: 'Gelegentlich, einzelne Dateien' },
        { score: 3, label: 'Regelmäßig, auch strukturiert, z. B. in Projekten' },
        { score: 4, label: 'Systematisch — eigene Wissensbasis, wiederverwendbare Kontexte' },
      ],
    },
    {
      id: 'automation',
      text: 'Automatisierst du mit KI wiederkehrende Aufgaben?',
      answers: [
        { score: 1, label: 'Noch nie darüber nachgedacht' },
        { score: 2, label: 'Idee vorhanden, aber nicht umgesetzt' },
        { score: 3, label: 'Ein bis zwei Automatisierungen im Einsatz' },
        { score: 4, label: 'Mehrere feste Automatisierungen, die regelmäßig Zeit sparen' },
      ],
    },
    {
      id: 'integration',
      text: 'Ist deine KI mit deinen anderen Tools verbunden (z. B. E-Mail, Kalender, Drive)?',
      answers: [
        { score: 1, label: 'Nein, komplett isoliert' },
        { score: 2, label: 'Nein, aber ich sehe den Nutzen' },
        { score: 3, label: 'Eine Verbindung eingerichtet' },
        { score: 4, label: 'Mehrere Tools verbunden — KI ist Teil meines Systems' },
      ],
    },
    {
      id: 'quality',
      text: 'Wie gehst du mit KI-Ergebnissen um, bevor du sie nutzt oder versendest?',
      answers: [
        { score: 1, label: 'Übernehme meist direkt, ohne zu prüfen' },
        { score: 2, label: 'Prüfe nur bei wichtigen Dingen kurz' },
        { score: 3, label: 'Prüfe meist gründlich und passe an' },
        { score: 4, label: 'Habe einen festen Prüf-/Freigabeprozess' },
      ],
    },
    {
      id: 'timesaving',
      text: 'Wie viel Zeit sparst du aktuell realistisch pro Woche durch KI-Einsatz?',
      answers: [
        { score: 1, label: 'Keine, oder kaum spürbar' },
        { score: 2, label: 'Unter 1 Stunde' },
        { score: 3, label: '1–3 Stunden' },
        { score: 4, label: 'Mehr als 3 Stunden' },
      ],
    },
  ],
};
```

---

## Scoring-Logik (`src/lib/survey-scoring.ts`)

```ts
import type { SurveyAnswers, Dimension } from './survey-data';

// Score-Bereich: 8–32 (8 Fragen × 1–4 Punkte)
export function calculateStage(total: number): 1 | 2 | 3 | 4 {
  if (total <= 14) return 1; // KI-Neuling
  if (total <= 20) return 2; // KI-Anwender
  if (total <= 26) return 3; // Fortgeschritten
  return 4;                  // KI-Profi
}

// Gibt die 2 Dimensionen mit niedrigstem Score zurück.
// Bei Gleichstand gewinnt die frühere Position in der festen Dimension-Reihenfolge.
const DIMENSION_ORDER: Dimension[] = [
  'freq', 'prompting', 'tooling', 'files',
  'automation', 'integration', 'quality', 'timesaving',
];

export function calculateLevers(answers: SurveyAnswers): [Dimension, Dimension] {
  const sorted = DIMENSION_ORDER
    .map((dim) => ({ dim, score: answers[dim] }))
    .sort((a, b) => a.score - b.score || 0);
  return [sorted[0].dim, sorted[1].dim];
}
```

---

## Hebel-Texte (`src/lib/survey-levers.ts`)

```ts
import type { Dimension, Segment } from './survey-data';

export const LEVER_TEXTS: Record<Dimension, Record<Segment, string>> = {
  freq: {
    solo:     'Baue dir eine feste Routine auf — z. B. 15 Minuten täglich für eine Business-Aufgabe',
    employee: 'Baue dir eine feste Routine auf — z. B. 15 Minuten täglich im Job',
    coach:    'Baue dir eine feste Routine auf — z. B. 15 Minuten täglich in der Klientenarbeit',
    default:  'Baue dir eine feste Routine auf — z. B. 15 Minuten täglich mit einer wiederkehrenden Aufgabe',
  },
  prompting: {
    solo:     'Nutze konkrete Prompts mit Kontext zu Kunde, Rolle und Format — verbessert deine Ergebnisse sofort spürbar',
    employee: 'Nutze konkrete Prompts mit Kontext, Rolle und Format — verbessert deine Ergebnisse sofort spürbar',
    coach:    'Nutze konkrete Prompts mit Kontext zu Zielgruppe, Rolle und Format — verbessert deine Ergebnisse sofort spürbar',
    default:  'Nutze konkrete Prompts mit Kontext, Rolle und Format — verbessert deine Ergebnisse sofort spürbar',
  },
  tooling: {
    solo:     'Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug für dein Business',
    employee: 'Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug im Job',
    coach:    'Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug in der Beratung',
    default:  'Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug',
  },
  files: {
    solo:     'Baue dir eine strukturierte Wissensbasis mit Preisen, Ton und Vorlagen auf',
    employee: 'Baue dir eine strukturierte Wissensbasis mit Vorlagen und wiederkehrenden Kontexten auf',
    coach:    'Baue dir eine strukturierte Wissensbasis mit Methoden und Vorlagen auf',
    default:  'Baue dir eine strukturierte Wissensbasis auf, damit die KI deinen Kontext kennt',
  },
  automation: {
    solo:     'Identifiziere eine wiederkehrende Business-Aufgabe und automatisiere sie testweise',
    employee: 'Identifiziere eine wiederkehrende Aufgabe in deinem Job und automatisiere sie testweise',
    coach:    'Identifiziere eine wiederkehrende Aufgabe in deiner Beratung und automatisiere sie testweise',
    default:  'Identifiziere eine wiederkehrende Aufgabe und automatisiere sie testweise',
  },
  integration: {
    solo:     'Verbinde deine KI mit mindestens einem weiteren Business-Tool, um Medienbrüche zu vermeiden',
    employee: 'Verbinde deine KI mit mindestens einem weiteren Arbeits-Tool, um Medienbrüche zu vermeiden',
    coach:    'Verbinde deine KI mit mindestens einem weiteren Tool (CRM, Kursplattform), um Medienbrüche zu vermeiden',
    default:  'Verbinde deine KI mit mindestens einem weiteren Tool, um Medienbrüche zu vermeiden',
  },
  quality: {
    solo:     'Etabliere einen kurzen Prüf-Schritt, bevor Ergebnisse an Kunden rausgehen',
    employee: 'Etabliere einen kurzen Prüf-Schritt, bevor Ergebnisse an Kolleg:innen rausgehen',
    coach:    'Etabliere einen kurzen Prüf-Schritt, bevor Ergebnisse an Klient:innen rausgehen',
    default:  'Etabliere einen kurzen Prüf-Schritt vor dem Versenden von KI-Ergebnissen',
  },
  timesaving: {
    solo:     'Tracke bewusst, wo du im Business Zeit sparst — hilft, KI gezielter einzusetzen',
    employee: 'Tracke bewusst, wo du im Job Zeit sparst — hilft, KI gezielter einzusetzen',
    coach:    'Tracke bewusst, wo du in der Beratung Zeit sparst — hilft, KI gezielter einzusetzen',
    default:  'Tracke bewusst, wo du Zeit sparst — hilft, KI gezielter einzusetzen',
  },
};
```

---

## Ergebnis-Texte

```ts
// src/lib/survey-results.ts
import type { Score } from './survey-data';

export interface StageResult {
  stage: 1 | 2 | 3 | 4;
  label: string;
  emoji: string;
  scoreRange: string;
  text: string;
  ctaText: string;
  ctaHref: string; // TODO: konkrete URLs eintragen, sobald Wertleiter-Stufe 2 fertig ist
}

export const STAGE_RESULTS: Record<1 | 2 | 3 | 4, StageResult> = {
  1: {
    stage: 1,
    label: 'KI-Neuling',
    emoji: '🌱',
    scoreRange: '8–14',
    text: 'Du stehst noch ganz am Anfang deiner KI-Reise. Das ist kein Nachteil — im Gegenteil: Du kannst von Anfang an die richtigen Gewohnheiten aufbauen, statt dir später mühsame Ad-hoc-Nutzung abzugewöhnen. Mit ein paar gezielten Schritten sparst du schon bald spürbar Zeit.',
    ctaText: 'Zeig mir den Einstieg →',
    ctaHref: '/TODO', // Placeholder
  },
  2: {
    stage: 2,
    label: 'KI-Anwender',
    emoji: '🚀',
    scoreRange: '15–20',
    text: 'Du nutzt KI bereits im Alltag — aber eher punktuell und ohne festes System. Genau da liegt dein größtes Potenzial: Mit etwas mehr Struktur bei Prompts, Dateien und wiederkehrenden Aufgaben holst du deutlich mehr aus der gleichen Zeit heraus.',
    ctaText: 'Zeig mir, wie ich mehr rausholen kann →',
    ctaHref: '/TODO',
  },
  3: {
    stage: 3,
    label: 'Fortgeschrittene/r KI-Nutzer',
    emoji: '💪',
    scoreRange: '21–26',
    text: 'Du hast KI schon gut in deinen Alltag integriert und nutzt sie bewusst. Jetzt geht es darum, die letzten Prozentpunkte rauszuholen — vor allem bei Automatisierung und der Verbindung mit deinen anderen Tools.',
    ctaText: 'Zeig mir die nächsten Schritte →',
    ctaHref: '/TODO',
  },
  4: {
    stage: 4,
    label: 'KI-Profi / Automatisierer',
    emoji: '🏆',
    scoreRange: '27–32',
    text: 'Du gehörst zu den Top-Anwendern: KI ist bei dir System, nicht Zufall. Der nächste sinnvolle Schritt ist, dein Wissen zu verfeinern, zu skalieren — oder anderen beizubringen, was du bereits gelernt hast.',
    ctaText: 'Sprich mit mir über die nächste Stufe →',
    ctaHref: '/TODO',
  },
};
```

---

## Step-Flow & State

```
Step 0  → IntroScreen
Step 1  → SegmentStep        (Segment-Auswahl)
Step 2  → QuestionStep[0]    (freq)
Step 3  → QuestionStep[1]    (prompting)
...
Step 9  → QuestionStep[7]    (timesaving)
Step 10 → AnalysisLoader     (1,5–2 s, kein echter Netzwerkaufruf)
Step 11 → EmailGateStep      → ruft submitSurvey Server Action auf
Step 12 → ResultScreen
```

```ts
// State-Shape in SurveyContainer
interface SurveyState {
  step: number;                          // 0–12
  segment: Segment | null;
  answers: Partial<SurveyAnswers>;       // befüllt sich Frage für Frage
  firstName: string;
  email: string;
  result: {
    stage: 1 | 2 | 3 | 4;
    total: number;
    levers: [Dimension, Dimension];
  } | null;
}
```

**Transitions:**
- Step 1 → Step 2: Segment-Auswahl (kein Button nötig, Klick auf Card)
- Step 2–9: Antwort-Auswahl löst automatisch `step + 1` aus (Auto-Advance)
- Step 9 → 10: Antwort-Auswahl auf Frage 8
- Step 10 → 11: `setTimeout(1500)` in `AnalysisLoader.onDone`
- Step 11 → 12: Server Action erfolgreich, result in State gesetzt
- "Zurück"-Button auf Steps 2–9: `step - 1`, vorherige Antwort bleibt markiert

**ProgressBar:** sichtbar auf Steps 2–9. Zeigt `Frage {step - 1} von 8`.

---

## Server Action (`src/actions/survey.ts`)

```ts
'use server';

import { z } from 'zod';
import { SurveyRepository } from '@/repositories/SurveyRepository';
import { calculateStage, calculateLevers } from '@/lib/survey-scoring';
import type { SurveyAnswers, Segment, Dimension } from '@/lib/survey-data';

const DimensionEnum = z.enum([
  'freq', 'prompting', 'tooling', 'files',
  'automation', 'integration', 'quality', 'timesaving',
]);
const ScoreEnum = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);

const SubmitSchema = z.object({
  email:     z.string().email('Bitte gib eine gültige E-Mail-Adresse ein.'),
  firstName: z.string().optional(),
  segment:   z.enum(['solo', 'employee', 'coach', 'default']),
  answers:   z.record(DimensionEnum, ScoreEnum),
});

export async function submitSurvey(raw: unknown): Promise<{
  stage: 1 | 2 | 3 | 4;
  total: number;
  levers: [Dimension, Dimension];
}> {
  const { email, firstName, segment, answers } = SubmitSchema.parse(raw);
  const typedAnswers = answers as SurveyAnswers;

  const total = Object.values(typedAnswers).reduce((sum, s) => sum + s, 0);
  const stage = calculateStage(total);
  const levers = calculateLevers(typedAnswers);

  const repo = new SurveyRepository();
  await repo.create({
    email,
    firstName: firstName ?? null,
    segment: segment as Segment,
    answers: typedAnswers,
    total,
    stage,
  });

  return { stage, total, levers };
}
```

---

## Repository (`src/repositories/SurveyRepository.ts`)

```ts
import { prisma } from '@/lib/prisma';
import type { SurveyAnswers, Segment } from '@/lib/survey-data';

export class SurveyRepository {
  async create(data: {
    email: string;
    firstName: string | null;
    segment: Segment;
    answers: SurveyAnswers;
    total: number;
    stage: number;
  }) {
    return prisma.surveySubmission.create({ data });
  }
}
```

---

## Page (`src/app/ki-readiness-check/page.tsx`)

```tsx
import type { Metadata } from 'next';
import { SurveyContainer } from '@/components/survey/SurveyContainer';

export const metadata: Metadata = {
  title: 'KI-Readiness-Check — Wie gut hast du KI integriert?',
  description:
    'Mach den kostenlosen 2-Minuten-Check und erfahre, wo du stehst — und was dein nächster Schritt sein sollte.',
};

export default function KiReadinessCheckPage() {
  return <SurveyContainer />;
}
```

---

## Middleware

`/ki-readiness-check` muss in der bestehenden Middleware als öffentliche Route eingetragen werden. Den genauen Ort (Matcher-Array, `publicRoutes`-Liste o. ä.) in `src/middleware.ts` prüfen und ergänzen.

---

## E-Mail-Gate: Felder & Copy

| Element | Text |
|---|---|
| Headline | "Fast geschafft!" |
| Subline | "Wohin dürfen wir dein persönliches Ergebnis schicken?" |
| Feld 1 | Vorname (optional) — Placeholder: "Wie dürfen wir dich nennen?" |
| Feld 2 | E-Mail (Pflicht) — Placeholder: "deine@email.de" |
| Checkbox | "Ich möchte gelegentlich Tipps zu KI-Produktivität per E-Mail erhalten. Abmeldung jederzeit möglich." |
| Button | "Ergebnis anzeigen →" |
| Trust-Line | "Kein Spam. Deine Daten sind sicher." |
| Fehler E-Mail | "Bitte gib eine gültige E-Mail-Adresse ein." |
| Fehler Checkbox | "Bitte bestätige, um dein Ergebnis zu erhalten." |

DSGVO/Double-Opt-in: liegt beim E-Mail-Tool, nicht in diesem Feature.

---

## Ergebnis-Screen: Aufbau

1. Stufen-Label + Emoji + Score ("Dein Score: {total}/32")
2. Visueller Score-Balken (8–32)
3. Ergebnis-Fließtext (aus `STAGE_RESULTS`)
4. Überschrift "Deine größten Hebel gerade:" + 2 Hebel-Texte (aus `LEVER_TEXTS[dim][segment]`)
5. CTA-Button (Text + Link aus `STAGE_RESULTS`)
6. Sekundärlink: "Check nochmal machen" → `step = 0`, State reset

---

## Tests

### Unit-Tests (Pflicht)

**`src/lib/survey-scoring.test.ts`**
- `calculateStage`: Grenzen testen (8, 14, 15, 20, 21, 26, 27, 32) + Midpoints
- `calculateLevers`: gibt 2 niedrigste Dimensionen zurück; Gleichstand folgt Dimension-Reihenfolge

**`src/actions/survey.test.ts`** (Prisma gemockt)
- Happy path: korrekte `stage`, `total`, `levers` zurückgegeben; `repo.create` aufgerufen
- Ungültige E-Mail wirft Zod-Error
- Ungültiger Score-Wert (z. B. 5) wirft Zod-Error

**`src/repositories/SurveyRepository.test.ts`** (Prisma gemockt)
- `create` wird mit korrekten Daten aufgerufen

### Komponenten-Tests

**`SurveyContainer.test.tsx`**
- Happy path: vollständiger Durchlauf von Intro bis ResultScreen (Server Action gemockt)
- "Zurück"-Button auf Frage 3 springt zu Frage 2 und zeigt vorherige Antwort als selected

**`QuestionStep.test.tsx`**
- Rendert Frage und alle 4 Antwort-Optionen
- Klick auf eine Antwort ruft `onAnswer(score)` mit korrektem Score auf

**`EmailGateStep.test.tsx`**
- Submit ohne E-Mail: Fehlermeldung erscheint, `onSubmit` nicht aufgerufen
- Submit mit gültiger E-Mail: `onSubmit` aufgerufen

**`ResultScreen.test.tsx`**
- Rendert korrekte Stufe, Score und Hebel-Texte für alle 4 Stufen und alle 4 Segmente

---

## Offene Punkte (nicht Teil dieser Implementierung)

- **CTA-URLs**: `ctaHref` in `STAGE_RESULTS` mit konkreten Ziel-URLs befüllen, sobald Wertleiter-Stufe 2 steht
- **E-Mail-Versand**: Transaktionale Bestätigungs-E-Mail via Resend (Phase 2)
- **Consent/Double-Opt-in**: abhängig vom E-Mail-Tool, rechtlich klären
- **Tier-Grenzen**: nach ersten ~100 Submissions anhand Score-Verteilung adjustieren
