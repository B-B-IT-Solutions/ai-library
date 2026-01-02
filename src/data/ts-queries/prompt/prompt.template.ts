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
} from "@/data/actions/prompt";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import { LoadPromptTemplatesParams } from "./types";
import { promptTemplateCategoriesKeys, promptTemplateKeys } from "./utils";

export const preloadPromptTemplatesOptions = (): FetchQueryOptions<
   DPromptTemplateDescriptor[],
   Error,
   DPromptTemplateDescriptor[]
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
): UndefinedInitialDataOptions<
   DPromptTemplateDescriptor[],
   Error,
   DPromptTemplateDescriptor[]
> => {
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
): UseQueryResult<DPromptTemplateDescriptor[]> => {
   const options = loadPromptTemplatesOptions(params);
   return useQuery<DPromptTemplateDescriptor[]>(options);
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
