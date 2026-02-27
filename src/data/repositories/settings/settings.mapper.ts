import { isArray, map } from "es-toolkit/compat";

import { DGlobalField } from "@/data/types/domain/settings";
import { GlobalField } from "@/generated/prisma/client";

export const toDGlobalFields = (fields: GlobalField[]): DGlobalField[] => {
   return map(fields, toDGlobalField);
};

export const toDGlobalField = (field: GlobalField): DGlobalField => {
   return {
      id: field.id,
      userId: field.userId,
      name: field.name,
      label: field.label,
      description: field.description,
      type: field.type,
      required: field.required,
      defaultValue: field.defaultValue,
      options: isArray(field.options) ? (field.options as string[]) : null,
      order: field.order,
      createdAt: field.createdAt.toISOString(),
      updatedAt: field.updatedAt.toISOString(),
   };
};
