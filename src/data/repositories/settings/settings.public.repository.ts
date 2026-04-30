import { DbClient } from "@/data/types/db/common";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { GlobalTemplateFieldFindManyArgs } from "@/generated/prisma/models";

import { toDGlobalTemplateFields } from "./settings.mapper";

export class PublicSettingsRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetPublicGlobalTemplateFieldsByIds(
      ids: string[]
   ): Promise<DGlobalTemplateField[]> {
      const args: GlobalTemplateFieldFindManyArgs = {
         where: {
            id: {
               in: ids,
            },
         },
      };

      const fields = await this.prisma.globalTemplateField.findMany(args);
      return toDGlobalTemplateFields(fields);
   }
}
