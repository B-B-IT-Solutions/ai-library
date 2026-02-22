import {
   FetchQueryOptions,
   InfiniteData,
   keepPreviousData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   UndefinedInitialDataOptions,
   useInfiniteQuery,
   UseInfiniteQueryResult,
   useMutation,
   UseMutationResult,
   useQuery,
   useQueryClient,
   UseQueryResult,
} from "@tanstack/react-query";

import {
   addEntryToCollection,
   createLibraryCollection,
   deleteLibraryCollection,
   getLibraryCategories,
   getLibraryCollections,
   getLibraryEntriesPage,
   getLibraryModels,
   removeEntryFromCollection,
   toggleLibraryEntryFavorite,
   updateLibraryCollection,
} from "@/data/actions/library";
import {
   CreateCollectionInput,
   DLibraryCollection,
   DLibraryEntriesFilter,
   DLibraryEntriesPage,
   DLibraryEntriesPageQuery,
   UpdateCollectionInput,
} from "@/data/types/domain/library";
import { ActionResult } from "@/data/types/utils";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import { libraryKeys } from "./utils";

type LoadLibraryEntriesParams = {
   filters: DLibraryEntriesFilter;
};

// ==================== Preload Options ====================

export const preloadLibraryEntriesOptions = (
   props: LoadLibraryEntriesParams
): FetchQueryOptions<DLibraryEntriesPage, Error, DLibraryEntriesPage> => {
   const { filters } = props;

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

export const preloadLibraryCategoriesOptions = (): FetchQueryOptions<
   string[],
   Error,
   string[]
> => {
   return {
      queryKey: libraryKeys.categories(),
      queryFn: async () => {
         return await getLibraryCategories();
      },
   };
};

export const preloadLibraryModelsOptions = (): FetchQueryOptions<
   string[],
   Error,
   string[]
> => {
   return {
      queryKey: libraryKeys.models(),
      queryFn: async () => {
         return await getLibraryModels();
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
      queryFn: async () => {
         return await getLibraryCollections();
      },
   };
};

// ==================== Infinite Scroll ====================

export const infiniteLoadLibraryEntriesOptions = (
   props: LoadLibraryEntriesParams
): UndefinedInitialDataInfiniteOptions<
   DLibraryEntriesPage,
   Error,
   InfiniteData<DLibraryEntriesPage>,
   QueryKey,
   number
> => {
   const { filters } = props;
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
      initialPageParam: 1,
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

// ==================== Regular Queries ====================

export const loadLibraryCategoriesOptions = (): UndefinedInitialDataOptions<
   string[],
   Error,
   string[]
> => {
   return {
      queryKey: libraryKeys.categories(),
      queryFn: async () => {
         return await getLibraryCategories();
      },
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000,
   };
};

export const useLoadLibraryCategories = (): UseQueryResult<string[]> => {
   const options = loadLibraryCategoriesOptions();
   return useQuery<string[]>(options);
};

export const loadLibraryModelsOptions = (): UndefinedInitialDataOptions<
   string[],
   Error,
   string[]
> => {
   return {
      queryKey: libraryKeys.models(),
      queryFn: async () => {
         return await getLibraryModels();
      },
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000,
   };
};

export const useLoadLibraryModels = (): UseQueryResult<string[]> => {
   const options = loadLibraryModelsOptions();
   return useQuery<string[]>(options);
};

export const loadLibraryCollectionsOptions = (): UndefinedInitialDataOptions<
   DLibraryCollection[],
   Error,
   DLibraryCollection[]
> => {
   return {
      queryKey: libraryKeys.collections(),
      queryFn: async () => {
         return await getLibraryCollections();
      },
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

// ==================== Mutations ====================

export const useToggleFavorite = (): UseMutationResult<
   ActionResult,
   Error,
   { entryId: string; isFavorite: boolean }
> => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({
         entryId,
         isFavorite,
      }: {
         entryId: string;
         isFavorite: boolean;
      }) => {
         return await toggleLibraryEntryFavorite(entryId, isFavorite);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: libraryKeys.all });
      },
   });
};

export const useCreateCollection = (): UseMutationResult<
   ActionResult<DLibraryCollection>,
   Error,
   CreateCollectionInput
> => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (data: CreateCollectionInput) => {
         return await createLibraryCollection(data);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: libraryKeys.collections() });
      },
   });
};

export const useUpdateCollection = (): UseMutationResult<
   ActionResult,
   Error,
   { collectionId: string; data: UpdateCollectionInput }
> => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({
         collectionId,
         data,
      }: {
         collectionId: string;
         data: UpdateCollectionInput;
      }) => {
         return await updateLibraryCollection(collectionId, data);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: libraryKeys.collections() });
      },
   });
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
