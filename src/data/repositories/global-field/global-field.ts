import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import { DGlobalField, DGlobalFieldUpdate } from "@/data/types/domain/global-field";

export class GlobalFieldRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetGlobalFields(userId: string): Promise<DGlobalField[]> {
      const fields = await this.prisma.globalField.findMany({
         where: { userId },
         orderBy: { order: "asc" },
      });
      return map(fields, toDGlobalField);
   }

   async pCreateGlobalField(
      userId: string,
      data: DGlobalFieldUpdate
   ): Promise<DGlobalField> {
      const field = await this.prisma.globalField.create({
         data: {
            userId,
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

function toDGlobalField(field: {
   id: string;
   userId: string;
   name: string;
   label: string;
   description: string | null;
   type: string;
   required: boolean;
   defaultValue: string | null;
   options: unknown;
   order: number;
   createdAt: Date;
   updatedAt: Date;
}): DGlobalField {
   return {
      id: field.id,
      userId: field.userId,
      name: field.name,
      label: field.label,
      description: field.description,
      type: field.type as DGlobalField["type"],
      required: field.required,
      defaultValue: field.defaultValue,
      options: Array.isArray(field.options) ? (field.options as string[]) : null,
      order: field.order,
      createdAt: field.createdAt.toISOString(),
      updatedAt: field.updatedAt.toISOString(),
   };
}
