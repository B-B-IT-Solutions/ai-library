import { PrismaClient } from "../src/generated/prisma/client";

import { initCatalogData } from "./seeds/catalog";
import { initSubscriptionPlansData } from "./seeds/subscription-plans";

const prisma = new PrismaClient();

export const main = async () => {
   console.log("\nStarting data inserts\n====================================");

   await initSubscriptionPlansData(prisma);
   await initCatalogData(prisma);

   console.log("====================================\nData inserts completed");
};

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
