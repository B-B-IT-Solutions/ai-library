import { toDUser } from "@/data/services/user/user.mapper";
import { DbClient } from "@/data/types/db/common";
import { UserUpdateData } from "@/data/types/db/user";
import { DUserCreate } from "@/data/types/domain/user";
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

   async pCreateUser(data: DUserCreate) {
      const input: UserCreateInput = {
         name: data.name,
         email: data.email,
         password: data.hashedPassword,
      };

      const newUser = await this.prisma.user.create({
         data: input,
      });

      return toDUser(newUser);
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
