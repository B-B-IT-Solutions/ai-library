import { addDays } from "date-fns";

import { PrismaClient } from "@/generated/prisma/client";
import { bundlesData } from "../x_utils/data-dev/bundles";
import { templateProductMetadata } from "../x_utils/data-dev/product-metadata";
import { promptsWithFields } from "../x_utils/data-dev/prompt-fields";
import {
   promptsData,
   SEED_ADMIN_EMAIL,
   SEED_USER_EMAIL,
} from "../x_utils/data-dev/prompts";

import { seedCatalog } from "./seeds/catalog.data";
import { subscriptionPlansData } from "./seeds/subscription-plans.data";

const prisma = new PrismaClient();

export const main = async () => {
   console.log("Deleting obsolete entries...");

   await prisma.orderItem.deleteMany();
   await prisma.cartItem.deleteMany();
   await prisma.productItem.deleteMany();
   await prisma.product.deleteMany();
   await prisma.promptField.deleteMany();
   await prisma.promptContent.deleteMany();
   await prisma.prompt.deleteMany();
   await prisma.promptCategory.deleteMany();
   await prisma.prompt0Content.deleteMany();
   await prisma.prompt0.deleteMany();
   await prisma.prompt0Category.deleteMany();
   await prisma.subscriptionPlan.deleteMany();

   console.log("Starting data inserts...");

   console.log("\nCreating subscription plans...");
   for (const plan of subscriptionPlansData) {
      await prisma.subscriptionPlan.create({
         data: plan,
      });
   }

   console.log("\nCreating ADMIN user...");
   const adminUser = await prisma.user.upsert({
      where: { email: SEED_ADMIN_EMAIL },
      update: {},
      create: { email: SEED_ADMIN_EMAIL, name: "admin 1", role: "ADMIN" },
   });

   console.log("\nCreating user...");
   const user = await prisma.user.upsert({
      where: { email: SEED_USER_EMAIL },
      update: {},
      create: {
         email: SEED_USER_EMAIL,
         name: "test 1",
         trialEndsAt: addDays(new Date(), 14),
      },
   });

   console.log("\nCreating prompt templates...");

   const createdTemplateDesciptors = [];
   for (const pt of promptsData(user.id)) {
      const templateDescriptor = await prisma.prompt.create({
         data: pt,
         include: {
            content: true,
         },
      });

      createdTemplateDesciptors.push(templateDescriptor);
   }

   console.log("\nCreating prompt templates with fields...");
   for (const pt of promptsWithFields(user.id)) {
      const templateDescriptor = await prisma.prompt.create({
         data: pt,
         include: {
            content: true,
            fields: true,
         },
      });

      createdTemplateDesciptors.push(templateDescriptor);
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

   await seedCatalog(prisma);

   console.log("\n✅ Data inserts finished successfully!");
   console.log(`\nSummary:`);
   console.log(`- ${subscriptionPlansData.length} subscription plans`);
   console.log(`- ${createdTemplateDesciptors.length} templates`);
   console.log(`- ${createdTemplateDesciptors.length} individual products`);
};

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
