"use server";

import {
   createPrompt as pCreatePrompt,
   getPrompts as pGetPrompts,
} from "@/data/db/queries/prompt";
import {
   DPromptCreate,
   DPromptsPage,
   DPromptsPageQuery,
} from "@/data/types/domain/prompt";
import { createPromptSchema } from "@/data/types/validators/prompt.schema";

import { toDPromptsPage } from "./prompt.mapper";
import { formatError } from "./utils";

export const getPrompts = async (
   query?: DPromptsPageQuery
): Promise<DPromptsPage> => {
   const data = await pGetPrompts(query);
   return toDPromptsPage(data);
};

export const createPrompt = async (data: DPromptCreate) => {
   try {
      const prompt = createPromptSchema.parse(data);
      const toSave = { ...prompt, currentVersion: 1 };
      await pCreatePrompt(toSave);
      return {
         success: true,
         message: "Prompt created sucessfully.",
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};
