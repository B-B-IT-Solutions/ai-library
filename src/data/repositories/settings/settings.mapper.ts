import { isArray, map } from "es-toolkit/compat";

import { DGlobalPromptField } from "@/data/types/domain/settings";
import { GlobalPromptField } from "@/generated/prisma/client";

export const toDGlobalPromptFields = (
   fields: GlobalPromptField[]
): DGlobalPromptField[] => {
   return map(fields, toDGlobalPromptField);
};

export const toDGlobalPromptField = (
   field: GlobalPromptField
): DGlobalPromptField => {
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
