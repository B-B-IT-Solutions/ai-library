import type { ContentSection, FormattedLine } from "../types";

/**
 * Detect the type of a line based on its content
 */
export const detectLineType = (
   line: string
): "heading" | "list" | "placeholder" | "code" | "text" => {
   const trimmed = line.trim();

   // Heading: starts with # or ends with :
   if (trimmed.match(/^#+\s/) || trimmed.match(/^[A-Z][^:]*:$/)) {
      return "heading";
   }

   // List item: starts with -, *, or number
   if (trimmed.match(/^[-*•]\s/) || trimmed.match(/^\d+\.\s/)) {
      return "list";
   }

   // Placeholder: contains [BRACKETS] or {{braces}}
   if (trimmed.match(/\[[A-Z\s]+\]/) || trimmed.match(/\{\{[^}]+\}\}/)) {
      return "placeholder";
   }

   // Code: indented with spaces or tabs, or in backticks
   if (
      trimmed.match(/^    /) ||
      trimmed.match(/^```/) ||
      trimmed.match(/`[^`]+`/)
   ) {
      return "code";
   }

   return "text";
};

/**
 * Get CSS class for a line type
 */
export const getLineClassName = (
   type: "heading" | "list" | "placeholder" | "code" | "text"
): string => {
   const classMap = {
      heading: "text-indigo-600 font-semibold text-base",
      list: "text-slate-700",
      placeholder: "text-slate-700",
      code: "font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-sm",
      text: "text-slate-700",
   };

   return classMap[type];
};

/**
 * Highlight placeholders and variables in a line
 */
export const highlightPlaceholdersInLine = (line: string): string => {
   // Highlight [BRACKETS]
   let highlighted = line.replace(
      /\[([A-Z\s_]+)\]/g,
      '<span class="text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-medium">[$1]</span>'
   );

   // Highlight {{braces}}
   highlighted = highlighted.replace(
      /\{\{([^}]+)\}\}/g,
      '<span class="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">{{$1}}</span>'
   );

   // Highlight inline code `backticks`
   highlighted = highlighted.replace(
      /`([^`]+)`/g,
      '<code class="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm">$1</code>'
   );

   return highlighted;
};

/**
 * Format template content into structured lines
 */
export const formatTemplateContent = (content: string): FormattedLine[] => {
   const lines = content.split("\n");
   const formattedLines: FormattedLine[] = [];

   lines.forEach((line, index) => {
      const type = detectLineType(line);
      const className = getLineClassName(type);

      formattedLines.push({
         lineNumber: index + 1,
         content: line,
         type,
         className,
      });
   });

   return formattedLines;
};

/**
 * Create collapsible sections from formatted lines
 */
export const createContentSections = (
   formattedLines: FormattedLine[],
   maxLinesBeforeCollapse: number = 20
): ContentSection[] => {
   const sections: ContentSection[] = [];
   let currentSection: FormattedLine[] = [];
   let currentTitle = "Template Content";

   formattedLines.forEach((line, index) => {
      // Start new section on headings
      if (line.type === "heading") {
         if (currentSection.length > 0) {
            sections.push({
               title: currentTitle,
               lines: currentSection,
               collapsible: currentSection.length > maxLinesBeforeCollapse,
               collapsed: currentSection.length > maxLinesBeforeCollapse,
            });
         }
         currentSection = [line];
         currentTitle = line.content
            .replace(/^#+\s*/, "")
            .replace(/:$/, "")
            .trim();
      } else {
         currentSection.push(line);
      }
   });

   // Add the last section
   if (currentSection.length > 0) {
      sections.push({
         title: currentTitle,
         lines: currentSection,
         collapsible: currentSection.length > maxLinesBeforeCollapse,
         collapsed: false, // Last section stays open
      });
   }

   // If no sections created (no headings), create one section
   if (sections.length === 0) {
      sections.push({
         title: "Template Content",
         lines: formattedLines,
         collapsible: formattedLines.length > maxLinesBeforeCollapse,
         collapsed: false,
      });
   }

   return sections;
};

/**
 * Add line numbers to formatted content
 */
export const addLineNumbers = (line: FormattedLine): string => {
   const lineNum = line.lineNumber.toString().padStart(3, " ");
   return `<span class="text-slate-400 select-none mr-4 font-mono text-xs">${lineNum}</span>`;
};
