import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   useInfiniteQuery,
   UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { getPublishedCatalogEntriesPage } from "@/data/actions/catalog";
import {
   DCatalogEntriesPage,
   DCatalogEntriesPageQuery,
} from "@/data/types/domain/catalog";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import { LoadCatalogEntriesParams } from "./types";
import { catalogEntryKeys } from "./utils";

export const infiniteLoadCatalogEntryDescriptorsOptions = (
   params: LoadCatalogEntriesParams
): UndefinedInitialDataInfiniteOptions<
   DCatalogEntriesPage,
   Error,
   InfiniteData<DCatalogEntriesPage>,
   QueryKey,
   number
> => {
   const { filters, sort } = params;
   return {
      queryKey: catalogEntryKeys.entries(params),
      queryFn: async ({ pageParam }) => {
         const query: DCatalogEntriesPageQuery = pageQuery(
            pageParam,
            PAGE_SIZE,
            undefined,
            filters,
            sort
         );
         return await getPublishedCatalogEntriesPage(query);
      },
      initialPageParam: INIT_PAGE_NUMBER,
      getNextPageParam: getNextPageParam,
      staleTime: 5 * 60 * 1000,
   };
};

export const useInfiniteLoadCatalogEntryDescriptors = (
   props: LoadCatalogEntriesParams
): UseInfiniteQueryResult<InfiniteData<DCatalogEntriesPage>, Error> => {
   const options = infiniteLoadCatalogEntryDescriptorsOptions(props);
   return useInfiniteQuery(options);
};
