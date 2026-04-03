import {
   FetchQueryOptions,
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
import { filter, map } from "es-toolkit/compat";

import {
   addTemplateToCollection,
   createLibraryCollection,
   deleteLibraryCollection,
   getCollectionTemplateIds,
   getEntryCollectionIds,
   getLibraryCollectionById,
   getLibraryCollections,
   removeTemplateFromCollection,
   setLibraryCollectionSharing,
   updateEntryCollections,
   updateLibraryCollection,
} from "@/data/actions/library";
import {
   getTemplateDescriptorsPage,
   toggleTemplateDescriptorFavorite,
} from "@/data/actions/prompt-template";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
} from "@/data/types/domain/library";
import {
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import {
   LoadCollectionIdsParams,
   LoadLibraryEntriesParams,
   UpdateCollectionIdsParams,
   UpdateCollectionParams,
   UpdateIsFavoriteParams,
} from "./types";
import { libraryKeys } from "./utils";

export const preloadLibraryEntriesOptions = (
   params: LoadLibraryEntriesParams
): FetchQueryOptions<
   DTemplateDescriptorsPage,
   Error,
   DTemplateDescriptorsPage
> => {
   const { filters, sort } = params;

   return {
      queryKey: libraryKeys.entries(params),
      queryFn: async () => {
         const query: DTemplateDescriptorsPageQuery = pageQuery(
            INIT_PAGE_NUMBER,
            PAGE_SIZE,
            undefined,
            filters,
            sort
         );
         return await getTemplateDescriptorsPage(query);
      },
   };
};

export const preloadLibraryCollectionsOptions = (): FetchQueryOptions<
   DLibraryCollection[],
   Error,
   DLibraryCollection[]
> => {
   return {
      queryKey: libraryKeys.collections(),
      queryFn: getLibraryCollections,
   };
};

export const infiniteLoadLibraryEntriesOptions = (
   params: LoadLibraryEntriesParams
): UndefinedInitialDataInfiniteOptions<
   DTemplateDescriptorsPage,
   Error,
   InfiniteData<DTemplateDescriptorsPage>,
   QueryKey,
   number
> => {
   const { filters, sort } = params;
   return {
      queryKey: libraryKeys.entries(params),
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

export const useInfiniteLoadLibraryEntries = (
   props: LoadLibraryEntriesParams
): UseInfiniteQueryResult<InfiniteData<DTemplateDescriptorsPage>, Error> => {
   const options = infiniteLoadLibraryEntriesOptions(props);
   return useInfiniteQuery(options);
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

export const loadLibraryCollectionsOptions = (): UndefinedInitialDataOptions<
   DLibraryCollection[],
   Error,
   DLibraryCollection[]
> => {
   return {
      queryKey: libraryKeys.collections(),
      queryFn: getLibraryCollections,
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000,
   };
};

export const useLoadLibraryCollections = (): UseQueryResult<
   DLibraryCollection[]
> => {
   const options = loadLibraryCollectionsOptions();
   return useQuery<DLibraryCollection[]>(options);
};

export const createCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<
   ActionResult<DLibraryCollection>,
   Error,
   DLibraryCollectionUpdate
> => {
   return {
      mutationFn: async (data: DLibraryCollectionUpdate) => {
         return await createLibraryCollection(data);
      },
      onSuccess: (result) => {
         const currentData =
            queryClient.getQueryData<DLibraryCollection[]>(
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
   ActionResult<DLibraryCollection>,
   Error,
   DLibraryCollectionUpdate
> => {
   const queryClient = useQueryClient();
   return useMutation(createCollectionOptions(queryClient));
};

export const updateCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<ActionResult, Error, UpdateCollectionParams> => {
   return {
      mutationFn: async (params: UpdateCollectionParams) => {
         const { collectionId, data } = params;
         return await updateLibraryCollection(collectionId, data);
      },
      onSuccess: (_, params) => {
         const updater = (cols: DLibraryCollection[]) => {
            return map(cols, (col) => {
               if (col.id === params.collectionId) {
                  return { ...col, ...params.data };
               }
               return col;
            });
         };

         queryClient.setQueryData(libraryKeys.collections(), updater);
      },
   };
};

export const useUpdateCollection = (): UseMutationResult<
   ActionResult,
   Error,
   UpdateCollectionParams
> => {
   const queryClient = useQueryClient();
   return useMutation(updateCollectionOptions(queryClient));
};

export const deleteCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<ActionResult, Error, string> => {
   return {
      mutationFn: async (collectionId: string) => {
         return await deleteLibraryCollection(collectionId);
      },
      onSuccess: (_, collectionId) => {
         const updater = (cols: DLibraryCollection[]) => {
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

export const useLoadCollectionById = (
   collectionId: string | null
): UseQueryResult<DLibraryCollection | null> => {
   return useQuery({
      queryKey: libraryKeys.collection(collectionId ?? ""),
      queryFn: () => getLibraryCollectionById(collectionId!),
      enabled: !!collectionId,
      staleTime: 5 * 60 * 1000,
   });
};

export const useCollectionTemplateIds = (
   collectionId: string
): UseQueryResult<string[]> => {
   return useQuery({
      queryKey: libraryKeys.collectionTemplates(collectionId),
      queryFn: () => getCollectionTemplateIds(collectionId),
      staleTime: 2 * 60 * 1000,
   });
};

export const useAddTemplateToCollection = (): UseMutationResult<
   ActionResult,
   Error,
   { collectionId: string; templateDescriptorId: string }
> => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ collectionId, templateDescriptorId }) =>
         addTemplateToCollection(collectionId, templateDescriptorId),
      onSuccess: (_, { collectionId, templateDescriptorId }) => {
         queryClient.setQueryData<string[]>(
            libraryKeys.collectionTemplates(collectionId),
            (prev) => (prev ? [...prev, templateDescriptorId] : [templateDescriptorId])
         );
         queryClient.invalidateQueries({ queryKey: libraryKeys.collections() });
         queryClient.invalidateQueries({ queryKey: libraryKeys.entries({}) });
      },
   });
};

export const useRemoveTemplateFromCollection = (): UseMutationResult<
   ActionResult,
   Error,
   { collectionId: string; templateDescriptorId: string }
> => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ collectionId, templateDescriptorId }) =>
         removeTemplateFromCollection(collectionId, templateDescriptorId),
      onSuccess: (_, { collectionId, templateDescriptorId }) => {
         queryClient.setQueryData<string[]>(
            libraryKeys.collectionTemplates(collectionId),
            (prev) => prev?.filter((id) => id !== templateDescriptorId)
         );
         queryClient.invalidateQueries({ queryKey: libraryKeys.collections() });
         queryClient.invalidateQueries({ queryKey: libraryKeys.entries({}) });
      },
   });
};

export const useSetCollectionSharing = (): UseMutationResult<
   ActionResult<DLibraryCollection>,
   Error,
   { collectionId: string; isPublic: boolean }
> => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ collectionId, isPublic }) =>
         setLibraryCollectionSharing(collectionId, isPublic),
      onSuccess: (result, { collectionId }) => {
         if (result.data) {
            queryClient.setQueryData(
               libraryKeys.collection(collectionId),
               result.data
            );
            const updater = (cols: DLibraryCollection[]) =>
               cols.map((c) => (c.id === collectionId ? result.data! : c));
            queryClient.setQueryData(libraryKeys.collections(), updater);
         }
      },
   });
};
