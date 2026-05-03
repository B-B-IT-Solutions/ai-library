import { DUserInternal } from "@/data/types/domain/user";
import { User } from "@/generated/prisma/client";

export const toDUserInternal = (pUser: User): DUserInternal => {
   return {
      id: pUser.id,
      name: pUser.name,
      email: pUser.email,
      role: pUser.role,
      password: pUser.password,
      stripeCustomerId: pUser.stripeCustomerId,
      emailVerified: pUser.emailVerified?.toISOString() ?? null,
      updatedAt: pUser.updatedAt.toISOString(),
      createdAt: pUser.createdAt.toISOString(),
   };
};
