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

import {
   getPromptTemplateCategories,
   getTemplateDescriptorsPage,
} from "@/data/actions/template";
import {
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import { LoadTemplateDescriptorsParams } from "./types";
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

export const infiniteLoadTemplateDescriptorsOptions = (
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
      queryKey: templateKeys.templates(params),
      queryFn: async ({ pageParam }) => {
         const query: DTemplateDescriptorsPageQuery = pageQuery(
            pageParam,
            PAGE_SIZE,
            undefined,
            filters,
            sort
         );
         return await getTemplateDescriptorsPage(query);
      },
      initialPageParam: INIT_PAGE_NUMBER,
      getNextPageParam: getNextPageParam,
      staleTime: 5 * 60 * 1000,
   };
};

export const useInfiniteLoadTemplateDescriptors = (
   props: LoadTemplateDescriptorsParams
): UseInfiniteQueryResult<InfiniteData<DTemplateDescriptorsPage>, Error> => {
   const options = infiniteLoadTemplateDescriptorsOptions(props);
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
