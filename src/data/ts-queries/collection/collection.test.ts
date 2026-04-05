jest.mock("@/data/actions/collection");

import {
   keepPreviousData,
   UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";

import { getCollectionTemplateIds } from "@/data/actions/collection";

import {
   loadCollectionTemplateIdsOptions,
   useLoadCollectionTemplateIds,
} from "./collection";

const getCollectionTemplateIdsMock =
   getCollectionTemplateIds as jest.MockedFunction<
      typeof getCollectionTemplateIds
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
