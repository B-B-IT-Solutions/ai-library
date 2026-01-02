import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = global as unknown as {
   prisma: PrismaClient;
};

export const extendsConfig = {};

const prisma =
   globalForPrisma.prisma || new PrismaClient().$extends(extendsConfig);

if (process.env.NODE_ENV !== "production") {
   globalForPrisma.prisma = prisma;
}

export default prisma;
