"use server";

import { map } from "es-toolkit/compat";
import { validate as isValidUuid } from "uuid";

import {
   createPrompt as pCreatePrompt,
   getPrompt as pGetPrompt,
   getPromptCategories as pGetPromptCategories,
   getPrompts as pGetPrompts,
} from "@/data/db/queries/prompt";
import {
   DPrompt,
   DPromptCreate,
   DPromptsPage,
   DPromptsPageQuery,
} from "@/data/types/domain/prompt";
import { createPromptSchema } from "@/data/types/validators/prompt.schema";
import {
   PromptCategoryCreateOrConnectWithoutPromptsInput,
   PromptCreateInput,
} from "@/generated/prisma/models";
import { formatError } from "../utils";

import { toDPrompt, toDPromptsPage } from "./prompt.mapper";

export const getPrompts = async (
   query?: DPromptsPageQuery
): Promise<DPromptsPage> => {
   const data = await pGetPrompts(query);
   return toDPromptsPage(data);
};

export const getPrompt = async (id: string): Promise<DPrompt | undefined> => {
   if (isValidUuid(id)) {
      const data = await pGetPrompt({ id });
      if (data) {
         return toDPrompt(data);
      }
   }
   return undefined;
};

export const getPromptCategories = async (): Promise<string[]> => {
   const categories = await pGetPromptCategories();
   return map(categories, (c) => c.name);
};

export const createPrompt = async (data: DPromptCreate) => {
   try {
      const prompt = createPromptSchema.parse(data);
      const categories = createOrConnectCategories(prompt.categories);

      const toSave: PromptCreateInput = {
         ...prompt,
         currentVersion: 1,
         categories: {
            connectOrCreate: categories,
         },
      };
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

const createOrConnectCategories = (
   categories: string[]
): PromptCategoryCreateOrConnectWithoutPromptsInput[] => {
   return map(categories, (cat: string) => {
      return {
         where: {
            name: cat,
         },
         create: {
            name: cat,
         },
      };
   });
};
