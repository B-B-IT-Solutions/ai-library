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
   getPromptCollectionIds,
   updatePromptCollections,
} from "@/data/actions/collection";
import { DCollection } from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";

import {
   loadPromptCollectionIdsOptions,
   updatePromptCollectionsOptions,
   useLoadPromptCollectionIds,
   useUpdatePromptCollections,
} from "./library";
import { LoadCollectionIdsParams, UpdateCollectionIdsParams } from "./types";

const queryClientMock = mockDeep<QueryClient>();

const mutationContextMock: MutationFunctionContext = {
   client: queryClientMock,
   meta: {},
};

const getPromptCollectionIdsMock =
   getPromptCollectionIds as jest.MockedFunction<typeof getPromptCollectionIds>;

const updatePromptCollectionsMock =
   updatePromptCollections as jest.MockedFunction<
      typeof updatePromptCollections
   >;

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
