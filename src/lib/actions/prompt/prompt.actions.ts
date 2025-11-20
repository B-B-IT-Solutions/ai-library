"use server";

import { DPromptCreate, DPrompt } from "@/data/domain/prompt";
import {
   getPrompts as pGetPrompts,
   createPrompt as pCreatePrompt,
} from "@/db/queries/prompt";
import { toDPrompts } from "./prompt.mapper";
import { createPromptSchema } from "@/data/validators/prompt.schema";
import { formatError } from "./utils";

export const getPrompts = async (): Promise<DPrompt[]> => {
   const data = await pGetPrompts();
   return toDPrompts(data);
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
