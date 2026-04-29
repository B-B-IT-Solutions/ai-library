import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   useInfiniteQuery,
   UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { getPublicTemplateDescriptorsPage } from "@/data/actions/template";
import {
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import { LoadTemplateDescriptorsParams } from "./types";
import { templateKeys } from "./utils";

export const infiniteLoadPublicTemplateDescriptorsOptions = (
   params: LoadTemplateDescriptorsParams
): UndefinedInitialDataInfiniteOptions<
   DTemplateDescriptorsPage,
   Error,
   InfiniteData<DTemplateDescriptorsPage>,
   QueryKey,
   number
> => {
   const { filters, sort } = params;
   return {
      queryKey: templateKeys.publicTemplates(params),
      queryFn: async ({ pageParam }) => {
         const query: DTemplateDescriptorsPageQuery = pageQuery(
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
): UseInfiniteQueryResult<InfiniteData<DTemplateDescriptorsPage>, Error> => {
   const options = infiniteLoadPublicTemplateDescriptorsOptions(props);
   return useInfiniteQuery(options);
};
