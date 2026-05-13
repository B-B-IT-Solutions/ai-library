import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   useInfiniteQuery,
   UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { getPublicTemplateDescriptorsPage } from "@/data/actions/template";
import { DPromptsPage, DPromptsPageQuery } from "@/data/types/domain/prompt";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import { LoadTemplateDescriptorsParams } from "./types";
import { templateKeys } from "./utils";

export const infiniteLoadPublicTemplateDescriptorsOptions = (
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
      queryKey: templateKeys.publicTemplates(params),
      queryFn: async ({ pageParam }) => {
         const query: DPromptsPageQuery = pageQuery(
            pageParam,
            PAGE_SIZE,
            undefined,
            filters,
            sort
         );
         return await getPublicTemplateDescriptorsPage(query);
      },
      initialPageParam: INIT_PAGE_NUMBER,
      getNextPageParam: getNextPageParam,
      staleTime: 5 * 60 * 1000,
   };
};

export const useInfiniteLoadPublicTemplateDescriptors = (
   props: LoadTemplateDescriptorsParams
): UseInfiniteQueryResult<InfiniteData<DPromptsPage>, Error> => {
   const options = infiniteLoadPublicTemplateDescriptorsOptions(props);
   return useInfiniteQuery(options);
};
