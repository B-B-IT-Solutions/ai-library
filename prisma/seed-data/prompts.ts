import { map } from "es-toolkit/compat";

import { PromptDescriptorCreateInput } from "@/generated/prisma/models";

const promptCategories = (userId: string, categories: string[]) => {
   return map(categories, (cat: string) => {
      return {
         where: {
            userId_name: { userId, name: cat },
         },
         create: {
            name: cat,
            userId,
         },
      };
   });
};

export const promptsData = (userId: string): PromptDescriptorCreateInput[] => [
   {
      user: { connect: { id: userId } },
      title: "Vision Notes - Produktbeschreibung",
      content:
         "Du bist ein Verkauf-Experte. Ich habe ein Prompt App entwickelt, die erm\u00F6glicht den Nutzers ihre eigene Prompt Bibliothek erstellen und verwalten. Die App hat 3 Hauptbestandteile.\r\n\r\n1. KI Prompt Builder\r\n2. KI Prompt Bibliothek\r\n3. KI Prompt Vorlagen\r\n\r\nIch brauche f\u00FCr jeden Teil einen Namen und eine kurze knackige Produktbeschreibung (ein Satz), wie sie in der Megamenuliste der App erschienen soll. Der Name und die Beschreibung soll Interesse wecken und den Mehrwert vermitteln.\\\r\n\\\r\nWichtig meine App ist auf Deutsch und zielt auf DACH Region ab.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptCategories(userId, ["reddit"]),
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Vision Notes - Landing Page",
      content:
         "Erstelle eine vollst\u00E4ndig ausgearbeitete Landing Page f\u00FCr folgende App:\r\n\r\nName der App: Vision Notes\r\nBeschreibung der App: Die Prompt-App f\u00FCr echte KI-Effizienz\r\nProdukte, die die App beinhaltet:\r\nPrompt Studio: Entwickle hochwertige KI-Prompts mit System \u2013 von der Idee bis zur perfekten Ausf\u00FChrung\r\nPrompt Vault: Verwalte, organisiere und finde deine besten Prompts jederzeit wieder \u2013 zentral, \u00FCbersichtlich und effizient\r\nPrompt Blueprints: Vorgefertigte Prompt-Blueprints f\u00FCr professionelle KI-Ergebnisse auf Knopfdruck\r\nDie App ist f\u00FCr Einzel Nutzer bestimmt (nicht f\u00FCr Teams).\r\nVerwende eine moderne, klare und \u00FCberzeugende Schreibweise.\r\n\r\nStruktur der Landing Page:\r\n\r\nHero-Sektion mit starkem Haupt-Claim, Subheadline und CTA.\r\nProblem- > L\u00F6sung-Logik: Beschreibe die Schwierigkeiten der Zielgruppe in der Arbeit mit KI und wie ohne geeignete Tools das volles Potenzial der KI nicht gesch\u00F6pft ist.\r\nFeature-Highlights: Liste die Produkte klar strukturiert auf. Stelle die Produkte als notwendige Bausteine, der effektiven Arbeit mit KI.\r\nSocial Proof: Testimonials, Trust-Elemente oder G\u00FCtesiegel einf\u00FCgen (falls keine vorhanden, generiere realistische Beispiele).\r\nAbschlie\u00DFender CTA mit Dringlichkeit\/Mehrwert.\r\nTonality & Style: \u2013 Professionell, vertrauensw\u00FCrdig, inspirierend \u2013 Klar, ohne Fachjargon \u2013 Conversion-optimiert\r\n\r\nSEO: \u2013 Verwende relevante Keywords \u2013 Nutze sprechende Zwischen\u00FCberschriften \u2013 F\u00FCge Meta Title & Meta Description hinzu\r\n\r\nOutput:\r\n\r\nSaubere, formatierte Struktur. Vermeide Aufz\u00E4hlungen.\r\nDer Problem Abschnitt soll aus einem kurzen pr\u00E4gnanter Badge, einem Titel (der zusammenfassend die Herausforderung bei der KI-Arbeit hervorhebt) und einem kurzen Untertitel bestehen. Der Abschnitt soll 3 Unterabschnitte beinhalten. Jede Unterabschnitt hat dann eine \u00DCberschrift und eine kurze 150 - 300 Zeichen lange Erkl\u00E4rung.\r\nDer L\u00F6sung Abschnitt soll aus einem kurzen pr\u00E4gnanter Badge, einem Titel (der zusammenfassend der L\u00F6sung in Form dieser App andeutet) und einem kurzen Untertitel bestehen. Der Abschnitt soll 3 Unterabschnitte beinhalten. Jeder Unterabschnitt hat dann eine \u00DCberschrift und eine kurze 150 - 300 Zeichen lange Erkl\u00E4rung.\r\nFeatures Abschnitt soll aus einem kurzen pr\u00E4gnanten Titel und Untertitel bestehen.\r\nJeder Feature soll einem Produkt entsprechen und soll eine \u00DCberschrift ( der ideale weise den Namen des Produkt beinhaltet oder auf ihn hinweist) und eine kurze 200 Zeichen lange Erkl\u00E4rung des Produkts erhalten.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptCategories(userId, ["reddit"]),
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Universeller Prompt zur Erstellung einer Landing Page",
      content:
         "Erstelle eine vollst\u00E4ndig ausgearbeitete Landing Page f\u00FCr folgendes Angebot:\r\n\r\nName des Produkts: Prompt Blueprints\r\nBeschreibung des Produkts: Vorgefertigte Prompt-Vorlagen f\u00FCr professionelle KI-Ergebnisse auf Knopfdruck\r\nDas Produkt ist f\u00FCr Einzel Nutzer bestimmt (nicht f\u00FCr Teams).\r\nVerwende eine moderne, klare und \u00FCberzeugende Schreibweise.\r\n\r\nStruktur der Landing Page:\r\n\r\nHero-Sektion mit starkem Haupt-Claim, Subheadline und CTA.\r\nProblem- > L\u00F6sung-Logik: Beschreibe das Problem der Zielgruppe und wie das Angebot es l\u00F6st.\r\nFeature-Highlights: Liste die wichtigsten Funktionen\/Benefits klar strukturiert auf.\r\nSocial Proof: Testimonials, Trust-Elemente oder G\u00FCtesiegel einf\u00FCgen (falls keine vorhanden, generiere realistische Beispiele).\r\nDetailbeschreibung des Angebots inkl. Value Proposition.\r\nFAQ-Bereich mit typischen Kundenfragen.\r\nAbschlie\u00DFender CTA mit Dringlichkeit\/Mehrwert.\r\nTonality & Style: \u2013 Professionell, vertrauensw\u00FCrdig, inspirierend \u2013 Klar, ohne Fachjargon \u2013 Conversion-optimiert\r\n\r\nSEO: \u2013 Verwende relevante Keywords \u2013 Nutze sprechende Zwischen\u00FCberschriften \u2013 F\u00FCge Meta Title & Meta Description hinzu\r\n\r\nOutput:\r\n\r\nSaubere, formatierte Struktur. Vermeide Aufz\u00E4hlungen.\r\nDer Problem Abschnitt soll aus ein kurzer pr\u00E4gnanter Badge, einem Titel (der zusammenfassend die Schwierigkeiten der Nutzer hervorhebt) und einer Beschreibung bestehen. Die Beschreibung soll 2 Abs\u00E4tze jeder 160 - 170 Zeichen lang sein\r\nDer L\u00F6sung Abschnitt soll aus ein kurzer pr\u00E4gnanter Badge, einem Titel (der zusammenfassend die Erleichterung der Nutzer hervorhebt) und einer Beschreibung bestehen. Die Beschreibung soll 2 Abs\u00E4tze jeder 160 - 170 Zeichen lang sein.\r\nFeatures Abschnitt soll aus ein kurzer pr\u00E4gnanter Badge, einem Titel und Untertitel bestehen.\r\n6 Features. Jede Feature soll eine \u00DCberschrift, eine Unterschrift und eine kurze 160 Zeichen lange Erkl\u00E4rung erhalten.\r\nFAQ Abschnitt soll einen k\u00FCrzen Hinweis (100 Zeichen) erhalten.\r\n6 hilfreiche Fragen",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptCategories(userId, ["reddit"]),
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SEO Blogartikel Erfassung",
      content:
         "Du bist Experte f\u00FCr KI-Technologie und Prompt Engineering. Verfasse einen 3000 W\u00F6rter langen Blogbeitrag mit dem Titel \u201EPrompting lernen: Die wichtigsten LLM-Grundlagen einfach erkl\u00E4rt\u201C. Integriere die folgenden Keywords, um die Suchmaschinen-Optimierung zu verbessern. haupt keywords: Prompting, Prompting lernen, bessere Prompts schreiben, neben keywords: LLM, LLM verstehen, KI. Die Gliederung auf der der Artikel basieren soll: \r\n\r\n1. Einleitung: Warum gutes Prompting kein Zufall ist\r\n- Kurze Einf\u00FChrung ins Thema Prompting\r\n- Typische Frustrationen: \u201EWarum versteht das Modell mich nicht?\u201C\r\n- Zentrale These des Artikels:  Wer bessere Prompts schreiben will, muss verstehen, wie Large Language Models denken\r\n- \u00DCberblick: Was Leser:innen im Artikel lernen\r\nSEO-Keywords: Prompting lernen, bessere Prompts schreiben, LLM verstehen\r\n\r\n2. Was ist ein Large Language Model (LLM)?\r\n2.1 Definition: Was bedeutet \u201ELarge Language Model\u201C?\r\n- Einfache Erkl\u00E4rung ohne mathematische Details\r\n- Abgrenzung zu klassischen Programmen\r\n- Beispiele: ChatGPT, Claude, Gemini\r\n2.2 Was ein LLM nicht ist\r\n- Kein Mensch\r\n- Kein Wissenslexikon\r\n- Kein \u201Edenkendes\u201C System\r\n- Warum diese Missverst\u00E4ndnisse zu schlechten Prompts f\u00FChren\r\n\r\n3. Training & Wissen: Woher LLMs ihr Wissen haben\r\n3.1 Trainingsdaten: Texte aus dem Internet (vereinfacht erkl\u00E4rt)\r\n- Allgemeine Beschreibung des Trainingsprozesses\r\n- Warum LLMs Muster erkennen, nicht Fakten \u201Elernen\u201C\r\n3.2 Wissensgrenzen und Halluzinationen\r\n- Knowledge Cutoff\r\n- Warum LLMs \u00FCberzeugend falsche Antworten geben k\u00F6nnen\r\n\r\n4. Wie LLMs Sprache tats\u00E4chlich verarbeiten\r\n4.1 Token statt W\u00F6rter: Die kleinste Einheit eines LLM\r\n- Erkl\u00E4rung von Tokens\r\n- Warum Wortwahl und L\u00E4nge von Prompts wichtig sind\r\n- Auswirkungen auf Kontext und Pr\u00E4zision\r\n4.2 Wahrscheinlichkeiten statt Bedeutung\r\n- LLMs sagen nicht \u201Edie richtige Antwort\u201C, sondern die wahrscheinlichste\r\n- Wie jedes Wort im Prompt die Antworten beeinflusst\r\n- Zusammenhang zwischen den Eingaben im Prompt und dem Output des LLMs\r\n\r\n5. Auswirkungen f\u00FCr den Schreiben von Prompts\r\n5.1. Grundprinzip: LLMs erg\u00E4nzen fehlende Informationen\r\n- LLMs arbeiten auf Basis von Wahrscheinlichkeiten\r\n- Fehlende oder uneindeutige Angaben werden automatisch vom Modell erg\u00E4nzt\r\n- Art der Erg\u00E4nzung h\u00E4ngt von Trainingsdaten und Modellarchitektur ab\r\n5.2 Auswirkung auf die Gestaltung von Prompts\r\na) Vage Prompts\r\n - Eignen sich f\u00FCr explorative Aufgaben/Ideenfindung ohne klare Richtung (Beispiel: Themenfindung f\u00FCr Blogartikel)\r\n- Greift auf Modellwissen zur\u00FCckgreifen und l\u00E4sst bewusst dem Model Freiraum \r\nb) Detaillierte Prompts\r\n- Eignen sich f\u00FCr pr\u00E4zise Ergebnisse, wenn man klare Vorstellung vom gew\u00FCnschten Output hat\r\n- des Model muss alle n\u00F6tigen Informationen f\u00FCr zielgenaue Ausf\u00FChrung erh\u00E4ltan\r\n\r\n6. Der Schl\u00FCssel zu besseren Prompts\r\n- um genauere Ergebnisse zu erzielen muss genauer beschreiben k\u00F6nnen was ist das gew\u00FCnschte Ergebnis \r\n6.1 Die zwei S\u00E4ulen effektiver Prompts\r\na) Sachlicher Inhalt des Prompts \u2013 was ist zu erreichen?\r\n- Klare Beschreibung des gew\u00FCnschten Ergebnisses\r\n- Sie m\u00FCssen in der Lage sein pr\u00E4zise zu formulieren, was Sie wollen?\r\n- Je konkreter die Anfrage, desto besser das Ergebnis\r\nb) Formaler Inhalt des Prompts\r\n- KI verarbeitet unmenge an Daten\r\n- um genauere Ergebnisse zu Erzielen m\u00FCssen wir sagen auf welche Daten das Model zugreifen soll\r\n- z.b. durch Festlegung des Wissensbereichs und der Perspektive\r\n6.3 Das Wechselspiel beider S\u00E4ule\r\n- Idealfall: Beide Elemente vorhanden \r\n- Kompensation: Fehlender sachlicher Inhalt kann durch starke Kontextsetzung ausgeglichen werden\r\n- Risiko: Fehlen beide Teile, bestimmt allein die KI das Ergebnis\r\n\r\n7. Fazit: Besseres Prompting beginnt mit Verst\u00E4ndnis\r\n- R\u00FCckbezug auf die Einleitung\r\n- Kernaussage: Bessere Prompts sind kein Trick \u2013 sie sind angewandtes LLM-Verst\u00E4ndnis\r\n- zum Gl\u00FCck muss man kein Wissenschaftler sein um die Grundprinzipien sich anzueignen\r\n- Einladung zum Weiterlernen",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptCategories(userId, ["reddit"]),
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Reddit Post Kommentare",
      content:
         'du bist ein erfahrener Startup Gr\u00FCnder und Community Manager. Du hast ein Reddit Post in r/KI_Welt erstellt, der lautet: \r\n\r\n"Hey zusammen,\r\n\r\nich wollte mal in die Runde fragen, wie ihr eure Prompts verwaltet, wenn ihr regelm\u00E4\u00DFig mit KI-Tools arbeitet.\r\n\r\n    Speichert ihr eure Prompts irgendwo (Notion, Obsidian, Docs, Textdateien, \u2026)?\r\n\r\n    Nutzt ihr Kategorien, Tags oder Versionen?\r\n\r\n    Habt ihr eine Sammlung f\u00FCr \u201Ebew\u00E4hrte\u201C Prompts?\r\n\r\n    Oder l\u00E4uft bei euch alles eher spontan und ad hoc?\r\n\r\nBei mir sammeln sich langsam immer mehr Prompts an und ich merke, dass es un\u00FCbersichtlich wird.\r\nMich w\u00FCrden deshalb eure Workflows, Tools oder einfachen Tricks interessieren \u2013 gerne auch low-tech L\u00F6sungen."\r\n\r\nEin Nuter hat folgendes geantwortet: "die prompts waren automatisch im titel der bilder die ich erstellt habe, sehr hilfreich ist aber lange her. ". \r\n\r\nEmphlene passende Reaktionen darauf?  Dein \u00FCbergeordnete Ziel ist Diskussion anzuregen, Mehrwert zu bieten und zwischen durch herauszufinden ob es ein Bedarf f\u00FCr beseere L\u00F6sungen f\u00FCr Prompts Verwaltung und Organisierung gibt.\r\n',
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptCategories(userId, ["reddit"]),
      },
   },
];
