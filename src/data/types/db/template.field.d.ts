import { TemplateField, TemplateFieldType } from "@/generated/prisma";

export type DbTemplateField = TemplateField;
export type DbTemplateFieldType = TemplateFieldType;

export type DbTemplateFieldWithRelations = TemplateField & {
  // Future: relationships if needed
};
