import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   useInfiniteQuery,
   UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { DPromptsPage } from "@/data/types/domain/prompt";

import { LoadPromptParams } from "./types";
import { promptKeys } from "./utils";

export const infiniteLoadPromptsOptions = (
   props: LoadPromptParams
): UndefinedInitialDataInfiniteOptions<
   DPromptsPage,
   Error,
   InfiniteData<DPromptsPage>,
   QueryKey,
   number
> => {
   return {
      queryKey: promptKeys.prompts(props),
      queryFn: ({ pageParam }) => {
         const query: DNotesPageQuery = pageQuery2(pageParam, 7, filter, sort);
         return loadContactNotes(contactId, query);
      },
      initialPageParam: 0,
      getNextPageParam: getNextPageParam,
      staleTime: 5 * 60 * 1000,
   };
};

export const useInfiniteLoadPrompts = (
   props: LoadPromptParams
): UseInfiniteQueryResult<InfiniteData<DPromptsPage>, Error> => {
   const options = infiniteLoadPromptsOptions(props);
   return useInfiniteQuery(options);
};
