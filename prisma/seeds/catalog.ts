import {
   CatalogCategory,
   CatalogEntry,
   CatalogEntryField,
   PrismaClient,
} from "@/generated/prisma/client";

type CatalogCategoryData = Omit<
   CatalogCategory,
   "id" | "createdAt" | "updatedAt"
>;

type CatalogEntryFieldData = Omit<
   CatalogEntryField,
   "id" | "catalogEntryId" | "defaultValue" | "description" | "options"
> & {
   description?: string;
   options?: string[];
};

type CatalogEntryData = Omit<
   CatalogEntry,
   | "content"
   | "id"
   | "createdAt"
   | "updatedAt"
   | "status"
   | "categoryId"
   | "copyCount"
   | "publishedAt"
> & {
   content: string;
   categorySlug: string;
   fields: CatalogEntryFieldData[];
};

const catalogCategories: CatalogCategoryData[] = [
   {
      name: "Marketing & Content",
      slug: "marketing-content",
      description:
         "Vorlagen für Content-Marketing, Social Media und Werbetexte",
      order: 1,
   },
   {
      name: "Coding & Development",
      slug: "coding-development",
      description:
         "Vorlagen für Programmierung, Code-Reviews und technische Aufgaben",
      order: 2,
   },
   {
      name: "Business & Strategy",
      slug: "business-strategy",
      description: "Vorlagen für Geschäftsstrategie, Analysen und Planung",
      order: 3,
   },
   {
      name: "Research & Analysis",
      slug: "research-analysis",
      description:
         "Vorlagen für Recherche, Analyse und wissenschaftliche Aufgaben",
      order: 4,
   },
   {
      name: "E-Mail & Kommunikation",
      slug: "email-kommunikation",
      description: "Vorlagen für professionelle E-Mails und Kommunikation",
      order: 5,
   },
   {
      name: "SEO & Performance",
      slug: "seo-performance",
      description: "Vorlagen für SEO-Optimierung und Performance-Analyse",
      order: 6,
   },
   {
      name: "Produktivität",
      slug: "produktivitaet",
      description: "Vorlagen für Zeitmanagement, Meetings und Organisation",
      order: 7,
   },
   {
      name: "HR & Recruiting",
      slug: "hr-recruiting",
      description:
         "Vorlagen für Personalgewinnung, Mitarbeiterführung und HR-Prozesse",
      order: 8,
   },
   {
      name: "Kundenservice & Support",
      slug: "kundenservice-support",
      description:
         "Vorlagen für Kundenkommunikation, Support-Anfragen und Beschwerdemanagement",
      order: 9,
   },
   {
      name: "Vertrieb & Sales",
      slug: "vertrieb-sales",
      description:
         "Vorlagen für Akquise, Angebote und Verhandlungen im Vertrieb",
      order: 10,
   },
   {
      name: "Bewerbung & Karriere",
      slug: "bewerbung-karriere",
      description:
         "Vorlagen für Bewerbungen, Vorstellungsgespräche und Karriereplanung",
      order: 11,
   },
];

const catalogEntries: CatalogEntryData[] = [
   {
      slug: "blog-post-outline-erstellen",
      title: "Blog-Post Outline erstellen",
      description:
         "Erstelle eine strukturierte Gliederung für deinen nächsten Blog-Artikel. Ideal für Content-Marketer, die schnell qualitativ hochwertige Inhalte planen möchten.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle eine detaillierte Outline für einen Blog-Post zum Thema {{thema}}.\n\nZielgruppe: {{zielgruppe}}\nTonalität: {{tonalitaet}}\n\nDie Outline soll folgende Abschnitte enthalten:\n1. Eine packende Einleitung mit Hook\n2. 3-5 Hauptabschnitte mit Unterkapiteln\n3. Praktische Beispiele und Tipps\n4. Ein klarer Call-to-Action\n\nFormattiere das Ergebnis übersichtlich mit Überschriften und Bullet Points.",
      categorySlug: "marketing-content",
      fields: [
         {
            name: "thema",
            label: "Thema",
            description: "Worum soll der Blog-Post gehen?",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "zielgruppe",
            label: "Zielgruppe",
            description: "Wer sind die Leser?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "tonalitaet",
            label: "Tonalität",
            description: "Formell, informell, humorvoll, sachlich?",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "Formell",
               "Informell",
               "Humorvoll",
               "Sachlich",
               "Inspirierend",
            ],
         },
      ],
   },
   {
      slug: "professionelle-email-schreiben",
      title: "Professionelle E-Mail schreiben",
      description:
         "Verfasse professionelle E-Mails für jede Situation – von der Anfrage bis zur Beschwerdebearbeitung. Spart Zeit und sorgt für eine klare, wirkungsvolle Kommunikation.",
      recommendedModel: "GPT-4o",
      content:
         "Schreibe eine professionelle E-Mail mit folgenden Angaben:\n\nEmpfänger: {{empfaenger}}\nAnlass: {{anlass}}\nGewünschtes Ergebnis: {{wunschergebnis}}\n\nDie E-Mail soll:\n- Einen klaren, relevanten Betreff haben\n- Professionell aber freundlich formuliert sein\n- Das Anliegen präzise und respektvoll darstellen\n- Mit einer klaren Handlungsaufforderung enden\n- Auf Deutsch verfasst sein",
      categorySlug: "email-kommunikation",
      fields: [
         {
            name: "empfaenger",
            label: "Empfänger",
            description:
               "An wen geht die E-Mail? (z.B. Geschäftspartner, Kunde)",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "anlass",
            label: "Anlass",
            description: "Was ist der Grund der E-Mail?",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "wunschergebnis",
            label: "Gewünschtes Ergebnis",
            description: "Was soll die E-Mail bewirken?",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "code-review-feedback-gpt4",
      title: "Code Review Feedback",
      description:
         "Erhalte strukturiertes, konstruktives Feedback zu deinem Code. Ideal für Entwickler, die Code-Qualität verbessern und Best Practices einhalten wollen.",
      recommendedModel: "GPT-4o",
      content:
         "Führe ein detailliertes Code Review durch:\n\nProgrammiersprache: {{sprache}}\nFokus: {{fokus}}\n\nCode:\n```\n{{code_snippet}}\n```\n\nBitte analysiere:\n1. Code-Qualität und Lesbarkeit\n2. Potenzielle Bugs oder Sicherheitsprobleme\n3. Performance-Optimierungen\n4. Best Practices für {{sprache}}\n5. Konkrete Verbesserungsvorschläge mit Beispielen",
      categorySlug: "coding-development",
      fields: [
         {
            name: "sprache",
            label: "Programmiersprache",
            description: "Welche Sprache wird verwendet?",
            type: "SELECT" as const,
            required: true,
            order: 0,
            options: [
               "TypeScript",
               "JavaScript",
               "Python",
               "Java",
               "Go",
               "Rust",
               "C#",
               "PHP",
            ],
         },
         {
            name: "code_snippet",
            label: "Code-Snippet",
            description: "Füge den Code ein, der reviewt werden soll",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "fokus",
            label: "Review-Fokus",
            description: "Worauf soll besonders geachtet werden?",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "Sicherheit",
               "Performance",
               "Lesbarkeit",
               "Testbarkeit",
               "Allgemein",
            ],
         },
      ],
   },
   {
      slug: "wettbewerbsanalyse-erstellen",
      title: "Wettbewerbsanalyse erstellen",
      description:
         "Analysiere deine Konkurrenten systematisch und finde Marktlücken. Perfekt für Gründer, Produktmanager und Strategen.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle eine strukturierte Wettbewerbsanalyse:\n\nEigenes Produkt/Service: {{eigenes_produkt}}\nKonkurrent: {{konkurrent}}\nZielmarkt: {{markt}}\n\nAnalysiere folgende Dimensionen:\n1. Stärken und Schwächen des Konkurrenten\n2. Marktpositionierung und USP\n3. Preisstruktur und Geschäftsmodell\n4. Zielgruppen und Marketing-Ansatz\n5. Differenzierungsmöglichkeiten für unser Produkt\n6. Strategische Empfehlungen\n\nFasse die Erkenntnisse in einer SWOT-Matrix zusammen.",
      categorySlug: "business-strategy",
      fields: [
         {
            name: "eigenes_produkt",
            label: "Eigenes Produkt/Service",
            description: "Was bietest du an?",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "konkurrent",
            label: "Konkurrent",
            description: "Welchen Mitbewerber analysieren wir?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "markt",
            label: "Zielmarkt",
            description: "In welchem Markt agieren beide?",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "linkedin-beitrag-erstellen",
      title: "LinkedIn-Beitrag erstellen",
      description:
         "Erstelle ansprechende LinkedIn-Posts, die Engagement erzeugen und deine Personal Brand stärken. Perfekt für Founder, Freelancer und Fachexperten.",
      recommendedModel: "GPT-4o",
      content:
         "Schreibe einen packenden LinkedIn-Beitrag:\n\nThema: {{thema}}\nPersönliche Erfahrung: {{erfahrung}}\nCall-to-Action: {{cta}}\n\nDer Beitrag soll:\n- Mit einem starken Hook beginnen (erste Zeile stoppt das Scrollen)\n- Eine persönliche Geschichte oder Erkenntnis teilen\n- 3-5 Learnings oder Tipps enthalten\n- Mit einer Frage oder klarem CTA enden\n- 150-300 Wörter lang sein\n- Emojis sparsam und wirkungsvoll einsetzen\n- Keine LinkedIn-Klischees enthalten",
      categorySlug: "marketing-content",
      fields: [
         {
            name: "thema",
            label: "Thema",
            description: "Worüber möchtest du schreiben?",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "erfahrung",
            label: "Persönliche Erfahrung",
            description: "Was hast du erlebt oder gelernt?",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "cta",
            label: "Call-to-Action",
            description: "Was sollen Leser tun? (kommentieren, teilen, fragen)",
            type: "TEXT" as const,
            required: false,
            order: 2,
         },
      ],
   },
   {
      slug: "bug-report-beschreibung",
      title: "Bug-Report Beschreibung",
      description:
         "Erstelle präzise, vollständige Bug-Reports, die Entwickler schnell nachvollziehen können. Spart Zeit und verhindert Rückfragen.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle einen vollständigen Bug-Report:\n\nFehler-Beschreibung: {{fehler}}\nSchritte zur Reproduktion: {{schritte}}\nErwartetes Verhalten: {{erwartetes_verhalten}}\n\nStrukturiere den Report mit:\n1. Kurze Zusammenfassung (1 Satz)\n2. Umgebung (Browser, OS, Version)\n3. Schritte zur Reproduktion (nummeriert)\n4. Tatsächliches Verhalten\n5. Erwartetes Verhalten\n6. Screenshots/Logs Hinweis\n7. Mögliche Ursachen (falls bekannt)\n8. Schweregrad (Critical/High/Medium/Low)\n\nFormuliere klar und sachlich.",
      categorySlug: "coding-development",
      fields: [
         {
            name: "fehler",
            label: "Fehler-Beschreibung",
            description: "Was geht schief?",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "schritte",
            label: "Schritte zur Reproduktion",
            description: "Wie kann man den Fehler nachstellen?",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "erwartetes_verhalten",
            label: "Erwartetes Verhalten",
            description: "Was sollte eigentlich passieren?",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "produktbeschreibung-shop",
      title: "Produktbeschreibung für Shop",
      description:
         "Schreibe überzeugende Produktbeschreibungen, die Kunden zum Kauf motivieren. Optimiert für Conversion und SEO.",
      recommendedModel: "GPT-4o",
      content:
         "Schreibe eine überzeugende Produktbeschreibung:\n\nProdukt: {{produkt}}\nHauptfeatures: {{features}}\nZielgruppe: {{zielgruppe}}\n\nDie Beschreibung soll:\n- Mit dem stärksten Nutzen beginnen\n- Emotionale und rationale Kaufgründe ansprechen\n- Features als Vorteile formulieren (nicht technisch)\n- Eine klare Struktur mit Bullet Points haben\n- SEO-relevante Keywords natürlich einbauen\n- 150-250 Wörter lang sein\n- Mit einer Kaufaufforderung enden\n\nSprache: Überzeugend, aber nicht übertrieben.",
      categorySlug: "marketing-content",
      fields: [
         {
            name: "produkt",
            label: "Produkt",
            description: "Um welches Produkt geht es?",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "features",
            label: "Hauptfeatures",
            description: "Was sind die wichtigsten Eigenschaften?",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "zielgruppe",
            label: "Zielgruppe",
            description: "Für wen ist das Produkt?",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "meeting-zusammenfassung-erstellen",
      title: "Meeting-Zusammenfassung",
      description:
         "Wandle Meetingnotizen in professionelle Zusammenfassungen mit klaren Action Items um. Spart Zeit und erhöht die Nachverfolgbarkeit.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle eine professionelle Meeting-Zusammenfassung:\n\nTeilnehmer: {{teilnehmer}}\nBesprochene Themen: {{themen}}\nBeschlüsse: {{beschluesse}}\n\nStrukturiere die Zusammenfassung:\n1. Meeting-Datum und Teilnehmer\n2. Kurze Agenda-Übersicht\n3. Hauptdiskussionspunkte (je Thema 2-3 Sätze)\n4. Getroffene Entscheidungen\n5. Action Items (Aufgabe, Verantwortlicher, Deadline)\n6. Nächste Schritte\n\nTon: Sachlich, präzise, vollständig aber kompakt.",
      categorySlug: "produktivitaet",
      fields: [
         {
            name: "teilnehmer",
            label: "Teilnehmer",
            description: "Wer war dabei?",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "themen",
            label: "Besprochene Themen",
            description: "Was wurde diskutiert?",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "beschluesse",
            label: "Beschlüsse",
            description: "Was wurde entschieden?",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "keyword-cluster-seo",
      title: "Keyword-Cluster erstellen",
      description:
         "Erstelle strukturierte Keyword-Cluster für deine SEO-Strategie. Perfekt für SEO-Manager, die Themenautorität aufbauen wollen.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle einen umfassenden Keyword-Cluster:\n\nHaupt-Keyword: {{haupt_keyword}}\nBranche: {{branche}}\nSuchintention: {{suchintention}}\n\nAnalysiere und strukturiere:\n1. Pillar-Keyword (Hauptthema)\n2. Cluster-Keywords (verwandte Unterthemen, 10-15 Begriffe)\n3. Long-Tail-Keywords (spezifische Suchanfragen, 10+ Beispiele)\n4. Semantisch verwandte Begriffe\n5. Fragen-basierte Keywords (W-Fragen)\n6. Lokale Keywords (falls relevant)\n7. Content-Ideen für jeden Cluster\n\nGib für jeden Begriff den geschätzten Suchintent an (informational/transactional/navigational).",
      categorySlug: "seo-performance",
      fields: [
         {
            name: "haupt_keyword",
            label: "Haupt-Keyword",
            description: "Das primäre Keyword für dein Thema",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "branche",
            label: "Branche",
            description: "In welchem Bereich bist du tätig?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "suchintention",
            label: "Suchintention",
            description: "Was suchen Nutzer hauptsächlich?",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "Informational",
               "Transactional",
               "Navigational",
               "Commercial Investigation",
            ],
         },
      ],
   },
   {
      slug: "research-prompt-fachbereich",
      title: "Research-Prompt",
      description:
         "Führe strukturierte Recherchen zu komplexen Themen durch. Ideal für Wissenschaftler, Studenten und Analysten.",
      recommendedModel: "GPT-4o",
      content:
         "Führe eine strukturierte Recherche durch:\n\nFachbereich: {{fachbereich}}\nForschungsfrage: {{forschungsfrage}}\nKontext: {{kontext}}\n\nBitte:\n1. Beantworte die Forschungsfrage fundiert und strukturiert\n2. Nenne wichtige Theorien, Konzepte und Modelle\n3. Beschreibe aktuelle Forschungsstand und Kontroversen\n4. Gib praktische Implikationen an\n5. Schlage weiterführende Quellen und Suchbegriffe vor\n6. Weise auf Limitierungen deines Wissens hin\n\nSei wissenschaftlich präzise und zitiere wo möglich Quellen.",
      categorySlug: "research-analysis",
      fields: [
         {
            name: "fachbereich",
            label: "Fachbereich",
            description: "Welches Forschungsgebiet?",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "forschungsfrage",
            label: "Forschungsfrage",
            description: "Was möchtest du herausfinden?",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "kontext",
            label: "Kontext",
            description: "Hintergrundinformationen die helfen",
            type: "TEXTAREA" as const,
            required: false,
            order: 2,
         },
      ],
   },
   {
      slug: "hook-generator-texteinstieg",
      title: "Hook-Generator: Packende Texteinstiege",
      description:
         "Generiere 5 verschiedene Eröffnungssätze für deinen Text – von der provokanten These bis zur Neugier-Lücke. Perfekt um den besten Hook auszuwählen statt beim ersten Entwurf zu bleiben.",
      recommendedModel: "GPT-4o",
      content:
         'Du bist ein erfahrener Werbetexter. Schreib 5 verschiedene Eröffnungssätze für folgenden Text:\n\nThema: {{thema}}\nZielgruppe: {{zielgruppe}}\nPlattform: {{plattform}}\n\nVerwende diese 5 verschiedenen Hook-Typen:\n1. Provokante These (widerspricht einer gängigen Meinung)\n2. Konkrete Zahl / Statistik\n3. "Was wäre wenn"-Szenario\n4. Schmerz-Hook (benennt ein Problem direkt)\n5. Neugier-Lücke (stellt eine Frage, die unbedingt beantwortet werden will)\n\nFormattiere jeden Hook als eigenständigen Satz. Keine Erklärungen.',
      categorySlug: "marketing-content",
      fields: [
         {
            name: "thema",
            label: "Thema",
            description: "Worum geht es in deinem Text?",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "zielgruppe",
            label: "Zielgruppe",
            description: "Für wen schreibst du?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "plattform",
            label: "Plattform",
            description: "Wo wird der Text veröffentlicht?",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "LinkedIn",
               "Newsletter",
               "Landing Page",
               "Blog",
               "Instagram",
               "Website",
            ],
         },
      ],
   },
   {
      slug: "pas-converter-werbetext",
      title: "PAS-Converter: Problem–Agitate–Solution",
      description:
         "Wandle Rohinformationen in überzeugenden Werbetext nach dem bewährten PAS-Framework um. Aktiviert Emotion und führt den Leser zur Lösung – genau in der Reihenfolge, wie Kaufentscheidungen getroffen werden.",
      recommendedModel: "GPT-4o",
      content:
         "Du bist ein erfahrener Conversion-Texter. Wandle folgende Informationen in überzeugenden Werbetext nach dem PAS-Framework um:\n\nProdukt/Dienstleistung: {{produkt}}\nZielgruppe: {{zielgruppe}}\nHauptproblem der Zielgruppe: {{hauptproblem}}\nKernvorteil: {{kernvorteil}}\n\nStruktur:\nPROBLEM (2-3 Sätze): Benenne das Problem präzise – so, dass die Zielgruppe sich sofort erkannt fühlt.\nAGITATE (3-4 Sätze): Vertiefe den Schmerz. Was passiert, wenn das Problem ungelöst bleibt?\nSOLUTION (3-4 Sätze): Präsentiere die Lösung klar, konkret, mit einem Nutzen-Versprechen.\n\nTon: {{ton}}\nLänge: ~150 Wörter",
      categorySlug: "marketing-content",
      fields: [
         {
            name: "produkt",
            label: "Produkt / Dienstleistung",
            description: "Was wird vermarktet?",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "zielgruppe",
            label: "Zielgruppe",
            description: "Für wen ist das Angebot?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "hauptproblem",
            label: "Hauptproblem",
            description: "Was ist der größte Schmerzpunkt der Zielgruppe?",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
         {
            name: "kernvorteil",
            label: "Kernvorteil",
            description: "Wie löst dein Produkt das Problem?",
            type: "TEXT" as const,
            required: true,
            order: 3,
         },
         {
            name: "ton",
            label: "Ton",
            description: "Wie soll der Text klingen?",
            type: "SELECT" as const,
            required: true,
            order: 4,
            options: ["Direkt", "Empathisch", "Sachlich", "Inspirierend"],
         },
      ],
   },
   {
      slug: "feature-to-benefit-transformer",
      title: "Feature-to-Benefit Transformer",
      description:
         "Wandle technische Features in echte Kundenvorteile um. Kunden kaufen keine Features – sie kaufen Ergebnisse. Dieser Prompt erzwingt den Perspektivwechsel vom Anbieter zum Kunden.",
      recommendedModel: "GPT-4o",
      content:
         'Du bist ein erfahrener Werbetexter. Hier sind die technischen Features meines Produkts:\n\n{{feature_liste}}\n\nDeine Aufgabe: Wandle jedes Feature in einen konkreten Kundennutzen um.\nNutze die Formel: "[Feature] – das bedeutet für dich: [konkreter Nutzen im Alltag]"\n\nZielgruppe: {{zielgruppe}}\nTon: {{tonalitaet}}\n\nDanach: Wähle die 3 stärksten Benefits aus und schreib sie als kurze, prägnante Bullet Points (max. 10 Wörter pro Bullet).',
      categorySlug: "marketing-content",
      fields: [
         {
            name: "feature_liste",
            label: "Feature-Liste",
            description:
               "Liste deine Produkt-Features auf (eine Zeile pro Feature)",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "zielgruppe",
            label: "Zielgruppe",
            description: "Für wen ist das Produkt?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "tonalitaet",
            label: "Tonalität",
            description: "Wie soll der Text klingen?",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "Direkt",
               "Empathisch",
               "Sachlich",
               "Inspirierend",
               "Humorvoll",
            ],
         },
      ],
   },
   {
      slug: "email-betreff-generator",
      title: "E-Mail-Betreff-Generator",
      description:
         "Erstelle 10 Betreffzeilen in 5 verschiedenen Typen – mit geschätzter Öffnungsrate. Schluss mit dem Raten: wähle datenbasiert den stärksten Betreff für deine Kampagne.",
      recommendedModel: "GPT-4o",
      content:
         'Du bist ein E-Mail-Marketing-Experte. Schreib 10 Betreffzeilen für folgende E-Mail:\n\nInhalt der E-Mail: {{email_inhalt}}\nZielgruppe: {{zielgruppe}}\nZiel: {{ziel}}\n\nNutze diese Betreffzeilen-Typen (je 2):\n- Neugier ("Warum die meisten X falsch machen...")\n- Direkter Nutzen ("In 10 Minuten zu X")\n- Personalisierung / Spezifität ("Für [Jobtitel/Situation]")\n- Dringlichkeit / Knappheit\n- Überraschung / Paradox\n\nJede Betreffzeile: max. 50 Zeichen. Ohne Clickbait-Floskeln.\nDanach bewerte jede mit einer geschätzten Öffnungsrate (1–10) und begründe kurz.',
      categorySlug: "email-kommunikation",
      fields: [
         {
            name: "email_inhalt",
            label: "Inhalt der E-Mail",
            description: "Worum geht es in der E-Mail?",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "zielgruppe",
            label: "Zielgruppe",
            description: "Wer bekommt die E-Mail?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "ziel",
            label: "Ziel der E-Mail",
            description: "Was soll die E-Mail bewirken?",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "Klick",
               "Kauf",
               "Terminbuchung",
               "Anmeldung",
               "Information",
            ],
         },
      ],
   },
   {
      slug: "tone-of-voice-kopierer",
      title: "Tone-of-Voice-Kopierer",
      description:
         "Analysiere den Schreibstil einer Marke oder Person und repliziere ihn für neuen Content. Die explizite Stil-Analyse verhindert, dass die KI in ihren generischen Standardton zurückfällt.",
      recommendedModel: "GPT-4o",
      content:
         "Du bist ein erfahrener Texter mit Expertise in Markenstimmen. Hier ist ein Beispieltext, dessen Stil ich replizieren möchte:\n\n{{beispieltext}}\n\nAnalysiere zuerst den Stil anhand dieser Dimensionen:\n- Satzlänge und -rhythmus\n- Formell / informal\n- Aktiv / passiv\n- Typische Sprachbilder oder Formulierungen\n- Emotionaler Ton (warm/kühl/direkt/inspirierend)\n\nSchreib dann folgenden neuen Inhalt exakt in diesem Stil:\n\nThema: {{neues_thema}}\nFormat: {{format}}\nLänge: {{laenge}} Wörter",
      categorySlug: "marketing-content",
      fields: [
         {
            name: "beispieltext",
            label: "Beispieltext",
            description:
               "Text der Marke oder Person, deren Stil du übernehmen möchtest",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "neues_thema",
            label: "Neues Thema",
            description: "Worüber soll der neue Text sein?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "format",
            label: "Format",
            description: "Welches Format soll der neue Text haben?",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "LinkedIn-Post",
               "Newsletter",
               "Produktbeschreibung",
               "Blog-Artikel",
               "Website-Text",
               "Social Media Caption",
            ],
         },
         {
            name: "laenge",
            label: "Länge (Wörter)",
            description: "Wie lang soll der Text sein?",
            type: "TEXT" as const,
            required: true,
            order: 3,
         },
      ],
   },
   {
      slug: "kritiker-prompt-text-feedback",
      title: "Kritiker-Prompt: Radikales Text-Feedback",
      description:
         "Lass deine Texte von der KI als strenger Cheflektor durchleuchten – mit Schulnoten, konkreter Kritik und überarbeiteten Versionen. Qualitätskontrolle bevor der Text live geht.",
      recommendedModel: "GPT-4o",
      content:
         "Du bist ein erfahrener Cheflektor bei einem Premium-Verlag. Du bist bekannt für ehrliches, manchmal hartes Feedback – aber immer konstruktiv.\n\nHier ist mein Text:\n{{text}}\n\nBewerte ihn nach diesen Kriterien (Schulnote 1–6 + Begründung):\n1. Klarheit: Ist die Kernaussage sofort verständlich?\n2. Überzeugungskraft: Würde ich handeln nach dem Lesen?\n3. Lesbarkeit: Fluss, Satzstruktur, Länge\n4. Originalität: Klingt es wie tausend andere Texte oder hat es eine eigene Stimme?\n5. Call-to-Action: Ist klar, was als nächstes passieren soll?\n\nDanach: 3 konkrete Verbesserungsvorschläge. Jeweils mit einer überarbeiteten Version des schwächsten Satzes oder Absatzes.",
      categorySlug: "marketing-content",
      fields: [
         {
            name: "text",
            label: "Dein Text",
            description: "Füge den Text ein, der bewertet werden soll",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
      ],
   },
   {
      slug: "zielgruppen-persona-builder",
      title: "Zielgruppen-Persona-Builder",
      description:
         "Erstelle ein tiefes Persona-Profil mit echten Wörtern deiner Zielgruppe, Kaufmotiven und Einwänden. Der Abschlusssatz wird direkt zur stärksten Headline.",
      recommendedModel: "GPT-4o",
      content:
         "Du bist ein erfahrener Marketing-Stratege. Erstelle ein detailliertes Persona-Profil für folgende Zielgruppe:\n\nBranche / Kontext: {{branche_kontext}}\nProdukt / Dienstleistung: {{produkt}}\n\nStruktur des Profils:\n1. Demografisch: Alter, Beruf, Einkommen, Lebenssituation (3–4 Sätze)\n2. Ziele: Was will diese Person erreichen? (3 konkrete Ziele)\n3. Frustrationen: Was hält sie nachts wach? (3 konkrete Schmerzpunkte)\n4. Wording: Welche 10 Begriffe oder Phrasen benutzt sie selbst?\n5. Kaufmotive: Warum kauft sie – rational und emotional?\n6. Einwände: Die 3 häufigsten Gründe, NICHT zu kaufen\n\nAbschluss: Schreib einen einzigen Satz, den diese Person sich selbst sagen würde, wenn das Produkt ihr Problem löst.",
      categorySlug: "marketing-content",
      fields: [
         {
            name: "branche_kontext",
            label: "Branche / Kontext",
            description: "In welchem Umfeld bewegt sich deine Zielgruppe?",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "produkt",
            label: "Produkt / Dienstleistung",
            description: "Was wird vermarktet?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
      ],
   },

   // ── HR & Recruiting ──────────────────────────────────────────────
   {
      slug: "stellenanzeige-erstellen",
      title: "Stellenanzeige erstellen",
      description:
         "Erstelle eine ansprechende, zielgruppengerechte Stellenanzeige, die qualifizierte Kandidat:innen anspricht statt nur Anforderungen aufzulisten. Ideal für HR-Teams und Recruiter, die schneller passende Bewerbungen erhalten wollen.",
      recommendedModel: "GPT-4o",
      content:
         'Erstelle eine Stellenanzeige für folgende Position:\n\nJobtitel: {{jobtitel}}\nUnternehmen/Team: {{unternehmen}}\nWichtigste Aufgaben: {{aufgaben}}\nMuss-Anforderungen: {{anforderungen}}\n\nDie Anzeige soll:\n1. Mit einem einladenden Intro-Absatz beginnen (kein generisches "Wir suchen...")\n2. Aufgaben als konkrete Verantwortlichkeiten formulieren, nicht als Stichwortliste\n3. Zwischen Muss- und Kann-Anforderungen unterscheiden\n4. Einen Abschnitt zu Benefits/Teamkultur enthalten\n5. Mit einem klaren, einladenden Call-to-Action enden\n\nTon: {{tonalitaet}}',
      categorySlug: "hr-recruiting",
      fields: [
         {
            name: "jobtitel",
            label: "Jobtitel",
            description: "Für welche Position wird gesucht?",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "unternehmen",
            label: "Unternehmen / Team",
            description: "Für welches Unternehmen oder Team?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "aufgaben",
            label: "Wichtigste Aufgaben",
            description: "Was sind die Kernaufgaben der Rolle?",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
         {
            name: "anforderungen",
            label: "Muss-Anforderungen",
            description: "Welche Qualifikationen sind zwingend?",
            type: "TEXTAREA" as const,
            required: true,
            order: 3,
         },
         {
            name: "tonalitaet",
            label: "Tonalität",
            description: "Wie soll die Anzeige klingen?",
            type: "SELECT" as const,
            required: true,
            order: 4,
            options: [
               "Modern & locker",
               "Klassisch & seriös",
               "Startup-Energie",
               "Corporate",
            ],
         },
      ],
   },
   {
      slug: "bewerbungsscreening-kandidatenprofil",
      title: "Bewerbungs-Screening: Kandidatenprofil bewerten",
      description:
         "Bewerte einen Lebenslauf strukturiert gegen ein Anforderungsprofil und erhalte eine objektive Einschätzung mit Begründung. Spart Zeit bei der Vorauswahl und macht Screening-Entscheidungen nachvollziehbar.",
      recommendedModel: "GPT-4o",
      content:
         "Bewerte folgenden Kandidaten für die ausgeschriebene Position:\n\nAnforderungsprofil: {{anforderungsprofil}}\nLebenslauf/Bewerbung: {{lebenslauf}}\n\nErstelle eine strukturierte Einschätzung:\n1. Erfüllungsgrad der Muss-Kriterien (je Kriterium: erfüllt/teilweise/nicht erfüllt)\n2. Relevante Stärken für die Position\n3. Mögliche Lücken oder offene Fragen fürs Interview\n4. Gesamteinschätzung (Einladen / Nachfragen / Absagen) mit kurzer Begründung\n\nBleibe sachlich und beziehe dich nur auf Fakten aus dem Lebenslauf, keine Spekulation über Persönlichkeit.",
      categorySlug: "hr-recruiting",
      fields: [
         {
            name: "anforderungsprofil",
            label: "Anforderungsprofil",
            description: "Welche Kriterien muss die Person erfüllen?",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "lebenslauf",
            label: "Lebenslauf / Bewerbung",
            description: "Füge den Inhalt der Bewerbung ein",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
      ],
   },
   {
      slug: "absage-email-formulieren",
      title: "Absage-E-Mail an Bewerber formulieren",
      description:
         "Verfasse eine wertschätzende, rechtlich unproblematische Absage, die die Employer Brand schützt statt zu beschädigen. Besonders wichtig bei Kandidat:innen, die weit im Prozess kamen.",
      recommendedModel: "GPT-4o",
      content:
         "Schreibe eine Absage-E-Mail an einen Bewerber:\n\nName/Anrede: {{anrede}}\nPosition: {{position}}\nProzessphase: {{phase}}\nGrund (intern, nicht 1:1 übernehmen): {{grund}}\n\nDie E-Mail soll:\n- Wertschätzend und persönlich klingen, nicht wie eine Massen-Absage\n- Die Absage klar, aber ohne unnötige Härte kommunizieren\n- Keine rechtlich angreifbaren Begründungen enthalten (z.B. Alter, Herkunft)\n- Bei weit fortgeschrittenen Kandidaten: Tür für zukünftigen Kontakt offenlassen\n- Kurz sein (max. 150 Wörter)",
      categorySlug: "hr-recruiting",
      fields: [
         {
            name: "anrede",
            label: "Anrede",
            description: "Name/Anrede des Bewerbers",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "position",
            label: "Position",
            description: "Für welche Stelle wurde sich beworben?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "phase",
            label: "Prozessphase",
            description: "In welcher Phase steht die Absage?",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "Nach Bewerbungseingang",
               "Nach erstem Interview",
               "Nach finaler Runde",
            ],
         },
         {
            name: "grund",
            label: "Grund (intern)",
            description: "Warum wird abgesagt? (nicht direkt übernehmen)",
            type: "TEXTAREA" as const,
            required: true,
            order: 3,
         },
      ],
   },
   {
      slug: "onboarding-plan-mitarbeiter",
      title: "Onboarding-Plan für neue Mitarbeitende",
      description:
         "Erstelle einen strukturierten 30-60-90-Tage-Onboarding-Plan, der neue Mitarbeitende schneller produktiv macht und Frühfluktuation reduziert.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle einen Onboarding-Plan:\n\nPosition: {{position}}\nAbteilung: {{abteilung}}\nWichtigste Tools/Systeme: {{tools}}\n\nStruktur:\n1. Woche 1: Ankommen (Zugänge, Team kennenlernen, Grundlagen)\n2. Tag 30: Erste eigenständige Aufgaben\n3. Tag 60: Vertiefung und erste Projektverantwortung\n4. Tag 90: Volle Produktivität, erstes Feedbackgespräch\n\nFür jede Phase: konkrete Ziele, Meilensteine und Check-in-Termine.",
      categorySlug: "hr-recruiting",
      fields: [
         {
            name: "position",
            label: "Position",
            description: "Für welche Rolle ist das Onboarding?",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "abteilung",
            label: "Abteilung",
            description: "Welcher Abteilung gehört die Position an?",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "tools",
            label: "Wichtigste Tools/Systeme",
            description: "Welche Systeme muss die Person lernen?",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "interviewfragen-generieren",
      title: "Interviewfragen für eine Position generieren",
      description:
         "Erhalte einen strukturierten Interview-Leitfaden mit fachlichen, verhaltensbasierten und kulturellen Fragen. Reduziert Bauchgefühl-Entscheidungen und macht Interviews vergleichbar.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle einen Interview-Leitfaden für:\n\nPosition: {{position}}\nSeniorität: {{senioritaet}}\nWichtigste Kompetenzen: {{kompetenzen}}\n\nErstelle je 3 Fragen für:\n1. Fachliche Kompetenz\n2. Verhaltensbasierte Fragen (STAR-Methode: Situation, Task, Action, Result)\n3. Team-/Kulturfit\n4. Motivation/Erwartungen an die Rolle\n\nGib zu jeder Frage kurz an, worauf bei der Antwort zu achten ist.",
      categorySlug: "hr-recruiting",
      fields: [
         {
            name: "position",
            label: "Position",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "senioritaet",
            label: "Seniorität",
            type: "SELECT" as const,
            required: true,
            order: 1,
            options: ["Junior", "Mid-Level", "Senior", "Lead/Management"],
         },
         {
            name: "kompetenzen",
            label: "Wichtigste Kompetenzen",
            description: "Welche Fähigkeiten sind entscheidend?",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "mitarbeiter-leistungsbeurteilung",
      title: "Mitarbeiter-Leistungsbeurteilung schreiben",
      description:
         "Formuliere eine faire, konkrete Leistungsbeurteilung basierend auf Stichpunkten – klar genug für Entwicklungsgespräche, ohne vage Floskeln.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle eine Leistungsbeurteilung:\n\nMitarbeiter:in / Rolle: {{rolle}}\nZeitraum: {{zeitraum}}\nStichpunkte zu Leistung/Verhalten: {{stichpunkte}}\nEntwicklungsziele: {{entwicklungsziele}}\n\nStruktur:\n1. Zusammenfassung der Kernleistung (2-3 Sätze)\n2. Stärken mit konkreten Beispielen\n3. Entwicklungsfelder mit konkreten Beispielen, konstruktiv formuliert\n4. Ziele für die nächste Periode\n\nTon: wertschätzend, konkret, keine austauschbaren Floskeln.",
      categorySlug: "hr-recruiting",
      fields: [
         {
            name: "rolle",
            label: "Mitarbeiter:in / Rolle",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "zeitraum",
            label: "Zeitraum",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "stichpunkte",
            label: "Stichpunkte zu Leistung/Verhalten",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
         {
            name: "entwicklungsziele",
            label: "Entwicklungsziele",
            type: "TEXTAREA" as const,
            required: true,
            order: 3,
         },
      ],
   },
   {
      slug: "arbeitszeugnis-formulieren",
      title: "Arbeitszeugnis formulieren",
      description:
         "Erstelle ein wohlwollend formuliertes, aber wahrheitsgemäßes Arbeitszeugnis nach gängiger Zeugnissprache. Besonders hilfreich, um Standardformulierungen korrekt einzuordnen.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle ein Arbeitszeugnis:\n\nPosition: {{position}}\nBeschäftigungsdauer: {{dauer}}\nWichtigste Aufgaben: {{aufgaben}}\nLeistungsniveau: {{leistungsniveau}}\nGrund des Austritts: {{austrittsgrund}}\n\nNutze die übliche Struktur eines qualifizierten Zeugnisses:\n1. Einleitung (Position, Eintrittsdatum, Unternehmen)\n2. Tätigkeitsbeschreibung\n3. Leistungsbeurteilung (in wohlwollender Zeugnissprache passend zum angegebenen Leistungsniveau)\n4. Sozialverhalten\n5. Schlussformel passend zum Austrittsgrund\n\nHinweis: Ergebnis vor Verwendung von einer Fachperson (HR/Anwalt) prüfen lassen.",
      categorySlug: "hr-recruiting",
      fields: [
         {
            name: "position",
            label: "Position",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "dauer",
            label: "Beschäftigungsdauer",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "aufgaben",
            label: "Wichtigste Aufgaben",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
         {
            name: "leistungsniveau",
            label: "Leistungsniveau",
            type: "SELECT" as const,
            required: true,
            order: 3,
            options: [
               "Stets zur vollen Zufriedenheit (sehr gut)",
               "Zur vollen Zufriedenheit (gut)",
               "Zur Zufriedenheit (befriedigend)",
               "Im Großen und Ganzen zur Zufriedenheit (ausreichend)",
            ],
         },
         {
            name: "austrittsgrund",
            label: "Grund des Austritts",
            type: "SELECT" as const,
            required: true,
            order: 4,
            options: [
               "Eigene Kündigung",
               "Arbeitgeberseitige Kündigung",
               "Vertragsende befristet",
               "Einvernehmliche Trennung",
            ],
         },
      ],
   },
   {
      slug: "exit-interview-fragen",
      title: "Exit-Interview-Fragen erstellen",
      description:
         "Erstelle einen Fragenkatalog für Austrittsgespräche, der ehrliches Feedback ermöglicht statt Höflichkeitsfloskeln – wichtig, um echte Kündigungsgründe zu verstehen.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle einen Exit-Interview-Leitfaden:\n\nPosition: {{position}}\nKündigungsgrund (falls bekannt): {{kuendigungsgrund}}\n\nErstelle 8-10 offene Fragen zu:\n1. Gründe für den Weggang\n2. Führung und Zusammenarbeit\n3. Arbeitsumfeld und Kultur\n4. Was hätte den Weggang verhindern können\n5. Was war besonders positiv\n\nFormuliere die Fragen so, dass sie ehrliches statt beschönigendes Feedback fördern.",
      categorySlug: "hr-recruiting",
      fields: [
         {
            name: "position",
            label: "Position",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "kuendigungsgrund",
            label: "Kündigungsgrund (falls bekannt)",
            type: "TEXT" as const,
            required: false,
            order: 1,
         },
      ],
   },
   {
      slug: "probezeit-feedback-vorbereiten",
      title: "Probezeit-Feedbackgespräch vorbereiten",
      description:
         "Bereite ein strukturiertes Feedbackgespräch zur Probezeit vor – inklusive klarer Empfehlung. Reduziert Unsicherheit bei Führungskräften, die diese Gespräche selten führen.",
      recommendedModel: "GPT-4o",
      content:
         "Bereite ein Probezeit-Feedbackgespräch vor:\n\nPosition: {{position}}\nBeobachtungen zur Leistung: {{beobachtungen}}\nEmpfehlung: {{empfehlung}}\n\nErstelle:\n1. Gesprächsstruktur (Einstieg, Hauptteil, Abschluss)\n2. 3-5 konkrete, belegbare Beobachtungen als Gesprächspunkte\n3. Formulierungsvorschlag für die Empfehlung (Übernahme / Verlängerung / Beendigung)\n4. Vorschlag für nächste Schritte je nach Ausgang",
      categorySlug: "hr-recruiting",
      fields: [
         {
            name: "position",
            label: "Position",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "beobachtungen",
            label: "Beobachtungen zur Leistung",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "empfehlung",
            label: "Empfehlung",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "Übernahme empfohlen",
               "Verlängerung der Probezeit",
               "Beendigung empfohlen",
            ],
         },
      ],
   },
   {
      slug: "mitarbeiterumfrage-erstellen",
      title: "Mitarbeiterumfrage / Pulse-Check erstellen",
      description:
         "Erstelle eine kurze, fokussierte Mitarbeiterumfrage zu einem spezifischen Thema – ohne die Ermüdung langer Standard-Fragebögen.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle eine Pulse-Check-Umfrage:\n\nThema: {{thema}}\nZielgruppe: {{zielgruppe}}\nAnzahl Fragen: {{anzahl_fragen}}\n\nErstelle {{anzahl_fragen}} Fragen, davon:\n- Mehrheit als Skalenfragen (1-5, Zustimmung)\n- 1-2 offene Fragen für Freitext-Feedback\n\nVermeide Suggestivfragen und Doppelfragen (zwei Aspekte in einer Frage).",
      categorySlug: "hr-recruiting",
      fields: [
         {
            name: "thema",
            label: "Thema",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "zielgruppe",
            label: "Zielgruppe",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "anzahl_fragen",
            label: "Anzahl Fragen",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: ["5", "8", "10"],
         },
      ],
   },

   // ── Kundenservice & Support ──────────────────────────────────────
   {
      slug: "beschwerde-antwort-formulieren",
      title: "Antwort auf Kundenbeschwerde formulieren",
      description:
         "Formuliere eine deeskalierende, lösungsorientierte Antwort auf eine Kundenbeschwerde. Reduziert Eskalationen und schützt die Kundenbeziehung, statt nur Prozesse zu erklären.",
      recommendedModel: "GPT-4o",
      content:
         "Formuliere eine Antwort auf folgende Kundenbeschwerde:\n\nBeschwerde des Kunden: {{beschwerde}}\nUnternehmenssicht/Fakten: {{fakten}}\nAngebotene Lösung: {{loesung}}\n\nDie Antwort soll:\n1. Das Anliegen ernst nehmen, ohne unnötig Schuld einzuräumen\n2. Empathie zeigen, bevor Fakten erklärt werden\n3. Die Lösung klar und konkret benennen\n4. Mit einem versöhnlichen, professionellen Abschluss enden\n\nTon: {{tonalitaet}}",
      categorySlug: "kundenservice-support",
      fields: [
         {
            name: "beschwerde",
            label: "Beschwerde des Kunden",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "fakten",
            label: "Unternehmenssicht / Fakten",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "loesung",
            label: "Angebotene Lösung",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
         {
            name: "tonalitaet",
            label: "Tonalität",
            type: "SELECT" as const,
            required: true,
            order: 3,
            options: [
               "Empathisch",
               "Sachlich-professionell",
               "Herzlich-persönlich",
            ],
         },
      ],
   },
   {
      slug: "faq-eintrag-erstellen",
      title: "FAQ-Eintrag aus Support-Anfrage erstellen",
      description:
         "Wandle eine wiederkehrende Support-Anfrage in einen klaren FAQ-Eintrag um. Reduziert Ticketvolumen, indem häufige Fragen selbsterklärend beantwortet werden.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle einen FAQ-Eintrag basierend auf dieser Support-Anfrage:\n\nUrsprüngliche Anfrage: {{anfrage}}\nLösung/Antwort: {{antwort}}\n\nErstelle:\n1. Eine klare, suchfreundliche Frage als Überschrift (wie ein Kunde selbst formulieren würde)\n2. Eine kurze, vollständige Antwort in einfacher Sprache\n3. Falls relevant: nummerierte Schritt-für-Schritt-Anleitung\n4. Einen Hinweis, an wen man sich bei weiteren Problemen wenden kann",
      categorySlug: "kundenservice-support",
      fields: [
         {
            name: "anfrage",
            label: "Ursprüngliche Anfrage",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "antwort",
            label: "Lösung / Antwort",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
      ],
   },
   {
      slug: "ticket-zusammenfassung",
      title: "Support-Ticket zusammenfassen",
      description:
         "Fasse einen langen Ticket-Verlauf in eine kompakte Übersicht zusammen. Spart Zeit bei Übergaben zwischen Support-Ebenen (Tier 1 zu Tier 2).",
      recommendedModel: "GPT-4o",
      content:
         "Fasse folgenden Ticket-Verlauf zusammen:\n\nTicket-Verlauf: {{verlauf}}\n\nErstelle eine Zusammenfassung mit:\n1. Kernproblem (1-2 Sätze)\n2. Bisher unternommene Schritte\n3. Aktueller Status\n4. Offene Fragen / benötigte Informationen für die nächste Ebene\n5. Priorität (Kritisch/Hoch/Mittel/Niedrig) mit Begründung",
      categorySlug: "kundenservice-support",
      fields: [
         {
            name: "verlauf",
            label: "Ticket-Verlauf",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
      ],
   },
   {
      slug: "entschuldigungs-email-kunde",
      title: "Entschuldigungs-E-Mail an Kunden",
      description:
         "Formuliere eine aufrichtige Entschuldigung nach einem Fehler oder Ausfall, die Vertrauen zurückgewinnt statt defensiv zu wirken.",
      recommendedModel: "GPT-4o",
      content:
         'Schreibe eine Entschuldigungs-E-Mail:\n\nVorfall: {{vorfall}}\nAuswirkung auf den Kunden: {{auswirkung}}\nWiedergutmachung: {{wiedergutmachung}}\n\nDie E-Mail soll:\n- Sich klar und ohne Ausreden entschuldigen\n- Kurz erklären, was passiert ist (ohne technisches Klein-Klein)\n- Die Wiedergutmachung konkret benennen\n- Beschreiben, was künftig anders gemacht wird\n\nVermeide: "Wir bedauern etwaige Unannehmlichkeiten" und ähnliche Floskeln.',
      categorySlug: "kundenservice-support",
      fields: [
         {
            name: "vorfall",
            label: "Vorfall",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "auswirkung",
            label: "Auswirkung auf den Kunden",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "wiedergutmachung",
            label: "Wiedergutmachung",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "eskalations-antwort-erstellen",
      title: "Antwort auf eskalierte Kundenanfrage",
      description:
         "Formuliere eine souveräne Antwort auf eine eskalierte, emotional aufgeladene Kundenanfrage (z.B. Drohung mit Kündigung oder Öffentlichkeit).",
      recommendedModel: "GPT-4o",
      content:
         "Formuliere eine Antwort auf diese eskalierte Anfrage:\n\nAnfrage des Kunden: {{anfrage}}\nEskalationsgrad: {{eskalationsgrad}}\nHandlungsspielraum: {{handlungsspielraum}}\n\nDie Antwort soll:\n1. Ruhig und souverän bleiben, nicht defensiv\n2. Die Dringlichkeit anerkennen\n3. Einen konkreten nächsten Schritt mit Zeitrahmen nennen\n4. Bei Bedarf einen persönlichen Kontakt (Telefonat) anbieten",
      categorySlug: "kundenservice-support",
      fields: [
         {
            name: "anfrage",
            label: "Anfrage des Kunden",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "eskalationsgrad",
            label: "Eskalationsgrad",
            type: "SELECT" as const,
            required: true,
            order: 1,
            options: [
               "Verärgert",
               "Sehr verärgert / Kündigungsdrohung",
               "Öffentliche Beschwerde angedroht",
            ],
         },
         {
            name: "handlungsspielraum",
            label: "Handlungsspielraum",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "kuendigung-rueckgewinnung",
      title: "Rückgewinnungs-Angebot bei Kündigung formulieren",
      description:
         "Erstelle ein individuelles Rückgewinnungsangebot für einen kündigenden Kunden, ohne verzweifelt zu wirken.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle eine Rückgewinnungs-Antwort:\n\nKündigungsgrund des Kunden: {{kuendigungsgrund}}\nKundenwert/Historie: {{kundenwert}}\nMögliches Angebot: {{angebot}}\n\nDie Antwort soll:\n1. Den Kündigungsgrund ernst nehmen, nicht nur ein Rabattangebot hinterherwerfen\n2. Das Angebot als Reaktion auf den genannten Grund positionieren\n3. Eine klare Frist für die Rückmeldung setzen\n4. Auch für den Fall einer endgültigen Kündigung wertschätzend bleiben",
      categorySlug: "kundenservice-support",
      fields: [
         {
            name: "kuendigungsgrund",
            label: "Kündigungsgrund des Kunden",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "kundenwert",
            label: "Kundenwert / Historie",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "angebot",
            label: "Mögliches Angebot",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "support-antwort-ton-anpassen",
      title: "Support-Antwort im Kundenton anpassen",
      description:
         "Passe eine Standard-Antwort an den Kommunikationsstil des jeweiligen Kunden an. Persönlichere Antworten erhöhen die Kundenzufriedenheit messbar.",
      recommendedModel: "GPT-4o",
      content:
         "Passe folgende Antwort an den Ton des Kunden an:\n\nStandard-Antwort: {{standard_antwort}}\nBeispieltext des Kunden (zeigt seinen Ton): {{kunden_beispiel}}\n\nBehalte den fachlichen Inhalt exakt bei, aber passe Wortwahl, Satzlänge und Förmlichkeit an den Stil des Kunden an.",
      categorySlug: "kundenservice-support",
      fields: [
         {
            name: "standard_antwort",
            label: "Standard-Antwort",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "kunden_beispiel",
            label: "Beispieltext des Kunden",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
      ],
   },
   {
      slug: "self-service-anleitung-erstellen",
      title: "Schritt-für-Schritt-Anleitung für Self-Service erstellen",
      description:
         "Erstelle eine klare Anleitung, mit der Kunden ein Problem selbst lösen können – reduziert wiederkehrende Support-Anfragen.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle eine Self-Service-Anleitung:\n\nProblem/Aufgabe: {{problem}}\nErforderliche Schritte (Stichpunkte): {{schritte_stichpunkte}}\nZielgruppe (technisches Niveau): {{zielgruppe}}\n\nErstelle eine nummerierte Schritt-für-Schritt-Anleitung, angepasst an das technische Niveau der Zielgruppe. Ergänze wo hilfreich Hinweise auf typische Stolperfallen.",
      categorySlug: "kundenservice-support",
      fields: [
         {
            name: "problem",
            label: "Problem / Aufgabe",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "schritte_stichpunkte",
            label: "Erforderliche Schritte (Stichpunkte)",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "zielgruppe",
            label: "Zielgruppe (technisches Niveau)",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "Technisch versiert",
               "Durchschnittlich",
               "Wenig technikaffin",
            ],
         },
      ],
   },
   {
      slug: "kundenfeedback-auswerten",
      title: "Kundenfeedback / NPS-Kommentare auswerten",
      description:
         "Cluster eine Menge an Freitext-Kundenfeedback nach Themen und Sentiment. Macht große Mengen unstrukturiertes Feedback auf einen Blick auswertbar.",
      recommendedModel: "GPT-4o",
      content:
         "Analysiere folgendes Kundenfeedback:\n\nFeedback-Kommentare: {{feedback}}\n\nErstelle:\n1. Die 5 häufigsten Themen-Cluster mit Beispielzitaten\n2. Sentiment je Cluster (überwiegend positiv/negativ/gemischt)\n3. Die 3 dringendsten Handlungsempfehlungen\n4. Eine kurze Management-Zusammenfassung (3-4 Sätze)",
      categorySlug: "kundenservice-support",
      fields: [
         {
            name: "feedback",
            label: "Feedback-Kommentare",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
      ],
   },
   {
      slug: "chatbot-antwortbaustein-erstellen",
      title: "Chatbot-Antwortbaustein für häufige Frage erstellen",
      description:
         "Erstelle einen wiederverwendbaren Antwortbaustein für Chatbots oder Makro-Antworten im Ticketsystem.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle einen Antwortbaustein für folgende häufige Frage:\n\nFrage/Anliegen: {{anliegen}}\nWichtigste Fakten der Antwort: {{fakten}}\n\nErstelle einen Baustein, der:\n- Kurz und direkt antwortet (max. 4 Sätze)\n- Platzhalter für Personalisierung enthält (z.B. [Name], [Bestellnummer])\n- Eine Option für Eskalation an einen Menschen enthält, falls die Antwort nicht passt",
      categorySlug: "kundenservice-support",
      fields: [
         {
            name: "anliegen",
            label: "Frage / Anliegen",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "fakten",
            label: "Wichtigste Fakten der Antwort",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
      ],
   },

   // ── Vertrieb & Sales ─────────────────────────────────────────────
   {
      slug: "cold-outreach-email",
      title: "Cold-Outreach-E-Mail erstellen",
      description:
         "Erstelle eine personalisierte Kaltakquise-E-Mail, die tatsächlich gelesen wird – kein generisches Massen-Template.",
      recommendedModel: "GPT-4o",
      content:
         'Erstelle eine Cold-Outreach-E-Mail:\n\nZielperson/Firma: {{zielperson}}\nUnser Angebot: {{angebot}}\nKonkreter Aufhänger (z.B. aktuelle News, gemeinsamer Kontakt): {{aufhaenger}}\nGewünschtes nächstes Ding: {{cta}}\n\nDie E-Mail soll:\n1. Mit dem konkreten Aufhänger beginnen, nicht mit der eigenen Firma\n2. Den Nutzen in einem Satz auf den Punkt bringen\n3. Kurz sein (max. 100 Wörter)\n4. Eine niedrigschwellige, konkrete CTA enthalten (kein "Lass uns mal connecten")',
      categorySlug: "vertrieb-sales",
      fields: [
         {
            name: "zielperson",
            label: "Zielperson / Firma",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "angebot",
            label: "Unser Angebot",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "aufhaenger",
            label: "Konkreter Aufhänger",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
         {
            name: "cta",
            label: "Gewünschter nächster Schritt",
            type: "TEXT" as const,
            required: true,
            order: 3,
         },
      ],
   },
   {
      slug: "angebotstext-erstellen",
      title: "Angebotstext / Proposal erstellen",
      description:
         "Strukturiere ein überzeugendes Geschäftsangebot, das Nutzen vor Preis kommuniziert und Einwände vorwegnimmt.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle ein Angebot:\n\nKunde: {{kunde}}\nLeistung/Produkt: {{leistung}}\nHerausforderung des Kunden: {{herausforderung}}\nPreis/Konditionen: {{preis}}\n\nStruktur:\n1. Ausgangslage (Herausforderung des Kunden in eigenen Worten)\n2. Vorgeschlagene Lösung\n3. Konkreter Nutzen/erwartetes Ergebnis\n4. Leistungsumfang\n5. Investition (Preis, eingebettet nach dem Nutzen)\n6. Nächste Schritte",
      categorySlug: "vertrieb-sales",
      fields: [
         {
            name: "kunde",
            label: "Kunde",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "leistung",
            label: "Leistung / Produkt",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "herausforderung",
            label: "Herausforderung des Kunden",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
         {
            name: "preis",
            label: "Preis / Konditionen",
            type: "TEXT" as const,
            required: true,
            order: 3,
         },
      ],
   },
   {
      slug: "einwandbehandlung-vorbereiten",
      title: "Einwandbehandlung vorbereiten",
      description:
         "Bereite überzeugende Antworten auf typische Kaufeinwände vor – strukturiert statt improvisiert im Gespräch.",
      recommendedModel: "GPT-4o",
      content:
         "Bereite Antworten auf folgenden Einwand vor:\n\nEinwand des Kunden: {{einwand}}\nUnser Produkt/Angebot: {{angebot}}\n\nErstelle:\n1. Eine empathische Anerkennung des Einwands (nicht widersprechen)\n2. Eine klärende Rückfrage, um den wahren Grund zu verstehen\n3. Eine faktenbasierte Antwort mit konkretem Beleg (Zahl, Beispiel, Referenz)\n4. Eine Überleitung zurück zum nächsten Schritt",
      categorySlug: "vertrieb-sales",
      fields: [
         {
            name: "einwand",
            label: "Einwand des Kunden",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "angebot",
            label: "Unser Produkt/Angebot",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
      ],
   },
   {
      slug: "follow-up-email-nach-meeting",
      title: "Follow-up-E-Mail nach Sales-Meeting",
      description:
         "Fasse ein Sales-Gespräch professionell zusammen und hältst die Dynamik zum nächsten Schritt aufrecht.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle eine Follow-up-E-Mail:\n\nBesprochene Punkte: {{besprochene_punkte}}\nOffene Fragen des Kunden: {{offene_fragen}}\nVereinbarter nächster Schritt: {{naechster_schritt}}\n\nDie E-Mail soll:\n1. Kurz danken und den Gesprächskontext bestätigen\n2. Die wichtigsten Punkte stichpunktartig zusammenfassen\n3. Offene Fragen aktiv beantworten oder terminieren\n4. Den nächsten Schritt mit konkretem Datum benennen",
      categorySlug: "vertrieb-sales",
      fields: [
         {
            name: "besprochene_punkte",
            label: "Besprochene Punkte",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "offene_fragen",
            label: "Offene Fragen des Kunden",
            type: "TEXTAREA" as const,
            required: false,
            order: 1,
         },
         {
            name: "naechster_schritt",
            label: "Vereinbarter nächster Schritt",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "discovery-call-fragen",
      title: "Discovery-Call: Qualifizierende Fragen erstellen",
      description:
         "Erstelle einen Fragenkatalog für Erstgespräche, der echten Bedarf aufdeckt statt nur Produktfeatures zu präsentieren.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle Discovery-Call-Fragen für:\n\nZielgruppe/Branche: {{zielgruppe}}\nUnser Angebot: {{angebot}}\n\nErstelle je 2-3 Fragen zu:\n1. Aktuelle Situation und Prozess\n2. Konkrete Schmerzpunkte / Kosten des Status quo\n3. Entscheidungsprozess und Budget\n4. Zeitlicher Druck / Dringlichkeit\n\nFormuliere offene Fragen, keine Ja/Nein-Fragen.",
      categorySlug: "vertrieb-sales",
      fields: [
         {
            name: "zielgruppe",
            label: "Zielgruppe / Branche",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "angebot",
            label: "Unser Angebot",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
      ],
   },
   {
      slug: "sales-pitch-elevator",
      title: "Elevator Pitch erstellen",
      description:
         "Erstelle einen prägnanten 30-Sekunden-Pitch, der in Netzwerk-Situationen oder am Telefon sofort Interesse weckt.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle einen Elevator Pitch:\n\nProdukt/Dienstleistung: {{produkt}}\nZielgruppe: {{zielgruppe}}\nGrößter Nutzen: {{nutzen}}\n\nStruktur (max. 4 Sätze, ca. 30 Sekunden gesprochen):\n1. Wer wir sind (1 Satz)\n2. Welches Problem wir lösen (1 Satz)\n3. Wie/wodurch wir uns unterscheiden (1 Satz)\n4. Eine Frage oder ein Einstiegssatz für den Dialog",
      categorySlug: "vertrieb-sales",
      fields: [
         {
            name: "produkt",
            label: "Produkt / Dienstleistung",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "zielgruppe",
            label: "Zielgruppe",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "nutzen",
            label: "Größter Nutzen",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "linkedin-sales-nachricht",
      title: "LinkedIn-Kontaktanfrage / Sales-Nachricht",
      description:
         "Erstelle eine LinkedIn-Nachricht für Social Selling, die nicht wie eine automatisierte Massenanfrage wirkt.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle eine LinkedIn-Nachricht:\n\nZielperson (Rolle/Kontext): {{zielperson}}\nGemeinsamer Anknüpfungspunkt: {{anknuepfungspunkt}}\nZiel der Nachricht: {{ziel}}\n\nDie Nachricht soll:\n- Max. 3-4 Sätze lang sein\n- Mit dem Anknüpfungspunkt beginnen, nicht mit dem Verkaufsangebot\n- Keine Buzzwords oder Templates-Sprache enthalten\n- Mit einer konkreten, niedrigschwelligen Frage enden",
      categorySlug: "vertrieb-sales",
      fields: [
         {
            name: "zielperson",
            label: "Zielperson (Rolle/Kontext)",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "anknuepfungspunkt",
            label: "Gemeinsamer Anknüpfungspunkt",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "ziel",
            label: "Ziel der Nachricht",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "Vernetzen",
               "Call vereinbaren",
               "Content teilen",
               "Feedback einholen",
            ],
         },
      ],
   },
   {
      slug: "verhandlungsstrategie-preis",
      title: "Preisverhandlung: Strategie vorbereiten",
      description:
         "Bereite eine Verhandlungsstrategie für ein Preisgespräch vor, inklusive Verhandlungsspielraum und Alternativen zum reinen Rabatt.",
      recommendedModel: "GPT-4o",
      content:
         "Bereite eine Preisverhandlung vor:\n\nAusgangspreis: {{ausgangspreis}}\nGeforderter Rabatt/Position des Kunden: {{kundenposition}}\nUnser Verhandlungsspielraum: {{spielraum}}\n\nErstelle:\n1. Unsere Ziel- und Grenzposition\n2. 3 Alternativen zum reinen Preisnachlass (z.B. Laufzeit, Umfang, Zahlungsbedingungen)\n3. Konkrete Formulierungen für die ersten Verhandlungssätze\n4. Eine Exit-Option, falls keine Einigung möglich ist",
      categorySlug: "vertrieb-sales",
      fields: [
         {
            name: "ausgangspreis",
            label: "Ausgangspreis",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "kundenposition",
            label: "Geforderter Rabatt / Position des Kunden",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "spielraum",
            label: "Unser Verhandlungsspielraum",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "kundenreferenz-case-study",
      title: "Kundenreferenz / Case Study strukturieren",
      description:
         "Wandle Rohinformationen zu einem Kundenprojekt in eine überzeugende Case Study um, die im Sales-Prozess als Beweis dient.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle eine Case Study:\n\nKunde/Branche: {{kunde}}\nAusgangssituation: {{ausgangssituation}}\nUnsere Lösung: {{loesung}}\nErgebnis (mit Zahlen wenn möglich): {{ergebnis}}\n\nStruktur:\n1. Herausforderung (Ausgangslage aus Kundensicht)\n2. Lösung (was wurde umgesetzt)\n3. Ergebnis (konkret, idealerweise quantifiziert)\n4. Zitat-Vorschlag, das der Kunde so gesagt haben könnte (zur Freigabe)",
      categorySlug: "vertrieb-sales",
      fields: [
         {
            name: "kunde",
            label: "Kunde / Branche",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "ausgangssituation",
            label: "Ausgangssituation",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "loesung",
            label: "Unsere Lösung",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
         {
            name: "ergebnis",
            label: "Ergebnis (mit Zahlen wenn möglich)",
            type: "TEXT" as const,
            required: true,
            order: 3,
         },
      ],
   },
   {
      slug: "lead-qualifizierung-kriterien",
      title: "Lead-Qualifizierung nach BANT strukturieren",
      description:
         "Bewerte einen Lead systematisch nach Budget, Autorität, Bedarf und Zeitrahmen (BANT) statt nach Bauchgefühl.",
      recommendedModel: "GPT-4o",
      content:
         "Qualifiziere folgenden Lead nach BANT:\n\nInformationen zum Lead: {{lead_infos}}\n\nBewerte strukturiert:\n1. Budget: Ist ein Budget vorhanden/realistisch?\n2. Authority: Spricht die Kontaktperson mit Entscheidungsbefugnis?\n3. Need: Wie konkret ist der Bedarf?\n4. Timeline: Wie dringend/wann soll entschieden werden?\n\nGib eine Gesamteinschätzung (Heiß/Warm/Kalt) und empfohlene nächste Schritte.",
      categorySlug: "vertrieb-sales",
      fields: [
         {
            name: "lead_infos",
            label: "Informationen zum Lead",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
      ],
   },

   // ── Bewerbung & Karriere ─────────────────────────────────────────
   {
      slug: "anschreiben-erstellen",
      title: "Anschreiben für Bewerbung erstellen",
      description:
         "Erstelle ein individuelles Anschreiben, das konkret auf die Stelle eingeht statt generische Floskeln aneinanderzureihen.",
      recommendedModel: "GPT-4o",
      content:
         'Erstelle ein Bewerbungsanschreiben:\n\nZielposition: {{position}}\nUnternehmen: {{unternehmen}}\nEigene relevante Erfahrung: {{erfahrung}}\nMotivation für die Stelle: {{motivation}}\n\nDas Anschreiben soll:\n1. Mit einem konkreten Bezug zur Stelle/zum Unternehmen beginnen, nicht mit "Hiermit bewerbe ich mich..."\n2. 2-3 relevante Erfahrungen mit Ergebnis verknüpfen\n3. Die Motivation glaubwürdig und spezifisch machen\n4. Mit einem klaren, selbstbewussten Abschluss enden\n5. Max. 300 Wörter',
      categorySlug: "bewerbung-karriere",
      fields: [
         {
            name: "position",
            label: "Zielposition",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "unternehmen",
            label: "Unternehmen",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "erfahrung",
            label: "Eigene relevante Erfahrung",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
         {
            name: "motivation",
            label: "Motivation für die Stelle",
            type: "TEXTAREA" as const,
            required: true,
            order: 3,
         },
      ],
   },
   {
      slug: "lebenslauf-optimieren",
      title: "Lebenslauf-Abschnitt optimieren",
      description:
         "Formuliere Berufserfahrung im Lebenslauf ergebnisorientiert statt als reine Aufgabenliste – entscheidend, um im ersten Screening aufzufallen.",
      recommendedModel: "GPT-4o",
      content:
         'Optimiere folgenden Lebenslauf-Abschnitt:\n\nAktueller Text: {{aktueller_text}}\nZielposition: {{zielposition}}\n\nFormuliere jede Aufgabe nach dem Muster "[Aktion] → [Ergebnis/Kennzahl]" statt als reine Tätigkeitsbeschreibung. Nutze aktive Verben. Passe die Formulierung so an, dass sie zur Zielposition passt, ohne Fakten zu verfälschen.',
      categorySlug: "bewerbung-karriere",
      fields: [
         {
            name: "aktueller_text",
            label: "Aktueller Text",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "zielposition",
            label: "Zielposition",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
      ],
   },
   {
      slug: "interview-vorbereitung-antworten",
      title: "Vorstellungsgespräch: Antworten vorbereiten",
      description:
         "Bereite überzeugende Antworten auf typische Interviewfragen vor, basierend auf der eigenen Erfahrung – nach der STAR-Methode.",
      recommendedModel: "GPT-4o",
      content:
         "Bereite eine Interview-Antwort vor:\n\nFrage: {{frage}}\nRelevante eigene Erfahrung: {{erfahrung}}\n\nStrukturiere die Antwort nach STAR:\n- Situation: Kontext kurz beschreiben\n- Task: Was war die Aufgabe/Herausforderung?\n- Action: Was hast du konkret getan?\n- Result: Was war das Ergebnis (idealerweise messbar)?\n\nHalte die Antwort auf 60-90 Sekunden Sprechzeit begrenzt.",
      categorySlug: "bewerbung-karriere",
      fields: [
         {
            name: "frage",
            label: "Frage",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "erfahrung",
            label: "Relevante eigene Erfahrung",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
      ],
   },
   {
      slug: "gehaltsverhandlung-vorbereiten",
      title: "Gehaltsverhandlung vorbereiten",
      description:
         "Bereite Argumente und Formulierungen für eine Gehaltsverhandlung vor – selbstbewusst, aber ohne Konfrontation.",
      recommendedModel: "GPT-4o",
      content:
         'Bereite eine Gehaltsverhandlung vor:\n\nAktuelles/erwartetes Gehalt: {{gehalt_situation}}\nEigene Leistungen/Marktwert-Argumente: {{argumente}}\nGesprächsanlass: {{anlass}}\n\nErstelle:\n1. Eine klare Zielzahl und eine Verhandlungsuntergrenze\n2. 3 konkrete Argumente basierend auf Leistung/Marktdaten\n3. Einen Formulierungsvorschlag für den Gesprächseinstieg\n4. Eine Antwort für den Fall, dass zunächst "Nein" kommt',
      categorySlug: "bewerbung-karriere",
      fields: [
         {
            name: "gehalt_situation",
            label: "Aktuelles / erwartetes Gehalt",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "argumente",
            label: "Eigene Leistungen / Marktwert-Argumente",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "anlass",
            label: "Gesprächsanlass",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: [
               "Jahresgespräch",
               "Neues Jobangebot",
               "Beförderung",
               "Gegenangebot",
            ],
         },
      ],
   },
   {
      slug: "linkedin-profil-optimieren",
      title: "LinkedIn-Profil-Text optimieren",
      description:
         'Formuliere die LinkedIn-"Über mich"-Sektion so, dass sie in Suchergebnissen und beim Lesen sofort Klarheit über den eigenen Wert schafft.',
      recommendedModel: "GPT-4o",
      content:
         'Optimiere den LinkedIn-"Über mich"-Text:\n\nAktueller Text/Stichpunkte: {{aktueller_text}}\nZielrolle/Branche: {{zielrolle}}\n\nStruktur:\n1. Erste Zeile: Wer bin ich + größter Nutzen (wird in der Vorschau angezeigt, muss stark sein)\n2. Kernkompetenzen mit konkreten Beispielen\n3. Was mich antreibt / Arbeitsweise\n4. Klare Aussage, wonach ich suche oder wofür ich offen bin',
      categorySlug: "bewerbung-karriere",
      fields: [
         {
            name: "aktueller_text",
            label: "Aktueller Text / Stichpunkte",
            type: "TEXTAREA" as const,
            required: true,
            order: 0,
         },
         {
            name: "zielrolle",
            label: "Zielrolle / Branche",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
      ],
   },
   {
      slug: "karriereziele-formulieren",
      title: "Karriereziele strukturiert formulieren",
      description:
         "Formuliere eigene Karriereziele klar und konkret – nützlich für Mitarbeitergespräche, Bewerbungen oder die eigene Orientierung.",
      recommendedModel: "GPT-4o",
      content:
         "Formuliere Karriereziele:\n\nAktuelle Position: {{aktuelle_position}}\nGrobe Richtung/Interessen: {{richtung}}\nZeithorizont: {{zeithorizont}}\n\nErstelle:\n1. Ein konkretes Ziel für den Zeithorizont (SMART formuliert)\n2. 3 Zwischenschritte dorthin\n3. Fähigkeiten, die dafür aufgebaut werden müssen\n4. Wie sich dieses Ziel im Gespräch mit einer Führungskraft glaubwürdig begründen lässt",
      categorySlug: "bewerbung-karriere",
      fields: [
         {
            name: "aktuelle_position",
            label: "Aktuelle Position",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "richtung",
            label: "Grobe Richtung / Interessen",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
         {
            name: "zeithorizont",
            label: "Zeithorizont",
            type: "SELECT" as const,
            required: true,
            order: 2,
            options: ["1 Jahr", "3 Jahre", "5 Jahre"],
         },
      ],
   },
   {
      slug: "kuendigung-schreiben",
      title: "Kündigungsschreiben verfassen",
      description:
         "Erstelle ein formal korrektes, professionelles Kündigungsschreiben – ohne unnötige Erklärungen oder Emotionen, die später gegen einen verwendet werden könnten.",
      recommendedModel: "GPT-4o",
      content:
         "Erstelle ein Kündigungsschreiben:\n\nArbeitgeber: {{arbeitgeber}}\nPosition: {{position}}\nKündigungsdatum: {{datum}}\nKündigungsfrist: {{frist}}\n\nDas Schreiben soll:\n- Formal korrekt sein (Betreff, Datum, klare Kündigungserklärung)\n- Das Enddatum unter Einhaltung der Frist konkret benennen\n- Um ein qualifiziertes Arbeitszeugnis bitten\n- Kurz und sachlich bleiben, keine Begründung des Weggangs enthalten",
      categorySlug: "bewerbung-karriere",
      fields: [
         {
            name: "arbeitgeber",
            label: "Arbeitgeber",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "position",
            label: "Position",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "datum",
            label: "Kündigungsdatum",
            type: "TEXT" as const,
            required: true,
            order: 2,
         },
         {
            name: "frist",
            label: "Kündigungsfrist",
            type: "TEXT" as const,
            required: true,
            order: 3,
         },
      ],
   },
   {
      slug: "dankes-email-nach-interview",
      title: "Dankes-E-Mail nach Vorstellungsgespräch",
      description:
         "Verfasse eine kurze Dankes-Mail nach dem Interview, die im Kopf bleibt statt generisch zu wirken.",
      recommendedModel: "GPT-4o",
      content:
         'Erstelle eine Dankes-E-Mail nach dem Interview:\n\nAnsprechpartner: {{ansprechpartner}}\nPosition: {{position}}\nKonkreter Gesprächsmoment, an den ich anknüpfen will: {{gespraechsmoment}}\n\nDie E-Mail soll:\n- Kurz sein (max. 100 Wörter)\n- Auf einen konkreten Moment aus dem Gespräch Bezug nehmen (kein generisches "Danke für Ihre Zeit")\n- Kurz nochmal die eigene Eignung unterstreichen\n- Interesse an der Stelle bekräftigen',
      categorySlug: "bewerbung-karriere",
      fields: [
         {
            name: "ansprechpartner",
            label: "Ansprechpartner",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "position",
            label: "Position",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "gespraechsmoment",
            label: "Konkreter Gesprächsmoment",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
      ],
   },
   {
      slug: "staerken-schwaechen-analyse",
      title: "Stärken-Schwächen-Analyse für Bewerbung",
      description:
         "Erarbeite eine ehrliche, aber bewerbungstaugliche Stärken-Schwächen-Analyse – inklusive glaubwürdiger Formulierung von Schwächen.",
      recommendedModel: "GPT-4o",
      content:
         'Erstelle eine Stärken-Schwächen-Analyse:\n\nZielposition: {{zielposition}}\nBisherige Erfahrung/Selbsteinschätzung: {{selbsteinschaetzung}}\n\nErstelle:\n1. 3 Stärken mit je einem konkreten Beleg aus der Erfahrung\n2. 2 Schwächen, glaubwürdig formuliert (echte Entwicklungsfelder, keine verkappten Stärken wie "ich bin zu perfektionistisch")\n3. Für jede Schwäche: was aktiv dagegen unternommen wird',
      categorySlug: "bewerbung-karriere",
      fields: [
         {
            name: "zielposition",
            label: "Zielposition",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "selbsteinschaetzung",
            label: "Bisherige Erfahrung / Selbsteinschätzung",
            type: "TEXTAREA" as const,
            required: true,
            order: 1,
         },
      ],
   },
   {
      slug: "quereinstieg-positionierung",
      title: "Quereinstieg: Erfahrung glaubwürdig positionieren",
      description:
         "Positioniere branchenfremde Erfahrung überzeugend für eine Bewerbung in einem neuen Feld – zeigt Transfer-Kompetenzen statt Lücken.",
      recommendedModel: "GPT-4o",
      content:
         'Positioniere folgende Erfahrung für einen Quereinstieg:\n\nBisherige Branche/Rolle: {{bisherige_rolle}}\nZielbranche/Zielrolle: {{zielrolle}}\nÜbertragbare Fähigkeiten (Stichpunkte): {{faehigkeiten}}\n\nErstelle:\n1. Eine kurze Positionierungs-Aussage, die den Wechsel als Stärke framt\n2. 3 konkrete Beispiele, wie bisherige Erfahrung in der neuen Rolle Mehrwert schafft\n3. Formulierungsvorschlag für die "Warum der Wechsel"-Frage im Interview',
      categorySlug: "bewerbung-karriere",
      fields: [
         {
            name: "bisherige_rolle",
            label: "Bisherige Branche / Rolle",
            type: "TEXT" as const,
            required: true,
            order: 0,
         },
         {
            name: "zielrolle",
            label: "Zielbranche / Zielrolle",
            type: "TEXT" as const,
            required: true,
            order: 1,
         },
         {
            name: "faehigkeiten",
            label: "Übertragbare Fähigkeiten (Stichpunkte)",
            type: "TEXTAREA" as const,
            required: true,
            order: 2,
         },
      ],
   },
];

export const initCatalogData = async (prisma: PrismaClient) => {
   console.log("\Creating catalog categories...");

   const categoryMap = new Map<string, string>();

   for (const cat of catalogCategories) {
      const created = await prisma.catalogCategory.upsert({
         where: { slug: cat.slug },
         update: {},
         create: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            order: cat.order,
         },
      });
      categoryMap.set(cat.slug, created.id);
   }

   console.log(`  ✓ ${catalogCategories.length} catalog categories created`);

   console.log("\Creating catalog entries...");

   for (const entry of catalogEntries) {
      const categoryId = entry.categorySlug
         ? categoryMap.get(entry.categorySlug)
         : undefined;

      await prisma.catalogEntry.upsert({
         where: { slug: entry.slug },
         update: {},
         create: {
            slug: entry.slug,
            title: entry.title,
            description: entry.description,
            recommendedModel: entry.recommendedModel,
            status: "PUBLISHED",
            publishedAt: new Date(),
            categoryId: categoryId ?? null,
            content: {
               create: {
                  content: entry.content,
               },
            },
            fields: {
               create: entry.fields.map((f) => ({
                  name: f.name,
                  label: f.label,
                  description: f.description ?? null,
                  type: f.type,
                  required: f.required,
                  order: f.order,
                  options: f.options ?? undefined,
               })),
            },
         },
      });
   }

   console.log(`  ✓ ${catalogEntries.length} catalog entries created`);
};
