jest.mock("@/data/actions/library");

import {
   InfiniteData,
   InvalidateQueryFilters,
   keepPreviousData,
   MutationFunctionContext,
   QueryClient,
   QueryFunction,
   QueryFunctionContext,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   UndefinedInitialDataOptions,
   UseMutationOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";
import { mockDeep } from "jest-mock-extended";

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

import {
   createCollectionOptions,
   infiniteLoadLibraryEntriesOptions,
   loadLibraryCollectionsOptions,
   preloadLibraryCollectionsOptions,
   preloadLibraryEntriesOptions,
   toggleFavoriteOptions,
   useCreateCollection,
   useInfiniteLoadLibraryEntries,
   useLoadLibraryCollections,
   useToggleFavorite,
} from "./library";
import { LoadLibraryEntriesParams, UpdateIsFavoriteParams } from "./types";

const queryClientMock = mockDeep<QueryClient>();

const mutationContextMock: MutationFunctionContext = {
   client: queryClientMock,
   meta: {},
};

const getLibraryEntriesPageMock = getLibraryEntriesPage as jest.MockedFunction<
   typeof getLibraryEntriesPage
>;

const getLibraryCollectionsMock = getLibraryCollections as jest.MockedFunction<
   typeof getLibraryCollections
>;

const toggleLibraryEntryFavoriteMock =
   toggleLibraryEntryFavorite as jest.MockedFunction<
      typeof toggleLibraryEntryFavorite
   >;

const createLibraryCollectionMock =
   createLibraryCollection as jest.MockedFunction<
      typeof createLibraryCollection
   >;

describe("prefetch options tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("preloadLibraryEntriesOptions  - test", async () => {
      const page = dtestData.dLibraryEntriesPage();
      getLibraryEntriesPageMock.mockResolvedValue(page);

      const filters = dtestData.dLibraryEntriesFilter();
      const params: LoadLibraryEntriesParams = { filters };

      const options = preloadLibraryEntriesOptions(params);
      const queryFn = options.queryFn as QueryFunction<DLibraryEntriesPage>;
      const context = {} as QueryFunctionContext;
      const fnResult = await queryFn(context);

      const expectedOptions: UndefinedInitialDataOptions<
         DLibraryEntriesPage,
         Error,
         DLibraryEntriesPage
      > = {
         queryKey: ["library", "entries", filters],
         queryFn: jest.fn(),
      };

      const expectedQuery: DLibraryEntriesPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: params.filters,
      };

      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(getLibraryEntriesPageMock).toHaveBeenCalledTimes(1);
      expect(getLibraryEntriesPageMock).toHaveBeenCalledWith(expectedQuery);
      expect(fnResult).toEqual(page);
   });

   test("preloadLibraryCollectionsOptions  - test", async () => {
      const collections = dtestData.dLibraryCollections();
      getLibraryCollectionsMock.mockResolvedValue(collections);

      const options = preloadLibraryCollectionsOptions();
      const queryFn = options.queryFn as QueryFunction<DLibraryCollection[]>;
      const context = {} as QueryFunctionContext;
      const fnResult = await queryFn(context);

      const expectedOptions: UndefinedInitialDataOptions<
         DLibraryCollection[],
         Error,
         DLibraryCollection[]
      > = {
         queryKey: ["library", "collections"],
         queryFn: jest.fn(),
      };

      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(getLibraryCollectionsMock).toHaveBeenCalledTimes(1);
      expect(fnResult).toEqual(collections);
   });
});

describe("loadLibraryEntries hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("infiniteLoadLibraryEntriesOptions - test", async () => {
      const filters = dtestData.dLibraryEntriesFilter();
      const params: LoadLibraryEntriesParams = { filters };

      const expectedOptions: UndefinedInitialDataInfiniteOptions<
         DLibraryEntriesPage,
         Error,
         InfiniteData<DLibraryEntriesPage, unknown>,
         QueryKey,
         number
      > = {
         queryKey: ["library", "entries", filters],
         queryFn: jest.fn(),
         initialPageParam: 0,
         getNextPageParam: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = infiniteLoadLibraryEntriesOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useInfiniteLoadLibraryEntries test", async () => {
      const page = dtestData.dLibraryEntriesPage();
      getLibraryEntriesPageMock.mockResolvedValue(page);

      const filters = dtestData.dLibraryEntriesFilter();
      const params: LoadLibraryEntriesParams = { filters };

      const { result } = renderHookWithReactQuery(() =>
         useInfiniteLoadLibraryEntries(params)
      );

      const expectedQuery: DLibraryEntriesPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: params.filters,
      };

      await waitFor(() => {
         expect(result.current.data?.pageParams).toEqual([0]);
         expect(result.current.data?.pages).toHaveLength(1);
         expect(result.current.data?.pages[0]).toEqual(page);
         expect(getLibraryEntriesPageMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntriesPageMock).toHaveBeenCalledWith(expectedQuery);
      });
   });
});

describe("toggleFavorite hooks tests", () => {
   test("toggleFavoriteOptions test", async () => {
      const expectedOptions: UseMutationOptions<
         ActionResult,
         Error,
         UpdateIsFavoriteParams
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = toggleFavoriteOptions();
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useToggleFavorite test", async () => {
      const { result } = renderHookWithReactQuery(() => useToggleFavorite());

      const params: UpdateIsFavoriteParams = {
         entryId: "1",
         isFavorite: true,
      };

      await waitFor(() => {
         result.current.mutate(params);
         expect(result.current.isSuccess).toBe(true);
         expect(toggleLibraryEntryFavoriteMock).toHaveBeenCalledTimes(1);
         expect(toggleLibraryEntryFavoriteMock).toHaveBeenCalledWith(
            params.entryId,
            params.isFavorite
         );
      });
   });
});

describe("loadLibraryCollections hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("loadLibraryCollectionsOptions - test", async () => {
      const expectedOptions: UndefinedInitialDataOptions<
         DLibraryCollection[],
         Error,
         DLibraryCollection[]
      > = {
         queryKey: ["library", "collections"],
         queryFn: jest.fn(),
         placeholderData: keepPreviousData,
         staleTime: 5 * 60 * 1000,
      };

      const options = loadLibraryCollectionsOptions();
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useLoadLibraryCollections test", async () => {
      const collections = dtestData.dLibraryCollections();
      getLibraryCollectionsMock.mockResolvedValue(collections);

      const { result } = renderHookWithReactQuery(() =>
         useLoadLibraryCollections()
      );

      await waitFor(() => {
         expect(result.current.data).toEqual(collections);
         expect(getLibraryCollectionsMock).toHaveBeenCalledTimes(1);
      });
   });
});

describe("createCollection hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("createCollectionOptions test", async () => {
      const result: ActionResult<DLibraryCollection> = {
         success: true,
         message: "Collection created",
         data: dtestData.dLibraryCollection(),
      };
      const update = dtestData.dLibraryCollectionUpdate();

      const expectedOptions: UseMutationOptions<
         ActionResult<DLibraryCollection>,
         Error,
         DLibraryCollectionUpdate
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = createCollectionOptions(queryClientMock);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(queryClientMock.invalidateQueries).not.toHaveBeenCalled();

      if (options.onSuccess) {
         options.onSuccess(result, update, undefined, mutationContextMock);
      }

      const expectedInvalidateFilters: InvalidateQueryFilters = {
         queryKey: ["library", "collections"],
      };
      expect(queryClientMock.invalidateQueries).toHaveBeenCalledTimes(1);
      expect(queryClientMock.invalidateQueries).toHaveBeenCalledWith(
         expectedInvalidateFilters
      );
   });

   test("useCreateCollection test", async () => {
      const { result } = renderHookWithReactQuery(() => useCreateCollection());

      const update = dtestData.dLibraryCollectionUpdate();

      await waitFor(() => {
         result.current.mutate(update);
         expect(result.current.isSuccess).toBe(true);
         expect(createLibraryCollectionMock).toHaveBeenCalledTimes(1);
         expect(createLibraryCollectionMock).toHaveBeenCalledWith(update);
      });
   });
});
