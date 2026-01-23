import { DbClient } from "@/data/types/db/common";
import { UserUpdateData } from "@/data/types/db/user";
import { User } from "@/generated/prisma/client";
import { UserCreateInput, UserWhereInput } from "@/generated/prisma/models";

type PGeUserParams = {
   userId?: string;
   email?: string;
};

export class UserRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetUserById(userId: string): Promise<User | null> {
      return this.pGetUser({ userId });
   }

   async pGetUserByEmail(email: string): Promise<User | null> {
      return this.pGetUser({ email });
   }

   async pGetUser(params: PGeUserParams): Promise<User | null> {
      const whereClause = this.resolveGetUserParams(params);

      if (whereClause) {
         return await this.prisma.user.findFirst({
            where: whereClause,
         });
      }
      return null;
   }

   async pCreateUser(user: UserCreateInput) {
      return await this.prisma.user.create({
         data: {
            name: user.name,
            email: user.email,
            password: user.password,
         },
      });
   }

   async pUpdateUser(userId: string, data: UserUpdateData) {
      return await this.prisma.user.update({
         where: { id: userId },
         data: data,
      });
   }

   async pUpdatePassword(userId: string, newPasswordHash: string) {
      return await this.prisma.user.update({
         where: { id: userId },
         data: { password: newPasswordHash },
      });
   }

   async pHardDeleteUser(userId: string) {
      return await this.prisma.$transaction(async (tx) => {
         // Delete in dependency order
         await tx.session.deleteMany({ where: { userId } });
         await tx.cart.deleteMany({ where: { userId } });
         await tx.libraryEntry.deleteMany({ where: { userId } });
         await tx.order.deleteMany({ where: { userId } });
         await tx.account.deleteMany({ where: { userId } });
         await tx.user.delete({ where: { id: userId } });
      });
   }

   private resolveGetUserParams(
      params: PGeUserParams
   ): UserWhereInput | undefined {
      const { userId, email } = params;

      if (userId) {
         return { id: userId };
      }
      if (email) {
         return { email: email };
      }
      return undefined;
   }
}
