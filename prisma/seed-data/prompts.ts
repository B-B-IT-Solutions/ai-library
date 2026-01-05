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
      title: "Reddit Post Kommentare",
      content:
         'du bist ein erfahrener Startup Gr\u00FCnder und hast ein Reddit Post in r/KI_Welt erstellt, der lautet: \r\n\r\n"Hey zusammen,\r\n\r\nich wollte mal in die Runde fragen, wie ihr eure Prompts verwaltet, wenn ihr regelm\u00E4\u00DFig mit KI-Tools arbeitet.\r\n\r\n    Speichert ihr eure Prompts irgendwo (Notion, Obsidian, Docs, Textdateien, \u2026)?\r\n\r\n    Nutzt ihr Kategorien, Tags oder Versionen?\r\n\r\n    Habt ihr eine Sammlung f\u00FCr \u201Ebew\u00E4hrte\u201C Prompts?\r\n\r\n    Oder l\u00E4uft bei euch alles eher spontan und ad hoc?\r\n\r\nBei mir sammeln sich langsam immer mehr Prompts an und ich merke, dass es un\u00FCbersichtlich wird.\r\nMich w\u00FCrden deshalb eure Workflows, Tools oder einfachen Tricks interessieren \u2013 gerne auch low-tech L\u00F6sungen."\r\n\r\nEin Nuter hat folgendes geantwortet: "die prompts waren automatisch im titel der bilder die ich erstellt habe, sehr hilfreich ist aber lange her". \r\n\r\nEmphlene passende Reaktionen darauf?  Dein \u00FCbergeordenete Ziel ist herauszufinden ob es ein Bedarf f\u00FCr beseere L\u00F6sungen f\u00FCr Prompts Verwaltung und Organisierung gibt.\r\n',
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptCategories(["reddit"]),
      },
   },
];
