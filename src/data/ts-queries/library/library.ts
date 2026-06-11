import {
   keepPreviousData,
   QueryClient,
   UndefinedInitialDataOptions,
   useMutation,
   UseMutationOptions,
   UseMutationResult,
   useQuery,
   useQueryClient,
   UseQueryResult,
} from "@tanstack/react-query";

import {
   getPromptCollectionIds,
   updatePromptCollections,
} from "@/data/actions/collection";
import { ActionResult } from "@/data/types/utils";

import type {
   LoadCollectionIdsParams,
   UpdateCollectionIdsParams,
} from "./types";
import { libraryKeys } from "./utils";

export const loadPromptCollectionIdsOptions = (
   params: LoadCollectionIdsParams
): UndefinedInitialDataOptions<string[], Error, string[]> => {
   const { entryId, enabled } = params;
   return {
      queryKey: libraryKeys.entryCollections(entryId),
      queryFn: () => getPromptCollectionIds(entryId),
      placeholderData: keepPreviousData,
      enabled,
      staleTime: 5 * 60 * 1000,
   };
};

export const useLoadPromptCollectionIds = (
   params: LoadCollectionIdsParams
): UseQueryResult<string[]> => {
   return useQuery(loadPromptCollectionIdsOptions(params));
};

export const updatePromptCollectionsOptions = (
   queryClient: QueryClient
): UseMutationOptions<ActionResult, Error, UpdateCollectionIdsParams> => {
   return {
      mutationFn: async (params: UpdateCollectionIdsParams) => {
         const { promptId, collectionIds } = params;
         return await updatePromptCollections(promptId, collectionIds);
      },
      onSuccess: (_, params) => {
         const { promptId, collectionIds } = params;
         queryClient.setQueryData(
            libraryKeys.entryCollections(promptId),
            collectionIds
         );
      },
   };
};

export const useUpdatePromptCollections = (): UseMutationResult<
   ActionResult,
   Error,
   UpdateCollectionIdsParams
> => {
   const queryClient = useQueryClient();
   return useMutation(updatePromptCollectionsOptions(queryClient));
};
