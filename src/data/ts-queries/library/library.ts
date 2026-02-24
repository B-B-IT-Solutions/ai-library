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

import {
   addEntryToCollection,
   createLibraryCollection,
   deleteLibraryCollection,
   getLibraryCollections,
   getLibraryEntriesPage,
   removeEntryFromCollection,
   toggleLibraryEntryFavorite,
   updateLibraryCollection,
} from "@/data/actions/library";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
   DLibraryEntriesPage,
   DLibraryEntriesPageQuery,
} from "@/data/types/domain/library";
import { ActionResult } from "@/data/types/utils";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import {
   LoadLibraryEntriesParams,
   UpdateCollectionParams,
   UpdateIsFavoriteParams,
} from "./types";
import { libraryKeys } from "./utils";

export const preloadLibraryEntriesOptions = (
   params: LoadLibraryEntriesParams
): FetchQueryOptions<DLibraryEntriesPage, Error, DLibraryEntriesPage> => {
   const { filters } = params;

   return {
      queryKey: libraryKeys.entries(filters),
      queryFn: async () => {
         const query: DLibraryEntriesPageQuery = pageQuery(
            INIT_PAGE_NUMBER,
            PAGE_SIZE,
            undefined,
            filters
         );
         return await getLibraryEntriesPage(query);
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
   DLibraryEntriesPage,
   Error,
   InfiniteData<DLibraryEntriesPage>,
   QueryKey,
   number
> => {
   const { filters } = params;
   return {
      queryKey: libraryKeys.entries(filters),
      queryFn: async ({ pageParam }) => {
         const query: DLibraryEntriesPageQuery = pageQuery(
            pageParam,
            PAGE_SIZE,
            undefined,
            filters
         );
         return await getLibraryEntriesPage(query);
      },
      initialPageParam: INIT_PAGE_NUMBER,
      getNextPageParam: getNextPageParam,
      staleTime: 5 * 60 * 1000,
   };
};

export const useInfiniteLoadLibraryEntries = (
   props: LoadLibraryEntriesParams
): UseInfiniteQueryResult<InfiniteData<DLibraryEntriesPage>, Error> => {
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
         const { entryId, isFavorite } = params;
         return await toggleLibraryEntryFavorite(entryId, isFavorite);
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
         const updater = (col?: DLibraryCollection) => {
            if (col?.id === params.collectionId) {
               return { ...col, ...params.data };
            }
            return col;
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

export const useDeleteCollection = (): UseMutationResult<
   ActionResult,
   Error,
   string
> => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (collectionId: string) => {
         return await deleteLibraryCollection(collectionId);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: libraryKeys.collections() });
         queryClient.invalidateQueries({ queryKey: libraryKeys.all });
      },
   });
};

export const useAddToCollection = (): UseMutationResult<
   ActionResult,
   Error,
   { collectionId: string; entryId: string }
> => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({
         collectionId,
         entryId,
      }: {
         collectionId: string;
         entryId: string;
      }) => {
         return await addEntryToCollection(collectionId, entryId);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: libraryKeys.all });
      },
   });
};

export const useRemoveFromCollection = (): UseMutationResult<
   ActionResult,
   Error,
   { collectionId: string; entryId: string }
> => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({
         collectionId,
         entryId,
      }: {
         collectionId: string;
         entryId: string;
      }) => {
         return await removeEntryFromCollection(collectionId, entryId);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: libraryKeys.all });
      },
   });
};
