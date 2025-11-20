import { ChevronDown, ChevronRight } from "lucide-react";
import { FC, useState } from "react";
import { TemplateFilters } from "./TemplateFilters";
import { TemplateCards } from "./TemplateCards";
import { DPromptTemplate } from "@/data/domain/prompt";

const PREDEFINED_PROMPTS: DPromptTemplate[] = [
   {
      title: "Code Review Assistant",
      content:
         "Please review the following code for:\n- Best practices\n- Performance optimization\n- Security vulnerabilities\n- Code readability\n- Potential bugs\n\nProvide specific suggestions for improvement.\n\nCode:\n[INSERT CODE HERE]",
      categories: ["Development", "Code Review"],
      recommendedModel: "Claude Sonnet 4.5",
   },
   {
      title: "Technical Documentation Writer",
      content:
         "Create comprehensive technical documentation for [FEATURE/API/SYSTEM]. Include:\n\n1. Overview and purpose\n2. Prerequisites\n3. Step-by-step instructions\n4. Code examples\n5. Common issues and troubleshooting\n6. Best practices\n\nTarget audience: [SPECIFY AUDIENCE]",
      categories: ["Documentation", "Technical Writing"],
      recommendedModel: "Claude Sonnet 4.5",
   },
   {
      title: "Blog Post Outliner",
      content:
         "Create a detailed blog post outline about [TOPIC].\n\nInclude:\n- Catchy title (3 options)\n- Meta description\n- Introduction hook\n- 5-7 main sections with subpoints\n- Conclusion with call-to-action\n- SEO keywords\n\nTone: [Professional/Casual/Technical]\nTarget audience: [SPECIFY]",
      categories: ["Content Creation", "Marketing"],
      recommendedModel: "GPT-4",
   },
   {
      title: "Data Analysis Helper",
      content:
         "Analyze the following dataset and provide insights:\n\n[INSERT DATA OR DESCRIBE DATASET]\n\nPlease provide:\n1. Summary statistics\n2. Key trends and patterns\n3. Anomalies or outliers\n4. Correlations between variables\n5. Actionable recommendations\n6. Visualizations suggestions",
      categories: ["Data Science", "Analysis"],
      recommendedModel: "Claude Sonnet 4.5",
   },
   {
      title: "Meeting Notes Summarizer",
      content:
         "Summarize the following meeting notes into a structured format:\n\n[INSERT MEETING NOTES]\n\nProvide:\n- Key decisions made\n- Action items with owners\n- Important discussion points\n- Follow-up required\n- Next meeting agenda items",
      categories: ["Productivity", "Business"],
      recommendedModel: "GPT-4 Turbo",
   },
   {
      title: "Email Response Generator",
      content:
         "Draft a professional email response to:\n\n[INSERT EMAIL CONTENT]\n\nTone: [Professional/Friendly/Formal]\nKey points to address:\n- [POINT 1]\n- [POINT 2]\n- [POINT 3]\n\nKeep it concise and actionable.",
      categories: ["Communication", "Business"],
      recommendedModel: "GPT-3.5",
   },
   {
      title: "Learning Path Creator",
      content:
         "Create a comprehensive learning path for [SKILL/TOPIC].\n\nInclude:\n1. Prerequisites\n2. Week-by-week breakdown\n3. Resources (courses, books, articles)\n4. Practice projects\n5. Milestone assessments\n6. Estimated time commitment\n\nCurrent level: [Beginner/Intermediate/Advanced]",
      categories: ["Education", "Learning"],
      recommendedModel: "Claude Opus 4",
   },
   {
      title: "SQL Query Generator",
      content:
         "Generate an SQL query for the following requirement:\n\n[DESCRIBE REQUIREMENT]\n\nDatabase schema:\n[DESCRIBE TABLES AND COLUMNS]\n\nProvide:\n- Optimized SQL query\n- Explanation of the query\n- Performance considerations\n- Alternative approaches if applicable",
      categories: ["Development", "Database"],
      recommendedModel: "Claude Sonnet 4.5",
   },
   {
      title: "User Story Creator",
      content:
         "Create user stories for [FEATURE NAME].\n\nFormat each as:\n- As a [USER TYPE]\n- I want to [ACTION]\n- So that [BENEFIT]\n\nInclude:\n- Acceptance criteria\n- Edge cases\n- Technical considerations\n- Estimated complexity",
      categories: ["Agile", "Product Management"],
      recommendedModel: "GPT-4",
   },
   {
      title: "Bug Report Template",
      content:
         "Report a bug with the following details:\n\n**Title:** [Clear, concise title]\n\n**Environment:**\n- OS: [e.g., Windows 11, macOS 14]\n- Browser/App Version:\n- Device:\n\n**Steps to Reproduce:**\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\n**Expected Behavior:**\n[What should happen]\n\n**Actual Behavior:**\n[What actually happens]\n\n**Screenshots/Logs:**\n[Attach if available]\n\n**Severity:** [Critical/High/Medium/Low]",
      categories: ["Development", "QA"],
      recommendedModel: "GPT-4 Turbo",
   },
];

type TemplateSelectorProps = {
   onSelect: (template: DPromptTemplate) => void;
};

export const TemplateSelector: FC<TemplateSelectorProps> = ({ onSelect }) => {
   const [showTemplates, setShowTemplates] = useState(false);
   const [templateSearch, setTemplateSearch] = useState("");
   const [templateCategory, setTemplateCategory] = useState("all");

   const templateCategories = [
      ...new Set(PREDEFINED_PROMPTS.flatMap((t) => t.categories)),
   ].sort();

   const filteredTemplates = PREDEFINED_PROMPTS.filter((template) => {
      const matchesSearch =
         template.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
         template.content
            .toLowerCase()
            .includes(templateSearch.toLowerCase()) ||
         template.categories.some((cat: string) =>
            cat.toLowerCase().includes(templateSearch.toLowerCase())
         );
      const matchesCategory =
         templateCategory === "all" ||
         template.categories.includes(templateCategory);
      return matchesSearch && matchesCategory;
   });

   return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
         <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full flex items-center justify-between text-left"
         >
            <span className="font-medium text-blue-900">
               {showTemplates ? "📋 Hide Templates" : "📋 Start from Template"}
            </span>
            {showTemplates ? (
               <ChevronDown className="w-5 h-5 text-blue-900" />
            ) : (
               <ChevronRight className="w-5 h-5 text-blue-900" />
            )}
         </button>

         {showTemplates && (
            <div className="mt-4 space-y-4">
               {/* Template Filters */}
               <TemplateFilters
                  search={templateSearch}
                  setSearch={setTemplateSearch}
                  category={templateCategory}
                  setCategory={setTemplateCategory}
                  categories={templateCategories}
               />

               {/* Template Grid */}
               <TemplateCards
                  templates={filteredTemplates}
                  onSelect={(template) => {
                     onSelect(template);
                     setShowTemplates(false);
                     setTemplateSearch("");
                     setTemplateCategory("all");
                  }}
               />
            </div>
         )}
      </div>
   );
};
