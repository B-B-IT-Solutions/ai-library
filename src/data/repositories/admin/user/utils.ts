import { DAdminUsersPageQuery } from "@/data/types/domain/admin/user";
import { UserWhereInput } from "@/generated/prisma/models";

export const resolveWhereInput = (
   query?: DAdminUsersPageQuery
): UserWhereInput => {
   if (!query?.filter?.search) {
      return {};
   }
   return {
      OR: [
         { name: { contains: query.filter.search, mode: "insensitive" } },
         { email: { contains: query.filter.search, mode: "insensitive" } },
      ],
   };
};
