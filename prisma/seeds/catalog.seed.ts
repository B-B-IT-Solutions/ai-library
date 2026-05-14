import { PrismaClient } from "@/generated/prisma/client";

type PrismaClientType = InstanceType<typeof PrismaClient>;

const catalogCategories = [
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
];

const catalogEntries = [
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
         "Du bist ein erfahrener Werbetexter. Schreib 5 verschiedene Eröffnungssätze für folgenden Text:\n\nThema: {{thema}}\nZielgruppe: {{zielgruppe}}\nPlattform: {{plattform}}\n\nVerwende diese 5 verschiedenen Hook-Typen:\n1. Provokante These (widerspricht einer gängigen Meinung)\n2. Konkrete Zahl / Statistik\n3. \"Was wäre wenn\"-Szenario\n4. Schmerz-Hook (benennt ein Problem direkt)\n5. Neugier-Lücke (stellt eine Frage, die unbedingt beantwortet werden will)\n\nFormattiere jeden Hook als eigenständigen Satz. Keine Erklärungen.",
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
         "Du bist ein erfahrener Werbetexter. Hier sind die technischen Features meines Produkts:\n\n{{feature_liste}}\n\nDeine Aufgabe: Wandle jedes Feature in einen konkreten Kundennutzen um.\nNutze die Formel: \"[Feature] – das bedeutet für dich: [konkreter Nutzen im Alltag]\"\n\nZielgruppe: {{zielgruppe}}\nTon: {{tonalitaet}}\n\nDanach: Wähle die 3 stärksten Benefits aus und schreib sie als kurze, prägnante Bullet Points (max. 10 Wörter pro Bullet).",
      categorySlug: "marketing-content",
      fields: [
         {
            name: "feature_liste",
            label: "Feature-Liste",
            description: "Liste deine Produkt-Features auf (eine Zeile pro Feature)",
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
            options: ["Direkt", "Empathisch", "Sachlich", "Inspirierend", "Humorvoll"],
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
         "Du bist ein E-Mail-Marketing-Experte. Schreib 10 Betreffzeilen für folgende E-Mail:\n\nInhalt der E-Mail: {{email_inhalt}}\nZielgruppe: {{zielgruppe}}\nZiel: {{ziel}}\n\nNutze diese Betreffzeilen-Typen (je 2):\n- Neugier (\"Warum die meisten X falsch machen...\")\n- Direkter Nutzen (\"In 10 Minuten zu X\")\n- Personalisierung / Spezifität (\"Für [Jobtitel/Situation]\")\n- Dringlichkeit / Knappheit\n- Überraschung / Paradox\n\nJede Betreffzeile: max. 50 Zeichen. Ohne Clickbait-Floskeln.\nDanach bewerte jede mit einer geschätzten Öffnungsrate (1–10) und begründe kurz.",
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
            options: ["Klick", "Kauf", "Terminbuchung", "Anmeldung", "Information"],
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
            description: "Text der Marke oder Person, deren Stil du übernehmen möchtest",
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
];

export const seedCatalog = async (prisma: PrismaClientType) => {
   console.log("\nSeeding catalog categories...");

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

   console.log("\nSeeding catalog entries...");

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
                  options: (f as { options?: string[] }).options ?? undefined,
               })),
            },
         },
      });
   }

   console.log(`  ✓ ${catalogEntries.length} catalog entries created`);
};
