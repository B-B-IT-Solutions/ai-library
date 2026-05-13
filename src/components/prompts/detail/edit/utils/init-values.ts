import { map } from "es-toolkit/compat";

import { existingTemplateFieldInitValues } from "@/components/shared/template-fields";
import {
   DPrompt,
   DPromptWithContent,
   DPromptUpdate,
} from "@/data/types/domain/prompt";

export const initPromptTemplate = (
   descriptor?: DPrompt,
   template?: DPromptWithContent
): DPromptUpdate => {
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
