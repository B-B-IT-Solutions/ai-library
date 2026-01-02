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
      title: "Code Review Assistant",
      recommendedModel: "Claude Sonnet 4.5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Development",
            "Code Review",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Please review the following code for:\n- Best practices\n- Performance optimization\n- Security vulnerabilities\n- Code readability\n- Potential bugs\n\nProvide specific suggestions for improvement.\n\nCode:\n[INSERT CODE HERE]",
         },
      },
   },
   {
      title: "Technical Documentation Writer",
      recommendedModel: "Claude Sonnet 4.5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Documentation",
            "Technical Writing",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Create comprehensive technical documentation for [FEATURE/API/SYSTEM]. Include:\n\n1. Overview and purpose\n2. Prerequisites\n3. Step-by-step instructions\n4. Code examples\n5. Common issues and troubleshooting\n6. Best practices\n\nTarget audience: [SPECIFY AUDIENCE]",
         },
      },
   },
   {
      title: "Blog Post Outliner",
      recommendedModel: "GPT-4",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Content Creation",
            "Marketing",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Create a detailed blog post outline about [TOPIC].\n\nInclude:\n- Catchy title (3 options)\n- Meta description\n- Introduction hook\n- 5-7 main sections with subpoints\n- Conclusion with call-to-action\n- SEO keywords\n\nTone: [Professional/Casual/Technical]\nTarget audience: [SPECIFY]",
         },
      },
   },
   {
      title: "Data Analysis Helper",
      recommendedModel: "Claude Sonnet 4.5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Data Science",
            "Analysis",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Analyze the following dataset and provide insights:\n\n[INSERT DATA OR DESCRIBE DATASET]\n\nPlease provide:\n1. Summary statistics\n2. Key trends and patterns\n3. Anomalies or outliers\n4. Correlations between variables\n5. Actionable recommendations\n6. Visualizations suggestions",
         },
      },
   },
   {
      title: "Meeting Notes Summarizer",
      recommendedModel: "GPT-4 Turbo",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Productivity",
            "Business",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Summarize the following meeting notes into a structured format:\n\n[INSERT MEETING NOTES]\n\nProvide:\n- Key decisions made\n- Action items with owners\n- Important discussion points\n- Follow-up required\n- Next meeting agenda items",
         },
      },
   },
   {
      title: "Email Response Generator",
      recommendedModel: "GPT-3.5",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Communication",
            "Business",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Draft a professional email response to:\n\n[INSERT EMAIL CONTENT]\n\nTone: [Professional/Friendly/Formal]\nKey points to address:\n- [POINT 1]\n- [POINT 2]\n- [POINT 3]\n\nKeep it concise and actionable.",
         },
      },
   },
   {
      title: "Learning Path Creator",
      recommendedModel: "Claude Opus 4",
      categories: {
         connectOrCreate: promptTemplateCategories(["Education", "Learning"]),
      },
      promptTemplate: {
         create: {
            content:
               "Create a comprehensive learning path for [SKILL/TOPIC].\n\nInclude:\n1. Prerequisites\n2. Week-by-week breakdown\n3. Resources (courses, books, articles)\n4. Practice projects\n5. Milestone assessments\n6. Estimated time commitment\n\nCurrent level: [Beginner/Intermediate/Advanced]",
         },
      },
   },
   {
      title: "SQL Query Generator",
      recommendedModel: "Claude Sonnet 4.5",
      categories: {
         connectOrCreate: promptTemplateCategories(["Development", "Database"]),
      },
      promptTemplate: {
         create: {
            content:
               "Generate an SQL query for the following requirement:\n\n[DESCRIBE REQUIREMENT]\n\nDatabase schema:\n[DESCRIBE TABLES AND COLUMNS]\n\nProvide:\n- Optimized SQL query\n- Explanation of the query\n- Performance considerations\n- Alternative approaches if applicable",
         },
      },
   },
   {
      title: "User Story Creator",
      recommendedModel: "GPT-4",
      categories: {
         connectOrCreate: promptTemplateCategories([
            "Agile",
            "Product Management",
         ]),
      },
      promptTemplate: {
         create: {
            content:
               "Create user stories for [FEATURE NAME].\n\nFormat each as:\n- As a [USER TYPE]\n- I want to [ACTION]\n- So that [BENEFIT]\n\nInclude:\n- Acceptance criteria\n- Edge cases\n- Technical considerations\n- Estimated complexity",
         },
      },
   },
   {
      title: "Bug Report Template",
      recommendedModel: "GPT-4 Turbo",
      categories: {
         connectOrCreate: promptTemplateCategories(["Development", "QA"]),
      },
      promptTemplate: {
         create: {
            content:
               "Report a bug with the following details:\n\n**Title:** [Clear, concise title]\n\n**Environment:**\n- OS: [e.g., Windows 11, macOS 14]\n- Browser/App Version:\n- Device:\n\n**Steps to Reproduce:**\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\n**Expected Behavior:**\n[What should happen]\n\n**Actual Behavior:**\n[What actually happens]\n\n**Screenshots/Logs:**\n[Attach if available]\n\n**Severity:** [Critical/High/Medium/Low]",
         },
      },
   },
];
