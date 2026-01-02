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
      title: "Schreibe eine verkaufende Landingpage",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Landingpage",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist ein Senior Direct-Response-Copywriter.\r\n\r\nAufgabe:\r\nErstelle eine vollst\u00E4ndige Landingpage, die [Ziel] erreicht.\r\n\r\nKontext:\r\nProdukt: [Produkt]\r\nZielgruppe: [Zielgruppe]\r\nBewusstseinslevel: [Level]\r\nTraffic-Quelle: [z. B. Ads]\r\nEinw\u00E4nde: [Liste]\r\n\r\nArbeite strukturiert:\r\n1. Starke Hero-Section\r\n2. Problem- & Schmerzverst\u00E4rkung\r\n3. L\u00F6sung & Mechanismus\r\n4. Nutzen vor Features\r\n5. Einwandbehandlung\r\n6. Social Proof\r\n7. Klarer CTA\r\n\r\nSchreibe verkaufspsychologisch, klar und ohne Floskeln.\r\n",
         },
      },
   },
   {
      title: "Diese Seite konvertiert schlecht – analysieren & reparieren",
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
            content:
               "Du bist Conversion-Rate-Optimizer.\r\n\r\nAnalysiere diese Landingpage:\r\n[Text]\r\n\r\nIdentifiziere:\r\n\u2013 Unklarheiten\r\n\u2013 fehlende Motivation\r\n\u2013 psychologische Br\u00FCche\r\n\u2013 fehlende Einwandbehandlung\r\n\u2013 schwache CTAs\r\n\r\nSchlage konkrete Text-Verbesserungen vor.\r\n",
         },
      },
   },
   {
      title: "Ads, die Aufmerksamkeit stoppen",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories(["Copywriting", "Paid Ads"]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist Performance-Copywriter f\u00FCr Paid Ads.\r\n\r\nZiel:\r\nScroll-Stopping Ads f\u00FCr [Plattform].\r\n\r\nProdukt: [Produkt]\r\nZielgruppe: [Zielgruppe]\r\nBewusstseinslevel: [Level]\r\n\r\nErstelle:\r\n\u2013 10 starke Hooks\r\n\u2013 5 Ad-Copies\r\n\u2013 klare CTA-Varianten\r\n\r\nFokus: Neugier, Relevanz, Emotion.\r\n",
         },
      },
   },
   {
      title: "Schreibe eine E-Mail, die verkauft",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories(["Copywriting", "E-Mail"]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist E-Mail-Copywriter.\r\n\r\nAufgabe:\r\nSchreibe eine Verkaufs-E-Mail f\u00FCr [Angebot].\r\n\r\nZielgruppe: [Zielgruppe]\r\nBewusstseinslevel: [Level]\r\nEinw\u00E4nde: [Liste]\r\n\r\nStruktur:\r\n\u2013 starker Einstieg\r\n\u2013 Story oder Problem\r\n\u2013 L\u00F6sung & Nutzen\r\n\u2013 Einwandbehandlung\r\n\u2013 CTA\r\n",
         },
      },
   },
   {
      title: "Positionierung & Brand Voice entwickeln",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Brand Voice",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist Brand-Strategist & Copywriter.\r\n\r\nEntwickle:\r\n\u2013 Kernbotschaft\r\n\u2013 Unique Mechanism\r\n\u2013 Tonalit\u00E4t\r\n\u2013 zentrale Narrative\r\n\r\nF\u00FCr:\r\nMarke: [Marke]\r\nZielgruppe: [Zielgruppe]\r\nMarkt: [Markt]\r\n",
         },
      },
   },
   {
      title: "Conversion-fokussierte Produktbeschreibung",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist ein erfahrener Conversion-Copywriter. Erstelle eine verkaufsstarke Produktbeschreibung f\u00FCr [Produkt].\r\nZielgruppe: [Zielgruppe]\r\nHauptproblem der Zielgruppe: [Problem]\r\nNutzenversprechen: [Hauptnutzen]\r\nStruktur:\r\n\r\nEmotionaler Einstieg (Problem oder Wunsch)\r\n\r\nKonkrete Nutzenargumente (keine Features)\r\n\r\nSoziale Absicherung (implizit)\r\n\r\nKlarer Kaufanreiz\r\nSchreibe pr\u00E4zise, \u00FCberzeugend und ohne Floskeln.",
         },
      },
   },
   {
      title: "Feature-zu-Benefit-Transformation",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist ein Produkt-Marketer. Analysiere die folgenden Produktfeatures und verwandle jedes Feature in einen klaren, kundenrelevanten Nutzen.\r\nProdukt: [Produkt]\r\nFeatures: [Feature-Liste]\r\nZielgruppe: [Zielgruppe]\r\nGib die Produktbeschreibung als leicht lesbaren, strukturierten Text aus, der zeigt, warum das Produkt das Leben des Kunden verbessert.",
         },
      },
   },
   {
      title: "Storytelling-Produktbeschreibung",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist ein Storytelling-Copywriter. Schreibe eine Produktbeschreibung f\u00FCr [Produkt], die eine kurze Geschichte erz\u00E4hlt:\r\n\r\nAusgangssituation der Zielgruppe\r\n\r\nFrustration oder Wunsch\r\n\r\nBegegnung mit dem Produkt\r\n\r\nPositive Ver\u00E4nderung danach\r\nZielgruppe: [Zielgruppe]\r\nTonalit\u00E4t: emotional, glaubw\u00FCrdig, nahbar.",
         },
      },
   },
   {
      title: "Premium-Produktbeschreibung (High-End)",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist ein Luxus-Copywriter. Erstelle eine hochwertige, elegante Produktbeschreibung f\u00FCr [Produkt].\r\nZielgruppe: anspruchsvolle Kunden mit hohem Qualit\u00E4tsanspruch.\r\nFokus: Exklusivit\u00E4t, Detailverliebtheit, Qualit\u00E4t, Gef\u00FChl von \u201Edas Beste\u201C.\r\nVermeide aggressive Verkaufssprache. Schreibe ruhig, souver\u00E4n und selbstbewusst.",
         },
      },
   },
   {
      title: "Kurze Produktbeschreibung für Online-Shop",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist ein E-Commerce-Texter. Schreibe eine kompakte, scannbare Produktbeschreibung f\u00FCr [Produkt].\r\nAnforderungen:\r\n\r\nMax. 150 W\u00F6rter\r\n\r\nKlare Nutzen\u00FCberschriften\r\n\r\nBullet Points\r\n\r\nKaufrelevante Argumente auf den ersten Blick\r\nZielgruppe: [Zielgruppe]",
         },
      },
   },
   {
      title: "SEO-optimierte Produktbeschreibung",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist ein SEO-Copywriter. Erstelle eine suchmaschinenoptimierte Produktbeschreibung f\u00FCr [Produkt].\r\nHauptkeyword: [Keyword]\r\nNebenkeywords: [Keywords]\r\nAnforderungen:\r\n\r\nNat\u00FCrlich lesbar\r\n\r\nKlare Nutzenkommunikation\r\n\r\nKeine Keyword-Stopferei\r\n\r\nMeta-Description am Ende erg\u00E4nzen.",
         },
      },
   },
   {
      title: "Vergleichsbasierte Produktbeschreibung",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist ein strategischer Copywriter. Schreibe eine Produktbeschreibung f\u00FCr [Produkt], indem du es implizit mit typischen Alternativen vergleichst.\r\nZeige, warum dieses Produkt die bessere Wahl ist \u2013 ohne Wettbewerber direkt zu nennen.\r\nFokus: Entscheidungserleichterung, Klarheit, Vertrauen.",
         },
      },
   },
   {
      title: "Problemlösungs-fokussierte Produktbeschreibung",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist ein Direktmarketing-Experte. Beginne die Produktbeschreibung mit dem gr\u00F6\u00DFten Problem der Zielgruppe und zeige Schritt f\u00FCr Schritt, wie [Produkt] dieses Problem l\u00F6st.\r\nZielgruppe: [Zielgruppe]\r\nSchreibe klar, direkt und l\u00F6sungsorientiert.",
         },
      },
   },
   {
      title: "Technisches Produkt – verständlich erklärt",
      recommendedModel: "GPT-5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Copywriting",
            "Produktbeschreibung",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Du bist ein Copywriter f\u00FCr erkl\u00E4rungsbed\u00FCrftige Produkte. Schreibe eine Produktbeschreibung f\u00FCr [Produkt], die komplexe Funktionen einfach und verst\u00E4ndlich erkl\u00E4rt.\r\nZielgruppe: Nicht-Experten.\r\nVermeide Fachjargon oder erkl\u00E4re ihn verst\u00E4ndlich. Fokus auf Nutzen und Anwendung.",
         },
      },
   },
];
