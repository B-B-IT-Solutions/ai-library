import {
   BookOpen,
   CheckCircle2,
   Code,
   FileText,
   Lightbulb,
   Settings,
   Sparkles,
   Target,
} from "lucide-react";

import type {
   Example,
   Feature,
   Instruction,
   ParsedProductContent,
   Placeholder,
   UseCase,
} from "../types";

/**
 * Extract features from template content
 * Looks for bullet points, numbered lists, and "Include:" patterns
 */
export const extractFeatures = (content: string): Feature[] => {
   const features: Feature[] = [];
   const lines = content.split("\n");

   // Icon mapping for common feature types
   const iconMap: Record<string, string> = {
      code: "Code",
      review: "CheckCircle2",
      documentation: "FileText",
      analysis: "Target",
      optimization: "Settings",
      best: "Sparkles",
      security: "Shield",
      performance: "Zap",
   };

   let includeSection = false;
   for (const line of lines) {
      const trimmed = line.trim();

      // Detect "Include:" or "Provides:" sections
      if (
         trimmed.toLowerCase().includes("include:") ||
         trimmed.toLowerCase().includes("provide")
      ) {
         includeSection = true;
         continue;
      }

      // Stop if we hit a different section
      if (trimmed.match(/^[A-Z][^:]*:$/) && !trimmed.includes("Include")) {
         includeSection = false;
      }

      // Extract bullet points
      if (trimmed.match(/^[-*•]\s+(.+)/) && features.length < 5) {
         const match = trimmed.match(/^[-*•]\s+(.+)/);
         if (match) {
            const text = match[1];
            const icon = getFeatureIcon(text, iconMap);
            features.push({
               icon,
               title: text.length > 50 ? text.substring(0, 47) + "..." : text,
               description: includeSection
                  ? "Included in this template"
                  : "Key capability",
            });
         }
      }

      // Extract numbered lists if in include section
      if (
         includeSection &&
         trimmed.match(/^\d+\.\s+(.+)/) &&
         features.length < 5
      ) {
         const match = trimmed.match(/^\d+\.\s+(.+)/);
         if (match) {
            const text = match[1];
            const icon = getFeatureIcon(text, iconMap);
            features.push({
               icon,
               title: text.length > 50 ? text.substring(0, 47) + "..." : text,
               description: "Included in this template",
            });
         }
      }
   }

   // If no features found, create generic ones from content
   if (features.length === 0) {
      features.push({
         icon: "Sparkles",
         title: "AI-Powered Template",
         description: "Optimized for language model interactions",
      });
      if (content.includes("[") || content.includes("{{")) {
         features.push({
            icon: "Settings",
            title: "Customizable",
            description: "Includes placeholders for your specific needs",
         });
      }
   }

   return features.slice(0, 5); // Max 5 features
};

/**
 * Get appropriate icon for a feature based on content
 */
const getFeatureIcon = (
   text: string,
   iconMap: Record<string, string>
): string => {
   const lowerText = text.toLowerCase();
   for (const [keyword, icon] of Object.entries(iconMap)) {
      if (lowerText.includes(keyword)) {
         return icon;
      }
   }
   return "Lightbulb"; // Default icon
};

/**
 * Extract use cases from categories and content
 */
export const extractUseCases = (
   content: string,
   categories: string[]
): UseCase[] => {
   const useCases: UseCase[] = [];

   // Create use cases from categories
   for (const category of categories) {
      useCases.push({
         category,
         description: `Ideal for ${category.toLowerCase()} tasks`,
         tags: [category],
      });
   }

   // Extract "for [purpose]" patterns from content
   const forPattern = /for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
   const matches = content.matchAll(forPattern);

   for (const match of matches) {
      const purpose = match[1];
      if (!useCases.some((uc) => uc.category === purpose)) {
         useCases.push({
            category: purpose,
            description: `Designed for ${purpose.toLowerCase()}`,
            tags: [purpose],
         });
      }
   }

   return useCases.slice(0, 6); // Max 6 use cases
};

/**
 * Extract examples from template content
 * Looks for [INSERT X] patterns or example sections
 */
export const extractExamples = (content: string): Example[] => {
   const examples: Example[] = [];
   const lines = content.split("\n");

   let inExampleSection = false;
   let currentExample: string[] = [];
   let exampleTitle = "";

   for (const line of lines) {
      const trimmed = line.trim();

      // Detect example sections
      if (
         trimmed.toLowerCase().includes("example") ||
         trimmed.toLowerCase().includes("sample")
      ) {
         if (currentExample.length > 0) {
            examples.push({
               title: exampleTitle || "Example",
               content: currentExample.join("\n"),
            });
            currentExample = [];
         }
         inExampleSection = true;
         exampleTitle = trimmed.replace(/[:#]/g, "").trim();
         continue;
      }

      // Collect example content
      if (inExampleSection) {
         if (trimmed === "" && currentExample.length > 0) {
            examples.push({
               title: exampleTitle || "Example",
               content: currentExample.join("\n"),
            });
            currentExample = [];
            inExampleSection = false;
         } else if (trimmed !== "") {
            currentExample.push(trimmed);
         }
      }
   }

   return examples.slice(0, 3); // Max 3 examples
};

/**
 * Extract step-by-step instructions from content
 */
export const extractInstructions = (content: string): Instruction[] => {
   const instructions: Instruction[] = [];
   const lines = content.split("\n");

   for (const line of lines) {
      const trimmed = line.trim();

      // Match numbered steps
      const match = trimmed.match(/^(\d+)\.\s+(.+)/);
      if (match) {
         const stepNumber = parseInt(match[1]);
         const stepText = match[2];

         instructions.push({
            step: stepNumber,
            title:
               stepText.length > 60
                  ? stepText.substring(0, 57) + "..."
                  : stepText,
            description: "",
         });
      }
   }

   // If no numbered steps found, provide generic instructions
   if (instructions.length === 0) {
      instructions.push(
         {
            step: 1,
            title: "Review the template content",
            description: "Familiarize yourself with the structure",
         },
         {
            step: 2,
            title: "Fill in the placeholders",
            description:
               "Replace bracketed text with your specific information",
         },
         {
            step: 3,
            title: "Adjust tone and style as needed",
            description: "Customize the template for your use case",
         },
         {
            step: 4,
            title: "Use with your AI assistant",
            description: "Copy and paste into your preferred AI tool",
         }
      );
   }

   return instructions;
};

/**
 * Extract placeholders from template content
 */
export const extractPlaceholders = (content: string): Placeholder[] => {
   const placeholders: Placeholder[] = [];
   const bracketPattern = /\[([^\]]+)\]/g;
   const bracePattern = /\{\{([^}]+)\}\}/g;

   // Find bracket placeholders
   let match;
   while ((match = bracketPattern.exec(content)) !== null) {
      placeholders.push({
         name: match[1],
         position: match.index,
      });
   }

   // Find brace placeholders
   while ((match = bracePattern.exec(content)) !== null) {
      placeholders.push({
         name: match[1],
         position: match.index,
      });
   }

   return placeholders;
};

/**
 * Parse all content and return structured data
 */
export const parseProductContent = (
   content: string,
   categories: string[]
): ParsedProductContent => {
   return {
      features: extractFeatures(content),
      useCases: extractUseCases(content, categories),
      examples: extractExamples(content),
      instructions: extractInstructions(content),
      placeholders: extractPlaceholders(content),
   };
};
