import type { Dimension, Segment } from "./survey-data";

export interface StageResult {
   stage: 1 | 2 | 3 | 4;
   label: string;
   emoji: string;
   scoreRange: string;
   text: string;
   ctaText: string;
   ctaHref: string;
}

export const STAGE_RESULTS: Record<1 | 2 | 3 | 4, StageResult> = {
   1: {
      stage: 1,
      label: "KI-Neuling",
      emoji: "🌱",
      scoreRange: "8–14",
      text: "Du stehst noch ganz am Anfang deiner KI-Reise. Das ist kein Nachteil — im Gegenteil: Du kannst von Anfang an die richtigen Gewohnheiten aufbauen, statt dir später mühsame Ad-hoc-Nutzung abzugewöhnen. Mit ein paar gezielten Schritten sparst du schon bald spürbar Zeit.",
      ctaText: "Zeig mir den Einstieg →",
      ctaHref: "/explore",
   },
   2: {
      stage: 2,
      label: "KI-Anwender",
      emoji: "🚀",
      scoreRange: "15–20",
      text: "Du nutzt KI bereits im Alltag — aber eher punktuell und ohne festes System. Genau da liegt dein größtes Potenzial: Mit etwas mehr Struktur bei Prompts, Dateien und wiederkehrenden Aufgaben holst du deutlich mehr aus der gleichen Zeit heraus.",
      ctaText: "Zeig mir, wie ich mehr rausholen kann →",
      ctaHref: "/explore",
   },
   3: {
      stage: 3,
      label: "Fortgeschrittene/r KI-Nutzer",
      emoji: "💪",
      scoreRange: "21–26",
      text: "Du hast KI schon gut in deinen Alltag integriert und nutzt sie bewusst. Jetzt geht es darum, die letzten Prozentpunkte rauszuholen — vor allem bei Automatisierung und der Verbindung mit deinen anderen Tools.",
      ctaText: "Zeig mir die nächsten Schritte →",
      ctaHref: "/explore",
   },
   4: {
      stage: 4,
      label: "KI-Profi / Automatisierer",
      emoji: "🏆",
      scoreRange: "27–32",
      text: "Du gehörst zu den Top-Anwendern: KI ist bei dir System, nicht Zufall. Der nächste sinnvolle Schritt ist, dein Wissen zu verfeinern, zu skalieren — oder anderen beizubringen, was du bereits gelernt hast.",
      ctaText: "Sprich mit mir über die nächste Stufe →",
      ctaHref: "/explore",
   },
};

export const LEVER_TEXTS: Record<Dimension, Record<Segment, string>> = {
   freq: {
      solo: "Baue dir eine feste Routine auf — z. B. 15 Minuten täglich für eine Business-Aufgabe",
      employee:
         "Baue dir eine feste Routine auf — z. B. 15 Minuten täglich im Job",
      coach:
         "Baue dir eine feste Routine auf — z. B. 15 Minuten täglich in der Klientenarbeit",
      default:
         "Baue dir eine feste Routine auf — z. B. 15 Minuten täglich mit einer wiederkehrenden Aufgabe",
   },
   prompting: {
      solo: "Nutze konkrete Prompts mit Kontext zu Kunde, Rolle und Format — verbessert deine Ergebnisse sofort spürbar",
      employee:
         "Nutze konkrete Prompts mit Kontext, Rolle und Format — verbessert deine Ergebnisse sofort spürbar",
      coach:
         "Nutze konkrete Prompts mit Kontext zu Zielgruppe, Rolle und Format — verbessert deine Ergebnisse sofort spürbar",
      default:
         "Nutze konkrete Prompts mit Kontext, Rolle und Format — verbessert deine Ergebnisse sofort spürbar",
   },
   tooling: {
      solo: "Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug für dein Business",
      employee:
         "Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug im Job",
      coach:
         "Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug in der Beratung",
      default:
         "Lerne den Unterschied zwischen Chat und automatisierten Workflows kennen und nutze bewusst das passende Werkzeug",
   },
   files: {
      solo: "Baue dir eine strukturierte Wissensbasis mit Preisen, Ton und Vorlagen auf",
      employee:
         "Baue dir eine strukturierte Wissensbasis mit Vorlagen und wiederkehrenden Kontexten auf",
      coach: "Baue dir eine strukturierte Wissensbasis mit Methoden und Vorlagen auf",
      default:
         "Baue dir eine strukturierte Wissensbasis auf, damit die KI deinen Kontext kennt",
   },
   automation: {
      solo: "Identifiziere eine wiederkehrende Business-Aufgabe und automatisiere sie testweise",
      employee:
         "Identifiziere eine wiederkehrende Aufgabe in deinem Job und automatisiere sie testweise",
      coach:
         "Identifiziere eine wiederkehrende Aufgabe in deiner Beratung und automatisiere sie testweise",
      default:
         "Identifiziere eine wiederkehrende Aufgabe und automatisiere sie testweise",
   },
   integration: {
      solo: "Verbinde deine KI mit mindestens einem weiteren Business-Tool, um Medienbrüche zu vermeiden",
      employee:
         "Verbinde deine KI mit mindestens einem weiteren Arbeits-Tool, um Medienbrüche zu vermeiden",
      coach:
         "Verbinde deine KI mit mindestens einem weiteren Tool (CRM, Kursplattform), um Medienbrüche zu vermeiden",
      default:
         "Verbinde deine KI mit mindestens einem weiteren Tool, um Medienbrüche zu vermeiden",
   },
   quality: {
      solo: "Etabliere einen kurzen Prüf-Schritt, bevor Ergebnisse an Kunden rausgehen",
      employee:
         "Etabliere einen kurzen Prüf-Schritt, bevor Ergebnisse an Kolleg:innen rausgehen",
      coach: "Etabliere einen kurzen Prüf-Schritt, bevor Ergebnisse an Klient:innen rausgehen",
      default:
         "Etabliere einen kurzen Prüf-Schritt vor dem Versenden von KI-Ergebnissen",
   },
   timesaving: {
      solo: "Tracke bewusst, wo du im Business Zeit sparst — hilft, KI gezielter einzusetzen",
      employee:
         "Tracke bewusst, wo du im Job Zeit sparst — hilft, KI gezielter einzusetzen",
      coach:
         "Tracke bewusst, wo du in der Beratung Zeit sparst — hilft, KI gezielter einzusetzen",
      default:
         "Tracke bewusst, wo du Zeit sparst — hilft, KI gezielter einzusetzen",
   },
};
