import { Prisma } from "@/generated/prisma/client";

/**
 * Reusable product metadata for individual template products
 */
export const templateProductMetadata = {
   features: [
      {
         icon: "Sparkles",
         title: "AI-Powered",
         description: "Optimized for modern AI models like Claude and GPT",
         order: 0,
      },
      {
         icon: "Zap",
         title: "Quick Setup",
         description: "Ready to use with minimal configuration",
         order: 1,
      },
      {
         icon: "Target",
         title: "Precise Results",
         description: "Structured prompts for consistent, high-quality output",
         order: 2,
      },
   ] as Prisma.ProductFeatureCreateWithoutProductInput[],

   getUseCases: (templateTitle: string) =>
      [
         {
            category: "Development",
            description: `Use ${templateTitle} to streamline your workflow`,
            tags: ["productivity", "automation"],
            order: 0,
         },
      ] as Prisma.ProductUseCaseCreateWithoutProductInput[],

   examples: [
      {
         title: "Quick Start Example",
         content: "See template content for detailed examples",
         order: 0,
      },
   ] as Prisma.ProductExampleCreateWithoutProductInput[],

   instructions: [
      {
         step: 1,
         title: "Copy Template",
         description: "Copy the template content to your clipboard",
      },
      {
         step: 2,
         title: "Customize Variables",
         description: "Replace placeholders with your specific information",
      },
      {
         step: 3,
         title: "Run Prompt",
         description: "Paste into your AI assistant and get results",
      },
      {
         step: 4,
         title: "Refine Output",
         description: "Adjust the prompt based on your needs",
      },
   ] as Prisma.ProductInstructionCreateWithoutProductInput[],
};
