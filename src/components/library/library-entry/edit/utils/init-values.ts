import { map } from "es-toolkit/compat";

import { existingTemplateFieldInitValues } from "@/components/shared/global-template-fields";
import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";

export const initPromptTempalte = (
   entry?: DLibraryEntryWithPromptTemplate
): DPromptTemplateUpdate => {
   const { templateDescriptor: descriptor } = entry || {};
   const { promptTemplate } = descriptor || {};
   return {
      title: descriptor?.title ?? "",
      description: descriptor?.description ?? "",
      content: promptTemplate?.content ?? "",
      detailedDescription: promptTemplate?.detailedDescription ?? "",
      recommendedModel: descriptor?.recommendedModel ?? "Claude 3.5 Sonnet",
      categories: map(descriptor?.categories, "name"),
      categoryInput: "",
      fields: map(promptTemplate?.fields, existingTemplateFieldInitValues),
      globalFieldIds: promptTemplate?.globalFieldIds ?? [],
   };
};
