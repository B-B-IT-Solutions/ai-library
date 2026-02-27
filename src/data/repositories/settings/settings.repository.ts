import { isEmpty } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   DGlobalField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";
import {
   GlobalFieldCreateArgs,
   GlobalFieldCreateInput,
   GlobalFieldDeleteArgs,
   GlobalFieldFindManyArgs,
   GlobalFieldUpdateArgs,
   GlobalFieldUpdateInput,
} from "@/generated/prisma/models";

import { toDGlobalField, toDGlobalFields } from "./settings.mapper";

export class SettingsRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetGlobalFields(userId: string): Promise<DGlobalField[]> {
      const args: GlobalFieldFindManyArgs = {
         where: { userId },
         orderBy: { order: "asc" },
      };

      const fields = await this.prisma.globalField.findMany(args);
      return toDGlobalFields(fields);
   }

   async pCreateGlobalField(
      userId: string,
      data: DGlobalTemplateFieldUpdate
   ): Promise<DGlobalField> {
      const input: GlobalFieldCreateInput = {
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

      const args: GlobalFieldCreateArgs = {
         data: input,
      };

      const field = await this.prisma.globalField.create(args);
      return toDGlobalField(field);
   }

   async pUpdateGlobalField(
      userId: string,
      id: string,
      data: DGlobalTemplateFieldUpdate
   ): Promise<DGlobalField> {
      const input: GlobalFieldUpdateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: !isEmpty(data.options) ? data.options : undefined,
         order: data.order,
      };

      const args: GlobalFieldUpdateArgs = {
         where: { id, userId },
         data: input,
      };

      const field = await this.prisma.globalField.update(args);
      return toDGlobalField(field);
   }

   async pDeleteGlobalField(userId: string, id: string) {
      const arg: GlobalFieldDeleteArgs = {
         where: { id, userId },
      };

      await this.prisma.globalField.delete(arg);
   }
}
