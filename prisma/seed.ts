import { PrismaClient } from "@/generated/prisma/client";

import { bundlesData } from "./seed-data/bundles";
import { templateProductMetadata } from "./seed-data/product-metadata";
import { promptTemplatesData } from "./seed-data/prompt-templates";

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

   console.log("Starting to seed...");

   // Seed prompt templates
   const createdTemplateDesciptors = [];
   for (const pt of promptTemplatesData) {
      const templateDescriptor = await prisma.promptTemplateDescriptor.create({
         data: pt,
         include: {
            promptTemplate: true,
         },
      });

      createdTemplateDesciptors.push(templateDescriptor);
      console.log(`Created template: ${templateDescriptor.title}`);
   }

   console.log("\nCreating products...");

   // Create individual template products with sample metadata
   for (const descriptor of createdTemplateDesciptors) {
      const product = await prisma.product.create({
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
      console.log(`Created product: ${product.name} ($${product.price})`);
   }

   // Create bundle products
   console.log("\nCreating bundles...");

   for (const bundleConfig of bundlesData) {
      const bundleTemplates = createdTemplateDesciptors.filter((t) =>
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
   console.log(`- ${createdTemplateDesciptors.length} templates`);
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
