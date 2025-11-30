import {
   FetchQueryOptions,
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   useInfiniteQuery,
   UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { getPrompts } from "@/data/actions/prompt/prompt.actions";
import { DPromptsPage, DPromptsPageQuery } from "@/data/types/domain/prompt";
import { getNextPageParam, pageQuery } from "../utils";

import { LoadPromptsParams } from "./types";
import { promptKeys } from "./utils";

export const preloadPromptsOptions = (
   props?: LoadPromptsParams
): FetchQueryOptions<DPromptsPage, Error, DPromptsPage> => {
   const { search, categories } = props || {};
   return {
      queryKey: promptKeys.prompts(props),
      queryFn: async () => {
         const globalFilter = search;
         const filter = { categories };
         const query: DPromptsPageQuery = pageQuery(0, 7, globalFilter, filter);
         return await getPrompts(query);
      },
   };
};

export const infiniteLoadPromptsOptions = (
   props: LoadPromptsParams
): UndefinedInitialDataInfiniteOptions<
   DPromptsPage,
   Error,
   InfiniteData<DPromptsPage>,
   QueryKey,
   number
> => {
   const { search, categories } = props;
   return {
      queryKey: promptKeys.prompts(props),
      queryFn: async ({ pageParam }) => {
         const globalFilter = search;
         const filter = { categories };
         const query: DPromptsPageQuery = pageQuery(
            pageParam,
            7,
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
): UseInfiniteQueryResult<InfiniteData<DPromptsPage>, Error> => {
   const options = infiniteLoadPromptsOptions(props);
   return useInfiniteQuery(options);
};
