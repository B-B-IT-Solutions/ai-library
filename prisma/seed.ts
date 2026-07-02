import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

import { initCatalogData } from "./seeds/catalog";
import { initSubscriptionPlansData } from "./seeds/subscription-plans";

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
