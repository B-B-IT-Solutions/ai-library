import prisma from "@/data/db/prisma";
import { Prisma, User } from "@/generated/prisma/client";
import { UserWhereInput } from "@/generated/prisma/models";

type PGeUserParams = {
   userId?: string;
   email?: string;
};

export const getUserById = async (userId: string): Promise<User | null> => {
   return getUser({ userId });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
   return getUser({ email });
};

export const getUser = async (params: PGeUserParams): Promise<User | null> => {
   const whereClause = resolveGetUserParams(params);

   if (whereClause) {
      return await prisma.user.findFirst({
         where: whereClause,
      });
   }
   return null;
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

const resolveGetUserParams = (
   params: PGeUserParams
): UserWhereInput | undefined => {
   const { userId, email } = params;

   if (userId) {
      return { id: userId };
   }
   if (email) {
      return { email: email };
   }
   return undefined;
};
