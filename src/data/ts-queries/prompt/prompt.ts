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
   getPromptCategoriesPage,
   getPromptGenerationData,
   getPromptPreviewsPage,
   getPromptsPage,
   togglePromptFavorite,
} from "@/data/actions/prompt";
import {
   DPromptCategoriesPage,
   DPromptCategoriesPageQuery,
   DPromptPreviewsPage,
   DPromptPreviewsPageQuery,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptTemplatingData,
} from "@/data/types/domain/prompt";
import { ActionResult } from "@/data/types/utils";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import type {
   LoadPromptPreviewsPageParams,
   LoadPromptsPageParams,
   LoadPromptTemplatingDataParams,
   UpdateIsFavoriteParams,
} from "./types";
import { promptKeys, templateCategoriesKeys } from "./utils";

export const infiniteLoadPromptsPageOptions = (
   params: LoadPromptsPageParams
): UndefinedInitialDataInfiniteOptions<
   DPromptsPage,
   Error,
   InfiniteData<DPromptsPage>,
   QueryKey,
   number
> => {
   const { filters, sort } = params;
   return {
      queryKey: promptKeys.prompts(params),
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
   props: LoadPromptsPageParams
): UseInfiniteQueryResult<InfiniteData<DPromptsPage>, Error> => {
   const options = infiniteLoadPromptsPageOptions(props);
   return useInfiniteQuery(options);
};

export const infiniteLoadPromptPreviewsPageOptions = (
   params: LoadPromptPreviewsPageParams
): UndefinedInitialDataInfiniteOptions<
   DPromptPreviewsPage,
   Error,
   InfiniteData<DPromptPreviewsPage>,
   QueryKey,
   number
> => {
   const { filters, sort } = params;
   return {
      queryKey: promptKeys.promptPreviews(params),
      queryFn: async ({ pageParam }) => {
         const query: DPromptPreviewsPageQuery = pageQuery(
            pageParam,
            PAGE_SIZE,
            undefined,
            filters,
            sort
         );
         return await getPromptPreviewsPage(query);
      },
      initialPageParam: INIT_PAGE_NUMBER,
      getNextPageParam: getNextPageParam,
      staleTime: 5 * 60 * 1000,
   };
};

export const useInfiniteLoadPromptPreviewsPage = (
   props: LoadPromptPreviewsPageParams
): UseInfiniteQueryResult<InfiniteData<DPromptPreviewsPage>, Error> => {
   const options = infiniteLoadPromptPreviewsPageOptions(props);
   return useInfiniteQuery(options);
};

export const infiniteLoadPromptCategoriesPageOptions = (
   search: string
): UndefinedInitialDataInfiniteOptions<
   DPromptCategoriesPage,
   Error,
   InfiniteData<DPromptCategoriesPage>,
   QueryKey,
   number
> => {
   return {
      queryKey: templateCategoriesKeys.categories(search),
      queryFn: async ({ pageParam }) => {
         const query: DPromptCategoriesPageQuery = pageQuery(
            pageParam,
            PAGE_SIZE,
            undefined,
            { search }
         );
         return await getPromptCategoriesPage(query);
      },
      initialPageParam: INIT_PAGE_NUMBER,
      getNextPageParam: getNextPageParam,
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000,
   };
};

export const useInfiniteLoadPromptCategoriesPage = (
   search: string
): UseInfiniteQueryResult<InfiniteData<DPromptCategoriesPage>, Error> => {
   const options = infiniteLoadPromptCategoriesPageOptions(search);
   return useInfiniteQuery(options);
};

export const loadPromptTemplatingDataOptions = (
   params: LoadPromptTemplatingDataParams
): UndefinedInitialDataOptions<
   DPromptTemplatingData | null,
   Error,
   DPromptTemplatingData | null
> => {
   const { promptId, enabled } = params;
   return {
      queryKey: promptKeys.templatingData(params),
      queryFn: () => {
         if (promptId) {
            return getPromptGenerationData(promptId);
         }
         return null;
      },
      enabled: enabled,
      staleTime: 5 * 60 * 1000,
   };
};

export const useLoadPromptTemplatingData = (
   params: LoadPromptTemplatingDataParams
): UseQueryResult<DPromptTemplatingData | null> => {
   const options = loadPromptTemplatingDataOptions(params);
   return useQuery(options);
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
