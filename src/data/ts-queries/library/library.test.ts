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

import {
   deleteCollectionOptions,
   loadCollectionPreviewsOptions,
   loadPromptCollectionIdsOptions,
   preloadCollectionPreviewsOptions,
   updatePromptCollectionsOptions,
   useDeleteCollection,
   useLoadCollectionPreviews,
   useLoadPromptCollectionIds,
   useUpdatePromptCollections,
} from "./library";
import {
   LoadCollectionIdsParams,
   LoadCollectionPreviewsParams,
   UpdateCollectionIdsParams,
} from "./types";

const queryClientMock = mockDeep<QueryClient>();

const mutationContextMock: MutationFunctionContext = {
   client: queryClientMock,
   meta: {},
};

const getCollectionPreviewsMock = getCollectionPreviews as jest.MockedFunction<
   typeof getCollectionPreviews
>;

const deleteCollectionMock = deleteCollection as jest.MockedFunction<
   typeof deleteCollection
>;

const getPromptCollectionIdsMock =
   getPromptCollectionIds as jest.MockedFunction<typeof getPromptCollectionIds>;

const updatePromptCollectionsMock =
   updatePromptCollections as jest.MockedFunction<
      typeof updatePromptCollections
   >;

describe("prefetch options tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("preloadCollectionPreviewsOptions  - test", async () => {
      const collections = dtestData.dCollectionPreviews();
      getCollectionPreviewsMock.mockResolvedValue(collections);

      const options = preloadCollectionPreviewsOptions();
      const queryFn = options.queryFn as QueryFunction<DCollectionPreview[]>;
      const context = {} as QueryFunctionContext;
      const fnResult = await queryFn(context);

      const expectedOptions: UndefinedInitialDataOptions<
         DCollectionPreview[],
         Error,
         DCollectionPreview[]
      > = {
         queryKey: ["library", "collection-previews"],
         queryFn: jest.fn(),
      };

      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(getCollectionPreviewsMock).toHaveBeenCalledTimes(1);
      expect(fnResult).toEqual(collections);
   });
});

describe("loadCollectionPreviews hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("loadCollectionPreviewsOptions - test", async () => {
      const enabled = true;

      const expectedOptions: UndefinedInitialDataOptions<
         DCollectionPreview[],
         Error,
         DCollectionPreview[]
      > = {
         queryKey: ["library", "collection-previews"],
         queryFn: jest.fn(),
         placeholderData: keepPreviousData,
         enabled,
         staleTime: 5 * 60 * 1000,
      };

      const params: LoadCollectionPreviewsParams = {
         enabled,
      };

      const options = loadCollectionPreviewsOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useLoadCollectionPreviews test", async () => {
      const enabled = true;

      const collections = dtestData.dCollectionPreviews();
      getCollectionPreviewsMock.mockResolvedValue(collections);

      const params: LoadCollectionPreviewsParams = {
         enabled,
      };

      const { result } = renderHookWithReactQuery(() =>
         useLoadCollectionPreviews(params)
      );

      await waitFor(() => {
         expect(result.current.data).toEqual(collections);
         expect(getCollectionPreviewsMock).toHaveBeenCalledTimes(1);
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

describe("loadPromptCollectionIds hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("loadPromptCollectionIdsOptions - test", async () => {
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

      const options = loadPromptCollectionIdsOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useLoadPromptCollectionIds test", async () => {
      const entryId = "entry-id-1";
      const enabled = true;

      const collectionIds = dtestData.dCollectionIds();
      getPromptCollectionIdsMock.mockResolvedValue(collectionIds);

      const params: LoadCollectionIdsParams = {
         entryId,
         enabled,
      };

      const { result } = renderHookWithReactQuery(() =>
         useLoadPromptCollectionIds(params)
      );

      await waitFor(() => {
         expect(result.current.data).toEqual(collectionIds);
         expect(getPromptCollectionIdsMock).toHaveBeenCalledTimes(1);
      });
   });
});

describe("updatePromptCollections hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("updatePromptCollectionsOptions test", async () => {
      const expectedOptions: UseMutationOptions<
         ActionResult,
         Error,
         DCollection
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = updatePromptCollectionsOptions(queryClientMock);
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

   test("useUpdatePromptCollections test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Collections updated",
      };
      updatePromptCollectionsMock.mockResolvedValue(actionResult);

      const { result } = renderHookWithReactQuery(() =>
         useUpdatePromptCollections()
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
         expect(updatePromptCollectionsMock).toHaveBeenCalledTimes(1);
         expect(updatePromptCollectionsMock).toHaveBeenCalledWith(
            params.entryId,
            params.collectionIds
         );
      });
   });
});
