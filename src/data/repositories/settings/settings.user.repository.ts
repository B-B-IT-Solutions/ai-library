import { isEmpty } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   DGlobalPromptField,
   DGlobalPromptFieldUpdate,
} from "@/data/types/domain/settings";
import {
   GlobalPromptFieldCreateArgs,
   GlobalPromptFieldCreateInput,
   GlobalPromptFieldDeleteArgs,
   GlobalPromptFieldFindManyArgs,
   GlobalPromptFieldUpdateArgs,
   GlobalPromptFieldUpdateInput,
} from "@/generated/prisma/models";

import {
   toDGlobalPromptField,
   toDGlobalPromptFields,
} from "./settings.mapper";

export class SettingsRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetGlobalPromptFields(
      userId: string
   ): Promise<DGlobalPromptField[]> {
      const args: GlobalPromptFieldFindManyArgs = {
         where: { userId },
         orderBy: { order: "asc" },
      };

      const fields = await this.prisma.globalPromptField.findMany(args);
      return toDGlobalPromptFields(fields);
   }

   async pGetGlobalPromptFieldsByIds(
      userId: string,
      ids: string[]
   ): Promise<DGlobalPromptField[]> {
      const args: GlobalPromptFieldFindManyArgs = {
         where: {
            userId,
            id: {
               in: ids,
            },
         },
      };

      const fields = await this.prisma.globalPromptField.findMany(args);
      return toDGlobalPromptFields(fields);
   }

   async pCreateGlobalPromptField(
      userId: string,
      data: DGlobalPromptFieldUpdate
   ): Promise<DGlobalPromptField> {
      const input: GlobalPromptFieldCreateInput = {
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

      const args: GlobalPromptFieldCreateArgs = {
         data: input,
      };

      const field = await this.prisma.globalPromptField.create(args);
      return toDGlobalPromptField(field);
   }

   async pUpdateGlobalPromptField(
      userId: string,
      id: string,
      data: DGlobalPromptFieldUpdate
   ): Promise<DGlobalPromptField> {
      const input: GlobalPromptFieldUpdateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: !isEmpty(data.options) ? data.options : undefined,
         order: data.order,
      };

      const args: GlobalPromptFieldUpdateArgs = {
         where: { id, userId },
         data: input,
      };

      const field = await this.prisma.globalPromptField.update(args);
      return toDGlobalPromptField(field);
   }

   async pDeleteGlobalPromptField(userId: string, id: string) {
      const arg: GlobalPromptFieldDeleteArgs = {
         where: { id, userId },
      };

      await this.prisma.globalPromptField.delete(arg);
   }
}
