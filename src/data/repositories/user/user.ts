import prisma from "@/data/repositories/prisma";
import { UserUpdateData } from "@/data/types/db/user";
import { User } from "@/generated/prisma/client";
import { UserCreateInput, UserWhereInput } from "@/generated/prisma/models";

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

export const createUser = async (user: UserCreateInput) => {
   return await prisma.user.create({
      data: {
         name: user.name,
         email: user.email,
         password: user.password,
      },
   });
};

export const updateUser = async (userId: string, data: UserUpdateData) => {
   return await prisma.user.update({
      where: { id: userId },
      data: data,
   });
};

export const changePassword = async (userId: string, newPasswordHash: string) => {
   return await prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
   });
};

export const hardDeleteUser = async (userId: string) => {
   return await prisma.$transaction(async (tx) => {
      // Delete in dependency order
      await tx.session.deleteMany({ where: { userId } });
      await tx.cart.deleteMany({ where: { userId } });
      await tx.libraryEntry.deleteMany({ where: { userId } });
      await tx.order.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
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
