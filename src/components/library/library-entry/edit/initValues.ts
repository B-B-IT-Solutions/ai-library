import { DLibraryCollectionUpdate } from "@/data/types/domain/library";
import {
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

export const initPromptTempalte = (): DPromptTemplateUpdate => {
   return {
      title: "",
      description: "",
      content: "",
      detailedDescription: "",
      recommendedModel: "Claude 3.5 Sonnet",
      categories: [],
      categoryInput: "",
      fields: [],
   };
};

export const initPromptTemplateField = (
   order: number,
   name?: string,
   label?: string
): DPromptTemplateFieldUpdate => {
   return {
      name: name || "",
      label: label || "",
      description: "",
      type: "TEXT",
      required: true,
      order: order,
      defaultValue: "",
      options: [],
   };
};
