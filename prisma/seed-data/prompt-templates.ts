import { map } from "es-toolkit/compat";

import { PromptTemplateDescriptorCreateInput } from "@/generated/prisma/models";

const promptTemplateCategories = (categories: string[]) => {
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

export const promptTemplatesData: PromptTemplateDescriptorCreateInput[] = [
   {
      title: "AI-SaaS Landingpage mit „Why Us“- & Differenzierungs-Fokus",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine Landingpage f\u00FCr ein AI-SaaS-Produkt ([Produktname]), die sich klar von Wettbewerbern abgrenzt.\r\nStrukturiere die Seite mit:\r\n\r\npr\u00E4gnantem Hero mit klarem Nutzenversprechen,\r\n\r\nVergleichssektion (Warum [Produktname] vs. klassische Tools / andere KI-L\u00F6sungen),\r\n\r\nAlleinstellungsmerkmalen der KI (z. B. bessere Modelle, spezifischer Use Case, geringerer Setup-Aufwand),\r\n\r\nkonkreten Ergebnissen f\u00FCr [Zielgruppe],\r\n\r\neindeutiger Call-to-Action.\r\nVermeide generische KI-Buzzwords und formuliere konkret, \u00FCberpr\u00FCfbar und nutzenorientiert.",
         },
      },
   },
   {
      title: "AI-SaaS Landingpage für B2B-Entscheider mit ROI-Fokus",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine B2B-Landingpage f\u00FCr ein AI-SaaS-Produkt, das Prozesse automatisiert oder Entscheidungen verbessert.\r\nFokus auf Business-Impact, ROI, Skalierbarkeit und Integration in bestehende Systeme. Verwende faktenbasierte Argumente, KPIs und eine CTA wie Beratung anfragen.",
         },
      },
   },
   {
      title: "AI-SaaS Landingpage mit Fokus auf Vertrauen & Sicherheit",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Schreibe eine Landingpage f\u00FCr ein AI-SaaS-Produkt, bei dem Vertrauen entscheidend ist.\r\nGehe explizit auf Datenschutz (z. B. DSGVO), Datenverarbeitung, Modelltraining und Sicherheitsstandards ein. Erg\u00E4nze Trust-Elemente wie Kundenstimmen, Zertifikate und klare Aussagen zur Datennutzung.",
         },
      },
   },
   {
      title: "AI-SaaS Landingpage für erklärungsbedürftige KI-Produkte",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine Landingpage f\u00FCr ein erkl\u00E4rungsbed\u00FCrftiges AI-SaaS-Tool, das [Use Case] automatisiert.\r\nErkl\u00E4re verst\u00E4ndlich, was die KI macht, was sie nicht macht, und wie der Nutzer sie einsetzt. Verwende einfache Sprache, visuelle Abschnitts\u00FCberschriften und einen sekund\u00E4ren CTA (Demo ansehen).",
         },
      },
   },
   {
      title: "AI-SaaS Landingpage mit klarem Value Proposition-Fokus",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine conversion-optimierte Landingpage f\u00FCr ein AI-SaaS-Produkt ([Produktname]).\r\nFormuliere eine klare Value Proposition im Hero-Bereich (1 Headline, 1 Subheadline), erkl\u00E4re konkret, welches Problem die KI l\u00F6st und welchen messbaren Mehrwert sie liefert. Integriere einen prim\u00E4ren CTA (z. B. Kostenlos testen). Zielgruppe: [Zielgruppe].",
         },
      },
   },
   {
      title: "SaaS-Landingpage mit Social Proof & Trust Signals",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Schreibe eine SaaS-Landingpage f\u00FCr [Software-Name], die stark auf Vertrauen setzt. Integriere Kundenlogos, Testimonials, Case Studies, Sicherheitsstandards, Datenschutz-Hinweise und einen klaren Call-to-Action.",
         },
      },
   },
   {
      title: "SaaS-Landingpage mit Feature-zu-Benefit-Mapping",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine SaaS-Landingpage f\u00FCr [Software-Name], bei der jede Hauptfunktion direkt in einen konkreten Kundennutzen \u00FCbersetzt wird. Strukturiere die Inhalte \u00FCbersichtlich und conversion-orientiert.",
         },
      },
   },
   {
      title: "SaaS-Landingpage für B2B-Entscheider",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Entwickle Inhalte f\u00FCr eine B2B-SaaS-Landingpage, die sich an Entscheider und Manager richtet. Fokus auf ROI, Effizienzsteigerung, Integration, Sicherheit und Skalierbarkeit von [Software-Name].",
         },
      },
   },
   {
      title: "SaaS-Landingpage mit Problem–Lösungs-Ansatz",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Schreibe eine SaaS-Landingpage f\u00FCr [Software-Name], die ein zentrales Problem von [Zielgruppe] klar benennt und zeigt, wie die Software dieses effizient l\u00F6st. Nutze klare Use-Cases, Vorteile und eine \u00FCberzeugende Produktpositionierung.",
         },
      },
   },
   {
      title: "SaaS-Landingpage für Free-Trial-Conversion",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine SaaS-Landingpage f\u00FCr [Software-Name], die Nutzer zur Anmeldung f\u00FCr eine kostenlose Testversion motiviert. Hebe den Hauptnutzen, Kernfunktionen, einfache Einrichtung, Risikofreiheit und einen klaren Call-to-Action hervor.",
         },
      },
   },
   {
      title: "Conversion-orientierte Landingpage mit Fokus auf Vertrauen",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine Landingpage f\u00FCr [Produkt/Dienstleistung], die stark auf Vertrauen und Glaubw\u00FCrdigkeit abzielt. Integriere Kundenbewertungen, Testimonials, Garantien, Siegel und eine \u00FCberzeugende Call-to-Action.",
         },
      },
   },
   {
      title: "SEO-optimierte Landingpage",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Schreibe Inhalte f\u00FCr eine SEO-optimierte Landingpage zum Thema [Produkt/Dienstleistung]. Integriere das Haupt-Keyword [Keyword], passende Nebenkeywords, Meta-Titel, Meta-Beschreibung und eine logische Seitenstruktur.",
         },
      },
   },
   {
      title: "Landingpage nach AIDA-Modell",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Entwickle eine Landingpage f\u00FCr [Produkt/Dienstleistung] nach dem AIDA-Prinzip (Attention, Interest, Desire, Action). Formuliere pr\u00E4gnante \u00DCberschriften, Zwischen\u00FCberschriften und Call-to-Actions.",
         },
      },
   },
   {
      title: "Verkaufsstarke Landingpage-Texte",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle \u00FCberzeugende Landingpage-Texte f\u00FCr [Produkt/Dienstleistung] mit Fokus auf Kundennutzen und klare Handlungsaufforderungen. Zielgruppe ist [Zielgruppe]",
         },
      },
   },
   {
      title: "Landingpage-Grundstruktur",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Schreibe eine klare und conversion-optimierte Struktur f\u00FCr eine Landingpage, die [Produkt/Dienstleistung] verkauft. Ber\u00FCcksichtige Hero-Bereich, Nutzenargumente, Features, Social Proof, Call-to-Action und FAQ.",
         },
      },
   },
   {
      title: "Psychological Trigger Landing Page",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "CRO",
            "Conversion Optimisation",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine Landing Page, die gezielt psychologische Trigger nutzt, um Conversion zu maximieren.\r\nAngebot: [Angebot einf\u00FCgen]\r\n\r\nTrigger, die eingebaut werden m\u00FCssen:\r\n\u2013 Klarheit\r\n\u2013 Social Proof\r\n\u2013 Autorit\u00E4t\r\n\u2013 Verlustangst\r\n\u2013 Einfachheit\r\n\r\nStruktur:\r\n\r\nHeadline mit klarer Transformation\r\n\r\nSubheadline mit sozialer Best\u00E4tigung\r\n\r\nDarstellung der einfachen L\u00F6sung\r\n\r\nVorteile & Ergebnisse\r\n\r\nBeweise (Zahlen, Aussagen, Referenzen)\r\n\r\nCTA mit Dringlichkeit\r\n\r\nZiel:\r\n\u2013 Nutzer versteht sofort den Nutzen\r\n\u2013 Nutzer f\u00FChlt sich sicher\r\n\u2013 Nutzer handelt",
         },
      },
   },
   {
      title: "Short-Form High-Conversion Landing Page",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "CRO",
            "Conversion Optimisation",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine kurze, extrem fokussierte Landing Page f\u00FCr folgendes Angebot:\r\n[Angebot einf\u00FCgen]\r\n\r\nZiel: Conversion in unter 30 Sekunden Lesezeit.\r\n\r\nInhalt:\r\n\r\nStarke Headline mit klarem Nutzen\r\n\r\nSubheadline: F\u00FCr wen + Ergebnis\r\n\r\n3\u20135 starke Benefits\r\n\r\n1\u20132 Social-Proof-Elemente\r\n\r\nKlarer CTA\r\n\r\nStil:\r\n\u2013 Sehr kurz\r\n\u2013 Kein unn\u00F6tiger Text\r\n\u2013 Jede Zeile verkauft",
         },
      },
   },
   {
      title: "Objection-Killer Landing Page",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "CRO",
            "Conversion Optimisation",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine Landing Page, die gezielt Einw\u00E4nde und Zweifel ausr\u00E4umt.\r\nAngebot: [Produkt / Service einf\u00FCgen]\r\n\r\nZiel: Conversion durch Vertrauen & Klarheit.\r\n\r\nStruktur:\r\n\r\nKlare Value Proposition im Hero\r\n\r\nKurz: Was das Angebot macht (1\u20132 S\u00E4tze)\r\n\r\nTypische Einw\u00E4nde der Zielgruppe (\u201EZu teuer\u201C, \u201EZu kompliziert\u201C, \u201EZu riskant\u201C)\r\n\r\nDirekte Antworten auf jeden Einwand\r\n\r\nVorteile & Ergebnisse\r\n\r\nSocial Proof + Glaubw\u00FCrdigkeit\r\n\r\nRisiko-freie CTA-Formulierung\r\n\r\nRegel:\r\n\u2013 Keine Marketingfloskeln\r\n\u2013 Klare Aussagen\r\n\u2013 Fokus auf Vertrauen",
         },
      },
   },
   {
      title: "Pain-Driven Conversion Landing Page",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "CRO",
            "Conversion Optimisation",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine Landing Page, die stark \u00FCber Pain Points verkauft.\r\nAngebot: [Angebot einf\u00FCgen]\r\n\r\nFokus: Maximale Identifikation des Nutzers mit seinem Problem.\r\n\r\nAufbau:\r\n\r\nHeadline, die den gr\u00F6\u00DFten Schmerz der Zielgruppe anspricht\r\n\r\nBeschreibung der negativen Konsequenzen, wenn nichts ge\u00E4ndert wird\r\n\r\nWarum bisherige L\u00F6sungen scheitern\r\n\r\nEinf\u00FChrung des Angebots als einfache, klare L\u00F6sung\r\n\r\nKonkrete Ergebnisse nach Nutzung\r\n\r\nBeweise (Social Proof / Zahlen / Aussagen)\r\n\r\nKlarer CTA mit Ergebnisversprechen\r\n\r\nTon:\r\n\u2013 Emotional, aber seri\u00F6s\r\n\u2013 Direkt, ohne Umschweife\r\n\u2013 Nutzer f\u00FChlt sich \u201Everstanden\u201C",
         },
      },
   },
   {
      title: "High-Conversion Landing Page (CRO-Framework)",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "CRO",
            "Conversion Optimisation",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine hochkonvertierende Landing Page f\u00FCr folgendes Angebot:\r\n[Produkt / Service einf\u00FCgen]\r\n\r\nZiel ist maximale Conversion (Lead / Kauf / Demo).\r\n\r\nConversion-Struktur:\r\n\r\nHero mit klarer Nutzen-Headline (Ergebnis > Funktion)\r\n\r\nSubheadline: F\u00FCr wen + welches Problem gel\u00F6st wird\r\n\r\nPrim\u00E4rer CTA oberhalb der Fold\r\n\r\nProblem-Agitation (Warum der Status quo nicht funktioniert)\r\n\r\nL\u00F6sung + USP (Warum genau dieses Angebot)\r\n\r\nBenefits statt Features (Transformation klar benennen)\r\n\r\nSocial Proof (Testimonials, Zahlen, Logos \u2013 realistisch generieren)\r\n\r\nRisiko-Umkehr (Garantie, Testphase, kein Risiko)\r\n\r\nWiederholter CTA mit Dringlichkeit\r\n\r\nStil:\r\n\u2013 Direkt, klar, aktiv\r\n\u2013 Keine Buzzwords\r\n\u2013 Jede Sektion muss zur Conversion f\u00FChren",
         },
      },
   },
   {
      title: "SEO-optimierte Landing Page",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine SEO-optimierte Landing Page f\u00FCr folgendes Thema:\r\n[Keyword / Produkt / Dienstleistung einf\u00FCgen]\r\n\r\nZiel ist es, organischen Traffic zu generieren und Besucher zu konvertieren.\r\n\r\nAnforderungen:\r\n\u2013 Nutze ein Haupt-Keyword + relevante Neben-Keywords\r\n\u2013 Saubere H1\u2013H3-Struktur\r\n\u2013 Lesefreundliche Abs\u00E4tze und Bulletpoints\r\n\r\nInhalt:\r\n\r\nKeyword-optimierte Headline\r\n\r\nEinleitung mit klarem Nutzen\r\n\r\nDetaillierte Problemerkl\u00E4rung\r\n\r\nL\u00F6sungsansatz durch das Angebot\r\n\r\nVorteile & Features\r\n\r\nFAQ-Bereich (SEO-relevant)\r\n\r\nStarker CTA\r\n\r\nOutput:\r\n\u2013 Strukturierter Text in Markdown\r\n\u2013 Inklusive Meta Title & Meta Description",
         },
      },
   },
   {
      title: "Minimalistische High-End Landing Page",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine minimalistische, hochwertige Landing Page f\u00FCr folgendes Premium-Angebot:\r\n[Angebot einf\u00FCgen]\r\n\r\nFokus liegt auf Klarheit, Design und Exklusivit\u00E4t.\r\n\r\nStruktur:\r\n\r\nSehr kurze, starke Headline mit klarer Aussage\r\n\r\nSubheadline mit Nutzenversprechen\r\n\r\n3\u20135 zentrale Vorteile in Bullet-Form\r\n\r\nKurze Erkl\u00E4rung, f\u00FCr wen das Angebot gedacht ist\r\n\r\nVertrauenselemente (Zahlen, Marken, Aussagen)\r\n\r\nReduzierter CTA (z. B. \u201EZugang anfragen\u201C)\r\n\r\nStil:\r\n\u2013 Kurz, pr\u00E4zise, selbstbewusst\r\n\u2013 Keine unn\u00F6tigen Erkl\u00E4rungen\r\n\u2013 Fokus auf Wirkung statt Textmenge",
         },
      },
   },
   {
      title: "SaaS / Tech Landing Page",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "SaaS",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine moderne Landing Page f\u00FCr ein SaaS- oder Tech-Produkt:\r\n[Name & Kurzbeschreibung einf\u00FCgen]\r\n\r\nZiel ist es, den Nutzen des Produkts in Sekunden verst\u00E4ndlich zu machen.\r\n\r\nStruktur:\r\n\r\nKlare Value Proposition im Hero-Bereich\r\n\r\nKurze Erkl\u00E4rung: \u201EWas ist das Produkt?\u201C\r\n\r\nHauptprobleme der Zielgruppe + passende Produktl\u00F6sung\r\n\r\nKernfunktionen mit kurzen Erkl\u00E4rungen\r\n\r\nIntegrationen / Kompatibilit\u00E4t (falls relevant)\r\n\r\nSicherheit, Datenschutz & Vertrauen\r\n\r\nCTA (Demo buchen / Kostenlos testen)\r\n\r\nExtras:\r\n\u2013 Schreibe klar, sachlich, aber \u00FCberzeugend\r\n\u2013 Vermeide technische \u00DCberladung\r\n\u2013 Optional: Pricing-Teaser & FAQ",
         },
      },
   },
   {
      title: "Storytelling Landing Page",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine Landing Page f\u00FCr folgendes Angebot mit starkem Storytelling-Fokus:\r\n[Angebot einf\u00FCgen]\r\n\r\nDie Landing Page soll den Besucher emotional abholen und logisch zur Conversion f\u00FChren.\r\n\r\nAufbau:\r\n\r\nEinstieg mit einer Story oder Alltagssituation der Zielgruppe\r\n\r\nDarstellung des Problems und der bisherigen erfolglosen L\u00F6sungsversuche\r\n\r\nEinf\u00FChrung des Angebots als Wendepunkt\r\n\r\nErkl\u00E4rung, wie das Angebot funktioniert (Schritt-f\u00FCr-Schritt)\r\n\r\nVorteile & Ergebnisse f\u00FCr den Nutzer\r\n\r\nErfahrungsberichte / Erfolgsgeschichten\r\n\r\nStarker CTA mit klarer Nutzenargumentation\r\n\r\nStil:\r\n\u2013 Emotional, glaubw\u00FCrdig, klar\r\n\u2013 Direkte Ansprache der Zielgruppe\r\n\u2013 Leicht verst\u00E4ndlich, ohne Buzzwords",
         },
      },
   },
   {
      title: "Conversion-fokussierte Landing Page",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine conversion-optimierte Landing Page f\u00FCr folgendes Angebot:\r\n[Produkt / Service / SaaS / Tool einf\u00FCgen]\r\n\r\nZiel der Seite ist es, Besucher zu Leads oder K\u00E4ufern zu konvertieren.\r\n\r\nStruktur:\r\n\r\nHero-Sektion mit emotionalem Hauptversprechen, Subheadline und prim\u00E4rem CTA\r\n\r\nKlare Darstellung des Kernproblems der Zielgruppe\r\n\r\nPr\u00E4sentation der L\u00F6sung inkl. einzigartigem Nutzen (USP)\r\n\r\nFeatures & Benefits (klar getrennt)\r\n\r\nSocial Proof (Kundenstimmen, Logos, Zahlen)\r\n\r\nSekund\u00E4rer CTA nach jedem Hauptabschnitt\r\n\r\nAbschlusssektion mit Risiko-Umkehr (z. B. Garantie, Testphase)\r\n\r\nAnforderungen:\r\n\u2013 Schreibe pr\u00E4gnant, nutzerzentriert und handlungsauffordernd\r\n\u2013 Verwende psychologische Trigger (Vertrauen, Dringlichkeit, Klarheit)\r\n\u2013 Strukturierter Output in Markdown",
         },
      },
   },
   {
      title: "Universeller Prompt zur Erstellung einer Landing Page",
      description: "",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription: "",
            promptText:
               "Erstelle eine vollst\u00E4ndig ausgearbeitete Landing Page f\u00FCr folgendes Angebot:\r\n[Hier dein Produkt/Service/Angebot einf\u00FCgen]\r\n\r\nVerwende eine moderne, klare und \u00FCberzeugende Schreibweise.\r\n\r\nStruktur der Landing Page:\r\n\r\nHero-Sektion mit starkem Haupt-Claim, Subheadline und CTA.\r\n\r\nProblem- > L\u00F6sung-Logik: Beschreibe das Problem der Zielgruppe und wie das Angebot es l\u00F6st.\r\n\r\nFeature-Highlights: Liste die wichtigsten Funktionen/Benefits klar strukturiert auf.\r\n\r\nSocial Proof: Testimonials, Trust-Elemente oder G\u00FCtesiegel einf\u00FCgen (falls keine vorhanden, generiere realistische Beispiele).\r\n\r\nDetailbeschreibung des Angebots inkl. Value Proposition.\r\n\r\nFAQ-Bereich mit typischen Kundenfragen.\r\n\r\nAbschlie\u00DFender CTA mit Dringlichkeit/Mehrwert.\r\n\r\nTonality & Style:\r\n\u2013 Professionell, vertrauensw\u00FCrdig, inspirierend\r\n\u2013 Klar, ohne Fachjargon\r\n\u2013 Conversion-optimiert\r\n\r\nSEO:\r\n\u2013 Verwende relevante Keywords\r\n\u2013 Nutze sprechende Zwischen\u00FCberschriften\r\n\u2013 F\u00FCge Meta Title & Meta Description hinzu\r\n\r\nOutput:\r\n\u2013 Saubere, formatierte Struktur in Markdown\r\n\u2013 Optional auch HTML-Variante erstellen (falls gew\u00FCnscht)",
         },
      },
   },
   {
      title: "Schreibe eine verkaufende Landingpage",
      description:
         "Dieser Prompt erm\u00F6glicht es, **vollst\u00E4ndige, verkaufspsychologisch optimierte Landingpages** zu generieren \u2013 von der Hero-Section bis zum Call-to-Action. Er zwingt die KI dazu, strukturiert nach Direct-Response-Prinzipien zu arbeiten und alle entscheidenden Conversion-Elemente zu ber\u00FCcksichtigen: Schmerzpunkte, Nutzenargumente, Einwandbehandlung und Social Proof. Ideal f\u00FCr Marketer, Copywriter und Gr\u00FCnder, die schnell hochwertige Landingpages erstellen wollen, ohne jedes Mal bei null zu beginnen.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Dieser Prompt versetzt die KI in die Rolle eines erfahrenen Senior Direct-Response-Copywriters und gibt ihr eine klare Aufgabe: eine Landingpage zu erstellen, die ein konkretes Ziel erreicht (z. B. Kauf, Lead, Anmeldung).\r\n\r\nDer Nutzer liefert daf\u00FCr alle entscheidenden Kontextinformationen:\r\n\r\n**Produkt**: Was wird angeboten\r\n\r\n**Zielgruppe**: F\u00FCr wen die Seite gedacht ist\r\n\r\n**Bewusstseinslevel**: Wie informiert die Zielgruppe bereits ist\r\n\r\n**Traffic-Quelle**: In welchem Kontext die Seite besucht wird\r\n\r\n**Einw\u00E4nde**: Typische Zweifel oder Kaufh\u00FCrden\r\n\r\nAnschlie\u00DFend zwingt der Prompt die KI, strikt einer bew\u00E4hrten Landingpage-Struktur zu folgen: Hero-Section, Problemverst\u00E4rkung, L\u00F6sung und Mechanismus, Nutzenargumentation, Einwandbehandlung, Social Proof und klarer CTA.\r\n\r\nDer gro\u00DFe Vorteil dieses Prompts liegt darin, dass er keinen generischen Text, sondern eine strategisch aufgebaute Verkaufsseite erzeugt. Nutzer m\u00FCssen lediglich die Platzhalter sauber ausf\u00FCllen \u2013 je pr\u00E4ziser die Angaben, desto st\u00E4rker die resultierende Landingpage. Der Prompt eignet sich besonders f\u00FCr Performance-Marketing, Funnel-Seiten, Produktlaunches und Angebotsseiten mit klarer Conversion-Absicht.",
            promptText:
               "Du bist ein Senior Direct-Response-Copywriter.\r\n\r\nAufgabe:\r\nErstelle eine vollst\u00E4ndige Landingpage, die [Ziel] erreicht.\r\n\r\nKontext:\r\nProdukt: [Produkt]\r\nZielgruppe: [Zielgruppe]\r\nBewusstseinslevel: [Level]\r\nTraffic-Quelle: [z. B. Ads]\r\nEinw\u00E4nde: [Liste]\r\n\r\nArbeite strukturiert:\r\n1. Starke Hero-Section\r\n2. Problem- & Schmerzverst\u00E4rkung\r\n3. L\u00F6sung & Mechanismus\r\n4. Nutzen vor Features\r\n5. Einwandbehandlung\r\n6. Social Proof\r\n7. Klarer CTA\r\n\r\nSchreibe verkaufspsychologisch, klar und ohne Floskeln.\r\n",
         },
      },
   },
   {
      title: "Diese Seite konvertiert schlecht – analysieren & reparieren",
      description:
         "Dieser Prompt hilft dir, bestehende Landingpages systematisch auf Conversion-Hürden zu analysieren und gezielt zu verbessern. Er identifiziert unklare Aussagen, fehlende Motivation, psychologische Brüche, nicht behandelte Einwände und schwache Call-to-Actions. Statt allgemeiner Kritik liefert der Prompt **konkrete Textvorschläge**, die direkt umsetzbar sind. Ideal für Marketer, Copywriter und Gründer, die mehr Leads oder Verkäufe aus bestehendem Traffic herausholen wollen.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
            "Conversion",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Dieser Prompt versetzt die KI in die Rolle eines erfahrenen Conversion-Rate-Optimizers. Der Nutzer f\u00FCgt den vollst\u00E4ndigen Text einer Landingpage ein. Die KI analysiert diesen Text strukturiert entlang f\u00FCnf zentraler Conversion-Faktoren: Klarheit, Motivation, psychologische Konsistenz, Einwandbehandlung und Handlungsaufforderung.\r\n\r\nIm ersten Schritt identifiziert die KI konkrete Schwachstellen, z. B. unklare Nutzenkommunikation, fehlende emotionale Trigger oder logische Br\u00FCche im Argumentationsfluss. Im zweiten Schritt schl\u00E4gt sie **konkrete Textverbesserungen** vor, statt nur abstrakte Empfehlungen zu geben.\r\n\r\nDer Prompt eignet sich besonders f\u00FCr Landingpages, Verkaufsseiten, Lead-Magnet-Seiten oder Angebotsseiten. F\u00FCr optimale Ergebnisse sollte der Nutzer den vollst\u00E4ndigen, unver\u00E4nderten Seiteninhalt einf\u00FCgen und keine einzelnen Abschnitte isolieren. So kann die KI Zusammenh\u00E4nge, \u00DCberg\u00E4nge und psychologische Spannungen korrekt bewerten und wirksame Optimierungen vorschlagen.",
            promptText:
               "Du bist Conversion-Rate-Optimizer.\r\n\r\nAnalysiere diese Landingpage:\r\n[Text]\r\n\r\nIdentifiziere:\r\n\u2013 Unklarheiten\r\n\u2013 fehlende Motivation\r\n\u2013 psychologische Br\u00FCche\r\n\u2013 fehlende Einwandbehandlung\r\n\u2013 schwache CTAs\r\n\r\nSchlage konkrete Text-Verbesserungen vor.\r\n",
         },
      },
   },
   {
      title: "Ads, die Aufmerksamkeit stoppen",
      description:
         "Dieser Prompt erzeugt **scroll-stoppende Werbetexte für Paid Ads**, die gezielt auf Plattform, Zielgruppe und Bewusstseinslevel abgestimmt sind. Er liefert sofort einsetzbare Hooks, vollständige Ad-Copies und klare Call-to-Actions mit Fokus auf Neugier, Relevanz und Emotion. Ideal für Marketer, Performance-Creator und Gründer, die schnell hochwertige Anzeigenvarianten testen und ihre Kampagnen effizient skalieren wollen.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories(["Copywriting", "Paid Ads"]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Dieser Prompt versetzt die KI in die Rolle eines erfahrenen Performance-Copywriters f\u00FCr Paid Advertising. Der Nutzer definiert zun\u00E4chst die wichtigsten Grundlagen der Kampagne: Plattform (z. B. Meta, TikTok, Google, LinkedIn), Produkt, Zielgruppe und das Bewusstseinslevel der Zielgruppe (z. B. problem-aware, solution-aware, product-aware).\r\n\r\nAuf dieser Basis erstellt die KI:\r\n\r\n**10 unterschiedliche Hooks**, die speziell darauf ausgelegt sind, Aufmerksamkeit im Feed zu erzeugen\r\n\r\n**5 vollst\u00E4ndige Ad-Copies**, die emotional, relevant und plattformgerecht formuliert sind\r\n\r\n**mehrere CTA-Varianten**, die zum n\u00E4chsten logischen Schritt motivieren\r\n\r\nDer Fokus liegt bewusst auf Performance-relevanten Faktoren wie Neugieraufbau, emotionaler Resonanz und klarer Ansprache der Zielgruppe.\r\nDer Prompt eignet sich besonders f\u00FCr A/B-Tests, Creative-Sprints und die schnelle Entwicklung von Anzeigenkonzepten. F\u00FCr optimale Ergebnisse sollte der Nutzer das Bewusstseinslevel realistisch einsch\u00E4tzen und die Plattform klar benennen, da Tonalit\u00E4t und Textl\u00E4nge stark davon abh\u00E4ngen.",
            promptText:
               "Du bist Performance-Copywriter f\u00FCr Paid Ads.\r\n\r\nZiel:\r\nScroll-Stopping Ads f\u00FCr [Plattform].\r\n\r\nProdukt: [Produkt]\r\nZielgruppe: [Zielgruppe]\r\nBewusstseinslevel: [Level]\r\n\r\nErstelle:\r\n\u2013 10 starke Hooks\r\n\u2013 5 Ad-Copies\r\n\u2013 klare CTA-Varianten\r\n\r\nFokus: Neugier, Relevanz, Emotion.\r\n",
         },
      },
   },
   {
      title: "Schreibe eine E-Mail, die verkauft",
      description:
         "Dieser Prompt hilft dir, **komplette Verkaufs-E-Mails** zu erstellen, die Aufmerksamkeit erzeugen, Einwände auflösen und gezielt zum Klick führen. Er kombiniert Copywriting-Struktur, Verkaufspsychologie und Zielgruppenverständnis in einem klaren Workflow. Zusätzlich generiert der Prompt Hooks, Ad-Copies und CTA-Varianten, sodass du nicht nur eine E-Mail, sondern mehrere einsetzbare Marketing-Assets erhältst. Ideal für Launches, Kampagnen und Performance-Marketing.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories(["Copywriting", "E-Mail"]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Dieser Prompt versetzt die KI in die Rolle eines erfahrenen E-Mail-Copywriters und f\u00FChrt sie durch einen vollst\u00E4ndigen Verkaufsprozess. Der Nutzer definiert Angebot, Zielgruppe, Bewusstseinslevel und typische Einw\u00E4nde. Auf dieser Basis erstellt die KI eine strukturierte Verkaufs-E-Mail mit starkem Einstieg, problemorientierter Story, klarer Nutzenargumentation, gezielter Einwandbehandlung und einem \u00FCberzeugenden Call-to-Action.\r\n\r\nZus\u00E4tzlich generiert der Prompt:\r\n\r\n10 aufmerksamkeitsstarke Hooks (f\u00FCr Betreffzeilen oder Einstiegss\u00E4tze),\r\n\r\n5 Ad-Copies (z. B. f\u00FCr Social Ads oder Newsletter-Teaser),\r\n\r\nmehrere klare CTA-Varianten zur Conversion-Optimierung.\r\n\r\nDer Prompt eignet sich besonders f\u00FCr Marketer, Coaches, Agenturen und Produktanbieter, die systematisch E-Mails schreiben m\u00F6chten, ohne jedes Element einzeln zu prompten.\r\nF\u00FCr optimale Ergebnisse sollte das Bewusstseinslevel der Zielgruppe korrekt eingesch\u00E4tzt und typische Einw\u00E4nde m\u00F6glichst konkret angegeben werden. Dadurch kann die KI Tonalit\u00E4t, Argumentation und Dramaturgie pr\u00E4zise anpassen.",
            promptText:
               "Du bist E-Mail-Copywriter.\r\n\r\nAufgabe:\r\nSchreibe eine Verkaufs-E-Mail f\u00FCr [Angebot].\r\n\r\nZielgruppe: [Zielgruppe]\r\nBewusstseinslevel: [Level]\r\nEinw\u00E4nde: [Liste]\r\n\r\nStruktur:\r\n\u2013 starker Einstieg\r\n\u2013 Story oder Problem\r\n\u2013 L\u00F6sung & Nutzen\r\n\u2013 Einwandbehandlung\r\n\u2013 CTA\r\n",
         },
      },
   },
   {
      title: "Positionierung & Brand Voice entwickeln",
      description:
         "Dieser Prompt hilft dir, das strategische Fundament einer Marke zu entwickeln: klare Kernbotschaft, ein differenzierender Unique Mechanism, eine stimmige Tonalität und ein zentrales Narrativ. Er ist ideal, wenn eine Marke unscharf wirkt, sich nicht klar vom Markt abgrenzt oder ihre Kommunikation inkonsistent ist. Der Mehrwert liegt darin, dass nicht nur Texte entstehen, sondern eine klare Markenlogik, auf der alle weiteren Marketing- und Copywriting-Maßnahmen aufbauen können.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Brand Voice",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Dieser Prompt versetzt die KI in die Rolle eines erfahrenen Brand-Strategen und Copywriters. Ziel ist nicht die Erstellung einzelner Texte, sondern die Entwicklung eines koh\u00E4renten Markenfundaments.\r\n\r\nDer Nutzer gibt drei zentrale Informationen an:\r\n\r\n**Marke**: Name, Produkt oder Unternehmen\r\n\r\n**Zielgruppe**: idealerweise m\u00F6glichst konkret (Bed\u00FCrfnisse, Probleme, Bewusstsein)\r\n\r\n**Markt**: Branche, Wettbewerbsumfeld oder Kategorie\r\n\r\nAuf dieser Basis entwickelt die KI vier strategische Elemente:\r\n\r\nKernbotschaft\r\nDie eine zentrale Aussage, die die Marke im Kopf der Zielgruppe verankern soll. Sie dient als Leitstern f\u00FCr alle Texte, Kampagnen und Inhalte.\r\n\r\nUnique Mechanism\r\nDer spezifische Wirkmechanismus oder Ansatz, der erkl\u00E4rt, warum diese Marke funktioniert \u2013 und nicht nur dass sie funktioniert. Er sorgt f\u00FCr echte Differenzierung im Markt.\r\n\r\nTonalit\u00E4t\r\nDie kommunikative Haltung der Marke (z. B. direkt, empathisch, souver\u00E4n, rebellisch). Sie stellt sicher, dass alle Texte konsistent klingen \u2013 unabh\u00E4ngig vom Kanal.\r\n\r\nZentrale Narrative\r\nDie \u00FCbergeordnete Geschichte oder Perspektive, durch die die Marke ihre Welt erkl\u00E4rt und sich emotional positioniert. Dieses Narrativ verbindet Produkt, Marke und Zielgruppe.\r\n\r\nDer Prompt eignet sich besonders f\u00FCr:\r\n\r\nMarkenaufbau oder Repositionierung\r\n\r\nneue Produkte oder Startups\r\n\r\nCopywriter, Strategen und Gr\u00FCnder\r\n\r\nals Ausgangspunkt f\u00FCr Websites, Sales Pages, Ads und Content\r\n\r\nWichtig f\u00FCr die Nutzung:\r\nJe klarer Zielgruppe und Markt beschrieben sind, desto pr\u00E4ziser und differenzierter wird das Ergebnis. Die Resultate dieses Prompts sollten nicht als finale Texte, sondern als strategische Grundlage f\u00FCr alle weiteren Kommunikationsma\u00DFnahmen verstanden werden.",
            promptText:
               "Du bist Brand-Strategist & Copywriter.\r\n\r\nEntwickle:\r\n\u2013 Kernbotschaft\r\n\u2013 Unique Mechanism\r\n\u2013 Tonalit\u00E4t\r\n\u2013 zentrale Narrative\r\n\r\nF\u00FCr:\r\nMarke: [Marke]\r\nZielgruppe: [Zielgruppe]\r\nMarkt: [Markt]\r\n",
         },
      },
   },
   {
      title: "Conversion-fokussierte Produktbeschreibung",
      description:
         "Dieser Prompt hilft dir, Produktbeschreibungen zu erstellen, die **nachweislich verkaufen**. Statt Features aufzuzählen, führt er die KI dazu, gezielt auf die Probleme, Wünsche und Kaufmotive der Zielgruppe einzugehen. Ideal für Verkaufsseiten, Landing Pages und Produktdetailseiten, bei denen Conversion im Vordergrund steht. Der Mehrwert liegt in der klaren Struktur und der psychologisch wirksamen Nutzenargumentation.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Dieser Prompt versetzt die KI in die Rolle eines erfahrenen Conversion-Copywriters. Der Nutzer gibt Produkt, Zielgruppe, Hauptproblem und Nutzenversprechen vor. Auf dieser Basis erstellt die KI eine strukturierte Produktbeschreibung mit emotionalem Einstieg, klaren Nutzenargumenten und einem starken Kaufimpuls.\r\nDer Prompt eignet sich besonders f\u00FCr Nutzer, die ihre Produkttexte systematisch verbessern wollen, ohne selbst tiefes Copywriting-Wissen zu besitzen. Wichtig ist, dass Problem und Zielgruppe m\u00F6glichst konkret angegeben werden, da die Qualit\u00E4t der Beschreibung stark davon abh\u00E4ngt.",
            promptText:
               "Du bist ein erfahrener Conversion-Copywriter. Erstelle eine verkaufsstarke Produktbeschreibung f\u00FCr [Produkt].\r\nZielgruppe: [Zielgruppe]\r\nHauptproblem der Zielgruppe: [Problem]\r\nNutzenversprechen: [Hauptnutzen]\r\nStruktur:\r\n\r\nEmotionaler Einstieg (Problem oder Wunsch)\r\n\r\nKonkrete Nutzenargumente (keine Features)\r\n\r\nSoziale Absicherung (implizit)\r\n\r\nKlarer Kaufanreiz\r\nSchreibe pr\u00E4zise, \u00FCberzeugend und ohne Floskeln.",
         },
      },
   },
   {
      title: "Feature-zu-Benefit-Transformation",
      description:
         "Dieser Prompt wandelt trockene Produktfeatures in **kundenrelevante Nutzenargumente** um. Er hilft dabei, den Mehrwert eines Produkts verständlich und überzeugend zu kommunizieren – ideal für technische oder erklärungsbedürftige Produkte. Perfekt für alle, die zwar wissen, was ihr Produkt kann, aber nicht, wie sie es verkaufsstark formulieren sollen.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Der Prompt fordert den Nutzer auf, eine Liste von Produktfeatures einzugeben. Die KI analysiert jedes Feature einzeln und \u00FCbersetzt es in einen konkreten Nutzen f\u00FCr die Zielgruppe. Dadurch entsteht eine Produktbeschreibung, die nicht erkl\u00E4rt, _was_ das Produkt ist, sondern _warum_ es relevant ist.\r\nBesonders wichtig ist eine vollst\u00E4ndige Feature-Liste. Je genauer die Features beschrieben sind, desto pr\u00E4ziser wird die Nutzenargumentation. Der Prompt eignet sich hervorragend f\u00FCr Shops, SaaS-Produkte oder technische L\u00F6sungen.",
            promptText:
               "Du bist ein Produkt-Marketer. Analysiere die folgenden Produktfeatures und verwandle jedes Feature in einen klaren, kundenrelevanten Nutzen.\r\nProdukt: [Produkt]\r\nFeatures: [Feature-Liste]\r\nZielgruppe: [Zielgruppe]\r\nGib die Produktbeschreibung als leicht lesbaren, strukturierten Text aus, der zeigt, warum das Produkt das Leben des Kunden verbessert.",
         },
      },
   },
   {
      title: "Storytelling-Produktbeschreibung",
      description:
         "Mit diesem Prompt entstehen Produktbeschreibungen, die emotional binden statt nur zu informieren. Durch Storytelling wird das Produkt in eine nachvollziehbare Situation eingebettet, wodurch sich potenzielle Kunden leichter identifizieren können. Ideal für Markenaufbau, Social Proof und Produkte mit emotionalem Mehrwert.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Der Prompt leitet die KI an, eine klare Story-Struktur zu nutzen: Ausgangssituation, Problem, L\u00F6sung und Transformation. Der Nutzer definiert Produkt und Zielgruppe, die KI entwickelt daraus eine kurze Geschichte, in der das Produkt der Wendepunkt ist.\r\nDer Prompt eignet sich besonders f\u00FCr Lifestyle-Produkte, Coaches, Creator-Produkte oder Marken, die sich differenzieren m\u00F6chten. Wichtig ist eine klar definierte Zielgruppe, da die Geschichte auf deren Lebensrealit\u00E4t aufbauen soll.",
            promptText:
               "Du bist ein Storytelling-Copywriter. Schreibe eine Produktbeschreibung f\u00FCr [Produkt], die eine kurze Geschichte erz\u00E4hlt:\r\n\r\nAusgangssituation der Zielgruppe\r\n\r\nFrustration oder Wunsch\r\n\r\nBegegnung mit dem Produkt\r\n\r\nPositive Ver\u00E4nderung danach\r\nZielgruppe: [Zielgruppe]\r\nTonalit\u00E4t: emotional, glaubw\u00FCrdig, nahbar.",
         },
      },
   },
   {
      title: "Premium-Produktbeschreibung (High-End)",
      description:
         "Dieser Prompt erzeugt **hochwertige, elegante Produktbeschreibungen** für Premium- und Luxusprodukte. Statt aggressiver Verkaufssprache liegt der Fokus auf Qualität, Exklusivität und Detailtiefe. Ideal für Marken, die Vertrauen, Stil und Wertigkeit vermitteln wollen.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Die KI wird in die Rolle eines Luxus-Copywriters versetzt. Der Nutzer definiert das Produkt, w\u00E4hrend Tonalit\u00E4t und Zielgruppe bereits vorgegeben sind. Die KI erstellt daraufhin einen ruhigen, selbstbewussten Text, der nicht \u00FCberzeugen muss \u2013 sondern wirkt.\r\nDer Prompt eignet sich besonders f\u00FCr hochpreisige Produkte, Designobjekte, Manufakturware oder exklusive Services. Der Nutzer sollte bewusst auf \u00FCbertriebene Nutzenversprechen verzichten und dem Prompt Raum f\u00FCr subtile Wirkung lassen.",
            promptText:
               "Du bist ein Luxus-Copywriter. Erstelle eine hochwertige, elegante Produktbeschreibung f\u00FCr [Produkt].\r\nZielgruppe: anspruchsvolle Kunden mit hohem Qualit\u00E4tsanspruch.\r\nFokus: Exklusivit\u00E4t, Detailverliebtheit, Qualit\u00E4t, Gef\u00FChl von \u201Edas Beste\u201C.\r\nVermeide aggressive Verkaufssprache. Schreibe ruhig, souver\u00E4n und selbstbewusst.",
         },
      },
   },
   {
      title: "Kurze Produktbeschreibung für Online-Shop",
      description:
         "Dieser Prompt erstellt **kompakte, sofort verständliche Produktbeschreibungen**, die für Online-Shops optimiert sind. Perfekt für Nutzer, die klare, scannbare Texte mit hohem Informationswert benötigen – ohne lange Fließtexte.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Der Prompt gibt der KI klare Vorgaben zu Textl\u00E4nge, Struktur und Format. Das Ergebnis sind kurze Abs\u00E4tze, Bullet Points und klare Nutzen\u00FCberschriften.\r\nDer Nutzer sollte Produkt und Zielgruppe definieren und optional die wichtigsten Kaufargumente mitgeben. Ideal f\u00FCr Shopify-, Amazon- oder WooCommerce-Shops, bei denen Nutzer schnell entscheiden m\u00FCssen.",
            promptText:
               "Du bist ein E-Commerce-Texter. Schreibe eine kompakte, scannbare Produktbeschreibung f\u00FCr [Produkt].\r\nAnforderungen:\r\n\r\nMax. 150 W\u00F6rter\r\n\r\nKlare Nutzen\u00FCberschriften\r\n\r\nBullet Points\r\n\r\nKaufrelevante Argumente auf den ersten Blick\r\nZielgruppe: [Zielgruppe]",
         },
      },
   },
   {
      title: "SEO-optimierte Produktbeschreibung",
      description:
         "Dieser Prompt kombiniert **verkaufsstarkes Copywriting mit SEO-Best Practices**. Er hilft dabei, Produktbeschreibungen zu erstellen, die sowohl für Menschen als auch für Suchmaschinen optimiert sind – ohne unnatürliche Keyword-Dichte.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Der Nutzer gibt Haupt- und Nebenkeywords vor. Die KI integriert diese sinnvoll in eine nat\u00FCrlich lesbare Produktbeschreibung und erg\u00E4nzt optional eine Meta-Description.\r\nDer Prompt eignet sich besonders f\u00FCr organisches Wachstum im E-Commerce. Wichtig ist, relevante Keywords zu verwenden und nicht zu viele Begriffe gleichzeitig vorzugeben.",
            promptText:
               "Du bist ein SEO-Copywriter. Erstelle eine suchmaschinenoptimierte Produktbeschreibung f\u00FCr [Produkt].\r\nHauptkeyword: [Keyword]\r\nNebenkeywords: [Keywords]\r\nAnforderungen:\r\n\r\nNat\u00FCrlich lesbar\r\n\r\nKlare Nutzenkommunikation\r\n\r\nKeine Keyword-Stopferei\r\n\r\nMeta-Description am Ende erg\u00E4nzen.",
         },
      },
   },
   {
      title: "Vergleichsbasierte Produktbeschreibung",
      description:
         "Dieser Prompt hilft dabei, Kaufentscheidungen zu erleichtern, indem das Produkt **implizit besser positioniert wird als Alternativen**. Ideal für Märkte mit vielen ähnlichen Angeboten, ohne direkte Wettbewerber zu nennen.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Die KI wird angewiesen, typische Alternativen oder Standardl\u00F6sungen im Markt zu ber\u00FCcksichtigen und subtil aufzuzeigen, warum das eigene Produkt \u00FCberlegen ist.\r\nDer Nutzer sollte wissen, worin sich sein Produkt wirklich unterscheidet. Der Prompt eignet sich hervorragend f\u00FCr SaaS, Tools und Dienstleistungen mit klaren USPs.",
            promptText:
               "Du bist ein strategischer Copywriter. Schreibe eine Produktbeschreibung f\u00FCr [Produkt], indem du es implizit mit typischen Alternativen vergleichst.\r\nZeige, warum dieses Produkt die bessere Wahl ist \u2013 ohne Wettbewerber direkt zu nennen.\r\nFokus: Entscheidungserleichterung, Klarheit, Vertrauen.",
         },
      },
   },
   {
      title: "Problemlösungs-fokussierte Produktbeschreibung",
      description:
         "Dieser Prompt stellt das **Problem der Zielgruppe in den Mittelpunkt** und positioniert das Produkt als klare Lösung. Ideal für Direct-Response-Marketing und Produkte mit starkem Problemlösungsversprechen.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Der Prompt f\u00FChrt die KI dazu, den Text mit dem gr\u00F6\u00DFten Schmerzpunkt der Zielgruppe zu beginnen und systematisch zur L\u00F6sung hinzuf\u00FChren.\r\nDer Nutzer sollte das Kernproblem m\u00F6glichst konkret formulieren. Je klarer das Problem, desto st\u00E4rker wirkt die Beschreibung. Besonders geeignet f\u00FCr Coaching-, Gesundheits- oder Softwareprodukte.",
            promptText:
               "Du bist ein Direktmarketing-Experte. Beginne die Produktbeschreibung mit dem gr\u00F6\u00DFten Problem der Zielgruppe und zeige Schritt f\u00FCr Schritt, wie [Produkt] dieses Problem l\u00F6st.\r\nZielgruppe: [Zielgruppe]\r\nSchreibe klar, direkt und l\u00F6sungsorientiert.",
         },
      },
   },
   {
      title: "Technisches Produkt – verständlich erklärt",
      description:
         "Dieser Prompt macht komplexe oder technische Produkte **verständlich für Nicht-Experten**. Er reduziert Fachsprache und übersetzt Funktionen in praktische Vorteile.",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            detailedDescription:
               "Die KI wird explizit angewiesen, Fachbegriffe zu vermeiden oder zu erkl\u00E4ren. Der Fokus liegt auf Anwendung und Nutzen statt Technikdetails.\r\nDer Nutzer sollte das Produkt m\u00F6glichst vollst\u00E4ndig beschreiben. Ideal f\u00FCr Technik, Software, Tools oder erkl\u00E4rungsbed\u00FCrftige Services.",
            promptText:
               "Du bist ein Copywriter f\u00FCr erkl\u00E4rungsbed\u00FCrftige Produkte. Schreibe eine Produktbeschreibung f\u00FCr [Produkt], die komplexe Funktionen einfach und verst\u00E4ndlich erkl\u00E4rt.\r\nZielgruppe: Nicht-Experten.\r\nVermeide Fachjargon oder erkl\u00E4re ihn verst\u00E4ndlich. Fokus auf Nutzen und Anwendung.",
         },
      },
   },
];
