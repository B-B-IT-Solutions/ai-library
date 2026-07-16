import { map } from "es-toolkit/compat";

import { existingTemplateFieldInitValues } from "@/components/shared/template-fields";
import { DPromptUpdate, DPromptWithContent } from "@/data/types/domain/prompt";

export const initPromptTemplate = (
   prompt?: DPromptWithContent
): DPromptUpdate => {
   return {
      title: prompt?.title ?? "",
      description: prompt?.description ?? "",
      content: prompt?.content ?? "",
      recommendedModel: prompt?.recommendedModel ?? "",
      categories: map(prompt?.categories, "name"),
      fields: map(prompt?.fields, existingTemplateFieldInitValues),
      globalFieldIds: prompt?.globalFieldIds ?? [],
   };
};
