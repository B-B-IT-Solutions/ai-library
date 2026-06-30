import { UserWithSubscription } from "@/data/types/db/admin/user";
import { DbClient } from "@/data/types/db/common";
import {
   DAdminUserDetail,
   DAdminUsersPage,
   DAdminUsersPageQuery,
} from "@/data/types/domain/admin/admin";
import {
   UserCountArgs,
   UserFindFirstArgs,
   UserFindManyArgs,
   UserUpdateArgs,
} from "@/generated/prisma/models";

import { toDAdminUserDetail, toDAdminUserListItems } from "./user.admin.mapper";
import { resolveWhereInput } from "./utils";

export class AdminUserRepository {
   constructor(private readonly prisma: DbClient) {}

   async pGetUsersPage(query?: DAdminUsersPageQuery): Promise<DAdminUsersPage> {
      const pageNumber = query?.pagination?.pageNumber ?? 0;
      const pageSize = query?.pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where = resolveWhereInput(query);

      const args = {
         where,
         include: {
            subscription: { include: { plan: true } },
         },
         orderBy: { createdAt: "desc" as const },
         skip,
         take: pageSize,
      } satisfies UserFindManyArgs;

      const countArgs = {
         where,
      } satisfies UserCountArgs;

      const [users, totalElements] = await Promise.all([
         this.prisma.user.findMany(args) as Promise<UserWithSubscription[]>,
         this.prisma.user.count(countArgs),
      ]);

      return {
         content: toDAdminUserListItems(users),
         pageNumber,
         pageSize,
         numberOfElements: users.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements,
      };
   }

   async pGetUserDetail(userId: string): Promise<DAdminUserDetail | null> {
      const args = {
         where: { id: userId },
         include: {
            subscription: { include: { plan: true } },
         },
      } satisfies UserFindFirstArgs;

      const user = await this.prisma.user.findFirst(args);
      if (!user) {
         return null;
      }
      return toDAdminUserDetail(user);
   }

   async pUpdateUserRole(userId: string, role: string) {
      const args = {
         where: { id: userId },
         data: { role },
      } satisfies UserUpdateArgs;

      await this.prisma.user.update(args);
   }
}
