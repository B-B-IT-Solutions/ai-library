import { isEmpty } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   DGlobalTemplateField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";
import {
   GlobalTemplateFieldCreateArgs,
   GlobalTemplateFieldCreateInput,
   GlobalTemplateFieldDeleteArgs,
   GlobalTemplateFieldFindManyArgs,
   GlobalTemplateFieldUpdateArgs,
   GlobalTemplateFieldUpdateInput,
} from "@/generated/prisma/models";

import {
   toDGlobalTemplateField,
   toDGlobalTemplateFields,
} from "./settings.mapper";

export class SettingsRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetGlobalTemplateFields(
      userId: string
   ): Promise<DGlobalTemplateField[]> {
      const args: GlobalTemplateFieldFindManyArgs = {
         where: { userId },
         orderBy: { order: "asc" },
      };

      const fields = await this.prisma.globalTemplateField.findMany(args);
      return toDGlobalTemplateFields(fields);
   }

   async pGetGlobalTemplateFieldsByIds(
      userId: string,
      ids: string[]
   ): Promise<DGlobalTemplateField[]> {
      const args: GlobalTemplateFieldFindManyArgs = {
         where: {
            userId,
            id: {
               in: ids,
            },
         },
      };

      const fields = await this.prisma.globalTemplateField.findMany(args);
      return toDGlobalTemplateFields(fields);
   }

   async pCreateGlobalTemplateField(
      userId: string,
      data: DGlobalTemplateFieldUpdate
   ): Promise<DGlobalTemplateField> {
      const input: GlobalTemplateFieldCreateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: !isEmpty(data.options) ? data.options : undefined,
         order: data.order,
         user: {
            connect: {
               id: userId,
            },
         },
      };

      const args: GlobalTemplateFieldCreateArgs = {
         data: input,
      };

      const field = await this.prisma.globalTemplateField.create(args);
      return toDGlobalTemplateField(field);
   }

   async pUpdateGlobalTemplateField(
      userId: string,
      id: string,
      data: DGlobalTemplateFieldUpdate
   ): Promise<DGlobalTemplateField> {
      const input: GlobalTemplateFieldUpdateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: !isEmpty(data.options) ? data.options : undefined,
         order: data.order,
      };

      const args: GlobalTemplateFieldUpdateArgs = {
         where: { id, userId },
         data: input,
      };

      const field = await this.prisma.globalTemplateField.update(args);
      return toDGlobalTemplateField(field);
   }

   async pDeleteGlobalTemplateField(userId: string, id: string) {
      const arg: GlobalTemplateFieldDeleteArgs = {
         where: { id, userId },
      };

      await this.prisma.globalTemplateField.delete(arg);
   }
}
