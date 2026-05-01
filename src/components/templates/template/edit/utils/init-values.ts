import { map } from "es-toolkit/compat";

import { existingTemplateFieldInitValues } from "@/components/shared/template-fields";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

export const initPromptTemplate = (
   descriptor?: DPromptTemplateDescriptor,
   template?: DPromptTemplate
): DPromptTemplateUpdate => {
   return {
      title: descriptor?.title ?? "",
      description: descriptor?.description ?? "",
      content: template?.content ?? "",
      recommendedModel: descriptor?.recommendedModel ?? "Claude",
      categories: map(descriptor?.categories, "name"),
      fields: map(template?.fields, existingTemplateFieldInitValues),
      globalFieldIds: template?.globalFieldIds ?? [],
   };
};
