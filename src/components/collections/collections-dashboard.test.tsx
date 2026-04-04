jest.mock("@/data/actions/collection");
jest.mock("./collections-search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { getCollections } from "@/data/actions/collection";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

import { CollectionsDashboard } from "./collections-dashboard";
import { collectionsSearchParamsCache } from "./collections-search-params";

const getCollectionsMock = getCollections as jest.MockedFunction<
   typeof getCollections
>;

const collectionsSearchParamsCacheMock =
   collectionsSearchParamsCache as DeepMockProxy<
      typeof collectionsSearchParamsCache
   >;

type CacheKey = Parameters<typeof collectionsSearchParamsCache.get>[0];
type CacheValue = ReturnType<typeof collectionsSearchParamsCache.get>;

const assertRendered = () => {
   const dashboard = screen.getByTestId("collections-dashboard");
   const createBtn = screen.getByTestId("create-collection-btn");
   const toolbar = screen.getByTestId("collections-toolbar");
   const items = screen.getByTestId("collection-items");

   assertInDocument(dashboard);
   assertInDocument(createBtn);
   assertInDocument(toolbar);
   assertInDocument(items);
};

const mockSearchParams = (key: CacheKey): CacheValue => {
   switch (key) {
      case "view":
         return DListViewMode.GRID;
      case "group":
         return DListGroupByMode.NONE;
      case "sort":
         return DListSortByMode.DATE_DESC;
      case "f_search":
         return "test-1";
      case "f_categories":
         return ["cat-1"];
      case "f_models":
         return ["mod-1"];
      case "f_collectionIds":
         return ["col-id-1"];
      case "f_isFavorite":
         return "false";
   }
};

describe("CollectionsDashboard rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered test", async () => {
      collectionsSearchParamsCacheMock.get.mockImplementation(mockSearchParams);

      const collections = dtestData.dCollections();
      getCollectionsMock.mockResolvedValue(collections);

      const { container } = await renderAsyncRSC(CollectionsDashboard, {});

      await waitFor(() => {
         assertRendered();
         expect(getCollectionsMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
