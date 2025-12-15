import prisma from "@/data/db/prisma";
import { Prisma, User } from "@/generated/prisma/client";

export const getUser = async (userId: string): Promise<User | null> => {
   return await prisma.user.findFirst({
      where: { id: userId },
   });
};

export const createUser = async (user: Prisma.UserCreateInput) => {
   return await prisma.user.create({
      data: {
         name: user.name,
         email: user.email,
         password: user.password,
      },
   });
};
