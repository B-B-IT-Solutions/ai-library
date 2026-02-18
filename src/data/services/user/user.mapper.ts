import { DUser, DUserInternal } from "@/data/types/domain/user";

export const toDUser = (user: DUserInternal): DUser => {
   return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
   };
};
