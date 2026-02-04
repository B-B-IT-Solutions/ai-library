import { DbTemplateField } from "@/data/types/db/template.field";
import { DTemplateField } from "@/data/types/domain/template.field";

export const toDTemplateField = (field: DbTemplateField): DTemplateField => ({
  id: field.id,
  promptTemplateId: field.promptTemplateId,
  name: field.name,
  label: field.label,
  description: field.description ?? undefined,
  type: field.type,
  required: field.required,
  order: field.order,
  defaultValue: field.defaultValue ?? undefined,
  options: field.options ? (field.options as string[]) : undefined,
  validation: field.validation
    ? (field.validation as Record<string, any>)
    : undefined,
});

export const toDTemplateFields = (
  fields: DbTemplateField[]
): DTemplateField[] => {
  return fields.map(toDTemplateField).sort((a, b) => a.order - b.order);
};
