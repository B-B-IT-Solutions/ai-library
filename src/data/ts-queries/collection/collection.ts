import {
   InfiniteData,
   keepPreviousData,
   QueryClient,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   UndefinedInitialDataOptions,
   useInfiniteQuery,
   UseInfiniteQueryResult,
   useMutation,
   UseMutationOptions,
   UseMutationResult,
   useQuery,
   useQueryClient,
   UseQueryResult,
} from "@tanstack/react-query";
import { filter, isEmpty } from "es-toolkit/compat";

import {
   addPromptToCollection,
   createCollection,
   getCollectionPromptIds,
   getCollectionsPage,
   removePromptFromCollection,
} from "@/data/actions/collection";
import {
   DCollection,
   DCollectionsPage,
   DCollectionUpdate,
} from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import {
   AddPromptToCollectionParams,
   LoadCollectionsPageParams,
   RemovePromptFromCollectionParams,
} from "./types";
import { collectionKeys } from "./utils";

export const infiniteLoadCollectionsPageOptions = (
   params: LoadCollectionsPageParams
): UndefinedInitialDataInfiniteOptions<
   DCollectionsPage,
   Error,
   InfiniteData<DCollectionsPage>,
   QueryKey,
   number
> => {
   const { filters, sort } = params;
   return {
      queryKey: collectionKeys.collectionsPage(params),
      queryFn: async ({ pageParam }) => {
         const query = pageQuery(
            pageParam,
            PAGE_SIZE,
            undefined,
            filters,
            sort
         );
         return await getCollectionsPage(query);
      },
      initialPageParam: INIT_PAGE_NUMBER,
      getNextPageParam: getNextPageParam,
      staleTime: 5 * 60 * 1000,
   };
};

export const useInfiniteLoadCollectionsPage = (
   params: LoadCollectionsPageParams
): UseInfiniteQueryResult<InfiniteData<DCollectionsPage>, Error> => {
   const options = infiniteLoadCollectionsPageOptions(params);
   return useInfiniteQuery(options);
};

export const loadCollectionPromptIdsOptions = (
   collectionId: string
): UndefinedInitialDataOptions<string[], Error, string[]> => {
   return {
      queryKey: collectionKeys.collectionTemplateIds(collectionId),
      queryFn: () => getCollectionPromptIds(collectionId),
      placeholderData: keepPreviousData,
      staleTime: 2 * 60 * 1000,
   };
};

export const useLoadCollectionPromptIds = (
   collectionId: string
): UseQueryResult<string[]> => {
   const options = loadCollectionPromptIdsOptions(collectionId);
   return useQuery(options);
};

export const addPromptToCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<ActionResult, Error, AddPromptToCollectionParams> => {
   return {
      mutationFn: (params) => {
         const { collectionId, promptId } = params;
         return addPromptToCollection(collectionId, promptId);
      },
      onSuccess: (_, params) => {
         const updater = (templateIds: string[]) => {
            if (isEmpty(templateIds)) {
               return [params.promptId];
            }
            return [...templateIds, params.promptId];
         };
         queryClient.setQueryData(
            collectionKeys.collectionTemplateIds(params.collectionId),
            updater
         );
      },
   };
};

export const useAddPromptToCollection = (): UseMutationResult<
   ActionResult,
   Error,
   AddPromptToCollectionParams
> => {
   const queryClient = useQueryClient();
   const options = addPromptToCollectionOptions(queryClient);
   return useMutation(options);
};

export const removePromptFromCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<
   ActionResult,
   Error,
   RemovePromptFromCollectionParams
> => {
   return {
      mutationFn: (params) => {
         const { collectionId, promptId } = params;
         return removePromptFromCollection(collectionId, promptId);
      },
      onSuccess: (_, params) => {
         const updater = (templateIds: string[]) => {
            return filter(templateIds, (id) => id != params.promptId);
         };
         queryClient.setQueryData(
            collectionKeys.collectionTemplateIds(params.collectionId),
            updater
         );
      },
   };
};

export const useRemovePromptFromCollection = (): UseMutationResult<
   ActionResult,
   Error,
   RemovePromptFromCollectionParams
> => {
   const queryClient = useQueryClient();
   const options = removePromptFromCollectionOptions(queryClient);
   return useMutation(options);
};

export const createCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<ActionResult<DCollection>, Error, DCollectionUpdate> => {
   return {
      mutationFn: async (data: DCollectionUpdate) => {
         return await createCollection(data);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: collectionKeys.collectionsPage({}),
         });
      },
   };
};

export const useCreateCollection = (): UseMutationResult<
   ActionResult<DCollection>,
   Error,
   DCollectionUpdate
> => {
   const queryClient = useQueryClient();
   return useMutation(createCollectionOptions(queryClient));
};
