import {
   FetchQueryOptions,
   InfiniteData,
   keepPreviousData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   UndefinedInitialDataOptions,
   useInfiniteQuery,
   UseInfiniteQueryResult,
   useQuery,
   UseQueryResult,
} from "@tanstack/react-query";

import { getPromptCategories, getPrompts } from "@/data/actions/prompt";
import { DPrompt0sPage, DPrompt0sPageQuery } from "@/data/types/domain/prompt";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import { LoadPromptsParams } from "./types";
import { promptCategoriesKeys, promptKeys } from "./utils";

export const preloadPromptsOptions = (
   props?: LoadPromptsParams
): FetchQueryOptions<DPrompt0sPage, Error, DPrompt0sPage> => {
   const { search, categories } = props || {};
   return {
      queryKey: promptKeys.prompts(props),
      queryFn: async () => {
         const globalFilter = search;
         const filter = { categories };
         const query: DPrompt0sPageQuery = pageQuery(
            INIT_PAGE_NUMBER,
            PAGE_SIZE,
            globalFilter,
            filter
         );
         return await getPrompts(query);
      },
   };
};

export const preloadPromptCategoriesOptions = (): FetchQueryOptions<
   string[],
   Error,
   string[]
> => {
   return {
      queryKey: promptCategoriesKeys.categories(),
      queryFn: async () => {
         return await getPromptCategories();
      },
   };
};

export const infiniteLoadPromptsOptions = (
   props: LoadPromptsParams
): UndefinedInitialDataInfiniteOptions<
   DPrompt0sPage,
   Error,
   InfiniteData<DPrompt0sPage>,
   QueryKey,
   number
> => {
   const { search, categories } = props;
   return {
      queryKey: promptKeys.prompts(props),
      queryFn: async ({ pageParam }) => {
         const globalFilter = search;
         const filter = { categories };
         const query: DPrompt0sPageQuery = pageQuery(
            pageParam,
            PAGE_SIZE,
            globalFilter,
            filter
         );
         return await getPrompts(query);
      },
      initialPageParam: 0,
      getNextPageParam: getNextPageParam,
      staleTime: 5 * 60 * 1000,
   };
};

export const useInfiniteLoadPrompts = (
   props: LoadPromptsParams
): UseInfiniteQueryResult<InfiniteData<DPrompt0sPage>, Error> => {
   const options = infiniteLoadPromptsOptions(props);
   return useInfiniteQuery(options);
};

export const loadPromptCategoriesOptions = (): UndefinedInitialDataOptions<
   string[],
   Error,
   string[]
> => {
   return {
      queryKey: promptCategoriesKeys.categories(),
      queryFn: async () => {
         return await getPromptCategories();
      },
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000,
   };
};

export const useLoadPromptCategories = (): UseQueryResult<string[]> => {
   const options = loadPromptCategoriesOptions();
   return useQuery<string[]>(options);
};
