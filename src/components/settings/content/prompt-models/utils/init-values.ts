import {
   DPromptModelUpdate,
   DPromptModelWithUsage,
} from "@/data/types/domain/prompt";

export const initPromptModel = (
   model?: DPromptModelWithUsage
): DPromptModelUpdate => {
   return {
      name: model?.name ?? "",
   };
};
