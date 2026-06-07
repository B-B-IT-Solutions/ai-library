jest.mock("@/data/actions/collection");

import {
   keepPreviousData,
   MutationFunctionContext,
   QueryClient,
   QueryKey,
   UndefinedInitialDataOptions,
   UseMutationOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";
import { mockDeep } from "jest-mock-extended";

import {
   addPromptToCollection,
   getCollectionPromptIds,
   removePromptFromCollection,
} from "@/data/actions/collection";
import { ActionResult } from "@/data/types/utils";

import {
   addPromptToCollectionOptions,
   loadCollectionPromptIdsOptions,
   removePromptFromCollectionOptions,
   useAddPromptToCollection,
   useLoadCollectionPromptIds,
   useRemovePromptFromCollection,
} from "./collection";
import {
   AddPromptToCollectionParams,
   RemovePromptFromCollectionParams,
} from "./types";

const queryClientMock = mockDeep<QueryClient>();

const mutationContextMock: MutationFunctionContext = {
   client: queryClientMock,
   meta: {},
};

const getCollectionPromptIdsMock =
   getCollectionPromptIds as jest.MockedFunction<typeof getCollectionPromptIds>;

const addPromptToCollectionMock = addPromptToCollection as jest.MockedFunction<
   typeof addPromptToCollection
>;

const removePromptFromCollectionMock =
   removePromptFromCollection as jest.MockedFunction<
      typeof removePromptFromCollection
   >;

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

      const templateIds = dtestData.dCollectionPromptIds();
      getCollectionPromptIdsMock.mockResolvedValue(templateIds);

      const { result } = renderHookWithReactQuery(() =>
         useLoadCollectionPromptIds(collectionId)
      );

      await waitFor(() => {
         expect(result.current.data).toEqual(templateIds);
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
