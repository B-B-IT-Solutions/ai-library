import { map } from "es-toolkit/compat";

import {
   PromptDescriptorCreateInput,
   PromptTemplateDescriptorCreateInput,
} from "@/generated/prisma/models";

const promptCategories = (categories: string[]) => {
   return map(categories, (cat: string) => {
      return {
         where: {
            name: cat,
         },
         create: {
            name: cat,
         },
      };
   });
};

export const promptsData: PromptDescriptorCreateInput[] = [
   {
      title: "SEO Blogartikel Erfassung",
      content:
         "Du bist Experte f\u00FCr KI-Technologie und Prompt Engineering. Verfasse einen 3000 W\u00F6rter langen Blogbeitrag mit dem Titel \u201EPrompting lernen: Die wichtigsten LLM-Grundlagen einfach erkl\u00E4rt\u201C. Integriere die folgenden Keywords, um die Suchmaschinen-Optimierung zu verbessern. haupt keywords: Prompting, Prompting lernen, bessere Prompts schreiben, neben keywords: LLM, LLM verstehen, KI. Die Gliederung auf der der Artikel basieren soll: \r\n\r\n1. Einleitung: Warum gutes Prompting kein Zufall ist\r\n- Kurze Einf\u00FChrung ins Thema Prompting\r\n- Typische Frustrationen: \u201EWarum versteht das Modell mich nicht?\u201C\r\n- Zentrale These des Artikels:  Wer bessere Prompts schreiben will, muss verstehen, wie Large Language Models denken\r\n- \u00DCberblick: Was Leser:innen im Artikel lernen\r\nSEO-Keywords: Prompting lernen, bessere Prompts schreiben, LLM verstehen\r\n\r\n2. Was ist ein Large Language Model (LLM)?\r\n2.1 Definition: Was bedeutet \u201ELarge Language Model\u201C?\r\n- Einfache Erkl\u00E4rung ohne mathematische Details\r\n- Abgrenzung zu klassischen Programmen\r\n- Beispiele: ChatGPT, Claude, Gemini\r\n2.2 Was ein LLM nicht ist\r\n- Kein Mensch\r\n- Kein Wissenslexikon\r\n- Kein \u201Edenkendes\u201C System\r\n- Warum diese Missverst\u00E4ndnisse zu schlechten Prompts f\u00FChren\r\nSEO-Keywords: Large Language Model Erkl\u00E4rung, was ist ein LLM\r\n\r\n3. Wie LLMs Sprache tats\u00E4chlich verarbeiten\r\n3.1 Token statt W\u00F6rter: Die kleinste Einheit eines LLM\r\n- Erkl\u00E4rung von Tokens\r\n- Warum Wortwahl und L\u00E4nge von Prompts wichtig sind\r\n- Auswirkungen auf Kontext und Pr\u00E4zision\r\n3.2 Wahrscheinlichkeiten statt Bedeutung\r\n- LLMs sagen nicht \u201Edie richtige Antwort\u201C, sondern die wahrscheinlichste\r\n- Wie jedes Wort im Prompt die Antworten beeinflusst\r\n- Zusammenhang zwischen den Eingaben im Prompt und dem Output des LLMs\r\nSEO-Keywords: Tokens, wie LLMs funktionieren, Sprachmodell Grundlagen",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptCategories(["reddit"]),
      },
   },
   {
      title: "Reddit Post Kommentare",
      content:
         'du bist ein erfahrener Startup Gr\u00FCnder und Community Manager. Du hast ein Reddit Post in r/KI_Welt erstellt, der lautet: \r\n\r\n"Hey zusammen,\r\n\r\nich wollte mal in die Runde fragen, wie ihr eure Prompts verwaltet, wenn ihr regelm\u00E4\u00DFig mit KI-Tools arbeitet.\r\n\r\n    Speichert ihr eure Prompts irgendwo (Notion, Obsidian, Docs, Textdateien, \u2026)?\r\n\r\n    Nutzt ihr Kategorien, Tags oder Versionen?\r\n\r\n    Habt ihr eine Sammlung f\u00FCr \u201Ebew\u00E4hrte\u201C Prompts?\r\n\r\n    Oder l\u00E4uft bei euch alles eher spontan und ad hoc?\r\n\r\nBei mir sammeln sich langsam immer mehr Prompts an und ich merke, dass es un\u00FCbersichtlich wird.\r\nMich w\u00FCrden deshalb eure Workflows, Tools oder einfachen Tricks interessieren \u2013 gerne auch low-tech L\u00F6sungen."\r\n\r\nEin Nuter hat folgendes geantwortet: "die prompts waren automatisch im titel der bilder die ich erstellt habe, sehr hilfreich ist aber lange her. ". \r\n\r\nEmphlene passende Reaktionen darauf?  Dein \u00FCbergeordnete Ziel ist Diskussion anzuregen, Mehrwert zu bieten und zwischen durch herauszufinden ob es ein Bedarf f\u00FCr beseere L\u00F6sungen f\u00FCr Prompts Verwaltung und Organisierung gibt.\r\n',
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptCategories(["reddit"]),
      },
   },
];
