import { PUser } from "@/data/types/db/user";
import { DUser } from "@/data/types/domain/user";

export const toDUser = (pUser: PUser): DUser => {
   return {
      id: pUser.id,
      name: pUser.name,
      email: pUser.email,
      role: pUser.role,
      updatedAt: pUser.updatedAt.toISOString(),
      createdAt: pUser.createdAt.toISOString(),
   };
};
