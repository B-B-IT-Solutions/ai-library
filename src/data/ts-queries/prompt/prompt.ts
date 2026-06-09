import {
   FetchQueryOptions,
   InfiniteData,
   keepPreviousData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   UndefinedInitialDataOptions,
   useInfiniteQuery,
   UseInfiniteQueryResult,
   useMutation,
   UseMutationOptions,
   UseMutationResult,
   useQuery,
   UseQueryResult,
} from "@tanstack/react-query";

import {
   getPromptsPage,
   getPromptTemplateCategories,
   togglePromptFavorite,
} from "@/data/actions/prompt";
import { DPromptsPage, DPromptsPageQuery } from "@/data/types/domain/prompt";
import { ActionResult } from "@/data/types/utils";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import type {
   LoadTemplateDescriptorsParams,
   UpdateIsFavoriteParams,
} from "./types";
import { templateCategoriesKeys, templateKeys } from "./utils";

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

export const infiniteLoadPromptsPageOptions = (
   params: LoadTemplateDescriptorsParams
): UndefinedInitialDataInfiniteOptions<
   DPromptsPage,
   Error,
   InfiniteData<DPromptsPage>,
   QueryKey,
   number
> => {
   const { filters, sort } = params;
   return {
      queryKey: templateKeys.templates(params),
      queryFn: async ({ pageParam }) => {
         const query: DPromptsPageQuery = pageQuery(
            pageParam,
            PAGE_SIZE,
            undefined,
            filters,
            sort
         );
         return await getPromptsPage(query);
      },
      initialPageParam: INIT_PAGE_NUMBER,
      getNextPageParam: getNextPageParam,
      staleTime: 5 * 60 * 1000,
   };
};

export const useInfiniteLoadPromptsPage = (
   props: LoadTemplateDescriptorsParams
): UseInfiniteQueryResult<InfiniteData<DPromptsPage>, Error> => {
   const options = infiniteLoadPromptsPageOptions(props);
   return useInfiniteQuery(options);
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

export const toggleFavoriteOptions = (): UseMutationOptions<
   ActionResult,
   Error,
   UpdateIsFavoriteParams
> => {
   return {
      mutationFn: async (params: UpdateIsFavoriteParams) => {
         const { promptId, isFavorite } = params;
         return await togglePromptFavorite(promptId, isFavorite);
      },
   };
};

export const useToggleFavorite = (): UseMutationResult<
   ActionResult,
   Error,
   UpdateIsFavoriteParams
> => {
   const options = toggleFavoriteOptions();
   return useMutation(options);
};
