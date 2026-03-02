import { isArray, map } from "es-toolkit/compat";

import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { GlobalTemplateField } from "@/generated/prisma/client";

export const toDGlobalTemplateFields = (
   fields: GlobalTemplateField[]
): DGlobalTemplateField[] => {
   return map(fields, toDGlobalTemplateField);
};

export const toDGlobalTemplateField = (
   field: GlobalTemplateField
): DGlobalTemplateField => {
   return {
      id: field.id,
      userId: field.userId,
      name: field.name,
      label: field.label,
      description: field.description,
      type: field.type,
      required: field.required,
      defaultValue: field.defaultValue,
      options: field.options as string[] | undefined,
      order: field.order,
      createdAt: field.createdAt.toISOString(),
      updatedAt: field.updatedAt.toISOString(),
   };
};
