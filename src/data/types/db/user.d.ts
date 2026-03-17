import { UserUpdateInput } from "@/generated/prisma/models";

export type UserUpdateData = Omit<
   UserUpdateInput,
   "id",
   "email",
   "updatedAt",
   "createdAt"
>;
