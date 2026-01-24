import { PrismaClient } from "@/generated/prisma/client";

import { bundlesData } from "./seed-data/bundles";
import { templateProductMetadata } from "./seed-data/product-metadata";
import { promptTemplatesData } from "./seed-data/prompt-templates";
import { promptsData } from "./seed-data/prompts";
import { subscriptionPlansData } from "./seed-data/subscription-plans";

const prisma = new PrismaClient();

export const main = async () => {
   console.log("Deleting obsolete entries...");

   await prisma.productItem.deleteMany();
   await prisma.product.deleteMany();
   await prisma.promptTemplate.deleteMany();
   await prisma.promptTemplateDescriptor.deleteMany();
   await prisma.promptTemplateCategory.deleteMany();
   await prisma.prompt.deleteMany();
   await prisma.promptDescriptor.deleteMany();
   await prisma.promptCategory.deleteMany();
   await prisma.subscriptionPlan.deleteMany();

   console.log("Starting data inserts...");

   console.log("\nCreating subscription plans...");
   for (const plan of subscriptionPlansData) {
      await prisma.subscriptionPlan.create({
         data: plan,
      });
   }

   console.log("\nCreating prompt templates...");

   const createdTemplateDesciptors = [];
   for (const pt of promptTemplatesData) {
      const templateDescriptor = await prisma.promptTemplateDescriptor.create({
         data: pt,
         include: {
            promptTemplate: true,
         },
      });

      createdTemplateDesciptors.push(templateDescriptor);
   }

   console.log("\nCreating prompts...");
   const createdPrompts = [];
   for (const pt of promptsData) {
      const promptDescriptor = await prisma.promptDescriptor.create({
         data: pt,
      });

      createdPrompts.push(promptDescriptor);
   }

   console.log("\nCreating products...");

   // Create individual template products with sample metadata
   for (const descriptor of createdTemplateDesciptors) {
      await prisma.product.create({
         data: {
            name: descriptor.title,
            description: descriptor.description,
            price: 1.99,
            type: "TEMPLATE",
            status: "ACTIVE",
            features: {
               create: templateProductMetadata.features,
            },
            useCases: {
               create: templateProductMetadata.getUseCases(descriptor.title),
            },
            examples: {
               create: templateProductMetadata.examples,
            },
            instructions: {
               create: templateProductMetadata.instructions,
            },
            productItems: {
               create: {
                  templateId: descriptor.id,
               },
            },
         },
      });
   }

   // Create bundle products
   console.log("\nCreating bundles...");

   for (const bundleConfig of bundlesData) {
      const bundleTemplates = createdTemplateDesciptors.filter((t) =>
         bundleConfig.templateTitles.includes(t.title)
      );

      await prisma.product.create({
         data: {
            name: bundleConfig.name,
            description: bundleConfig.description,
            price: bundleConfig.price,
            type: "BUNDLE",
            status: "ACTIVE",
            discountAmount: bundleConfig.discountAmount,
            features: {
               create: bundleConfig.features,
            },
            useCases: {
               create: bundleConfig.useCases,
            },
            instructions: {
               create: bundleConfig.instructions,
            },
            productItems: {
               create: bundleTemplates.map((t) => ({
                  templateId: t.id,
               })),
            },
         },
      });
   }

   console.log("\n✅ Data inserts finished successfully!");
   console.log(`\nSummary:`);
   console.log(`- ${subscriptionPlansData.length} subscription plans`);
   console.log(`- ${createdTemplateDesciptors.length} templates`);
   console.log(`- ${createdPrompts.length} prompts`);
   console.log(`- ${createdTemplateDesciptors.length} individual products`);
   console.log(`- ${bundlesData.length} bundles`);
};

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
