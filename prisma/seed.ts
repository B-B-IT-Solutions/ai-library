import { forEach, map } from "es-toolkit/compat";

import { Prisma, PrismaClient } from "@/generated/prisma/client";

import { promptTemplatesData } from "./seed-data/prompt-templates";

const prisma = new PrismaClient();

export const main = async () => {
   console.log("Deleting obsolete entries...");

   await prisma.productItem.deleteMany();
   await prisma.product.deleteMany();
   await prisma.promptTemplate.deleteMany();
   await prisma.promptTemplateCategory.deleteMany();

   console.log("Starting to seed...");

   // Seed categories
   forEach(promptTemplatesData, async (pt) => {
      forEach(pt.categories, async (cat: string) => {
         await prisma.promptTemplateCategory.upsert({
            where: {
               name: cat,
            },
            create: {
               name: cat,
            },
            update: {
               name: cat,
            },
         });
      });
   });

   // Seed prompt templates
   const createdTemplates = [];
   for (const pt of promptTemplatesData) {
      const connect: Prisma.PromptTemplateCategoryCreateOrConnectWithoutPromptsInput[] =
         map(pt.categories, (cat: string) => {
            return {
               where: {
                  name: cat,
               },
               create: {
                  name: cat,
               },
            };
         });

      const template = await prisma.promptTemplate.create({
         data: {
            ...pt,
            categories: {
               connectOrCreate: connect,
            },
         },
      });

      createdTemplates.push(template);
      console.log(`Created template: ${template.title}`);
   }

   console.log("\nCreating products...");

   // Create individual template products with sample metadata
   for (const template of createdTemplates) {
      const product = await prisma.product.create({
         data: {
            name: template.title,
            description: `Get access to the "${
               template.title
            }" template. ${template.content.substring(0, 100)}...`,
            price: 9.99,
            type: "TEMPLATE",
            status: "ACTIVE",
            // Sample metadata as related records
            features: {
               create: [
                  {
                     icon: "Sparkles",
                     title: "AI-Powered",
                     description:
                        "Optimized for modern AI models like Claude and GPT",
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
                     description:
                        "Structured prompts for consistent, high-quality output",
                     order: 2,
                  },
               ],
            },
            useCases: {
               create: [
                  {
                     category: "Development",
                     description: `Use ${template.title} to streamline your workflow`,
                     tags: ["productivity", "automation"],
                     order: 0,
                  },
               ],
            },
            examples: {
               create: [
                  {
                     title: "Quick Start Example",
                     content: "See template content for detailed examples",
                     order: 0,
                  },
               ],
            },
            instructions: {
               create: [
                  {
                     step: 1,
                     title: "Copy Template",
                     description: "Copy the template content to your clipboard",
                  },
                  {
                     step: 2,
                     title: "Customize Variables",
                     description:
                        "Replace placeholders with your specific information",
                  },
                  {
                     step: 3,
                     title: "Run Prompt",
                     description:
                        "Paste into your AI assistant and get results",
                  },
                  {
                     step: 4,
                     title: "Refine Output",
                     description: "Adjust the prompt based on your needs",
                  },
               ],
            },
            productItems: {
               create: {
                  templateId: template.id,
               },
            },
         },
      });
      console.log(`Created product: ${product.name} ($${product.price})`);
   }

   // Create bundle products
   console.log("\nCreating bundles...");

   // Developer Bundle
   const devTemplates = createdTemplates.filter((t) =>
      [
         "Code Review Assistant",
         "SQL Query Generator",
         "Bug Report Template",
      ].includes(t.title)
   );

   // Calculate Developer Bundle savings
   const devBundlePrice = 19.99;
   const devOriginalPrice = 9.99 * devTemplates.length; // $29.97
   const devDiscountAmount = devOriginalPrice - devBundlePrice; // $9.98

   const devBundle = await prisma.product.create({
      data: {
         name: "Developer Essentials Bundle",
         description:
            "Complete toolkit for developers including code review, SQL generation, and bug reporting templates. Save 30%!",
         price: devBundlePrice,
         type: "BUNDLE",
         status: "ACTIVE",

         discountAmount: devDiscountAmount,
         originalPrice: devOriginalPrice,

         // Sample metadata as related records
         features: {
            create: [
               {
                  icon: "Code2",
                  title: "Complete Dev Toolkit",
                  description:
                     "Everything you need for modern software development",
                  order: 0,
               },
               {
                  icon: "GitBranch",
                  title: "Code Review Ready",
                  description:
                     "Professional templates for code reviews and feedback",
                  order: 1,
               },
               {
                  icon: "Database",
                  title: "SQL Generation",
                  description:
                     "Create optimized SQL queries with AI assistance",
                  order: 2,
               },
               {
                  icon: "Bug",
                  title: "Bug Tracking",
                  description: "Structured bug reports that developers love",
                  order: 3,
               },
            ],
         },
         useCases: {
            create: [
               {
                  category: "Software Development",
                  description: "Streamline code reviews and quality assurance",
                  tags: ["code-review", "quality", "collaboration"],
                  order: 0,
               },
               {
                  category: "Database Management",
                  description: "Generate complex SQL queries efficiently",
                  tags: ["database", "sql", "queries"],
                  order: 1,
               },
               {
                  category: "Bug Reporting",
                  description: "Create detailed, actionable bug reports",
                  tags: ["debugging", "testing", "qa"],
                  order: 2,
               },
            ],
         },
         instructions: {
            create: [
               {
                  step: 1,
                  title: "Choose a Template",
                  description:
                     "Select the template that fits your current task",
               },
               {
                  step: 2,
                  title: "Customize for Your Project",
                  description:
                     "Adapt the template to your specific project needs",
               },
               {
                  step: 3,
                  title: "Generate with AI",
                  description: "Use your AI assistant to process the prompt",
               },
               {
                  step: 4,
                  title: "Integrate Results",
                  description: "Apply the output to your development workflow",
               },
            ],
         },

         productItems: {
            create: devTemplates.map((t) => ({
               templateId: t.id,
            })),
         },
      },
   });
   console.log(`Created bundle: ${devBundle.name} ($${devBundle.price})`);

   // Content Creator Bundle
   const contentTemplates = createdTemplates.filter((t) =>
      [
         "Blog Post Outliner",
         "Technical Documentation Writer",
         "Email Response Generator",
      ].includes(t.title)
   );

   // Calculate Content Creator Bundle savings
   const contentBundlePrice = 22.99;
   const contentIndividualPrice = 9.99 * contentTemplates.length; // $29.97
   const contentSavings = contentIndividualPrice - contentBundlePrice; // $6.98

   const contentBundle = await prisma.product.create({
      data: {
         name: "Content Creator Pro Bundle",
         description:
            "Everything you need for content creation: blog posts, documentation, and professional emails. Save 25%!",
         price: contentBundlePrice,
         type: "BUNDLE",
         status: "ACTIVE",

         // Bundle savings fields
         discountAmount: contentSavings,
         originalPrice: contentIndividualPrice,

         // Sample metadata as related records
         features: {
            create: [
               {
                  icon: "FileText",
                  title: "Content Creation Suite",
                  description:
                     "Complete toolkit for professional content creation",
                  order: 0,
               },
               {
                  icon: "BookOpen",
                  title: "Technical Documentation",
                  description: "Create clear, comprehensive technical docs",
                  order: 1,
               },
               {
                  icon: "Mail",
                  title: "Professional Emails",
                  description: "Craft polished, effective email responses",
                  order: 2,
               },
               {
                  icon: "PenTool",
                  title: "Blog Writing",
                  description: "Structured outlines for engaging blog posts",
                  order: 3,
               },
            ],
         },
         useCases: {
            create: [
               {
                  category: "Content Writing",
                  description: "Create engaging blog posts and articles",
                  tags: ["blogging", "writing", "content"],
                  order: 0,
               },
               {
                  category: "Documentation",
                  description: "Write clear technical documentation",
                  tags: ["docs", "technical-writing", "guides"],
                  order: 1,
               },
               {
                  category: "Communication",
                  description:
                     "Professional email responses and correspondence",
                  tags: ["email", "communication", "business"],
                  order: 2,
               },
            ],
         },
         instructions: {
            create: [
               {
                  step: 1,
                  title: "Select Content Type",
                  description: "Choose the template for your content needs",
               },
               {
                  step: 2,
                  title: "Define Your Topic",
                  description:
                     "Specify your subject matter and target audience",
               },
               {
                  step: 3,
                  title: "Generate Content",
                  description: "Use AI to create your first draft",
               },
               {
                  step: 4,
                  title: "Edit and Publish",
                  description: "Refine the output and publish your content",
               },
            ],
         },

         productItems: {
            create: contentTemplates.map((t) => ({
               templateId: t.id,
            })),
         },
      },
   });
   console.log(
      `Created bundle: ${contentBundle.name} ($${contentBundle.price})`
   );

   // Business Productivity Bundle
   const businessTemplates = createdTemplates.filter((t) =>
      [
         "Meeting Notes Summarizer",
         "User Story Creator",
         "Email Response Generator",
      ].includes(t.title)
   );
   // Calculate Business Productivity Bundle savings
   const businessBundlePrice = 21.99;
   const businessIndividualPrice = 9.99 * businessTemplates.length; // $29.97
   const businessSavings = businessIndividualPrice - businessBundlePrice; // $7.98

   const businessBundle = await prisma.product.create({
      data: {
         name: "Business Productivity Bundle",
         description:
            "Boost your productivity with meeting summaries, user stories, and professional communication templates.",
         price: businessBundlePrice,
         type: "BUNDLE",
         status: "ACTIVE",

         // Bundle savings fields
         discountAmount: businessSavings,
         originalPrice: businessIndividualPrice,

         // Sample metadata as related records
         features: {
            create: [
               {
                  icon: "Briefcase",
                  title: "Business Productivity",
                  description: "Essential tools for modern business operations",
                  order: 0,
               },
               {
                  icon: "Users",
                  title: "Meeting Management",
                  description:
                     "Transform meeting notes into actionable summaries",
                  order: 1,
               },
               {
                  icon: "ListTodo",
                  title: "User Story Creation",
                  description: "Generate clear, comprehensive user stories",
                  order: 2,
               },
               {
                  icon: "MessageSquare",
                  title: "Professional Communication",
                  description:
                     "Polished email responses and business correspondence",
                  order: 3,
               },
            ],
         },
         useCases: {
            create: [
               {
                  category: "Meeting Management",
                  description: "Summarize meetings and extract action items",
                  tags: ["meetings", "notes", "productivity"],
                  order: 0,
               },
               {
                  category: "Agile Development",
                  description: "Create well-structured user stories",
                  tags: ["agile", "user-stories", "requirements"],
                  order: 1,
               },
               {
                  category: "Business Communication",
                  description: "Professional email templates and responses",
                  tags: ["email", "business", "communication"],
                  order: 2,
               },
            ],
         },
         instructions: {
            create: [
               {
                  step: 1,
                  title: "Choose Your Tool",
                  description: "Select the template that matches your task",
               },
               {
                  step: 2,
                  title: "Input Your Data",
                  description: "Provide the necessary context and information",
               },
               {
                  step: 3,
                  title: "Generate Output",
                  description: "Let AI create your structured output",
               },
               {
                  step: 4,
                  title: "Apply to Work",
                  description: "Use the output in your business workflow",
               },
            ],
         },

         productItems: {
            create: businessTemplates.map((t) => ({
               templateId: t.id,
            })),
         },
      },
   });
   console.log(
      `Created bundle: ${businessBundle.name} ($${businessBundle.price})`
   );

   console.log("\n✅ Seeding finished successfully!");
   console.log(`\nSummary:`);
   console.log(`- ${createdTemplates.length} templates`);
   console.log(`- ${createdTemplates.length} individual products`);
   console.log(`- 3 bundles`);
};

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
