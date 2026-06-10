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
   createCollection,
   deleteCollection,
   getCollectionPreviews,
   getPromptCollectionIds,
   updatePromptCollections,
} from "@/data/actions/collection";
import {
   DCollection,
   DCollectionPreview,
   DCollectionUpdate,
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

export const createCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<ActionResult<DCollection>, Error, DCollectionUpdate> => {
   return {
      mutationFn: async (data: DCollectionUpdate) => {
         return await createCollection(data);
      },
      onSuccess: (result) => {
         const currentData =
            queryClient.getQueryData<DCollection[]>(
               libraryKeys.collections()
            ) || [];

         if (result.data) {
            const newData = [...currentData, result.data];
            queryClient.setQueryData(libraryKeys.collections(), newData);
         }

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

export const deleteCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<ActionResult, Error, string> => {
   return {
      mutationFn: async (collectionId: string) => {
         return await deleteCollection(collectionId);
      },
      onSuccess: (_, collectionId) => {
         const updater = (cols: DCollection[]) => {
            return filter(cols, (col) => col.id !== collectionId);
         };
         queryClient.setQueryData(libraryKeys.collections(), updater);
         queryClient.invalidateQueries({
            queryKey: collectionKeys.collectionsPage({}),
         });
      },
   };
};

export const useDeleteCollection = (): UseMutationResult<
   ActionResult,
   Error,
   string
> => {
   const queryClient = useQueryClient();
   return useMutation(deleteCollectionOptions(queryClient));
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
