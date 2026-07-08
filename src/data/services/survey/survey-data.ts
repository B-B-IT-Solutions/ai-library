import type {
   DSurveyQuestion,
   DSurveySegment,
} from "@/data/types/domain/survey";

export type SurveyData = Record<
   DSurveySegment,
   [
      DSurveyQuestion,
      DSurveyQuestion,
      DSurveyQuestion,
      DSurveyQuestion,
      DSurveyQuestion,
      DSurveyQuestion,
      DSurveyQuestion,
      DSurveyQuestion,
   ]
>;

export const SEGMENT_LABELS: Record<DSurveySegment, string> = {
   solo: "Ich führe mein eigenes (kleines) Unternehmen",
   employee: "Ich bin angestellt und nutze KI für meinen Job",
   coach: "Ich berate oder coache andere",
   default: "Etwas anderes",
};

export const SURVEY_DATA: SurveyData = {
   solo: [
      {
         id: "freq",
         text: "Wie oft nutzt du KI-Tools wie Claude aktuell für dein Business?",
         answers: [
            { score: 1, label: "Nie oder kaum" },
            {
               score: 2,
               label: "Ein paar Mal im Monat, z. B. für einzelne Texte",
            },
            {
               score: 3,
               label: "Mehrmals pro Woche, z. B. für Angebote, Content, Kundenkommunikation",
            },
            {
               score: 4,
               label: "Täglich, fester Bestandteil meines Arbeitsalltags",
            },
         ],
      },
      {
         id: "prompting",
         text: "Wie sehen deine Anfragen an die KI typischerweise aus, wenn du z. B. ein Angebot, eine E-Mail oder einen Social-Media-Post erstellen lässt?",
         answers: [
            {
               score: 1,
               label: 'Kurze, allgemeine Anfrage ohne viel Kontext ("Schreib mir ein Angebot")',
            },
            {
               score: 2,
               label: "Ich gebe manchmal Kontext (z. B. Kundenname), aber nicht systematisch",
            },
            {
               score: 3,
               label: "Ich gebe meist Kontext zu Kunde, Ziel und gewünschtem Format",
            },
            {
               score: 4,
               label: "Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ",
            },
         ],
      },
      {
         id: "tooling",
         text: "Weißt du, wann du einfachen Chat vs. automatisierte Workflows für wiederkehrende Business-Aufgaben einsetzen solltest?",
         answers: [
            { score: 1, label: "Kenne den Unterschied nicht wirklich" },
            {
               score: 2,
               label: "Nutze nur den einfachen Chat, auch für wiederkehrende Aufgaben",
            },
            {
               score: 3,
               label: "Kenne den Unterschied, nutze weiterführende Funktionen aber selten",
            },
            {
               score: 4,
               label: "Wechsle bewusst zwischen Chat und automatisierten Workflows, je nach Aufgabe",
            },
         ],
      },
      {
         id: "files",
         text: "Wie arbeitest du mit deinen eigenen Geschäftsunterlagen (z. B. Preislisten, Angebote, Kundendaten) in der KI?",
         answers: [
            { score: 1, label: "Ich lade nie eigene Dateien hoch" },
            {
               score: 2,
               label: "Gelegentlich, einzelne Dateien, z. B. mal ein Angebot als Vorlage",
            },
            {
               score: 3,
               label: "Regelmäßig, auch strukturiert, z. B. in einem Projekt/Wissensordner",
            },
            {
               score: 4,
               label: "Systematisch — eigene Wissensbasis mit Preisen, Ton, Vorlagen, wiederverwendbar",
            },
         ],
      },
      {
         id: "automation",
         text: "Automatisierst du mit KI wiederkehrende Business-Aufgaben (z. B. Angebote, Reports, Social-Media-Planung)?",
         answers: [
            { score: 1, label: "Noch nie darüber nachgedacht" },
            { score: 2, label: "Idee vorhanden, aber nicht umgesetzt" },
            {
               score: 3,
               label: "Ein bis zwei Automatisierungen im Einsatz, z. B. ein wöchentlicher Report",
            },
            {
               score: 4,
               label: "Mehrere feste Automatisierungen, die regelmäßig Zeit sparen",
            },
         ],
      },
      {
         id: "integration",
         text: "Ist deine KI mit deinen Business-Tools verbunden (z. B. E-Mail, Kalender, Buchhaltung, CRM)?",
         answers: [
            { score: 1, label: "Nein, komplett isoliert" },
            { score: 2, label: "Nein, aber ich sehe den Nutzen" },
            {
               score: 3,
               label: "Eine Verbindung eingerichtet, z. B. E-Mail oder Kalender",
            },
            {
               score: 4,
               label: "Mehrere Tools verbunden — KI ist Teil meines Geschäftssystems",
            },
         ],
      },
      {
         id: "quality",
         text: "Wie gehst du mit KI-Ergebnissen um, bevor du sie an Kunden versendest oder veröffentlichst?",
         answers: [
            { score: 1, label: "Übernehme meist direkt, ohne zu prüfen" },
            {
               score: 2,
               label: "Prüfe nur bei wichtigen Kunden/Anlässen kurz",
            },
            {
               score: 3,
               label: "Prüfe meist gründlich und passe an mein Business an",
            },
            {
               score: 4,
               label: "Habe einen festen Prüf-/Freigabeprozess, bevor etwas rausgeht",
            },
         ],
      },
      {
         id: "timesaving",
         text: "Wie viel Zeit sparst du aktuell realistisch pro Woche in deinem Business durch KI-Einsatz?",
         answers: [
            { score: 1, label: "Keine, oder kaum spürbar" },
            { score: 2, label: "Unter 1 Stunde" },
            { score: 3, label: "1–3 Stunden" },
            { score: 4, label: "Mehr als 3 Stunden" },
         ],
      },
   ],

   employee: [
      {
         id: "freq",
         text: "Wie oft nutzt du KI-Tools wie Claude aktuell in deinem Job?",
         answers: [
            { score: 1, label: "Nie oder kaum" },
            { score: 2, label: "Ein paar Mal im Monat" },
            {
               score: 3,
               label: "Mehrmals pro Woche, z. B. für E-Mails, Recherche, Reports",
            },
            {
               score: 4,
               label: "Täglich, fester Bestandteil meines Arbeitsalltags",
            },
         ],
      },
      {
         id: "prompting",
         text: "Wie sehen deine Anfragen an die KI typischerweise aus, wenn du z. B. eine E-Mail, ein Protokoll oder eine Zusammenfassung erstellen lässt?",
         answers: [
            {
               score: 1,
               label: "Kurze, allgemeine Anfrage ohne viel Kontext",
            },
            {
               score: 2,
               label: "Ich gebe manchmal Kontext, aber nicht systematisch",
            },
            {
               score: 3,
               label: "Ich gebe meist Kontext zu Empfänger, Ziel und Format",
            },
            {
               score: 4,
               label: "Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ",
            },
         ],
      },
      {
         id: "tooling",
         text: "Weißt du, wann du einfachen Chat vs. automatisierte Workflows für wiederkehrende Aufgaben im Job einsetzen solltest?",
         answers: [
            { score: 1, label: "Kenne den Unterschied nicht wirklich" },
            { score: 2, label: "Nutze nur den einfachen Chat" },
            {
               score: 3,
               label: "Kenne den Unterschied, nutze weiterführende Funktionen aber selten",
            },
            {
               score: 4,
               label: "Wechsle bewusst zwischen Chat und automatisierten Workflows",
            },
         ],
      },
      {
         id: "files",
         text: "Wie arbeitest du mit internen Dokumenten (z. B. Reports, Vorlagen, Meeting-Notizen) in der KI?",
         answers: [
            { score: 1, label: "Ich lade nie eigene Dateien hoch" },
            { score: 2, label: "Gelegentlich, einzelne Dateien" },
            {
               score: 3,
               label: "Regelmäßig, auch strukturiert, z. B. in einem Projekt",
            },
            {
               score: 4,
               label: "Systematisch — eigene Wissensbasis mit Vorlagen und wiederverwendbaren Kontexten",
            },
         ],
      },
      {
         id: "automation",
         text: "Automatisierst du mit KI wiederkehrende Aufgaben in deinem Job (z. B. wöchentliche Reports, Status-Updates)?",
         answers: [
            { score: 1, label: "Noch nie darüber nachgedacht" },
            { score: 2, label: "Idee vorhanden, aber nicht umgesetzt" },
            {
               score: 3,
               label: "Ein bis zwei Automatisierungen im Einsatz",
            },
            {
               score: 4,
               label: "Mehrere feste Automatisierungen, die regelmäßig Zeit sparen",
            },
         ],
      },
      {
         id: "integration",
         text: "Ist deine KI mit deinen Arbeits-Tools verbunden (z. B. E-Mail, Kalender, Slack, Drive)?",
         answers: [
            { score: 1, label: "Nein, komplett isoliert" },
            { score: 2, label: "Nein, aber ich sehe den Nutzen" },
            { score: 3, label: "Eine Verbindung eingerichtet" },
            {
               score: 4,
               label: "Mehrere Tools verbunden — KI ist Teil meines Arbeitsalltags",
            },
         ],
      },
      {
         id: "quality",
         text: "Wie gehst du mit KI-Ergebnissen um, bevor du sie an Kolleg:innen oder Vorgesetzte weitergibst?",
         answers: [
            { score: 1, label: "Übernehme meist direkt, ohne zu prüfen" },
            { score: 2, label: "Prüfe nur bei wichtigen Anlässen kurz" },
            { score: 3, label: "Prüfe meist gründlich und passe an" },
            { score: 4, label: "Habe einen festen Prüf-/Freigabeprozess" },
         ],
      },
      {
         id: "timesaving",
         text: "Wie viel Zeit sparst du aktuell realistisch pro Woche in deinem Job durch KI-Einsatz?",
         answers: [
            { score: 1, label: "Keine, oder kaum spürbar" },
            { score: 2, label: "Unter 1 Stunde" },
            { score: 3, label: "1–3 Stunden" },
            { score: 4, label: "Mehr als 3 Stunden" },
         ],
      },
   ],

   coach: [
      {
         id: "freq",
         text: "Wie oft nutzt du KI-Tools wie Claude aktuell in deiner Beratungs- oder Coaching-Tätigkeit?",
         answers: [
            { score: 1, label: "Nie oder kaum" },
            { score: 2, label: "Ein paar Mal im Monat" },
            {
               score: 3,
               label: "Mehrmals pro Woche, z. B. für Konzepte, Content, Klientenunterlagen",
            },
            {
               score: 4,
               label: "Täglich, fester Bestandteil meiner Arbeit",
            },
         ],
      },
      {
         id: "prompting",
         text: "Wie sehen deine Anfragen an die KI typischerweise aus, wenn du z. B. ein Konzept, eine Workshop-Unterlage oder einen Beitrag erstellen lässt?",
         answers: [
            {
               score: 1,
               label: "Kurze, allgemeine Anfrage ohne viel Kontext",
            },
            {
               score: 2,
               label: "Ich gebe manchmal Kontext, aber nicht systematisch",
            },
            {
               score: 3,
               label: "Ich gebe meist Kontext zu Zielgruppe, Ziel und Format",
            },
            {
               score: 4,
               label: "Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ",
            },
         ],
      },
      {
         id: "tooling",
         text: "Weißt du, wann du einfachen Chat vs. automatisierte Workflows für wiederkehrende Klientenarbeit einsetzen solltest?",
         answers: [
            { score: 1, label: "Kenne den Unterschied nicht wirklich" },
            { score: 2, label: "Nutze nur den einfachen Chat" },
            {
               score: 3,
               label: "Kenne den Unterschied, nutze weiterführende Funktionen aber selten",
            },
            {
               score: 4,
               label: "Wechsle bewusst zwischen Chat und automatisierten Workflows",
            },
         ],
      },
      {
         id: "files",
         text: "Wie arbeitest du mit deinen eigenen Unterlagen (z. B. Beratungskonzepte, Workshop-Material, Klientendaten) in der KI?",
         answers: [
            { score: 1, label: "Ich lade nie eigene Dateien hoch" },
            { score: 2, label: "Gelegentlich, einzelne Dateien" },
            {
               score: 3,
               label: "Regelmäßig, auch strukturiert, z. B. in einem Projekt",
            },
            {
               score: 4,
               label: "Systematisch — eigene Wissensbasis mit Methoden, Vorlagen, wiederverwendbaren Kontexten",
            },
         ],
      },
      {
         id: "automation",
         text: "Automatisierst du mit KI wiederkehrende Aufgaben in deiner Beratung (z. B. Angebote, Follow-ups, Content)?",
         answers: [
            { score: 1, label: "Noch nie darüber nachgedacht" },
            { score: 2, label: "Idee vorhanden, aber nicht umgesetzt" },
            {
               score: 3,
               label: "Ein bis zwei Automatisierungen im Einsatz",
            },
            {
               score: 4,
               label: "Mehrere feste Automatisierungen, die regelmäßig Zeit sparen",
            },
         ],
      },
      {
         id: "integration",
         text: "Ist deine KI mit deinen Tools verbunden (z. B. E-Mail, Kalender, CRM, Kursplattform)?",
         answers: [
            { score: 1, label: "Nein, komplett isoliert" },
            { score: 2, label: "Nein, aber ich sehe den Nutzen" },
            { score: 3, label: "Eine Verbindung eingerichtet" },
            {
               score: 4,
               label: "Mehrere Tools verbunden — KI ist Teil meines Beratungssystems",
            },
         ],
      },
      {
         id: "quality",
         text: "Wie gehst du mit KI-Ergebnissen um, bevor du sie an Klient:innen weitergibst oder veröffentlichst?",
         answers: [
            { score: 1, label: "Übernehme meist direkt, ohne zu prüfen" },
            {
               score: 2,
               label: "Prüfe nur bei wichtigen Klient:innen/Anlässen kurz",
            },
            {
               score: 3,
               label: "Prüfe meist gründlich und passe an meine Methodik an",
            },
            {
               score: 4,
               label: "Habe einen festen Prüf-/Freigabeprozess, bevor etwas rausgeht",
            },
         ],
      },
      {
         id: "timesaving",
         text: "Wie viel Zeit sparst du aktuell realistisch pro Woche in deiner Beratungstätigkeit durch KI-Einsatz?",
         answers: [
            { score: 1, label: "Keine, oder kaum spürbar" },
            { score: 2, label: "Unter 1 Stunde" },
            { score: 3, label: "1–3 Stunden" },
            { score: 4, label: "Mehr als 3 Stunden" },
         ],
      },
   ],

   default: [
      {
         id: "freq",
         text: "Wie oft nutzt du KI-Tools wie Claude aktuell?",
         answers: [
            { score: 1, label: "Nie oder kaum" },
            { score: 2, label: "Ein paar Mal im Monat" },
            {
               score: 3,
               label: "Mehrmals pro Woche, z. B. für Texte, Recherche, Organisation",
            },
            {
               score: 4,
               label: "Täglich, fester Bestandteil meines Alltags",
            },
         ],
      },
      {
         id: "prompting",
         text: "Wie sehen deine Anfragen (Prompts) an die KI typischerweise aus?",
         answers: [
            {
               score: 1,
               label: "Kurze, allgemeine Anfrage ohne viel Kontext",
            },
            {
               score: 2,
               label: "Ich gebe manchmal Kontext, aber nicht systematisch",
            },
            {
               score: 3,
               label: "Ich gebe meist Kontext, Format und Ziel klar vor",
            },
            {
               score: 4,
               label: "Ich gebe klare Rolle, Kontext und Format vor und verfeinere das Ergebnis iterativ",
            },
         ],
      },
      {
         id: "tooling",
         text: "Weißt du, wann du einfachen Chat vs. automatisierte Workflows einsetzen solltest?",
         answers: [
            { score: 1, label: "Kenne den Unterschied nicht wirklich" },
            { score: 2, label: "Nutze nur den einfachen Chat" },
            {
               score: 3,
               label: "Kenne den Unterschied, nutze weiterführende Funktionen aber selten",
            },
            {
               score: 4,
               label: "Wechsle bewusst zwischen Chat und automatisierten Workflows",
            },
         ],
      },
      {
         id: "files",
         text: "Wie arbeitest du mit deinen eigenen Dokumenten oder Daten in der KI?",
         answers: [
            { score: 1, label: "Ich lade nie eigene Dateien hoch" },
            { score: 2, label: "Gelegentlich, einzelne Dateien" },
            {
               score: 3,
               label: "Regelmäßig, auch strukturiert, z. B. in Projekten",
            },
            {
               score: 4,
               label: "Systematisch — eigene Wissensbasis, wiederverwendbare Kontexte",
            },
         ],
      },
      {
         id: "automation",
         text: "Automatisierst du mit KI wiederkehrende Aufgaben?",
         answers: [
            { score: 1, label: "Noch nie darüber nachgedacht" },
            { score: 2, label: "Idee vorhanden, aber nicht umgesetzt" },
            {
               score: 3,
               label: "Ein bis zwei Automatisierungen im Einsatz",
            },
            {
               score: 4,
               label: "Mehrere feste Automatisierungen, die regelmäßig Zeit sparen",
            },
         ],
      },
      {
         id: "integration",
         text: "Ist deine KI mit deinen anderen Tools verbunden (z. B. E-Mail, Kalender, Drive)?",
         answers: [
            { score: 1, label: "Nein, komplett isoliert" },
            { score: 2, label: "Nein, aber ich sehe den Nutzen" },
            { score: 3, label: "Eine Verbindung eingerichtet" },
            {
               score: 4,
               label: "Mehrere Tools verbunden — KI ist Teil meines Systems",
            },
         ],
      },
      {
         id: "quality",
         text: "Wie gehst du mit KI-Ergebnissen um, bevor du sie nutzt oder versendest?",
         answers: [
            { score: 1, label: "Übernehme meist direkt, ohne zu prüfen" },
            { score: 2, label: "Prüfe nur bei wichtigen Dingen kurz" },
            { score: 3, label: "Prüfe meist gründlich und passe an" },
            { score: 4, label: "Habe einen festen Prüf-/Freigabeprozess" },
         ],
      },
      {
         id: "timesaving",
         text: "Wie viel Zeit sparst du aktuell realistisch pro Woche durch KI-Einsatz?",
         answers: [
            { score: 1, label: "Keine, oder kaum spürbar" },
            { score: 2, label: "Unter 1 Stunde" },
            { score: 3, label: "1–3 Stunden" },
            { score: 4, label: "Mehr als 3 Stunden" },
         ],
      },
   ],
};
