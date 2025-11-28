import {
   FetchQueryOptions,
   keepPreviousData,
   UndefinedInitialDataOptions,
   useQuery,
   UseQueryResult,
} from "@tanstack/react-query";

import { DPromptTemplate } from "@/data/types/domain/prompt";
import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "@/lib/actions/prompt/prompt.template.actions";

import { promptTemplateCategoryKeys, promptTemplateKeys } from "./utils";

export const preloadPromptTemplatesOptions = (): FetchQueryOptions<
   DPromptTemplate[],
   Error,
   DPromptTemplate[]
> => {
   return {
      queryKey: promptTemplateKeys.templates(),
      queryFn: async () => {
         return await getPromptTemplates();
      },
   };
};

export const preloadPromptTemplateCategoriesOptions = (): FetchQueryOptions<
   string[],
   Error,
   string[]
> => {
   return {
      queryKey: promptTemplateCategoryKeys.categories(),
      queryFn: async () => {
         return await getPromptTemplateCategories();
      },
   };
};

export const loadPromptTemplatesOptions = (): UndefinedInitialDataOptions<
   DPromptTemplate[],
   Error,
   DPromptTemplate[]
> => {
   return {
      queryKey: promptTemplateKeys.templates(),
      queryFn: async () => {
         return await getPromptTemplates();
      },
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000,
   };
};

export const useLoadPromptTemplates = (): UseQueryResult<DPromptTemplate[]> => {
   const options = loadPromptTemplatesOptions();
   return useQuery<DPromptTemplate[]>(options);
};

export const loadPromptTemplateCategoriesOptions =
   (): UndefinedInitialDataOptions<string[], Error, string[]> => {
      return {
         queryKey: promptTemplateCategoryKeys.categories(),
         queryFn: async () => {
            return await getPromptTemplateCategories();
         },
         placeholderData: keepPreviousData,
         staleTime: 5 * 60 * 1000,
      };
   };

export const useLoadPromptTemplateCategories = (): UseQueryResult<string[]> => {
   const options = loadPromptTemplateCategoriesOptions();
   return useQuery<string[]>(options);
};
