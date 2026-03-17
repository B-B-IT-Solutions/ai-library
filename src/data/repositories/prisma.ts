import { ManagedIdentityCredential } from "@azure/identity";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = global as unknown as {
   prisma: PrismaClient;
};

export const extendsConfig = {};

const AZURE_TOKEN_SCOPE = "https://ossrdbms-aad.database.windows.net/.default";

const createAzureIdentityPool = (): Pool => {
   const clientId = process.env.AZURE_CLIENT_ID;
   const credential = new ManagedIdentityCredential({ clientId });

   console.log("process.env.USE_AZURE_IDENTITY");
   console.log(process.env.USE_AZURE_IDENTITY);
   console.log(credential);

   const url = new URL(process.env.DATABASE_URL!);

   return new Pool({
      host: url.hostname,
      port: parseInt(url.port || "5432"),
      database: url.pathname.slice(1),
      user: url.username,
      ssl: true,
      password: async () => {
         const tokenResponse = await credential.getToken(AZURE_TOKEN_SCOPE);
         return tokenResponse.token;
      },
   });
};

const createPrismaClient = (): PrismaClient => {
   if (process.env.USE_AZURE_IDENTITY === "true") {
      const pool = createAzureIdentityPool();
      const adapter = new PrismaPg(pool);
      return new PrismaClient({
         log: ["warn", "error"],
         adapter,
      }).$extends(extendsConfig) as unknown as PrismaClient;
   }

   return new PrismaClient().$extends(extendsConfig) as unknown as PrismaClient;
};

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
   globalForPrisma.prisma = prisma;
}

export default prisma;
