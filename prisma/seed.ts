import { forEach, map } from "es-toolkit/compat";

import { Prisma, PrismaClient } from "@/generated/prisma/client";

import { promptTemplatesData } from "./seed-data/prompt-templates";

const prisma = new PrismaClient();

export const main = async () => {
   console.log("Deleting obsolete entries...");

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

   // Create individual template products
   for (const template of createdTemplates) {
      const product = await prisma.product.create({
         data: {
            name: template.title,
            description: `Get access to the "${template.title}" template. ${template.content.substring(0, 100)}...`,
            price: 9.99,
            type: "TEMPLATE",
            status: "ACTIVE",
            templateId: template.id,
         },
      });
      console.log(`Created product: ${product.name} ($${product.price})`);
   }

   // Create bundle products
   console.log("\nCreating bundles...");

   // Developer Bundle
   const devTemplates = createdTemplates.filter((t) =>
      ["Code Review Assistant", "SQL Query Generator", "Bug Report Template"].includes(
         t.title
      )
   );
   const devBundle = await prisma.product.create({
      data: {
         name: "Developer Essentials Bundle",
         description:
            "Complete toolkit for developers including code review, SQL generation, and bug reporting templates. Save 30%!",
         price: 19.99,
         type: "BUNDLE",
         status: "ACTIVE",
         bundleItems: {
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
   const contentBundle = await prisma.product.create({
      data: {
         name: "Content Creator Pro Bundle",
         description:
            "Everything you need for content creation: blog posts, documentation, and professional emails. Save 25%!",
         price: 22.99,
         type: "BUNDLE",
         status: "ACTIVE",
         bundleItems: {
            create: contentTemplates.map((t) => ({
               templateId: t.id,
            })),
         },
      },
   });
   console.log(`Created bundle: ${contentBundle.name} ($${contentBundle.price})`);

   // Business Productivity Bundle
   const businessTemplates = createdTemplates.filter((t) =>
      [
         "Meeting Notes Summarizer",
         "User Story Creator",
         "Email Response Generator",
      ].includes(t.title)
   );
   const businessBundle = await prisma.product.create({
      data: {
         name: "Business Productivity Bundle",
         description:
            "Boost your productivity with meeting summaries, user stories, and professional communication templates.",
         price: 21.99,
         type: "BUNDLE",
         status: "ACTIVE",
         bundleItems: {
            create: businessTemplates.map((t) => ({
               templateId: t.id,
            })),
         },
      },
   });
   console.log(
      `Created bundle: ${businessBundle.name} ($${businessBundle.price})`
   );

   // Create subscription plans
   console.log("\nCreating subscription plans...");

   const monthlySubscription = await prisma.product.create({
      data: {
         name: "Monthly All-Access Pass",
         description:
            "Get unlimited access to all templates for 30 days. Perfect for trying out the platform!",
         price: 29.99,
         type: "SUBSCRIPTION",
         status: "ACTIVE",
         subscriptionDuration: 30,
      },
   });
   console.log(
      `Created subscription: ${monthlySubscription.name} ($${monthlySubscription.price})`
   );

   const yearlySubscription = await prisma.product.create({
      data: {
         name: "Annual All-Access Pass",
         description:
            "Unlimited access to all templates for a full year. Best value - save 40%!",
         price: 199.99,
         type: "SUBSCRIPTION",
         status: "ACTIVE",
         subscriptionDuration: 365,
      },
   });
   console.log(
      `Created subscription: ${yearlySubscription.name} ($${yearlySubscription.price})`
   );

   console.log("\n✅ Seeding finished successfully!");
   console.log(`\nSummary:`);
   console.log(`- ${createdTemplates.length} templates`);
   console.log(`- ${createdTemplates.length} individual products`);
   console.log(`- 3 bundles`);
   console.log(`- 2 subscription plans`);
};

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
