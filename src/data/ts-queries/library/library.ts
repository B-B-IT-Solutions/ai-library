import {
   FetchQueryOptions,
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
import { filter } from "es-toolkit/compat";

import {
   deleteCollection,
   getCollectionPreviews,
   getPromptCollectionIds,
   updatePromptCollections,
} from "@/data/actions/collection";
import {
   DCollection,
   DCollectionPreview,
} from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";
import { collectionKeys } from "../collection/utils";

import type {
   LoadCollectionIdsParams,
   LoadCollectionPreviewsParams,
   UpdateCollectionIdsParams,
} from "./types";
import { libraryKeys } from "./utils";

export const preloadCollectionPreviewsOptions = (): FetchQueryOptions<
   DCollectionPreview[],
   Error,
   DCollectionPreview[]
> => {
   return {
      queryKey: libraryKeys.collectionPreviews(),
      queryFn: getCollectionPreviews,
   };
};

export const loadCollectionPreviewsOptions = (
   params: LoadCollectionPreviewsParams
): UndefinedInitialDataOptions<
   DCollectionPreview[],
   Error,
   DCollectionPreview[]
> => {
   const { enabled } = params;
   return {
      queryKey: libraryKeys.collectionPreviews(),
      queryFn: getCollectionPreviews,
      placeholderData: keepPreviousData,
      enabled,
      staleTime: 5 * 60 * 1000,
   };
};

export const useLoadCollectionPreviews = (
   params: LoadCollectionPreviewsParams
): UseQueryResult<DCollectionPreview[]> => {
   const options = loadCollectionPreviewsOptions(params);
   return useQuery<DCollectionPreview[]>(options);
};

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
         const { entryId, collectionIds } = params;
         return await updatePromptCollections(entryId, collectionIds);
      },
      onSuccess: (_, params) => {
         const { entryId, collectionIds } = params;
         queryClient.setQueryData(
            libraryKeys.entryCollections(entryId),
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
