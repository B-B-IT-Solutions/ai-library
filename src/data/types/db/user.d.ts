import { User } from "@/generated/prisma/client";
import { UserUpdateInput } from "@/generated/prisma/models";

export type UserUpdateData = Omit<
   UserUpdateInput,
   "id",
   "email",
   "updatedAt",
   "createdAt"
>;

export type PUser = Omit<User, "password">;
