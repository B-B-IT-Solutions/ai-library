jest.mock("@/data/actions/library");

import {
   InfiniteData,
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
   createLibraryCollection,
   deleteLibraryCollection,
   getLibraryCollections,
   getLibraryEntriesPage,
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
   deleteCollectionOptions,
   infiniteLoadLibraryEntriesOptions,
   loadLibraryCollectionsOptions,
   preloadLibraryCollectionsOptions,
   preloadLibraryEntriesOptions,
   toggleFavoriteOptions,
   updateCollectionOptions,
   useCreateCollection,
   useDeleteCollection,
   useInfiniteLoadLibraryEntries,
   useLoadLibraryCollections,
   useToggleFavorite,
   useUpdateCollection,
} from "./library";
import {
   LoadLibraryEntriesParams,
   UpdateCollectionParams,
   UpdateIsFavoriteParams,
} from "./types";

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

const updateLibraryCollectionMock =
   updateLibraryCollection as jest.MockedFunction<
      typeof updateLibraryCollection
   >;

const deleteLibraryCollectionMock =
   deleteLibraryCollection as jest.MockedFunction<
      typeof deleteLibraryCollection
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
      expect(queryClientMock.getQueryData).not.toHaveBeenCalled();
      expect(queryClientMock.setQueryData).not.toHaveBeenCalled();

      const result1: ActionResult<DLibraryCollection> = {
         success: true,
         message: "Collection created",
         data: undefined,
      };

      options.onSuccess!(result1, update, undefined, mutationContextMock);

      const expectedQueryKey: QueryKey = ["library", "collections"];
      expect(queryClientMock.getQueryData).toHaveBeenCalledTimes(1);
      expect(queryClientMock.getQueryData).toHaveBeenCalledWith(
         expectedQueryKey
      );
      expect(queryClientMock.setQueryData).not.toHaveBeenCalled();

      const result2: ActionResult<DLibraryCollection> = {
         success: true,
         message: "Collection created",
         data: dtestData.dLibraryCollection(),
      };

      options.onSuccess!(result2, update, undefined, mutationContextMock);

      expect(queryClientMock.getQueryData).toHaveBeenCalledTimes(2);
      expect(queryClientMock.getQueryData).toHaveBeenNthCalledWith(
         2,
         expectedQueryKey
      );

      expect(queryClientMock.setQueryData).toHaveBeenCalledTimes(1);
      expect(queryClientMock.setQueryData).toHaveBeenCalledWith(
         expectedQueryKey,
         [result2.data]
      );
   });

   test("useCreateCollection test", async () => {
      const actionResult: ActionResult<DLibraryCollection> = {
         success: true,
         message: "Collection created",
         data: dtestData.dLibraryCollection(),
      };
      createLibraryCollectionMock.mockResolvedValue(actionResult);

      const { result } = renderHookWithReactQuery(() => useCreateCollection());

      const newCollection = dtestData.dLibraryCollectionUpdate();

      await waitFor(() => {
         result.current.mutate(newCollection);
         expect(result.current.isSuccess).toBe(true);
         expect(createLibraryCollectionMock).toHaveBeenCalledTimes(1);
         expect(createLibraryCollectionMock).toHaveBeenCalledWith(
            newCollection
         );
      });
   });
});

describe("updateCollection hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("updateCollectionOptions test", async () => {
      const expectedOptions: UseMutationOptions<
         ActionResult,
         Error,
         DLibraryCollection
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = updateCollectionOptions(queryClientMock);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(queryClientMock.setQueryData).not.toHaveBeenCalled();

      const result: ActionResult = {
         success: true,
         message: "Collection updated",
         data: undefined,
      };

      const update = dtestData.dLibraryCollectionUpdate(789);
      const collection1 = dtestData.dLibraryCollection(1);
      const collection2 = dtestData.dLibraryCollection(2);

      const params: UpdateCollectionParams = {
         collectionId: collection1.id,
         data: update,
      };

      options.onSuccess!(result, params, undefined, mutationContextMock);

      const expectedQueryKey: QueryKey = ["library", "collections"];
      expect(queryClientMock.setQueryData).toHaveBeenCalledTimes(1);
      expect(queryClientMock.setQueryData).toHaveBeenCalledWith(
         expectedQueryKey,
         expect.any(Function)
      );

      const updaterFn = queryClientMock.setQueryData.mock.calls[0][1] as (
         cols: DLibraryCollection[]
      ) => DLibraryCollection[];

      const updatedCollection1 = { ...collection1, ...update };
      const expectedUpdaterResult = [updatedCollection1, collection2];

      const updaterParams = [collection1, collection2];
      const updaterResult = updaterFn(updaterParams);
      expect(updaterResult).toEqual(expectedUpdaterResult);
   });

   test("useUpdateCollection test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Collection updated",
      };
      updateLibraryCollectionMock.mockResolvedValue(actionResult);

      const { result } = renderHookWithReactQuery(() => useUpdateCollection());

      const update = dtestData.dLibraryCollectionUpdate(789);
      const collection = dtestData.dLibraryCollection(1);

      const params: UpdateCollectionParams = {
         collectionId: collection.id,
         data: update,
      };

      await waitFor(() => {
         result.current.mutate(params);
         expect(result.current.isSuccess).toBe(true);
         expect(updateLibraryCollectionMock).toHaveBeenCalledTimes(1);
         expect(updateLibraryCollectionMock).toHaveBeenCalledWith(
            params.collectionId,
            params.data
         );
      });
   });
});

describe("deleteCollection hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("deleteCollectionOptions test", async () => {
      const expectedOptions: UseMutationOptions<ActionResult, Error, string> = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = deleteCollectionOptions(queryClientMock);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(queryClientMock.setQueryData).not.toHaveBeenCalled();

      const result: ActionResult = {
         success: true,
         message: "Collection deleted",
      };

      const collection1 = dtestData.dLibraryCollection(1);
      const collection2 = dtestData.dLibraryCollection(2);

      options.onSuccess!(
         result,
         collection1.id,
         undefined,
         mutationContextMock
      );

      const expectedQueryKey: QueryKey = ["library", "collections"];
      expect(queryClientMock.setQueryData).toHaveBeenCalledTimes(1);
      expect(queryClientMock.setQueryData).toHaveBeenCalledWith(
         expectedQueryKey,
         expect.any(Function)
      );

      const updaterFn = queryClientMock.setQueryData.mock.calls[0][1] as (
         cols: DLibraryCollection[]
      ) => DLibraryCollection[];

      const updaterParams = [collection1, collection2];
      const updaterResult = updaterFn(updaterParams);
      const expectedUpdaterResult = [collection2];
      expect(updaterResult).toEqual(expectedUpdaterResult);
   });

   test("useDeleteCollection test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Collection deleted",
      };
      deleteLibraryCollectionMock.mockResolvedValue(actionResult);

      const { result } = renderHookWithReactQuery(() => useDeleteCollection());

      const collection = dtestData.dLibraryCollection(1);

      await waitFor(() => {
         result.current.mutate(collection.id);
         expect(result.current.isSuccess).toBe(true);
         expect(deleteLibraryCollectionMock).toHaveBeenCalledTimes(1);
         expect(deleteLibraryCollectionMock).toHaveBeenCalledWith(
            collection.id
         );
      });
   });
});
