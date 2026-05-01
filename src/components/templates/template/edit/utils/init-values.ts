import { map } from "es-toolkit/compat";

import { existingTemplateFieldInitValues } from "@/components/shared/template-fields";
import {
   DPromptTemplateDescriptor,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

export const initPromptTemplate = (
   descriptor?: DPromptTemplateDescriptor
): DPromptTemplateUpdate => {
   const { promptTemplate } = descriptor || {};
   return {
      title: descriptor?.title ?? "",
      description: descriptor?.description ?? "",
      content: promptTemplate?.content ?? "",
      recommendedModel: descriptor?.recommendedModel ?? "Claude",
      categories: map(descriptor?.categories, "name"),
      fields: map(promptTemplate?.fields, existingTemplateFieldInitValues),
      globalFieldIds: promptTemplate?.globalFieldIds ?? [],
   };
};
