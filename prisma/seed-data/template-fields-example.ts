import { PromptTemplateDescriptorCreateInput } from "@/generated/prisma/models";

const promptTemplateCategories = (userId: string, categories: string[]) => {
   return categories.map((cat: string) => ({
      where: { userId_name: { userId, name: cat } },
      create: { name: cat, userId },
   }));
};

export const codeReviewTemplateWithFields = (
   userId: string
): PromptTemplateDescriptorCreateInput => ({
   user: { connect: { id: userId } },
   title: "KI-gestützte Code-Review",
   description:
      "Lassen Sie Ihren Code von einer KI analysieren mit Fokus auf Best Practices, Performance und Sicherheit.",
   recommendedModel: "Claude",
   categories: {
      connectOrCreate: promptTemplateCategories(userId, [
         "Entwicklung",
         "Code-Qualität",
         "Best Practices",
      ]),
   },
   promptContent: {
      create: {
         content: `Bitte führe eine professionelle Code-Review für den folgenden {{programming_language}}-Code durch:

\`\`\`{{programming_language}}
{{code_snippet}}
\`\`\`

**Fokusbereich:** {{focus_area}}

{{#if include_refactoring}}
Bitte gib auch konkrete Refactoring-Vorschläge, um die Code-Qualität zu verbessern.
{{/if}}

Analysiere den Code detailliert und gib strukturiertes Feedback zu folgenden Punkten:

1. **Code-Qualität & Lesbarkeit**
   - Ist der Code gut strukturiert und verständlich?
   - Werden Best Practices der Sprache befolgt?
   - Gibt es redundanten oder unnötig komplexen Code?

2. **Potenzielle Bugs & Fehlerquellen**
   - Welche Fehler könnten auftreten?
   - Sind Edge Cases abgedeckt?
   - Gibt es Race Conditions oder andere Threading-Probleme?

3. **Performance**
   - Gibt es Performance-Bottlenecks?
   - Können Algorithmen optimiert werden?
   - Werden Ressourcen effizient genutzt?

4. **Sicherheit**
   - Gibt es Sicherheitslücken?
   - Werden Eingaben validiert?
   - Sind sensitive Daten geschützt?

5. **Best Practices**
   - Entspricht der Code den Konventionen von {{programming_language}}?
   - Werden moderne Sprachfeatures optimal genutzt?

Gib für jeden kritischen Punkt ein konkretes Code-Beispiel, wie es verbessert werden kann.`,
         fields: {
            create: [
               {
                  name: "code_snippet",
                  label: "Code-Snippet",
                  description:
                     "Fügen Sie den Code ein, der überprüft werden soll",
                  type: "TEXTAREA",
                  required: true,
                  order: 0,
               },
               {
                  name: "programming_language",
                  label: "Programmiersprache",
                  type: "SELECT",
                  required: true,
                  order: 1,
                  options: [
                     "JavaScript",
                     "TypeScript",
                     "Python",
                     "Java",
                     "C#",
                     "Go",
                     "Rust",
                     "PHP",
                     "Ruby",
                     "C++",
                  ],
               },
               {
                  name: "focus_area",
                  label: "Fokusbereich",
                  description: "Worauf soll die Review fokussiert sein?",
                  type: "RADIO",
                  required: true,
                  order: 2,
                  options: [
                     "Best Practices",
                     "Performance",
                     "Sicherheit",
                     "Alles",
                  ],
                  defaultValue: "Best Practices",
               },
               {
                  name: "include_refactoring",
                  label: "Refactoring-Vorschläge einbeziehen",
                  type: "CHECKBOX",
                  required: false,
                  order: 3,
                  defaultValue: "true",
               },
            ],
         },
      },
   },
});

export const emailTemplateWithFields = (
   userId: string
): PromptTemplateDescriptorCreateInput => ({
   user: { connect: { id: userId } },
   title: "Professionelle E-Mail-Vorlage",
   description:
      "Erstellen Sie professionelle E-Mails für verschiedene Anlässe und Tonalitäten.",
   recommendedModel: "ChatGPT",
   categories: {
      connectOrCreate: promptTemplateCategories(userId, [
         "Kommunikation",
         "Business",
         "E-Mail",
      ]),
   },
   promptContent: {
      create: {
         content: `Erstelle eine professionelle E-Mail mit folgenden Parametern:

**Empfänger:** {{recipient}}
**Betreff:** {{subject}}
**Anlass:** {{occasion}}
**Tonalität:** {{tone}}

**Kernbotschaft:**
{{message}}

{{#if include_cta}}
**Call-to-Action:** {{cta_text}}
{{/if}}

Die E-Mail soll:
- Eine passende Anrede enthalten
- Die Kernbotschaft klar und präzise vermitteln
- Den gewählten Ton ({{tone}}) durchgängig einhalten
- Mit einer angemessenen Grußformel enden
{{#if include_cta}}
- Einen klaren Call-to-Action enthalten
{{/if}}

Achte darauf, dass die E-Mail professionell, aber nicht zu förmlich wirkt.`,
         fields: {
            create: [
               {
                  name: "recipient",
                  label: "Empfänger",
                  description: "An wen geht die E-Mail? (z.B. Kunde, Kollege)",
                  type: "TEXT",
                  required: true,
                  order: 0,
               },
               {
                  name: "subject",
                  label: "Betreff",
                  type: "TEXT",
                  required: true,
                  order: 1,
               },
               {
                  name: "occasion",
                  label: "Anlass",
                  type: "SELECT",
                  required: true,
                  order: 2,
                  options: [
                     "Anfrage",
                     "Angebot",
                     "Follow-up",
                     "Beschwerde",
                     "Danksagung",
                     "Information",
                     "Einladung",
                  ],
               },
               {
                  name: "tone",
                  label: "Tonalität",
                  type: "SELECT",
                  required: true,
                  order: 3,
                  options: ["Formell", "Freundlich", "Neutral", "Direkt"],
                  defaultValue: "Freundlich",
               },
               {
                  name: "message",
                  label: "Kernbotschaft",
                  description:
                     "Was ist die Hauptaussage der E-Mail? Was soll vermittelt werden?",
                  type: "TEXTAREA",
                  required: true,
                  order: 4,
               },
               {
                  name: "include_cta",
                  label: "Call-to-Action einbeziehen",
                  type: "CHECKBOX",
                  required: false,
                  order: 5,
               },
               {
                  name: "cta_text",
                  label: "Call-to-Action Text",
                  description:
                     "Was soll der Empfänger tun? (z.B. Termin vereinbaren, antworten)",
                  type: "TEXT",
                  required: false,
                  order: 6,
               },
            ],
         },
      },
   },
});

export const socialMediaPostTemplate = (
   userId: string
): PromptTemplateDescriptorCreateInput => ({
   user: { connect: { id: userId } },
   title: "Social Media Post Generator",
   description:
      "Erstellen Sie ansprechende Social Media Posts für verschiedene Plattformen mit der optimalen Tonalität und Länge.",
   recommendedModel: "ChatGPT",
   categories: {
      connectOrCreate: promptTemplateCategories(userId, [
         "Copywriting",
         "Social Media",
         "Marketing",
      ]),
   },
   promptContent: {
      create: {
         content: `Erstelle einen professionellen Social Media Post mit folgenden Parametern:

**Plattform:** {{platform}}
**Thema:** {{topic}}
**Tonalität:** {{tone}}
**Zielgruppe:** {{target_audience}}

**Kernbotschaft:**
{{message}}

{{#if include_cta}}
**Call-to-Action:** {{cta_type}}
{{/if}}

{{#if include_emojis}}
Verwende passende Emojis, um den Post aufzulockern und die Aufmerksamkeit zu erhöhen.
{{/if}}

{{#if include_hashtags}}
Füge 3-5 relevante Hashtags hinzu, die die Reichweite erhöhen.
{{/if}}

Der Post soll:
- Für {{platform}} optimiert sein (Länge, Format, Stil)
- Die Tonalität "{{tone}}" durchgängig einhalten
- Die Zielgruppe "{{target_audience}}" direkt ansprechen
- Engagement-fördernd und teilenswert sein
- Grammatikalisch einwandfrei und professionell formuliert sein

Achte auf die plattformspezifischen Best Practices und aktuellen Trends.`,
         fields: {
            create: [
               {
                  name: "platform",
                  label: "Plattform",
                  description: "Für welche Social Media Plattform?",
                  type: "SELECT",
                  required: true,
                  order: 0,
                  options: [
                     "LinkedIn",
                     "Instagram",
                     "Facebook",
                     "Twitter/X",
                     "TikTok",
                  ],
               },
               {
                  name: "topic",
                  label: "Thema/Topic",
                  description: "Worum geht es in dem Post?",
                  type: "TEXT",
                  required: true,
                  order: 1,
               },
               {
                  name: "message",
                  label: "Kernbotschaft",
                  description: "Was soll vermittelt werden?",
                  type: "TEXTAREA",
                  required: true,
                  order: 2,
               },
               {
                  name: "tone",
                  label: "Tonalität",
                  type: "SELECT",
                  required: true,
                  order: 3,
                  options: [
                     "Professionell",
                     "Freundlich",
                     "Inspirierend",
                     "Humorvoll",
                     "Direkt",
                  ],
                  defaultValue: "Freundlich",
               },
               {
                  name: "target_audience",
                  label: "Zielgruppe",
                  description: "Wen möchten Sie erreichen?",
                  type: "TEXT",
                  required: true,
                  order: 4,
               },
               {
                  name: "include_cta",
                  label: "Call-to-Action einbeziehen",
                  type: "CHECKBOX",
                  required: false,
                  order: 5,
               },
               {
                  name: "cta_type",
                  label: "Art des Call-to-Action",
                  type: "SELECT",
                  required: false,
                  order: 6,
                  options: [
                     "Link zum Artikel",
                     "Kommentar anregen",
                     "Teilen auffordern",
                     "Website besuchen",
                     "Produkt kaufen",
                  ],
               },
               {
                  name: "include_emojis",
                  label: "Emojis verwenden",
                  type: "CHECKBOX",
                  required: false,
                  order: 7,
                  defaultValue: "true",
               },
               {
                  name: "include_hashtags",
                  label: "Hashtags hinzufügen",
                  type: "CHECKBOX",
                  required: false,
                  order: 8,
                  defaultValue: "true",
               },
            ],
         },
      },
   },
});

export const productDescriptionTemplate = (
   userId: string
): PromptTemplateDescriptorCreateInput => ({
   user: { connect: { id: userId } },
   title: "Produkt-Beschreibung Generator",
   description:
      "Erstellen Sie überzeugende Produktbeschreibungen, die verkaufen und Ihre Zielgruppe ansprechen.",
   recommendedModel: "ChatGPT",
   categories: {
      connectOrCreate: promptTemplateCategories(userId, [
         "Copywriting",
         "E-Commerce",
         "Marketing",
      ]),
   },
   promptContent: {
      create: {
         content: `Erstelle eine professionelle Produktbeschreibung mit folgenden Parametern:

**Produktname:** {{product_name}}
**Produktkategorie:** {{category}}
**Zielgruppe:** {{target_audience}}
**Länge:** {{length}}

**Hauptmerkmale/Features:**
{{features}}

**Alleinstellungsmerkmal (USP):**
{{usp}}

{{#if include_seo}}
**SEO-Keywords:** {{seo_keywords}}
{{/if}}

Die Produktbeschreibung soll:
- Die Zielgruppe "{{target_audience}}" direkt ansprechen
- Features in konkrete Vorteile für den Kunden übersetzen
- Das Alleinstellungsmerkmal prominent hervorheben
- Emotionale Kaufanreize setzen
- Vertrauen und Glaubwürdigkeit aufbauen
{{#if include_seo}}
- Die Keywords "{{seo_keywords}}" natürlich integrieren
{{/if}}
- Eine klare Struktur haben (Überschrift, Haupttext, Highlights)
- Zum Kauf motivieren ohne aufdringlich zu wirken

Länge: {{length}}

Verwende aktive Sprache, konkrete Beschreibungen und fokussiere auf den Kundennutzen.`,
         fields: {
            create: [
               {
                  name: "product_name",
                  label: "Produktname",
                  type: "TEXT",
                  required: true,
                  order: 0,
               },
               {
                  name: "category",
                  label: "Produktkategorie",
                  type: "SELECT",
                  required: true,
                  order: 1,
                  options: [
                     "Elektronik",
                     "Mode & Accessoires",
                     "Haus & Garten",
                     "Sport & Fitness",
                     "Schönheit & Gesundheit",
                     "Software & Digital",
                     "Lebensmittel",
                     "Sonstiges",
                  ],
               },
               {
                  name: "target_audience",
                  label: "Zielgruppe",
                  description: "Wer ist die Hauptzielgruppe?",
                  type: "TEXT",
                  required: true,
                  order: 2,
               },
               {
                  name: "features",
                  label: "Hauptmerkmale",
                  description: "Wichtigste Features und Eigenschaften",
                  type: "TEXTAREA",
                  required: true,
                  order: 3,
               },
               {
                  name: "usp",
                  label: "Alleinstellungsmerkmal (USP)",
                  description: "Was macht dieses Produkt einzigartig?",
                  type: "TEXTAREA",
                  required: true,
                  order: 4,
               },
               {
                  name: "length",
                  label: "Textlänge",
                  type: "SELECT",
                  required: true,
                  order: 5,
                  options: [
                     "Kurz (100-150 Wörter)",
                     "Mittel (200-300 Wörter)",
                     "Lang (400-500 Wörter)",
                  ],
                  defaultValue: "Mittel (200-300 Wörter)",
               },
               {
                  name: "include_seo",
                  label: "SEO-Optimierung",
                  type: "CHECKBOX",
                  required: false,
                  order: 6,
                  defaultValue: "true",
               },
               {
                  name: "seo_keywords",
                  label: "SEO-Keywords",
                  description: "Komma-getrennte Liste",
                  type: "TEXT",
                  required: false,
                  order: 7,
               },
            ],
         },
      },
   },
});

export const blogOutlineTemplate = (
   userId: string
): PromptTemplateDescriptorCreateInput => ({
   user: { connect: { id: userId } },
   title: "Blog-Artikel Struktur Generator",
   description:
      "Erstellen Sie durchdachte Blog-Strukturen mit Headlines, Subheadlines und Content-Gliederung.",
   recommendedModel: "ChatGPT",
   categories: {
      connectOrCreate: promptTemplateCategories(userId, [
         "Copywriting",
         "Content-Marketing",
         "Blogging",
      ]),
   },
   promptContent: {
      create: {
         content: `Erstelle eine detaillierte Struktur für einen Blog-Artikel mit folgenden Parametern:

**Thema:** {{topic}}
**Zielgruppe:** {{target_audience}}
**Artikel-Typ:** {{article_type}}
**Geschätzte Wortanzahl:** {{word_count}}

**Hauptkeyword:** {{main_keyword}}
{{#if include_related_keywords}}
**Verwandte Keywords:** {{related_keywords}}
{{/if}}

**Ziel des Artikels:**
{{article_goal}}

Erstelle eine vollständige Blog-Struktur mit:

1. **Arbeitstitel (H1)**
   - Aufmerksamkeitsstark und keyword-optimiert
   - Klar kommuniziert den Mehrwert

2. **Meta-Beschreibung** (150-160 Zeichen)
   - Zusammenfassung des Inhalts
   - Call-to-Action integriert

3. **Einleitung** (Stichpunkte)
   - Hook: Aufmerksamkeit gewinnen
   - Problem/Bedürfnis identifizieren
   - Überblick über den Artikel

4. **Hauptteil-Struktur** (H2 und H3 Headlines)
   - Logische Gliederung in 3-5 Hauptabschnitte (H2)
   - Unterabschnitte mit H3-Headlines
   - Kurze Beschreibung, was in jedem Abschnitt behandelt wird
   - Integration der Keywords wo sinnvoll

5. **Schluss** (Stichpunkte)
   - Zusammenfassung der Kernpunkte
   - Call-to-Action
   - Nächste Schritte für den Leser

6. **Zusätzliche Elemente**
   - Vorschläge für Bilder/Grafiken
   - Interne Verlinkungsmöglichkeiten
   - Externe Quellen zum Verlinken

Die Struktur soll:
- Für {{article_type}} optimiert sein
- Die Zielgruppe "{{target_audience}}" optimal ansprechen
- Das Hauptkeyword "{{main_keyword}}" strategisch platzieren
- Einen klaren roten Faden haben
- SEO-Best Practices berücksichtigen`,
         fields: {
            create: [
               {
                  name: "topic",
                  label: "Thema des Artikels",
                  type: "TEXT",
                  required: true,
                  order: 0,
               },
               {
                  name: "article_type",
                  label: "Artikel-Typ",
                  type: "SELECT",
                  required: true,
                  order: 1,
                  options: [
                     "How-To Guide",
                     "Listicle",
                     "Vergleich/Review",
                     "Thought Leadership",
                     "News/Trend",
                     "Case Study",
                  ],
               },
               {
                  name: "target_audience",
                  label: "Zielgruppe",
                  type: "TEXT",
                  required: true,
                  order: 2,
               },
               {
                  name: "main_keyword",
                  label: "Hauptkeyword",
                  description: "Das primäre SEO-Keyword",
                  type: "TEXT",
                  required: true,
                  order: 3,
               },
               {
                  name: "article_goal",
                  label: "Ziel des Artikels",
                  description: "Was soll der Leser mitnehmen/tun?",
                  type: "TEXTAREA",
                  required: true,
                  order: 4,
               },
               {
                  name: "word_count",
                  label: "Geschätzte Wortanzahl",
                  type: "SELECT",
                  required: true,
                  order: 5,
                  options: [
                     "500-800",
                     "800-1200",
                     "1200-1800",
                     "1800-2500",
                     "2500+",
                  ],
                  defaultValue: "1200-1800",
               },
               {
                  name: "include_related_keywords",
                  label: "Verwandte Keywords hinzufügen",
                  type: "CHECKBOX",
                  required: false,
                  order: 6,
               },
               {
                  name: "related_keywords",
                  label: "Verwandte Keywords",
                  description: "Komma-getrennt",
                  type: "TEXT",
                  required: false,
                  order: 7,
               },
            ],
         },
      },
   },
});

export const marketingEmailTemplate = (
   userId: string
): PromptTemplateDescriptorCreateInput => ({
   user: { connect: { id: userId } },
   title: "Marketing-E-Mail Kampagne",
   description:
      "Erstellen Sie conversion-optimierte Marketing-E-Mails für Newsletter, Produktlaunches und Kampagnen.",
   recommendedModel: "ChatGPT",
   categories: {
      connectOrCreate: promptTemplateCategories(userId, [
         "Copywriting",
         "E-Mail-Marketing",
         "Marketing",
      ]),
   },
   promptContent: {
      create: {
         content: `Erstelle eine professionelle Marketing-E-Mail mit folgenden Parametern:

**Kampagnen-Typ:** {{campaign_type}}
**Zielgruppe:** {{target_audience}}
**Hauptziel:** {{main_goal}}
**Angebot/Produkt:** {{offer}}

**Tonalität:** {{tone}}

{{#if has_discount}}
**Rabatt/Aktion:** {{discount_details}}
{{/if}}

{{#if has_urgency}}
**Dringlichkeit:** {{urgency_reason}}
{{/if}}

Erstelle eine vollständige Marketing-E-Mail mit:

1. **Betreffzeile** (3 Varianten für A/B-Testing)
   - Aufmerksamkeitsstark
   - Maximal 50 Zeichen
   - Öffnungsrate-optimiert

2. **Preheader-Text** (85-100 Zeichen)
   - Ergänzt die Betreffzeile
   - Gibt zusätzlichen Kontext

3. **E-Mail-Body**

   **Einleitung:**
   - Persönliche Anrede
   - Relevanter Hook
   - Nutzen klar kommunizieren

   **Hauptteil:**
   - Angebot/Produkt vorstellen: {{offer}}
   - Vorteile hervorheben (nicht Features!)
   - Social Proof einbauen (z.B. "Bereits 10.000+ zufriedene Kunden")
   {{#if has_discount}}
   - Rabatt/Aktion prominent platzieren: {{discount_details}}
   {{/if}}
   {{#if has_urgency}}
   - Dringlichkeit kommunizieren: {{urgency_reason}}
   {{/if}}

   **Call-to-Action:**
   - Klarer, handlungsorientierter Button-Text
   - Primärer CTA für Hauptziel: {{main_goal}}
   - Sekundärer CTA als Alternative

   **Schluss:**
   - Wertschätzung zeigen
   - Optional: Abmeldelink-Text
   - Signature

4. **Zusätzliche Hinweise**
   - Mobile-Optimierung beachten
   - Visuelle Hierarchie berücksichtigen
   - Spam-Filter vermeiden

Die E-Mail soll:
- Die Tonalität "{{tone}}" durchgängig einhalten
- Die Zielgruppe "{{target_audience}}" direkt ansprechen
- Zum Ziel "{{main_goal}}" führen
- Conversion-optimiert sein
- Authentisch und nicht zu werblich wirken`,
         fields: {
            create: [
               {
                  name: "campaign_type",
                  label: "Kampagnen-Typ",
                  type: "SELECT",
                  required: true,
                  order: 0,
                  options: [
                     "Newsletter",
                     "Produktlaunch",
                     "Sales/Promotion",
                     "Event-Einladung",
                     "Re-Engagement",
                     "Onboarding",
                  ],
               },
               {
                  name: "target_audience",
                  label: "Zielgruppe",
                  type: "TEXT",
                  required: true,
                  order: 1,
               },
               {
                  name: "main_goal",
                  label: "Hauptziel der E-Mail",
                  description: "Was soll der Empfänger tun?",
                  type: "TEXT",
                  required: true,
                  order: 2,
               },
               {
                  name: "offer",
                  label: "Angebot/Produkt",
                  description: "Was wird beworben?",
                  type: "TEXTAREA",
                  required: true,
                  order: 3,
               },
               {
                  name: "tone",
                  label: "Tonalität",
                  type: "SELECT",
                  required: true,
                  order: 4,
                  options: [
                     "Professionell",
                     "Freundlich",
                     "Enthusiastisch",
                     "Dringend",
                     "Exklusiv",
                  ],
                  defaultValue: "Freundlich",
               },
               {
                  name: "has_discount",
                  label: "Rabatt/Aktion vorhanden",
                  type: "CHECKBOX",
                  required: false,
                  order: 5,
               },
               {
                  name: "discount_details",
                  label: "Rabatt-Details",
                  description: "z.B. 20% Rabatt mit Code SAVE20",
                  type: "TEXT",
                  required: false,
                  order: 6,
               },
               {
                  name: "has_urgency",
                  label: "Dringlichkeit schaffen",
                  type: "CHECKBOX",
                  required: false,
                  order: 7,
               },
               {
                  name: "urgency_reason",
                  label: "Grund für Dringlichkeit",
                  description: "z.B. Limitiertes Angebot, Zeitlich begrenzt",
                  type: "TEXT",
                  required: false,
                  order: 8,
               },
            ],
         },
      },
   },
});

export const seoMetaDescriptionTemplate = (
   userId: string
): PromptTemplateDescriptorCreateInput => ({
   user: { connect: { id: userId } },
   title: "SEO Meta-Description Generator",
   description:
      "Erstellen Sie klickstarke Meta-Descriptions und Title-Tags für bessere Rankings und höhere CTR.",
   recommendedModel: "ChatGPT",
   categories: {
      connectOrCreate: promptTemplateCategories(userId, [
         "Copywriting",
         "SEO",
         "Content-Marketing",
      ]),
   },
   promptContent: {
      create: {
         content: `Erstelle SEO-optimierte Meta-Tags mit folgenden Parametern:

**Seiten-URL:** {{page_url}}
**Seiten-Typ:** {{page_type}}
**Hauptkeyword:** {{main_keyword}}
**Zielgruppe:** {{target_audience}}

**Seiten-Inhalt Zusammenfassung:**
{{content_summary}}

{{#if secondary_keywords}}
**Sekundäre Keywords:** {{secondary_keywords}}
{{/if}}

**Wettbewerbs-Kontext:**
{{competition_context}}

Erstelle:

1. **Title-Tags** (3-5 Varianten)
   - Exakt 50-60 Zeichen
   - Hauptkeyword "{{main_keyword}}" möglichst am Anfang
   - Markenname am Ende (falls Platz)
   - Aufmerksamkeitsstark und klickwürdig
   - Varianten mit unterschiedlichen Ansätzen:
     * Direkt/Informativ
     * Nutzen-orientiert
     * Frage-basiert
     * Zahlen-basiert (wenn relevant)

2. **Meta-Descriptions** (3-5 Varianten)
   - Exakt 150-160 Zeichen
   - Hauptkeyword natürlich integriert
   {{#if secondary_keywords}}
   - Sekundäre Keywords wo passend: {{secondary_keywords}}
   {{/if}}
   - Klarer Nutzen kommuniziert
   - Call-to-Action enthalten
   - Varianten mit unterschiedlichen Hooks:
     * Nutzen-fokussiert
     * Problem-Lösung
     * Neugierde weckend
     * Dringlichkeit

3. **SERP-Snippet Preview** (für beste Varianten)
   - Zeige wie Title + Meta-Description in Google aussehen würden
   - Markiere den USP

4. **Optimierungs-Hinweise**
   - Welche Variante hat das höchste CTR-Potenzial?
   - Keyword-Platzierung optimal?
   - Konkurrenzdifferenzierung vorhanden?
   - Mobile-Darstellung berücksichtigt?

Die Meta-Tags sollen:
- Für {{page_type}} optimiert sein
- Die Zielgruppe "{{target_audience}}" ansprechen
- Sich vom Wettbewerb abheben: {{competition_context}}
- Zum Klicken animieren
- SEO- und CTR-optimiert sein
- Authentisch und nicht spammy wirken`,
         fields: {
            create: [
               {
                  name: "page_url",
                  label: "Seiten-URL oder Titel",
                  type: "TEXT",
                  required: true,
                  order: 0,
               },
               {
                  name: "page_type",
                  label: "Seiten-Typ",
                  type: "SELECT",
                  required: true,
                  order: 1,
                  options: [
                     "Homepage",
                     "Produktseite",
                     "Kategorie-Seite",
                     "Blog-Artikel",
                     "Landing-Page",
                     "Service-Seite",
                     "Über uns",
                  ],
               },
               {
                  name: "main_keyword",
                  label: "Hauptkeyword",
                  description: "Das primäre SEO-Keyword für diese Seite",
                  type: "TEXT",
                  required: true,
                  order: 2,
               },
               {
                  name: "content_summary",
                  label: "Inhalt der Seite (Zusammenfassung)",
                  description: "Worum geht es auf dieser Seite?",
                  type: "TEXTAREA",
                  required: true,
                  order: 3,
               },
               {
                  name: "target_audience",
                  label: "Zielgruppe",
                  type: "TEXT",
                  required: true,
                  order: 4,
               },
               {
                  name: "competition_context",
                  label: "Wettbewerbs-Kontext",
                  description: "Wie heben Sie sich von Konkurrenten ab?",
                  type: "TEXTAREA",
                  required: true,
                  order: 5,
               },
               {
                  name: "secondary_keywords",
                  label: "Sekundäre Keywords (optional)",
                  description: "Komma-getrennt",
                  type: "TEXT",
                  required: false,
                  order: 6,
               },
            ],
         },
      },
   },
});

export const templatesWithFields = (userId: string) => [
   codeReviewTemplateWithFields(userId),
   emailTemplateWithFields(userId),
   socialMediaPostTemplate(userId),
   productDescriptionTemplate(userId),
   blogOutlineTemplate(userId),
   marketingEmailTemplate(userId),
   seoMetaDescriptionTemplate(userId),
];
