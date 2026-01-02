import { forEach, map } from "es-toolkit/compat";

import { Prisma, PrismaClient } from "@/generated/prisma/client";

import { bundlesData } from "./seed-data/bundles";
import { templateProductMetadata } from "./seed-data/product-metadata";
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
            features: {
               create: templateProductMetadata.features,
            },
            useCases: {
               create: templateProductMetadata.getUseCases(template.title),
            },
            examples: {
               create: templateProductMetadata.examples,
            },
            instructions: {
               create: templateProductMetadata.instructions,
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

   for (const bundleConfig of bundlesData) {
      const bundleTemplates = createdTemplates.filter((t) =>
         bundleConfig.templateTitles.includes(t.title)
      );

      const bundle = await prisma.product.create({
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
      console.log(`Created bundle: ${bundle.name} ($${bundle.price})`);
   }

   console.log("\n✅ Seeding finished successfully!");
   console.log(`\nSummary:`);
   console.log(`- ${createdTemplates.length} templates`);
   console.log(`- ${createdTemplates.length} individual products`);
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
