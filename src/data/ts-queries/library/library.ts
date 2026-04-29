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
   getCollections,
   getEntryCollectionIds,
   updateEntryCollections,
} from "@/data/actions/collection";
import { toggleTemplateDescriptorFavorite } from "@/data/actions/template";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";

import {
   LoadCollectionIdsParams,
   UpdateCollectionIdsParams,
   UpdateIsFavoriteParams,
} from "./types";
import { libraryKeys } from "./utils";

export const preloadCollectionsOptions = (): FetchQueryOptions<
   DCollection[],
   Error,
   DCollection[]
> => {
   return {
      queryKey: libraryKeys.collections(),
      queryFn: getCollections,
   };
};

export const toggleFavoriteOptions = (): UseMutationOptions<
   ActionResult,
   Error,
   UpdateIsFavoriteParams
> => {
   return {
      mutationFn: async (params: UpdateIsFavoriteParams) => {
         const { descriptorId, isFavorite } = params;
         return await toggleTemplateDescriptorFavorite(
            descriptorId,
            isFavorite
         );
      },
   };
};

export const useToggleFavorite = (): UseMutationResult<
   ActionResult,
   Error,
   UpdateIsFavoriteParams
> => {
   const options = toggleFavoriteOptions();
   return useMutation(options);
};

export const loadCollectionsOptions = (): UndefinedInitialDataOptions<
   DCollection[],
   Error,
   DCollection[]
> => {
   return {
      queryKey: libraryKeys.collections(),
      queryFn: getCollections,
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000,
   };
};

export const useLoadCollections = (): UseQueryResult<DCollection[]> => {
   const options = loadCollectionsOptions();
   return useQuery<DCollection[]>(options);
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

export const loadEntryCollectionIdsOptions = (
   params: LoadCollectionIdsParams
): UndefinedInitialDataOptions<string[], Error, string[]> => {
   const { entryId, enabled } = params;
   return {
      queryKey: libraryKeys.entryCollections(entryId),
      queryFn: () => getEntryCollectionIds(entryId),
      placeholderData: keepPreviousData,
      enabled,
      staleTime: 5 * 60 * 1000,
   };
};

export const useLoadEntryCollectionIds = (
   params: LoadCollectionIdsParams
): UseQueryResult<string[]> => {
   return useQuery(loadEntryCollectionIdsOptions(params));
};

export const updateEntryCollectionsOptions = (
   queryClient: QueryClient
): UseMutationOptions<ActionResult, Error, UpdateCollectionIdsParams> => {
   return {
      mutationFn: async (params: UpdateCollectionIdsParams) => {
         const { entryId, collectionIds } = params;
         return await updateEntryCollections(entryId, collectionIds);
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

export const useUpdateEntryCollections = (): UseMutationResult<
   ActionResult,
   Error,
   UpdateCollectionIdsParams
> => {
   const queryClient = useQueryClient();
   return useMutation(updateEntryCollectionsOptions(queryClient));
};
