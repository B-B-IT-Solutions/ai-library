import { isEmpty, map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   DGlobalField,
   DGlobalFieldUpdate,
} from "@/data/types/domain/global-field";
import {
   GlobalFieldCreateArgs,
   GlobalFieldCreateInput,
} from "@/generated/prisma/models";

import { toDGlobalField, toDGlobalFields } from "./settings.mapper";

export class SettingsRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetGlobalFields(userId: string): Promise<DGlobalField[]> {
      const fields = await this.prisma.globalField.findMany({
         where: { userId },
         orderBy: { order: "asc" },
      });

      return toDGlobalFields(fields);
   }

   async pCreateGlobalField(
      userId: string,
      data: DGlobalFieldUpdate
   ): Promise<DGlobalField> {
      const input: GlobalFieldCreateInput = {
         name: data.name,
         label: data.label,
         description: data.description ?? null,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue ?? null,
         options: !isEmpty(data.options) ? data.options : undefined,
         order: data.order ?? 0,
         user: {
            connect: {
               id: userId,
            },
         },
      };

      const createArgs: GlobalFieldCreateArgs = {
         data: input,
      };

      const field = await this.prisma.globalField.create(createArgs);

      return toDGlobalField(field);
   }

   async pUpdateGlobalField(
      id: string,
      userId: string,
      data: DGlobalFieldUpdate
   ): Promise<DGlobalField> {
      const field = await this.prisma.globalField.update({
         where: { id, userId },
         data: {
            name: data.name,
            label: data.label,
            description: data.description ?? null,
            type: data.type,
            required: data.required,
            defaultValue: data.defaultValue ?? null,
            options:
               data.options && data.options.length > 0
                  ? data.options
                  : undefined,
            order: data.order ?? 0,
         },
      });
      return toDGlobalField(field);
   }

   async pDeleteGlobalField(id: string, userId: string): Promise<void> {
      await this.prisma.globalField.delete({
         where: { id, userId },
      });
   }
}
