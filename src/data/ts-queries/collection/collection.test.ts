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
   addTemplateToCollection,
   getCollectionTemplateIds,
   removeTemplateFromCollection,
} from "@/data/actions/collection";
import { ActionResult } from "@/data/types/utils";

import {
   addTemplateToCollectionOptions,
   loadCollectionTemplateIdsOptions,
   removeTemplateFromCollectionOptions,
   useAddTemplateToCollection,
   useLoadCollectionTemplateIds,
   useRemoveTemplateFromCollection,
} from "./collection";
import {
   AddTemplateToCollectionParams,
   RemoveTemplateFromCollectionParams,
} from "./types";

const queryClientMock = mockDeep<QueryClient>();

const mutationContextMock: MutationFunctionContext = {
   client: queryClientMock,
   meta: {},
};

const getCollectionTemplateIdsMock =
   getCollectionTemplateIds as jest.MockedFunction<
      typeof getCollectionTemplateIds
   >;

const addTemplateToCollectionMock =
   addTemplateToCollection as jest.MockedFunction<
      typeof addTemplateToCollection
   >;

const removeTemplateFromCollectionMock =
   removeTemplateFromCollection as jest.MockedFunction<
      typeof removeTemplateFromCollection
   >;

describe("loadCollectionTemplateIds hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("loadCollectionTemplateIdsOptions - test", async () => {
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

      const options = loadCollectionTemplateIdsOptions(collectionId);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useLoadCollectionTemplateIds test", async () => {
      const collectionId = "a7884b9f-3a28-4b5a-bea1-3c889106152e";

      const templateIds = dtestData.dTemplateCollectionEntryTemplateIds();
      getCollectionTemplateIdsMock.mockResolvedValue(templateIds);

      const { result } = renderHookWithReactQuery(() =>
         useLoadCollectionTemplateIds(collectionId)
      );

      await waitFor(() => {
         expect(result.current.data).toEqual(templateIds);
         expect(getCollectionTemplateIdsMock).toHaveBeenCalledTimes(1);
         expect(getCollectionTemplateIdsMock).toHaveBeenCalledWith(
            collectionId
         );
      });
   });
});

describe("addTemplateToCollection hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("addTemplateToCollectionOptions test", async () => {
      const expectedOptions: UseMutationOptions<
         ActionResult,
         Error,
         AddTemplateToCollectionParams
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = addTemplateToCollectionOptions(queryClientMock);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(queryClientMock.setQueryData).not.toHaveBeenCalled();

      const result: ActionResult = {
         success: true,
         message: "Template added to collection",
      };

      const collectionId = "a7884b9f-3a28-4b5a-bea1-3c889106152e";
      const templateDescriptorId = "1a19aee2-8d22-4057-894c-9a3dd513568c";

      const params: AddTemplateToCollectionParams = {
         collectionId,
         templateDescriptorId,
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
      const expectedUpdaterResult1 = [templateDescriptorId];

      const updaterResult1 = updaterFn(updaterParams1);
      expect(updaterResult1).toEqual(expectedUpdaterResult1);

      const templateDescriptorId2 = "fbde9eda-9341-4200-91d6-633237e4164b";
      const updaterParams2 = [templateDescriptorId2];
      const expectedUpdaterResult2 = [
         templateDescriptorId2,
         templateDescriptorId,
      ];
      const updaterResult2 = updaterFn(updaterParams2);
      expect(updaterResult2).toEqual(expectedUpdaterResult2);
   });

   test("useAddTemplateToCollection test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Template added to collection",
      };

      addTemplateToCollectionMock.mockResolvedValue(actionResult);

      const collectionId = "a7884b9f-3a28-4b5a-bea1-3c889106152e";
      const templateDescriptorId = "1a19aee2-8d22-4057-894c-9a3dd513568c";

      const { result } = renderHookWithReactQuery(() =>
         useAddTemplateToCollection()
      );

      const params: AddTemplateToCollectionParams = {
         collectionId,
         templateDescriptorId,
      };

      await waitFor(() => {
         result.current.mutate(params);
         expect(result.current.isSuccess).toBe(true);
         expect(addTemplateToCollectionMock).toHaveBeenCalledTimes(1);
         expect(addTemplateToCollectionMock).toHaveBeenCalledWith(
            params.collectionId,
            params.templateDescriptorId
         );
      });
   });
});

describe("removeTemplateFromCollection hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("removeTemplateFromCollectionOptions test", async () => {
      const expectedOptions: UseMutationOptions<
         ActionResult,
         Error,
         RemoveTemplateFromCollectionParams
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = removeTemplateFromCollectionOptions(queryClientMock);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(queryClientMock.setQueryData).not.toHaveBeenCalled();

      const result: ActionResult = {
         success: true,
         message: "Template removed from collection",
      };

      const collectionId = "a7884b9f-3a28-4b5a-bea1-3c889106152e";
      const templateDescriptorId = "1a19aee2-8d22-4057-894c-9a3dd513568c";

      const params: RemoveTemplateFromCollectionParams = {
         collectionId,
         templateDescriptorId,
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

      const templateDescriptorId2 = "fbde9eda-9341-4200-91d6-633237e4164b";
      const updaterParams2 = [templateDescriptorId, templateDescriptorId2];
      const expectedUpdaterResult2 = [templateDescriptorId2];
      const updaterResult2 = updaterFn(updaterParams2);
      expect(updaterResult2).toEqual(expectedUpdaterResult2);
   });

   test("useRemoveTemplateFromCollection test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Template removed from collection",
      };

      removeTemplateFromCollectionMock.mockResolvedValue(actionResult);

      const collectionId = "a7884b9f-3a28-4b5a-bea1-3c889106152e";
      const templateDescriptorId = "1a19aee2-8d22-4057-894c-9a3dd513568c";

      const { result } = renderHookWithReactQuery(() =>
         useRemoveTemplateFromCollection()
      );

      const params: RemoveTemplateFromCollectionParams = {
         collectionId,
         templateDescriptorId,
      };

      await waitFor(() => {
         result.current.mutate(params);
         expect(result.current.isSuccess).toBe(true);
         expect(removeTemplateFromCollectionMock).toHaveBeenCalledTimes(1);
         expect(removeTemplateFromCollectionMock).toHaveBeenCalledWith(
            params.collectionId,
            params.templateDescriptorId
         );
      });
   });
});
