import { DbClient } from "@/data/types/db/common";
import { UserUpdateData } from "@/data/types/db/user";
import { DUserCreate, DUserInternal } from "@/data/types/domain/user";
import { User } from "@/generated/prisma/client";
import { UserCreateInput, UserWhereInput } from "@/generated/prisma/models";

import { toDUserInternal } from "./user.mapper";

type PGeUserParams = {
   userId?: string;
   email?: string;
};

export class UserRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetUserById(userId: string): Promise<DUserInternal | null> {
      return await this.pGetUser({ userId });
   }

   async pGetUserByEmail(email: string): Promise<DUserInternal | null> {
      return await this.pGetUser({ email });
   }

   async pGetUser(params: PGeUserParams): Promise<DUserInternal | null> {
      const whereClause = this.resolveGetUserParams(params);

      if (whereClause) {
         const user: User | null = await this.prisma.user.findFirst({
            where: whereClause,
         });

         if (user) {
            return toDUserInternal(user);
         }
      }

      return null;
   }

   async pCreateUser(data: DUserCreate) {
      const input: UserCreateInput = {
         name: data.name,
         email: data.email,
         password: data.hashedPassword,
         consentAcceptedAt: data.consentAcceptedAt,
      };

      const newUser = await this.prisma.user.create({
         data: input,
      });

      return toDUserInternal(newUser);
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

   async pDeleteUser(userId: string) {
      await this.prisma.session.deleteMany({
         where: { userId },
      });
      await this.prisma.account.deleteMany({
         where: { userId },
      });
      await this.prisma.user.delete({
         where: { id: userId },
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
