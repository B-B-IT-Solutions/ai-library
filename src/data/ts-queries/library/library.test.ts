jest.mock("@/data/actions/collection");

import {
   keepPreviousData,
   MutationFunctionContext,
   QueryClient,
   QueryFunction,
   QueryFunctionContext,
   QueryKey,
   UndefinedInitialDataOptions,
   UseMutationOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";
import { mockDeep } from "jest-mock-extended";

import {
   createCollection,
   deleteCollection,
   getCollections,
   getTemplateCollectionIds,
   updateCollection,
   updateTemplateCollections,
} from "@/data/actions/collection";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";

import {
   createCollectionOptions,
   deleteCollectionOptions,
   loadCollectionsOptions,
   loadTemplateCollectionIdsOptions,
   preloadCollectionsOptions,
   updateTemplateCollectionsOptions,
   useCreateCollection,
   useDeleteCollection,
   useLoadCollections,
   useLoadTemplateCollectionIds,
   useUpdateTemplateCollections,
} from "./library";
import { LoadCollectionIdsParams, UpdateCollectionIdsParams } from "./types";

const queryClientMock = mockDeep<QueryClient>();

const mutationContextMock: MutationFunctionContext = {
   client: queryClientMock,
   meta: {},
};

const getCollectionsMock = getCollections as jest.MockedFunction<
   typeof getCollections
>;

const createCollectionMock = createCollection as jest.MockedFunction<
   typeof createCollection
>;

const updateCollectionMock = updateCollection as jest.MockedFunction<
   typeof updateCollection
>;

const deleteCollectionMock = deleteCollection as jest.MockedFunction<
   typeof deleteCollection
>;

const getTemplateCollectionIdsMock =
   getTemplateCollectionIds as jest.MockedFunction<
      typeof getTemplateCollectionIds
   >;

const updateTemplateCollectionsMock =
   updateTemplateCollections as jest.MockedFunction<
      typeof updateTemplateCollections
   >;

describe("prefetch options tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("preloadLibraryCollectionsOptions  - test", async () => {
      const collections = dtestData.dCollections();
      getCollectionsMock.mockResolvedValue(collections);

      const options = preloadCollectionsOptions();
      const queryFn = options.queryFn as QueryFunction<DCollection[]>;
      const context = {} as QueryFunctionContext;
      const fnResult = await queryFn(context);

      const expectedOptions: UndefinedInitialDataOptions<
         DCollection[],
         Error,
         DCollection[]
      > = {
         queryKey: ["library", "collections"],
         queryFn: jest.fn(),
      };

      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(getCollectionsMock).toHaveBeenCalledTimes(1);
      expect(fnResult).toEqual(collections);
   });
});

describe("loadCollections hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("loadCollectionsOptions - test", async () => {
      const expectedOptions: UndefinedInitialDataOptions<
         DCollection[],
         Error,
         DCollection[]
      > = {
         queryKey: ["library", "collections"],
         queryFn: jest.fn(),
         placeholderData: keepPreviousData,
         staleTime: 5 * 60 * 1000,
      };

      const options = loadCollectionsOptions();
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useLoadCollections test", async () => {
      const collections = dtestData.dCollections();
      getCollectionsMock.mockResolvedValue(collections);

      const { result } = renderHookWithReactQuery(() => useLoadCollections());

      await waitFor(() => {
         expect(result.current.data).toEqual(collections);
         expect(getCollectionsMock).toHaveBeenCalledTimes(1);
      });
   });
});

describe("createCollection hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("createCollectionOptions test", async () => {
      const update = dtestData.dCollectionUpdate();

      const expectedOptions: UseMutationOptions<
         ActionResult<DCollection>,
         Error,
         DCollectionUpdate
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = createCollectionOptions(queryClientMock);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(queryClientMock.getQueryData).not.toHaveBeenCalled();
      expect(queryClientMock.setQueryData).not.toHaveBeenCalled();

      const result1: ActionResult<DCollection> = {
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

      const result2: ActionResult<DCollection> = {
         success: true,
         message: "Collection created",
         data: dtestData.dCollection(),
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
      const actionResult: ActionResult<DCollection> = {
         success: true,
         message: "Collection created",
         data: dtestData.dCollection(),
      };
      createCollectionMock.mockResolvedValue(actionResult);

      const { result } = renderHookWithReactQuery(() => useCreateCollection());

      const newCollection = dtestData.dCollectionUpdate();

      await waitFor(() => {
         result.current.mutate(newCollection);
         expect(result.current.isSuccess).toBe(true);
         expect(createCollectionMock).toHaveBeenCalledTimes(1);
         expect(createCollectionMock).toHaveBeenCalledWith(newCollection);
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

      const collection1 = dtestData.dCollection(1);
      const collection2 = dtestData.dCollection(2);

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
         cols: DCollection[]
      ) => DCollection[];

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
      deleteCollectionMock.mockResolvedValue(actionResult);

      const { result } = renderHookWithReactQuery(() => useDeleteCollection());

      const collection = dtestData.dCollection(1);

      await waitFor(() => {
         result.current.mutate(collection.id);
         expect(result.current.isSuccess).toBe(true);
         expect(deleteCollectionMock).toHaveBeenCalledTimes(1);
         expect(deleteCollectionMock).toHaveBeenCalledWith(collection.id);
      });
   });
});

describe("loadTemplateCollectionIds hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("loadTemplateCollectionIdsOptions - test", async () => {
      const entryId = "entry-id-1";
      const enabled = true;

      const expectedOptions: UndefinedInitialDataOptions<
         string[],
         Error,
         string[]
      > = {
         queryKey: ["library", "entry", entryId, "collections"],
         queryFn: jest.fn(),
         placeholderData: keepPreviousData,
         enabled: enabled,
         staleTime: 5 * 60 * 1000,
      };

      const params: LoadCollectionIdsParams = {
         entryId,
         enabled,
      };

      const options = loadTemplateCollectionIdsOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useLoadTemplateCollectionIds test", async () => {
      const entryId = "entry-id-1";
      const enabled = true;

      const collectionIds = dtestData.dCollectionIds();
      getTemplateCollectionIdsMock.mockResolvedValue(collectionIds);

      const params: LoadCollectionIdsParams = {
         entryId,
         enabled,
      };

      const { result } = renderHookWithReactQuery(() =>
         useLoadTemplateCollectionIds(params)
      );

      await waitFor(() => {
         expect(result.current.data).toEqual(collectionIds);
         expect(getTemplateCollectionIdsMock).toHaveBeenCalledTimes(1);
      });
   });
});

describe("updateTemplateCollections hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("updateTemplateCollectionsOptions test", async () => {
      const expectedOptions: UseMutationOptions<
         ActionResult,
         Error,
         DCollection
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = updateTemplateCollectionsOptions(queryClientMock);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(queryClientMock.setQueryData).not.toHaveBeenCalled();

      const result: ActionResult = {
         success: true,
         message: "Collections updated",
      };

      const entryId = "entry-id-1";
      const collectionIds = dtestData.dCollectionIds();

      const params: UpdateCollectionIdsParams = {
         entryId,
         collectionIds,
      };

      options.onSuccess!(result, params, undefined, mutationContextMock);

      const expectedQueryKey: QueryKey = [
         "library",
         "entry",
         entryId,
         "collections",
      ];
      expect(queryClientMock.setQueryData).toHaveBeenCalledTimes(1);
      expect(queryClientMock.setQueryData).toHaveBeenCalledWith(
         expectedQueryKey,
         collectionIds
      );
   });

   test("useUpdateTemplateCollections test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Collections updated",
      };
      updateTemplateCollectionsMock.mockResolvedValue(actionResult);

      const { result } = renderHookWithReactQuery(() =>
         useUpdateTemplateCollections()
      );

      const entryId = "entry-id-1";
      const collectionIds = dtestData.dCollectionIds();

      const params: UpdateCollectionIdsParams = {
         entryId,
         collectionIds,
      };

      await waitFor(() => {
         result.current.mutate(params);
         expect(result.current.isSuccess).toBe(true);
         expect(updateTemplateCollectionsMock).toHaveBeenCalledTimes(1);
         expect(updateTemplateCollectionsMock).toHaveBeenCalledWith(
            params.entryId,
            params.collectionIds
         );
      });
   });
});
