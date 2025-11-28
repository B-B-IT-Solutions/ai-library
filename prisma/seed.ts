import { forEach, map } from "es-toolkit/compat";

import { PrismaClient } from "../src/generated/prisma/client";

import { promptTemplatesData } from "./seed-data/prompt-templates";

const prisma = new PrismaClient();

export const main = async () => {
   console.log("Deleting obsolete entries...");
   await prisma.promptTemplate.deleteMany();

   console.log("Starting to seed...");

   forEach(promptTemplatesData, async (pt) => {
      const connectOrCreate = map(pt.categories, (cat: string) => {
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
               connectOrCreate: connectOrCreate,
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
