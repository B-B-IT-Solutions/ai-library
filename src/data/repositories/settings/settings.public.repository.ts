import { DbClient } from "@/data/types/db/common";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { GlobalPromptFieldFindManyArgs } from "@/generated/prisma/models";

import { toDGlobalPromptFields } from "./settings.mapper";

export class PublicSettingsRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetPublicGlobalPromptFieldsByIds(
      ids: string[]
   ): Promise<DGlobalPromptField[]> {
      const args: GlobalPromptFieldFindManyArgs = {
         where: {
            id: {
               in: ids,
            },
         },
      };

      const fields = await this.prisma.globalPromptField.findMany(args);
      return toDGlobalPromptFields(fields);
   }
}
