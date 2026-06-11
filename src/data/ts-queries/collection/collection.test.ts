jest.mock("@/data/actions/collection");

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
   addPromptToCollection,
   createCollection,
   getCollectionPreviews,
   getCollectionPromptIds,
   getCollectionsPage,
   removePromptFromCollection,
} from "@/data/actions/collection";
import {
   DCollection,
   DCollectionPreview,
   DCollectionsPage,
   DCollectionsPageQuery,
   DCollectionUpdate,
} from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";
import { LoadCollectionPreviewsParams } from "../library/types";

import {
   addPromptToCollectionOptions,
   createCollectionOptions,
   infiniteLoadCollectionsPageOptions,
   loadCollectionPreviewsOptions,
   loadCollectionPromptIdsOptions,
   preloadCollectionPreviewsOptions,
   removePromptFromCollectionOptions,
   useAddPromptToCollection,
   useCreateCollection,
   useInfiniteLoadCollectionsPage,
   useLoadCollectionPreviews,
   useLoadCollectionPromptIds,
   useRemovePromptFromCollection,
} from "./collection";
import {
   AddPromptToCollectionParams,
   LoadCollectionsPageParams,
   RemovePromptFromCollectionParams,
} from "./types";

const queryClientMock = mockDeep<QueryClient>();

const mutationContextMock: MutationFunctionContext = {
   client: queryClientMock,
   meta: {},
};

const getCollectionsPageMock = getCollectionsPage as jest.MockedFunction<
   typeof getCollectionsPage
>;

const getCollectionPreviewsMock = getCollectionPreviews as jest.MockedFunction<
   typeof getCollectionPreviews
>;

const getCollectionPromptIdsMock =
   getCollectionPromptIds as jest.MockedFunction<typeof getCollectionPromptIds>;

const addPromptToCollectionMock = addPromptToCollection as jest.MockedFunction<
   typeof addPromptToCollection
>;

const removePromptFromCollectionMock =
   removePromptFromCollection as jest.MockedFunction<
      typeof removePromptFromCollection
   >;

const createCollectionMock = createCollection as jest.MockedFunction<
   typeof createCollection
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
         queryKey: ["collections", "previews"],
         queryFn: jest.fn(),
      };

      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(getCollectionPreviewsMock).toHaveBeenCalledTimes(1);
      expect(fnResult).toEqual(collections);
   });
});

describe("infiniteLoadCollectionsPage hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("infiniteLoadCollectionsPageOptions - test", async () => {
      const filters = dtestData.dCollectionsFilter();
      const sort = dtestData.sort();
      const params: LoadCollectionsPageParams = { filters, sort };

      const expectedOptions: UndefinedInitialDataInfiniteOptions<
         DCollectionsPage,
         Error,
         InfiniteData<DCollectionsPage, unknown>,
         QueryKey,
         number
      > = {
         queryKey: ["collections", params],
         queryFn: jest.fn(),
         initialPageParam: 0,
         getNextPageParam: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = infiniteLoadCollectionsPageOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useInfiniteLoadCollectionsPage test", async () => {
      const page = dtestData.dCollectionsPage();
      getCollectionsPageMock.mockResolvedValue(page);

      const filters = dtestData.dCollectionsFilter();
      const sort = dtestData.sort();
      const params: LoadCollectionsPageParams = { filters, sort };

      const { result } = renderHookWithReactQuery(() =>
         useInfiniteLoadCollectionsPage(params)
      );

      const expectedQuery: DCollectionsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: params.filters,
         sort: params.sort,
      };

      await waitFor(() => {
         expect(result.current.data?.pageParams).toEqual([0]);
         expect(result.current.data?.pages).toHaveLength(1);
         expect(result.current.data?.pages[0]).toEqual(page);
         expect(getCollectionsPageMock).toHaveBeenCalledTimes(1);
         expect(getCollectionsPageMock).toHaveBeenCalledWith(expectedQuery);
      });
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
         queryKey: ["collections", "previews"],
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

describe("loadCollectionPromptIds hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("loadCollectionPromptIdsOptions - test", async () => {
      const collectionId = "a7884b9f-3a28-4b5a-bea1-3c889106152e";
      const expectedOptions: UndefinedInitialDataOptions<
         string[],
         Error,
         string[]
      > = {
         queryKey: ["collections", "collection", collectionId, "templateIds"],
         queryFn: jest.fn(),
         placeholderData: keepPreviousData,
         staleTime: 2 * 60 * 1000,
      };

      const options = loadCollectionPromptIdsOptions(collectionId);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useLoadCollectionPromptIds test", async () => {
      const collectionId = "a7884b9f-3a28-4b5a-bea1-3c889106152e";

      const promptIds = dtestData.dCollectionPromptIds();
      getCollectionPromptIdsMock.mockResolvedValue(promptIds);

      const { result } = renderHookWithReactQuery(() =>
         useLoadCollectionPromptIds(collectionId)
      );

      await waitFor(() => {
         expect(result.current.data).toEqual(promptIds);
         expect(getCollectionPromptIdsMock).toHaveBeenCalledTimes(1);
         expect(getCollectionPromptIdsMock).toHaveBeenCalledWith(collectionId);
      });
   });
});

describe("addPromptToCollection hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("addPromptToCollectionOptions test", async () => {
      const expectedOptions: UseMutationOptions<
         ActionResult,
         Error,
         AddPromptToCollectionParams
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = addPromptToCollectionOptions(queryClientMock);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(queryClientMock.setQueryData).not.toHaveBeenCalled();

      const result: ActionResult = {
         success: true,
         message: "Template added to collection",
      };

      const collectionId = "a7884b9f-3a28-4b5a-bea1-3c889106152e";
      const promptId = "1a19aee2-8d22-4057-894c-9a3dd513568c";

      const params: AddPromptToCollectionParams = {
         collectionId,
         promptId,
      };

      options.onSuccess!(result, params, undefined, mutationContextMock);

      const expectedQueryKey: QueryKey = [
         "collections",
         "collection",
         collectionId,
         "templateIds",
      ];
      expect(queryClientMock.setQueryData).toHaveBeenCalledTimes(1);
      expect(queryClientMock.setQueryData).toHaveBeenCalledWith(
         expectedQueryKey,
         expect.any(Function)
      );

      const updaterFn = queryClientMock.setQueryData.mock.calls[0][1] as (
         cols: string[]
      ) => string[];

      const updaterParams1: string[] = [];
      const expectedUpdaterResult1 = [promptId];

      const updaterResult1 = updaterFn(updaterParams1);
      expect(updaterResult1).toEqual(expectedUpdaterResult1);

      const templateDescriptorId2 = "fbde9eda-9341-4200-91d6-633237e4164b";
      const updaterParams2 = [templateDescriptorId2];
      const expectedUpdaterResult2 = [templateDescriptorId2, promptId];
      const updaterResult2 = updaterFn(updaterParams2);
      expect(updaterResult2).toEqual(expectedUpdaterResult2);
   });

   test("addPromptToCollection test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Template added to collection",
      };

      addPromptToCollectionMock.mockResolvedValue(actionResult);

      const collectionId = "a7884b9f-3a28-4b5a-bea1-3c889106152e";
      const promptId = "1a19aee2-8d22-4057-894c-9a3dd513568c";

      const { result } = renderHookWithReactQuery(() =>
         useAddPromptToCollection()
      );

      const params: AddPromptToCollectionParams = {
         collectionId,
         promptId,
      };

      await waitFor(() => {
         result.current.mutate(params);
         expect(result.current.isSuccess).toBe(true);
         expect(addPromptToCollectionMock).toHaveBeenCalledTimes(1);
         expect(addPromptToCollectionMock).toHaveBeenCalledWith(
            params.collectionId,
            params.promptId
         );
      });
   });
});

describe("removePromptFromCollection hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("removePromptFromCollectionOptions test", async () => {
      const expectedOptions: UseMutationOptions<
         ActionResult,
         Error,
         RemovePromptFromCollectionParams
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = removePromptFromCollectionOptions(queryClientMock);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(queryClientMock.setQueryData).not.toHaveBeenCalled();

      const result: ActionResult = {
         success: true,
         message: "Template removed from collection",
      };

      const collectionId = "a7884b9f-3a28-4b5a-bea1-3c889106152e";
      const promptId = "1a19aee2-8d22-4057-894c-9a3dd513568c";

      const params: RemovePromptFromCollectionParams = {
         collectionId,
         promptId,
      };

      options.onSuccess!(result, params, undefined, mutationContextMock);

      const expectedQueryKey: QueryKey = [
         "collections",
         "collection",
         collectionId,
         "templateIds",
      ];
      expect(queryClientMock.setQueryData).toHaveBeenCalledTimes(1);
      expect(queryClientMock.setQueryData).toHaveBeenCalledWith(
         expectedQueryKey,
         expect.any(Function)
      );

      const updaterFn = queryClientMock.setQueryData.mock.calls[0][1] as (
         cols: string[]
      ) => string[];

      const updaterParams1: string[] = [];
      const expectedUpdaterResult1: string[] = [];

      const updaterResult1 = updaterFn(updaterParams1);
      expect(updaterResult1).toEqual(expectedUpdaterResult1);

      const promptId2 = "fbde9eda-9341-4200-91d6-633237e4164b";
      const updaterParams2 = [promptId, promptId2];
      const expectedUpdaterResult2 = [promptId2];
      const updaterResult2 = updaterFn(updaterParams2);
      expect(updaterResult2).toEqual(expectedUpdaterResult2);
   });

   test("removePromptFromCollection test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Template removed from collection",
      };

      removePromptFromCollectionMock.mockResolvedValue(actionResult);

      const collectionId = "a7884b9f-3a28-4b5a-bea1-3c889106152e";
      const promptId = "1a19aee2-8d22-4057-894c-9a3dd513568c";

      const { result } = renderHookWithReactQuery(() =>
         useRemovePromptFromCollection()
      );

      const params: RemovePromptFromCollectionParams = {
         collectionId,
         promptId,
      };

      await waitFor(() => {
         result.current.mutate(params);
         expect(result.current.isSuccess).toBe(true);
         expect(removePromptFromCollectionMock).toHaveBeenCalledTimes(1);
         expect(removePromptFromCollectionMock).toHaveBeenCalledWith(
            params.collectionId,
            params.promptId
         );
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

      const result: ActionResult<DCollection> = {
         success: true,
         message: "Collection created",
         data: undefined,
      };

      options.onSuccess!(result, update, undefined, mutationContextMock);

      const expectedQueryKey: QueryKey = { queryKey: ["collections", {}] };
      expect(queryClientMock.invalidateQueries).toHaveBeenCalledTimes(1);
      expect(queryClientMock.invalidateQueries).toHaveBeenCalledWith(
         expectedQueryKey
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
