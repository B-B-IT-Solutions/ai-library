import {
   FetchQueryOptions,
   keepPreviousData,
   UndefinedInitialDataOptions,
   useQuery,
   UseQueryResult,
} from "@tanstack/react-query";

import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "@/data/actions/prompt/prompt.template.actions";
import { DPromptTemplate } from "@/data/types/domain/prompt.template";

import { LoadPromptTemplatesParams } from "./types";
import { promptTemplateCategoriesKeys, promptTemplateKeys } from "./utils";

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
      queryKey: promptTemplateCategoriesKeys.categories(),
      queryFn: async () => {
         return await getPromptTemplateCategories();
      },
   };
};

export const loadPromptTemplatesOptions = (
   params?: LoadPromptTemplatesParams
): UndefinedInitialDataOptions<DPromptTemplate[], Error, DPromptTemplate[]> => {
   return {
      queryKey: promptTemplateKeys.templates(params),
      queryFn: async () => {
         return await getPromptTemplates(params);
      },
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000,
   };
};

export const useLoadPromptTemplates = (
   params?: LoadPromptTemplatesParams
): UseQueryResult<DPromptTemplate[]> => {
   const options = loadPromptTemplatesOptions(params);
   return useQuery<DPromptTemplate[]>(options);
};

export const loadPromptTemplateCategoriesOptions =
   (): UndefinedInitialDataOptions<string[], Error, string[]> => {
      return {
         queryKey: promptTemplateCategoriesKeys.categories(),
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
