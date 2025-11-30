import { forEach, map } from "es-toolkit/compat";

import { Prisma, PrismaClient } from "@/generated/prisma/client";

import { promptTemplatesData } from "./seed-data/prompt-templates";

const prisma = new PrismaClient();

export const main = async () => {
   console.log("Deleting obsolete entries...");

   await prisma.promptTemplate.deleteMany();
   await prisma.promptTemplateCategory.deleteMany();

   console.log("Starting to seed...");

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

   forEach(promptTemplatesData, async (pt) => {
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

      await prisma.promptTemplate.create({
         data: {
            ...pt,
            categories: {
               connectOrCreate: connect,
            },
         },
      });
   });

   console.log("Seeding finished.");
};

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
