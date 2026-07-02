import { map } from "es-toolkit/compat";

import { PromptCreateInput } from "@/generated/prisma/models";

export const SEED_USER_EMAIL = "test123@gmail.com";
export const SEED_ADMIN_EMAIL = "admin123@gmail.com";

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

export const promptsData = (userId: string): PromptCreateInput[] => [
   {
      user: { connect: { id: userId } },
      title: "Vision Notes - Produktbeschreibung",
      description: "",
      recommendedModel: "ChatGPT",
      content: {
         create: {
            content:
               "Du bist ein Verkauf-Experte. Ich habe ein Prompt App entwickelt, die erm\u00F6glicht den Nutzers ihre eigene Prompt Bibliothek erstellen und verwalten. Die App hat 3 Hauptbestandteile.\r\n\r\n1. KI Prompt Builder\r\n2. KI Prompt Bibliothek\r\n3. KI Prompt Vorlagen\r\n\r\nIch brauche f\u00FCr jeden Teil einen Namen und eine kurze knackige Produktbeschreibung (ein Satz), wie sie in der Megamenuliste der App erschienen soll. Der Name und die Beschreibung soll Interesse wecken und den Mehrwert vermitteln.\\\r\n\\\r\nWichtig meine App ist auf Deutsch und zielt auf DACH Region ab.",
         },
      },
      categories: {
         connectOrCreate: promptCategories(userId, ["reddit"]),
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Vision Notes - Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      content: {
         create: {
            content:
               "Erstelle eine vollst\u00E4ndig ausgearbeitete Landing Page f\u00FCr folgende App:\r\n\r\nName der App: Vision Notes\r\nBeschreibung der App: Die Prompt-App f\u00FCr echte KI-Effizienz\r\nProdukte, die die App beinhaltet:\r\nPrompt Studio: Entwickle hochwertige KI-Prompts mit System \u2013 von der Idee bis zur perfekten Ausf\u00FChrung\r\nPrompt Vault: Verwalte, organisiere und finde deine besten Prompts jederzeit wieder \u2013 zentral, \u00FCbersichtlich und effizient\r\nPrompt Blueprints: Vorgefertigte Prompt-Blueprints f\u00FCr professionelle KI-Ergebnisse auf Knopfdruck\r\nDie App ist f\u00FCr Einzel Nutzer bestimmt (nicht f\u00FCr Teams).\r\nVerwende eine moderne, klare und \u00FCberzeugende Schreibweise.\r\n\r\nStruktur der Landing Page:\r\n\r\nHero-Sektion mit starkem Haupt-Claim, Subheadline und CTA.\r\nProblem- > L\u00F6sung-Logik: Beschreibe die Schwierigkeiten der Zielgruppe in der Arbeit mit KI und wie ohne geeignete Tools das volles Potenzial der KI nicht gesch\u00F6pft ist.\r\nFeature-Highlights: Liste die Produkte klar strukturiert auf. Stelle die Produkte als notwendige Bausteine, der effektiven Arbeit mit KI.\r\nSocial Proof: Testimonials, Trust-Elemente oder G\u00FCtesiegel einf\u00FCgen (falls keine vorhanden, generiere realistische Beispiele).\r\nAbschlie\u00DFender CTA mit Dringlichkeit\/Mehrwert.\r\nTonality & Style: \u2013 Professionell, vertrauensw\u00FCrdig, inspirierend \u2013 Klar, ohne Fachjargon \u2013 Conversion-optimiert\r\n\r\nSEO: \u2013 Verwende relevante Keywords \u2013 Nutze sprechende Zwischen\u00FCberschriften \u2013 F\u00FCge Meta Title & Meta Description hinzu\r\n\r\nOutput:\r\n\r\nSaubere, formatierte Struktur. Vermeide Aufz\u00E4hlungen.\r\nDer Problem Abschnitt soll aus einem kurzen pr\u00E4gnanter Badge, einem Titel (der zusammenfassend die Herausforderung bei der KI-Arbeit hervorhebt) und einem kurzen Untertitel bestehen. Der Abschnitt soll 3 Unterabschnitte beinhalten. Jede Unterabschnitt hat dann eine \u00DCberschrift und eine kurze 150 - 300 Zeichen lange Erkl\u00E4rung.\r\nDer L\u00F6sung Abschnitt soll aus einem kurzen pr\u00E4gnanter Badge, einem Titel (der zusammenfassend der L\u00F6sung in Form dieser App andeutet) und einem kurzen Untertitel bestehen. Der Abschnitt soll 3 Unterabschnitte beinhalten. Jeder Unterabschnitt hat dann eine \u00DCberschrift und eine kurze 150 - 300 Zeichen lange Erkl\u00E4rung.\r\nFeatures Abschnitt soll aus einem kurzen pr\u00E4gnanten Titel und Untertitel bestehen.\r\nJeder Feature soll einem Produkt entsprechen und soll eine \u00DCberschrift ( der ideale weise den Namen des Produkt beinhaltet oder auf ihn hinweist) und eine kurze 200 Zeichen lange Erkl\u00E4rung des Produkts erhalten.",
         },
      },
      categories: {
         connectOrCreate: promptCategories(userId, ["reddit"]),
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Universeller Prompt zur Erstellung einer Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      content: {
         create: {
            content:
               "Erstelle eine vollst\u00E4ndig ausgearbeitete Landing Page f\u00FCr folgendes Angebot:\r\n\r\nName des Produkts: Prompt Blueprints\r\nBeschreibung des Produkts: Vorgefertigte Prompt-Vorlagen f\u00FCr professionelle KI-Ergebnisse auf Knopfdruck\r\nDas Produkt ist f\u00FCr Einzel Nutzer bestimmt (nicht f\u00FCr Teams).\r\nVerwende eine moderne, klare und \u00FCberzeugende Schreibweise.\r\n\r\nStruktur der Landing Page:\r\n\r\nHero-Sektion mit starkem Haupt-Claim, Subheadline und CTA.\r\nProblem- > L\u00F6sung-Logik: Beschreibe das Problem der Zielgruppe und wie das Angebot es l\u00F6st.\r\nFeature-Highlights: Liste die wichtigsten Funktionen\/Benefits klar strukturiert auf.\r\nSocial Proof: Testimonials, Trust-Elemente oder G\u00FCtesiegel einf\u00FCgen (falls keine vorhanden, generiere realistische Beispiele).\r\nDetailbeschreibung des Angebots inkl. Value Proposition.\r\nFAQ-Bereich mit typischen Kundenfragen.\r\nAbschlie\u00DFender CTA mit Dringlichkeit\/Mehrwert.\r\nTonality & Style: \u2013 Professionell, vertrauensw\u00FCrdig, inspirierend \u2013 Klar, ohne Fachjargon \u2013 Conversion-optimiert\r\n\r\nSEO: \u2013 Verwende relevante Keywords \u2013 Nutze sprechende Zwischen\u00FCberschriften \u2013 F\u00FCge Meta Title & Meta Description hinzu\r\n\r\nOutput:\r\n\r\nSaubere, formatierte Struktur. Vermeide Aufz\u00E4hlungen.\r\nDer Problem Abschnitt soll aus ein kurzer pr\u00E4gnanter Badge, einem Titel (der zusammenfassend die Schwierigkeiten der Nutzer hervorhebt) und einer Beschreibung bestehen. Die Beschreibung soll 2 Abs\u00E4tze jeder 160 - 170 Zeichen lang sein\r\nDer L\u00F6sung Abschnitt soll aus ein kurzer pr\u00E4gnanter Badge, einem Titel (der zusammenfassend die Erleichterung der Nutzer hervorhebt) und einer Beschreibung bestehen. Die Beschreibung soll 2 Abs\u00E4tze jeder 160 - 170 Zeichen lang sein.\r\nFeatures Abschnitt soll aus ein kurzer pr\u00E4gnanter Badge, einem Titel und Untertitel bestehen.\r\n6 Features. Jede Feature soll eine \u00DCberschrift, eine Unterschrift und eine kurze 160 Zeichen lange Erkl\u00E4rung erhalten.\r\nFAQ Abschnitt soll einen k\u00FCrzen Hinweis (100 Zeichen) erhalten.\r\n6 hilfreiche Fragen",
         },
      },
      categories: {
         connectOrCreate: promptCategories(userId, ["reddit"]),
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SEO Blogartikel Erfassung",
      description: "",
      recommendedModel: "ChatGPT",
      content: {
         create: {
            content:
               "Du bist Experte f\u00FCr KI-Technologie und Prompt Engineering. Verfasse einen 3000 W\u00F6rter langen Blogbeitrag mit dem Titel \u201EPrompting lernen: Die wichtigsten LLM-Grundlagen einfach erkl\u00E4rt\u201C. Integriere die folgenden Keywords, um die Suchmaschinen-Optimierung zu verbessern. haupt keywords: Prompting, Prompting lernen, bessere Prompts schreiben, neben keywords: LLM, LLM verstehen, KI. Die Gliederung auf der der Artikel basieren soll: \r\n\r\n1. Einleitung: Warum gutes Prompting kein Zufall ist\r\n- Kurze Einf\u00FChrung ins Thema Prompting\r\n- Typische Frustrationen: \u201EWarum versteht das Modell mich nicht?\u201C\r\n- Zentrale These des Artikels:  Wer bessere Prompts schreiben will, muss verstehen, wie Large Language Models denken\r\n- \u00DCberblick: Was Leser:innen im Artikel lernen\r\nSEO-Keywords: Prompting lernen, bessere Prompts schreiben, LLM verstehen\r\n\r\n2. Was ist ein Large Language Model (LLM)?\r\n2.1 Definition: Was bedeutet \u201ELarge Language Model\u201C?\r\n- Einfache Erkl\u00E4rung ohne mathematische Details\r\n- Abgrenzung zu klassischen Programmen\r\n- Beispiele: ChatGPT, Claude, Gemini\r\n2.2 Was ein LLM nicht ist\r\n- Kein Mensch\r\n- Kein Wissenslexikon\r\n- Kein \u201Edenkendes\u201C System\r\n- Warum diese Missverst\u00E4ndnisse zu schlechten Prompts f\u00FChren\r\n\r\n3. Training & Wissen: Woher LLMs ihr Wissen haben\r\n3.1 Trainingsdaten: Texte aus dem Internet (vereinfacht erkl\u00E4rt)\r\n- Allgemeine Beschreibung des Trainingsprozesses\r\n- Warum LLMs Muster erkennen, nicht Fakten \u201Elernen\u201C\r\n3.2 Wissensgrenzen und Halluzinationen\r\n- Knowledge Cutoff\r\n- Warum LLMs \u00FCberzeugend falsche Antworten geben k\u00F6nnen\r\n\r\n4. Wie LLMs Sprache tats\u00E4chlich verarbeiten\r\n4.1 Token statt W\u00F6rter: Die kleinste Einheit eines LLM\r\n- Erkl\u00E4rung von Tokens\r\n- Warum Wortwahl und L\u00E4nge von Prompts wichtig sind\r\n- Auswirkungen auf Kontext und Pr\u00E4zision\r\n4.2 Wahrscheinlichkeiten statt Bedeutung\r\n- LLMs sagen nicht \u201Edie richtige Antwort\u201C, sondern die wahrscheinlichste\r\n- Wie jedes Wort im Prompt die Antworten beeinflusst\r\n- Zusammenhang zwischen den Eingaben im Prompt und dem Output des LLMs\r\n\r\n5. Auswirkungen f\u00FCr den Schreiben von Prompts\r\n5.1. Grundprinzip: LLMs erg\u00E4nzen fehlende Informationen\r\n- LLMs arbeiten auf Basis von Wahrscheinlichkeiten\r\n- Fehlende oder uneindeutige Angaben werden automatisch vom Modell erg\u00E4nzt\r\n- Art der Erg\u00E4nzung h\u00E4ngt von Trainingsdaten und Modellarchitektur ab\r\n5.2 Auswirkung auf die Gestaltung von Prompts\r\na) Vage Prompts\r\n - Eignen sich f\u00FCr explorative Aufgaben/Ideenfindung ohne klare Richtung (Beispiel: Themenfindung f\u00FCr Blogartikel)\r\n- Greift auf Modellwissen zur\u00FCckgreifen und l\u00E4sst bewusst dem Model Freiraum \r\nb) Detaillierte Prompts\r\n- Eignen sich f\u00FCr pr\u00E4zise Ergebnisse, wenn man klare Vorstellung vom gew\u00FCnschten Output hat\r\n- des Model muss alle n\u00F6tigen Informationen f\u00FCr zielgenaue Ausf\u00FChrung erh\u00E4ltan\r\n\r\n6. Der Schl\u00FCssel zu besseren Prompts\r\n- um genauere Ergebnisse zu erzielen muss genauer beschreiben k\u00F6nnen was ist das gew\u00FCnschte Ergebnis \r\n6.1 Die zwei S\u00E4ulen effektiver Prompts\r\na) Sachlicher Inhalt des Prompts \u2013 was ist zu erreichen?\r\n- Klare Beschreibung des gew\u00FCnschten Ergebnisses\r\n- Sie m\u00FCssen in der Lage sein pr\u00E4zise zu formulieren, was Sie wollen?\r\n- Je konkreter die Anfrage, desto besser das Ergebnis\r\nb) Formaler Inhalt des Prompts\r\n- KI verarbeitet unmenge an Daten\r\n- um genauere Ergebnisse zu Erzielen m\u00FCssen wir sagen auf welche Daten das Model zugreifen soll\r\n- z.b. durch Festlegung des Wissensbereichs und der Perspektive\r\n6.3 Das Wechselspiel beider S\u00E4ule\r\n- Idealfall: Beide Elemente vorhanden \r\n- Kompensation: Fehlender sachlicher Inhalt kann durch starke Kontextsetzung ausgeglichen werden\r\n- Risiko: Fehlen beide Teile, bestimmt allein die KI das Ergebnis\r\n\r\n7. Fazit: Besseres Prompting beginnt mit Verst\u00E4ndnis\r\n- R\u00FCckbezug auf die Einleitung\r\n- Kernaussage: Bessere Prompts sind kein Trick \u2013 sie sind angewandtes LLM-Verst\u00E4ndnis\r\n- zum Gl\u00FCck muss man kein Wissenschaftler sein um die Grundprinzipien sich anzueignen\r\n- Einladung zum Weiterlernen",
         },
      },
      categories: {
         connectOrCreate: promptCategories(userId, ["reddit"]),
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Content-Struktur basierend auf Keyword-Daten",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "SEO",
            "Keyword-Recherche",
            "Content-Struktur",
         ]),
      },
      content: {
         create: {
            content:
               "Nutze die Keyword-Recherche zum Thema [Thema einsetzen], um eine SEO-optimierte Blogstruktur (H1\u2013H3) zu entwickeln. Ber\u00FCcksichtige Suchintention, Nutzerfragen, semantische Keywords und Featured-Snippet-Potenzial.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Keyword-Recherche für transaktionalen Content",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "SEO",
            "Keyword-Recherche",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine Keyword-Liste zum Thema [Thema einsetzen] mit Fokus auf kaufnahe Suchanfragen, die zu [Produkt/Dienstleistung] f\u00FChren. Sortiere die Keywords nach Kaufintention, Wettbewerb und Eignung f\u00FCr Blog-, Vergleichs- oder Ratgeber-Content.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Wettbewerbsorientierte Keyword-Recherche",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "SEO",
            "Keyword-Recherche",
         ]),
      },
      content: {
         create: {
            content:
               "\u00DCbernimm die Rolle eines SEO-Strategen und analysiere die Top-5 Google-Ergebnisse zum Thema [Thema einsetzen]. Leite daraus Keyword-Schwerpunkte, vernachl\u00E4ssigte Suchanfragen und Differenzierungspotenziale f\u00FCr einen neuen Blogartikel ab.\u201C",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SEO-Keywords für bestehenden Blogartikel optimieren",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "SEO",
            "Keyword-Recherche",
         ]),
      },
      content: {
         create: {
            content:
               "Analysiere das Thema [Thema einsetzen] im Kontext eines bestehenden Blogartikels, der aktuell auf Seite 2 bei Google rankt. Schlage erg\u00E4nzende Long-Tail-Keywords, semantisch verwandte Begriffe (LSI) und Fragen vor, um die Top-10-Rankings zu erreichen.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Keyword-Recherche mit Zielgruppe & Funnel-Stufe",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "SEO",
            "Keyword-Recherche",
         ]),
      },
      content: {
         create: {
            content:
               "F\u00FChre eine Keyword-Recherche zum Thema [Thema einsetzen] durch f\u00FCr [Zielgruppe, z. B. Selbstst\u00E4ndige / Marketing-Manager / Einsteiger] in der [Awareness-/Consideration-/Decision-Phase]. Priorisiere Keywords mit klarer Suchintention und erkl\u00E4re kurz, warum sie f\u00FCr diese Funnel-Stufe geeignet sind.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Keywords nach SEO-Priorität clustern",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "SEO",
            "Keyword-Recherche",
         ]),
      },
      content: {
         create: {
            content:
               "Cluster die relevantesten Keywords zum Thema [Thema einsetzen] in sinnvolle Themenbl\u00F6cke f\u00FCr einen SEO-Blogartikel und priorisiere sie nach Relevanz und gesch\u00E4tztem Ranking-Potenzial.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Keyword-Gaps & Content-Chancen finden",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "SEO",
            "Keyword-Recherche",
         ]),
      },
      content: {
         create: {
            content:
               "Identifiziere m\u00F6gliche Keyword-Gaps und Content-Chancen zum Thema [Thema einsetzen], die von bestehenden Top-Rankings h\u00E4ufig nicht ausreichend abgedeckt werden.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Fragen & W-Keywords generieren",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "SEO",
            "Keyword-Recherche",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine Liste h\u00E4ufig gesuchter W-Fragen und Problemstellungen rund um [Thema einsetzen], die sich als Unter\u00FCberschriften (H2/H3) f\u00FCr einen SEO-Blogartikel eignen.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Suchintention verstehen",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "SEO",
            "Keyword-Recherche",
         ]),
      },
      content: {
         create: {
            content:
               "Ordne die wichtigsten Keywords zum Thema [Thema einsetzen] nach Suchintention (informational, transactional, navigational, commercial) und erkl\u00E4re kurz, welche Content-Art sich f\u00FCr jedes Keyword eignet.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Haupt- & Nebenkeywords identifizieren",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "SEO",
            "Keyword-Recherche",
         ]),
      },
      content: {
         create: {
            content:
               "Analysiere das Thema [Thema einsetzen] und erstelle eine Liste relevanter Hauptkeywords, Nebenkeywords und Long-Tail-Keywords mit hoher Suchintention f\u00FCr einen SEO-Blogartikel.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "AI-SaaS Landingpage mit „Why Us“- & Differenzierungs-Fokus",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine Landingpage f\u00FCr ein AI-SaaS-Produkt ([Produktname]), die sich klar von Wettbewerbern abgrenzt.\r\nStrukturiere die Seite mit:\r\n\r\npr\u00E4gnantem Hero mit klarem Nutzenversprechen,\r\n\r\nVergleichssektion (Warum [Produktname] vs. klassische Tools / andere KI-L\u00F6sungen),\r\n\r\nAlleinstellungsmerkmalen der KI (z. B. bessere Modelle, spezifischer Use Case, geringerer Setup-Aufwand),\r\n\r\nkonkreten Ergebnissen f\u00FCr [Zielgruppe],\r\n\r\neindeutiger Call-to-Action.\r\nVermeide generische KI-Buzzwords und formuliere konkret, \u00FCberpr\u00FCfbar und nutzenorientiert.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "AI-SaaS Landingpage für B2B-Entscheider mit ROI-Fokus",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine B2B-Landingpage f\u00FCr ein AI-SaaS-Produkt, das Prozesse automatisiert oder Entscheidungen verbessert.\r\nFokus auf Business-Impact, ROI, Skalierbarkeit und Integration in bestehende Systeme. Verwende faktenbasierte Argumente, KPIs und eine CTA wie Beratung anfragen.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "AI-SaaS Landingpage mit Fokus auf Vertrauen & Sicherheit",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Schreibe eine Landingpage f\u00FCr ein AI-SaaS-Produkt, bei dem Vertrauen entscheidend ist.\r\nGehe explizit auf Datenschutz (z. B. DSGVO), Datenverarbeitung, Modelltraining und Sicherheitsstandards ein. Erg\u00E4nze Trust-Elemente wie Kundenstimmen, Zertifikate und klare Aussagen zur Datennutzung.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "AI-SaaS Landingpage für erklärungsbedürftige KI-Produkte",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine Landingpage f\u00FCr ein erkl\u00E4rungsbed\u00FCrftiges AI-SaaS-Tool, das [Use Case] automatisiert.\r\nErkl\u00E4re verst\u00E4ndlich, was die KI macht, was sie nicht macht, und wie der Nutzer sie einsetzt. Verwende einfache Sprache, visuelle Abschnitts\u00FCberschriften und einen sekund\u00E4ren CTA (Demo ansehen).",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "AI-SaaS Landingpage mit klarem Value Proposition-Fokus",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine conversion-optimierte Landingpage f\u00FCr ein AI-SaaS-Produkt ([Produktname]).\r\nFormuliere eine klare Value Proposition im Hero-Bereich (1 Headline, 1 Subheadline), erkl\u00E4re konkret, welches Problem die KI l\u00F6st und welchen messbaren Mehrwert sie liefert. Integriere einen prim\u00E4ren CTA (z. B. Kostenlos testen). Zielgruppe: [Zielgruppe].",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SaaS-Landingpage mit Social Proof & Trust Signals",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Schreibe eine SaaS-Landingpage f\u00FCr [Software-Name], die stark auf Vertrauen setzt. Integriere Kundenlogos, Testimonials, Case Studies, Sicherheitsstandards, Datenschutz-Hinweise und einen klaren Call-to-Action.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SaaS-Landingpage mit Feature-zu-Benefit-Mapping",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine SaaS-Landingpage f\u00FCr [Software-Name], bei der jede Hauptfunktion direkt in einen konkreten Kundennutzen \u00FCbersetzt wird. Strukturiere die Inhalte \u00FCbersichtlich und conversion-orientiert.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SaaS-Landingpage für B2B-Entscheider",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Entwickle Inhalte f\u00FCr eine B2B-SaaS-Landingpage, die sich an Entscheider und Manager richtet. Fokus auf ROI, Effizienzsteigerung, Integration, Sicherheit und Skalierbarkeit von [Software-Name].",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SaaS-Landingpage mit Problem–Lösungs-Ansatz",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Schreibe eine SaaS-Landingpage f\u00FCr [Software-Name], die ein zentrales Problem von [Zielgruppe] klar benennt und zeigt, wie die Software dieses effizient l\u00F6st. Nutze klare Use-Cases, Vorteile und eine \u00FCberzeugende Produktpositionierung.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SaaS-Landingpage für Free-Trial-Conversion",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine SaaS-Landingpage f\u00FCr [Software-Name], die Nutzer zur Anmeldung f\u00FCr eine kostenlose Testversion motiviert. Hebe den Hauptnutzen, Kernfunktionen, einfache Einrichtung, Risikofreiheit und einen klaren Call-to-Action hervor.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Conversion-orientierte Landingpage mit Fokus auf Vertrauen",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine Landingpage f\u00FCr [Produkt/Dienstleistung], die stark auf Vertrauen und Glaubw\u00FCrdigkeit abzielt. Integriere Kundenbewertungen, Testimonials, Garantien, Siegel und eine \u00FCberzeugende Call-to-Action.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SEO-optimierte Landingpage",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
         ]),
      },
      content: {
         create: {
            content:
               "Schreibe Inhalte f\u00FCr eine SEO-optimierte Landingpage zum Thema [Produkt/Dienstleistung]. Integriere das Haupt-Keyword [Keyword], passende Nebenkeywords, Meta-Titel, Meta-Beschreibung und eine logische Seitenstruktur.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Landingpage nach AIDA-Modell",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
         ]),
      },
      content: {
         create: {
            content:
               "Entwickle eine Landingpage f\u00FCr [Produkt/Dienstleistung] nach dem AIDA-Prinzip (Attention, Interest, Desire, Action). Formuliere pr\u00E4gnante \u00DCberschriften, Zwischen\u00FCberschriften und Call-to-Actions.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Verkaufsstarke Landingpage-Texte",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle \u00FCberzeugende Landingpage-Texte f\u00FCr [Produkt/Dienstleistung] mit Fokus auf Kundennutzen und klare Handlungsaufforderungen. Zielgruppe ist [Zielgruppe]",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Landingpage-Grundstruktur",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
         ]),
      },
      content: {
         create: {
            content:
               "Schreibe eine klare und conversion-optimierte Struktur f\u00FCr eine Landingpage, die [Produkt/Dienstleistung] verkauft. Ber\u00FCcksichtige Hero-Bereich, Nutzenargumente, Features, Social Proof, Call-to-Action und FAQ.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Psychological Trigger Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "CRO",
            "Conversion Optimisation",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine Landing Page, die gezielt psychologische Trigger nutzt, um Conversion zu maximieren.\r\nAngebot: [Angebot einf\u00FCgen]\r\n\r\nTrigger, die eingebaut werden m\u00FCssen:\r\n\u2013 Klarheit\r\n\u2013 Social Proof\r\n\u2013 Autorit\u00E4t\r\n\u2013 Verlustangst\r\n\u2013 Einfachheit\r\n\r\nStruktur:\r\n\r\nHeadline mit klarer Transformation\r\n\r\nSubheadline mit sozialer Best\u00E4tigung\r\n\r\nDarstellung der einfachen L\u00F6sung\r\n\r\nVorteile & Ergebnisse\r\n\r\nBeweise (Zahlen, Aussagen, Referenzen)\r\n\r\nCTA mit Dringlichkeit\r\n\r\nZiel:\r\n\u2013 Nutzer versteht sofort den Nutzen\r\n\u2013 Nutzer f\u00FChlt sich sicher\r\n\u2013 Nutzer handelt",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Short-Form High-Conversion Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "CRO",
            "Conversion Optimisation",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine kurze, extrem fokussierte Landing Page f\u00FCr folgendes Angebot:\r\n[Angebot einf\u00FCgen]\r\n\r\nZiel: Conversion in unter 30 Sekunden Lesezeit.\r\n\r\nInhalt:\r\n\r\nStarke Headline mit klarem Nutzen\r\n\r\nSubheadline: F\u00FCr wen + Ergebnis\r\n\r\n3\u20135 starke Benefits\r\n\r\n1\u20132 Social-Proof-Elemente\r\n\r\nKlarer CTA\r\n\r\nStil:\r\n\u2013 Sehr kurz\r\n\u2013 Kein unn\u00F6tiger Text\r\n\u2013 Jede Zeile verkauft",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Objection-Killer Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "CRO",
            "Conversion Optimisation",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine Landing Page, die gezielt Einw\u00E4nde und Zweifel ausr\u00E4umt.\r\nAngebot: [Produkt / Service einf\u00FCgen]\r\n\r\nZiel: Conversion durch Vertrauen & Klarheit.\r\n\r\nStruktur:\r\n\r\nKlare Value Proposition im Hero\r\n\r\nKurz: Was das Angebot macht (1\u20132 S\u00E4tze)\r\n\r\nTypische Einw\u00E4nde der Zielgruppe (\u201EZu teuer\u201C, \u201EZu kompliziert\u201C, \u201EZu riskant\u201C)\r\n\r\nDirekte Antworten auf jeden Einwand\r\n\r\nVorteile & Ergebnisse\r\n\r\nSocial Proof + Glaubw\u00FCrdigkeit\r\n\r\nRisiko-freie CTA-Formulierung\r\n\r\nRegel:\r\n\u2013 Keine Marketingfloskeln\r\n\u2013 Klare Aussagen\r\n\u2013 Fokus auf Vertrauen",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Pain-Driven Conversion Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "CRO",
            "Conversion Optimisation",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine Landing Page, die stark \u00FCber Pain Points verkauft.\r\nAngebot: [Angebot einf\u00FCgen]\r\n\r\nFokus: Maximale Identifikation des Nutzers mit seinem Problem.\r\n\r\nAufbau:\r\n\r\nHeadline, die den gr\u00F6\u00DFten Schmerz der Zielgruppe anspricht\r\n\r\nBeschreibung der negativen Konsequenzen, wenn nichts ge\u00E4ndert wird\r\n\r\nWarum bisherige L\u00F6sungen scheitern\r\n\r\nEinf\u00FChrung des Angebots als einfache, klare L\u00F6sung\r\n\r\nKonkrete Ergebnisse nach Nutzung\r\n\r\nBeweise (Social Proof / Zahlen / Aussagen)\r\n\r\nKlarer CTA mit Ergebnisversprechen\r\n\r\nTon:\r\n\u2013 Emotional, aber seri\u00F6s\r\n\u2013 Direkt, ohne Umschweife\r\n\u2013 Nutzer f\u00FChlt sich \u201Everstanden\u201C",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "High-Conversion Landing Page (CRO-Framework)",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "CRO",
            "Conversion Optimisation",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine hochkonvertierende Landing Page f\u00FCr folgendes Angebot:\r\n[Produkt / Service einf\u00FCgen]\r\n\r\nZiel ist maximale Conversion (Lead / Kauf / Demo).\r\n\r\nConversion-Struktur:\r\n\r\nHero mit klarer Nutzen-Headline (Ergebnis > Funktion)\r\n\r\nSubheadline: F\u00FCr wen + welches Problem gel\u00F6st wird\r\n\r\nPrim\u00E4rer CTA oberhalb der Fold\r\n\r\nProblem-Agitation (Warum der Status quo nicht funktioniert)\r\n\r\nL\u00F6sung + USP (Warum genau dieses Angebot)\r\n\r\nBenefits statt Features (Transformation klar benennen)\r\n\r\nSocial Proof (Testimonials, Zahlen, Logos \u2013 realistisch generieren)\r\n\r\nRisiko-Umkehr (Garantie, Testphase, kein Risiko)\r\n\r\nWiederholter CTA mit Dringlichkeit\r\n\r\nStil:\r\n\u2013 Direkt, klar, aktiv\r\n\u2013 Keine Buzzwords\r\n\u2013 Jede Sektion muss zur Conversion f\u00FChren",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SEO-optimierte Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine SEO-optimierte Landing Page f\u00FCr folgendes Thema:\r\n[Keyword / Produkt / Dienstleistung einf\u00FCgen]\r\n\r\nZiel ist es, organischen Traffic zu generieren und Besucher zu konvertieren.\r\n\r\nAnforderungen:\r\n\u2013 Nutze ein Haupt-Keyword + relevante Neben-Keywords\r\n\u2013 Saubere H1\u2013H3-Struktur\r\n\u2013 Lesefreundliche Abs\u00E4tze und Bulletpoints\r\n\r\nInhalt:\r\n\r\nKeyword-optimierte Headline\r\n\r\nEinleitung mit klarem Nutzen\r\n\r\nDetaillierte Problemerkl\u00E4rung\r\n\r\nL\u00F6sungsansatz durch das Angebot\r\n\r\nVorteile & Features\r\n\r\nFAQ-Bereich (SEO-relevant)\r\n\r\nStarker CTA\r\n\r\nOutput:\r\n\u2013 Strukturierter Text in Markdown\r\n\u2013 Inklusive Meta Title & Meta Description",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Minimalistische High-End Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine minimalistische, hochwertige Landing Page f\u00FCr folgendes Premium-Angebot:\r\n[Angebot einf\u00FCgen]\r\n\r\nFokus liegt auf Klarheit, Design und Exklusivit\u00E4t.\r\n\r\nStruktur:\r\n\r\nSehr kurze, starke Headline mit klarer Aussage\r\n\r\nSubheadline mit Nutzenversprechen\r\n\r\n3\u20135 zentrale Vorteile in Bullet-Form\r\n\r\nKurze Erkl\u00E4rung, f\u00FCr wen das Angebot gedacht ist\r\n\r\nVertrauenselemente (Zahlen, Marken, Aussagen)\r\n\r\nReduzierter CTA (z. B. \u201EZugang anfragen\u201C)\r\n\r\nStil:\r\n\u2013 Kurz, pr\u00E4zise, selbstbewusst\r\n\u2013 Keine unn\u00F6tigen Erkl\u00E4rungen\r\n\u2013 Fokus auf Wirkung statt Textmenge",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SaaS / Tech Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine moderne Landing Page f\u00FCr ein SaaS- oder Tech-Produkt:\r\n[Name & Kurzbeschreibung einf\u00FCgen]\r\n\r\nZiel ist es, den Nutzen des Produkts in Sekunden verst\u00E4ndlich zu machen.\r\n\r\nStruktur:\r\n\r\nKlare Value Proposition im Hero-Bereich\r\n\r\nKurze Erkl\u00E4rung: \u201EWas ist das Produkt?\u201C\r\n\r\nHauptprobleme der Zielgruppe + passende Produktl\u00F6sung\r\n\r\nKernfunktionen mit kurzen Erkl\u00E4rungen\r\n\r\nIntegrationen / Kompatibilit\u00E4t (falls relevant)\r\n\r\nSicherheit, Datenschutz & Vertrauen\r\n\r\nCTA (Demo buchen / Kostenlos testen)\r\n\r\nExtras:\r\n\u2013 Schreibe klar, sachlich, aber \u00FCberzeugend\r\n\u2013 Vermeide technische \u00DCberladung\r\n\u2013 Optional: Pricing-Teaser & FAQ",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Storytelling Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine Landing Page f\u00FCr folgendes Angebot mit starkem Storytelling-Fokus:\r\n[Angebot einf\u00FCgen]\r\n\r\nDie Landing Page soll den Besucher emotional abholen und logisch zur Conversion f\u00FChren.\r\n\r\nAufbau:\r\n\r\nEinstieg mit einer Story oder Alltagssituation der Zielgruppe\r\n\r\nDarstellung des Problems und der bisherigen erfolglosen L\u00F6sungsversuche\r\n\r\nEinf\u00FChrung des Angebots als Wendepunkt\r\n\r\nErkl\u00E4rung, wie das Angebot funktioniert (Schritt-f\u00FCr-Schritt)\r\n\r\nVorteile & Ergebnisse f\u00FCr den Nutzer\r\n\r\nErfahrungsberichte / Erfolgsgeschichten\r\n\r\nStarker CTA mit klarer Nutzenargumentation\r\n\r\nStil:\r\n\u2013 Emotional, glaubw\u00FCrdig, klar\r\n\u2013 Direkte Ansprache der Zielgruppe\r\n\u2013 Leicht verst\u00E4ndlich, ohne Buzzwords",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Conversion-fokussierte Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine conversion-optimierte Landing Page f\u00FCr folgendes Angebot:\r\n[Produkt / Service / SaaS / Tool einf\u00FCgen]\r\n\r\nZiel der Seite ist es, Besucher zu Leads oder K\u00E4ufern zu konvertieren.\r\n\r\nStruktur:\r\n\r\nHero-Sektion mit emotionalem Hauptversprechen, Subheadline und prim\u00E4rem CTA\r\n\r\nKlare Darstellung des Kernproblems der Zielgruppe\r\n\r\nPr\u00E4sentation der L\u00F6sung inkl. einzigartigem Nutzen (USP)\r\n\r\nFeatures & Benefits (klar getrennt)\r\n\r\nSocial Proof (Kundenstimmen, Logos, Zahlen)\r\n\r\nSekund\u00E4rer CTA nach jedem Hauptabschnitt\r\n\r\nAbschlusssektion mit Risiko-Umkehr (z. B. Garantie, Testphase)\r\n\r\nAnforderungen:\r\n\u2013 Schreibe pr\u00E4gnant, nutzerzentriert und handlungsauffordernd\r\n\u2013 Verwende psychologische Trigger (Vertrauen, Dringlichkeit, Klarheit)\r\n\u2013 Strukturierter Output in Markdown",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Universeller Prompt zur Erstellung einer Landing Page",
      description: "",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
         ]),
      },
      content: {
         create: {
            content:
               "Erstelle eine vollst\u00E4ndig ausgearbeitete Landing Page f\u00FCr folgendes Angebot:\r\n[Hier dein Produkt/Service/Angebot einf\u00FCgen]\r\n\r\nVerwende eine moderne, klare und \u00FCberzeugende Schreibweise.\r\n\r\nStruktur der Landing Page:\r\n\r\nHero-Sektion mit starkem Haupt-Claim, Subheadline und CTA.\r\n\r\nProblem- > L\u00F6sung-Logik: Beschreibe das Problem der Zielgruppe und wie das Angebot es l\u00F6st.\r\n\r\nFeature-Highlights: Liste die wichtigsten Funktionen/Benefits klar strukturiert auf.\r\n\r\nSocial Proof: Testimonials, Trust-Elemente oder G\u00FCtesiegel einf\u00FCgen (falls keine vorhanden, generiere realistische Beispiele).\r\n\r\nDetailbeschreibung des Angebots inkl. Value Proposition.\r\n\r\nFAQ-Bereich mit typischen Kundenfragen.\r\n\r\nAbschlie\u00DFender CTA mit Dringlichkeit/Mehrwert.\r\n\r\nTonality & Style:\r\n\u2013 Professionell, vertrauensw\u00FCrdig, inspirierend\r\n\u2013 Klar, ohne Fachjargon\r\n\u2013 Conversion-optimiert\r\n\r\nSEO:\r\n\u2013 Verwende relevante Keywords\r\n\u2013 Nutze sprechende Zwischen\u00FCberschriften\r\n\u2013 F\u00FCge Meta Title & Meta Description hinzu\r\n\r\nOutput:\r\n\u2013 Saubere, formatierte Struktur in Markdown\r\n\u2013 Optional auch HTML-Variante erstellen (falls gew\u00FCnscht)",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Schreibe eine verkaufende Landingpage",
      description:
         "Dieser Prompt erm\u00F6glicht es, **vollst\u00E4ndige, verkaufspsychologisch optimierte Landingpages** zu generieren \u2013 von der Hero-Section bis zum Call-to-Action. Er zwingt die KI dazu, strukturiert nach Direct-Response-Prinzipien zu arbeiten und alle entscheidenden Conversion-Elemente zu ber\u00FCcksichtigen: Schmerzpunkte, Nutzenargumente, Einwandbehandlung und Social Proof. Ideal f\u00FCr Marketer, Copywriter und Gr\u00FCnder, die schnell hochwertige Landingpages erstellen wollen, ohne jedes Mal bei null zu beginnen.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist ein Senior Direct-Response-Copywriter.\r\n\r\nAufgabe:\r\nErstelle eine vollst\u00E4ndige Landingpage, die [Ziel] erreicht.\r\n\r\nKontext:\r\nProdukt: [Produkt]\r\nZielgruppe: [Zielgruppe]\r\nBewusstseinslevel: [Level]\r\nTraffic-Quelle: [z. B. Ads]\r\nEinw\u00E4nde: [Liste]\r\n\r\nArbeite strukturiert:\r\n1. Starke Hero-Section\r\n2. Problem- & Schmerzverst\u00E4rkung\r\n3. L\u00F6sung & Mechanismus\r\n4. Nutzen vor Features\r\n5. Einwandbehandlung\r\n6. Social Proof\r\n7. Klarer CTA\r\n\r\nSchreibe verkaufspsychologisch, klar und ohne Floskeln.\r\n",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Diese Seite konvertiert schlecht – analysieren & reparieren",
      description:
         "Dieser Prompt hilft dir, bestehende Landingpages systematisch auf Conversion-Hürden zu analysieren und gezielt zu verbessern. Er identifiziert unklare Aussagen, fehlende Motivation, psychologische Brüche, nicht behandelte Einwände und schwache Call-to-Actions. Statt allgemeiner Kritik liefert der Prompt **konkrete Textvorschläge**, die direkt umsetzbar sind. Ideal für Marketer, Copywriter und Gründer, die mehr Leads oder Verkäufe aus bestehendem Traffic herausholen wollen.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Landingpage",
            "Conversion",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist Conversion-Rate-Optimizer.\r\n\r\nAnalysiere diese Landingpage:\r\n[Text]\r\n\r\nIdentifiziere:\r\n\u2013 Unklarheiten\r\n\u2013 fehlende Motivation\r\n\u2013 psychologische Br\u00FCche\r\n\u2013 fehlende Einwandbehandlung\r\n\u2013 schwache CTAs\r\n\r\nSchlage konkrete Text-Verbesserungen vor.\r\n",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Ads, die Aufmerksamkeit stoppen",
      description:
         "Dieser Prompt erzeugt **scroll-stoppende Werbetexte für Paid Ads**, die gezielt auf Plattform, Zielgruppe und Bewusstseinslevel abgestimmt sind. Er liefert sofort einsetzbare Hooks, vollständige Ad-Copies und klare Call-to-Actions mit Fokus auf Neugier, Relevanz und Emotion. Ideal für Marketer, Performance-Creator und Gründer, die schnell hochwertige Anzeigenvarianten testen und ihre Kampagnen effizient skalieren wollen.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, ["Copywriting", "Paid Ads"]),
      },
      content: {
         create: {
            content:
               "Du bist Performance-Copywriter f\u00FCr Paid Ads.\r\n\r\nZiel:\r\nScroll-Stopping Ads f\u00FCr [Plattform].\r\n\r\nProdukt: [Produkt]\r\nZielgruppe: [Zielgruppe]\r\nBewusstseinslevel: [Level]\r\n\r\nErstelle:\r\n\u2013 10 starke Hooks\r\n\u2013 5 Ad-Copies\r\n\u2013 klare CTA-Varianten\r\n\r\nFokus: Neugier, Relevanz, Emotion.\r\n",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Schreibe eine E-Mail, die verkauft",
      description:
         "Dieser Prompt hilft dir, **komplette Verkaufs-E-Mails** zu erstellen, die Aufmerksamkeit erzeugen, Einwände auflösen und gezielt zum Klick führen. Er kombiniert Copywriting-Struktur, Verkaufspsychologie und Zielgruppenverständnis in einem klaren Workflow. Zusätzlich generiert der Prompt Hooks, Ad-Copies und CTA-Varianten, sodass du nicht nur eine E-Mail, sondern mehrere einsetzbare Marketing-Assets erhältst. Ideal für Launches, Kampagnen und Performance-Marketing.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, ["Copywriting", "E-Mail"]),
      },
      content: {
         create: {
            content:
               "Du bist E-Mail-Copywriter.\r\n\r\nAufgabe:\r\nSchreibe eine Verkaufs-E-Mail f\u00FCr [Angebot].\r\n\r\nZielgruppe: [Zielgruppe]\r\nBewusstseinslevel: [Level]\r\nEinw\u00E4nde: [Liste]\r\n\r\nStruktur:\r\n\u2013 starker Einstieg\r\n\u2013 Story oder Problem\r\n\u2013 L\u00F6sung & Nutzen\r\n\u2013 Einwandbehandlung\r\n\u2013 CTA\r\n",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Positionierung & Brand Voice entwickeln",
      description:
         "Dieser Prompt hilft dir, das strategische Fundament einer Marke zu entwickeln: klare Kernbotschaft, ein differenzierender Unique Mechanism, eine stimmige Tonalität und ein zentrales Narrativ. Er ist ideal, wenn eine Marke unscharf wirkt, sich nicht klar vom Markt abgrenzt oder ihre Kommunikation inkonsistent ist. Der Mehrwert liegt darin, dass nicht nur Texte entstehen, sondern eine klare Markenlogik, auf der alle weiteren Marketing- und Copywriting-Maßnahmen aufbauen können.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Brand Voice",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist Brand-Strategist & Copywriter.\r\n\r\nEntwickle:\r\n\u2013 Kernbotschaft\r\n\u2013 Unique Mechanism\r\n\u2013 Tonalit\u00E4t\r\n\u2013 zentrale Narrative\r\n\r\nF\u00FCr:\r\nMarke: [Marke]\r\nZielgruppe: [Zielgruppe]\r\nMarkt: [Markt]\r\n",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Conversion-fokussierte Produktbeschreibung",
      description:
         "Dieser Prompt hilft dir, Produktbeschreibungen zu erstellen, die **nachweislich verkaufen**. Statt Features aufzuzählen, führt er die KI dazu, gezielt auf die Probleme, Wünsche und Kaufmotive der Zielgruppe einzugehen. Ideal für Verkaufsseiten, Landing Pages und Produktdetailseiten, bei denen Conversion im Vordergrund steht. Der Mehrwert liegt in der klaren Struktur und der psychologisch wirksamen Nutzenargumentation.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist ein erfahrener Conversion-Copywriter. Erstelle eine verkaufsstarke Produktbeschreibung f\u00FCr [Produkt].\r\nZielgruppe: [Zielgruppe]\r\nHauptproblem der Zielgruppe: [Problem]\r\nNutzenversprechen: [Hauptnutzen]\r\nStruktur:\r\n\r\nEmotionaler Einstieg (Problem oder Wunsch)\r\n\r\nKonkrete Nutzenargumente (keine Features)\r\n\r\nSoziale Absicherung (implizit)\r\n\r\nKlarer Kaufanreiz\r\nSchreibe pr\u00E4zise, \u00FCberzeugend und ohne Floskeln.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Feature-zu-Benefit-Transformation",
      description:
         "Dieser Prompt wandelt trockene Produktfeatures in **kundenrelevante Nutzenargumente** um. Er hilft dabei, den Mehrwert eines Produkts verständlich und überzeugend zu kommunizieren – ideal für technische oder erklärungsbedürftige Produkte. Perfekt für alle, die zwar wissen, was ihr Produkt kann, aber nicht, wie sie es verkaufsstark formulieren sollen.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist ein Produkt-Marketer. Analysiere die folgenden Produktfeatures und verwandle jedes Feature in einen klaren, kundenrelevanten Nutzen.\r\nProdukt: [Produkt]\r\nFeatures: [Feature-Liste]\r\nZielgruppe: [Zielgruppe]\r\nGib die Produktbeschreibung als leicht lesbaren, strukturierten Text aus, der zeigt, warum das Produkt das Leben des Kunden verbessert.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Storytelling-Produktbeschreibung",
      description:
         "Mit diesem Prompt entstehen Produktbeschreibungen, die emotional binden statt nur zu informieren. Durch Storytelling wird das Produkt in eine nachvollziehbare Situation eingebettet, wodurch sich potenzielle Kunden leichter identifizieren können. Ideal für Markenaufbau, Social Proof und Produkte mit emotionalem Mehrwert.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist ein Storytelling-Copywriter. Schreibe eine Produktbeschreibung f\u00FCr [Produkt], die eine kurze Geschichte erz\u00E4hlt:\r\n\r\nAusgangssituation der Zielgruppe\r\n\r\nFrustration oder Wunsch\r\n\r\nBegegnung mit dem Produkt\r\n\r\nPositive Ver\u00E4nderung danach\r\nZielgruppe: [Zielgruppe]\r\nTonalit\u00E4t: emotional, glaubw\u00FCrdig, nahbar.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Premium-Produktbeschreibung (High-End)",
      description:
         "Dieser Prompt erzeugt **hochwertige, elegante Produktbeschreibungen** für Premium- und Luxusprodukte. Statt aggressiver Verkaufssprache liegt der Fokus auf Qualität, Exklusivität und Detailtiefe. Ideal für Marken, die Vertrauen, Stil und Wertigkeit vermitteln wollen.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist ein Luxus-Copywriter. Erstelle eine hochwertige, elegante Produktbeschreibung f\u00FCr [Produkt].\r\nZielgruppe: anspruchsvolle Kunden mit hohem Qualit\u00E4tsanspruch.\r\nFokus: Exklusivit\u00E4t, Detailverliebtheit, Qualit\u00E4t, Gef\u00FChl von \u201Edas Beste\u201C.\r\nVermeide aggressive Verkaufssprache. Schreibe ruhig, souver\u00E4n und selbstbewusst.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Kurze Produktbeschreibung für Online-Shop",
      description:
         "Dieser Prompt erstellt **kompakte, sofort verständliche Produktbeschreibungen**, die für Online-Shops optimiert sind. Perfekt für Nutzer, die klare, scannbare Texte mit hohem Informationswert benötigen – ohne lange Fließtexte.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist ein E-Commerce-Texter. Schreibe eine kompakte, scannbare Produktbeschreibung f\u00FCr [Produkt].\r\nAnforderungen:\r\n\r\nMax. 150 W\u00F6rter\r\n\r\nKlare Nutzen\u00FCberschriften\r\n\r\nBullet Points\r\n\r\nKaufrelevante Argumente auf den ersten Blick\r\nZielgruppe: [Zielgruppe]",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "SEO-optimierte Produktbeschreibung",
      description:
         "Dieser Prompt kombiniert **verkaufsstarkes Copywriting mit SEO-Best Practices**. Er hilft dabei, Produktbeschreibungen zu erstellen, die sowohl für Menschen als auch für Suchmaschinen optimiert sind – ohne unnatürliche Keyword-Dichte.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist ein SEO-Copywriter. Erstelle eine suchmaschinenoptimierte Produktbeschreibung f\u00FCr [Produkt].\r\nHauptkeyword: [Keyword]\r\nNebenkeywords: [Keywords]\r\nAnforderungen:\r\n\r\nNat\u00FCrlich lesbar\r\n\r\nKlare Nutzenkommunikation\r\n\r\nKeine Keyword-Stopferei\r\n\r\nMeta-Description am Ende erg\u00E4nzen.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Vergleichsbasierte Produktbeschreibung",
      description:
         "Dieser Prompt hilft dabei, Kaufentscheidungen zu erleichtern, indem das Produkt **implizit besser positioniert wird als Alternativen**. Ideal für Märkte mit vielen ähnlichen Angeboten, ohne direkte Wettbewerber zu nennen.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist ein strategischer Copywriter. Schreibe eine Produktbeschreibung f\u00FCr [Produkt], indem du es implizit mit typischen Alternativen vergleichst.\r\nZeige, warum dieses Produkt die bessere Wahl ist \u2013 ohne Wettbewerber direkt zu nennen.\r\nFokus: Entscheidungserleichterung, Klarheit, Vertrauen.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Problemlösungs-fokussierte Produktbeschreibung",
      description:
         "Dieser Prompt stellt das **Problem der Zielgruppe in den Mittelpunkt** und positioniert das Produkt als klare Lösung. Ideal für Direct-Response-Marketing und Produkte mit starkem Problemlösungsversprechen.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist ein Direktmarketing-Experte. Beginne die Produktbeschreibung mit dem gr\u00F6\u00DFten Problem der Zielgruppe und zeige Schritt f\u00FCr Schritt, wie [Produkt] dieses Problem l\u00F6st.\r\nZielgruppe: [Zielgruppe]\r\nSchreibe klar, direkt und l\u00F6sungsorientiert.",
         },
      },
   },
   {
      user: { connect: { id: userId } },
      title: "Technisches Produkt – verständlich erklärt",
      description:
         "Dieser Prompt macht komplexe oder technische Produkte **verständlich für Nicht-Experten**. Er reduziert Fachsprache und übersetzt Funktionen in praktische Vorteile.",
      recommendedModel: "ChatGPT",
      categories: {
         connectOrCreate: promptCategories(userId, [
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      content: {
         create: {
            content:
               "Du bist ein Copywriter f\u00FCr erkl\u00E4rungsbed\u00FCrftige Produkte. Schreibe eine Produktbeschreibung f\u00FCr [Produkt], die komplexe Funktionen einfach und verst\u00E4ndlich erkl\u00E4rt.\r\nZielgruppe: Nicht-Experten.\r\nVermeide Fachjargon oder erkl\u00E4re ihn verst\u00E4ndlich. Fokus auf Nutzen und Anwendung.",
         },
      },
   },
];
