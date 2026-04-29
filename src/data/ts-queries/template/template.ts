import {
   FetchQueryOptions,
   keepPreviousData,
   UndefinedInitialDataOptions,
   useQuery,
   UseQueryResult,
} from "@tanstack/react-query";

import { getPromptTemplateCategories } from "@/data/actions/prompt-template";

import { templateCategoriesKeys } from "./utils";

export const preloadPromptTemplateCategoriesOptions = (): FetchQueryOptions<
   string[],
   Error,
   string[]
> => {
   return {
      queryKey: templateCategoriesKeys.categories(),
      queryFn: async () => {
         return await getPromptTemplateCategories();
      },
   };
};

export const loadPromptTemplateCategoriesOptions =
   (): UndefinedInitialDataOptions<string[], Error, string[]> => {
      return {
         queryKey: templateCategoriesKeys.categories(),
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
