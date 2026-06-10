jest.mock("@/data/actions/collection");
jest.mock("./collections-search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { getCollectionsPage } from "@/data/actions/collection";
import { DCollectionsPageQuery } from "@/data/types/domain/collection";
import {
   DCollectionsSortByMode,
   DListGroupByMode,
   DListViewMode,
} from "@/data/types/domain/common";

import { CollectionsDashboard } from "./collections-dashboard";
import { collectionsSearchParamsCache } from "./collections-search-params";

const getCollectionsPageMock = getCollectionsPage as jest.MockedFunction<
   typeof getCollectionsPage
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
         return DCollectionsSortByMode.NAME_ASC;
      case "f_search":
         return "test-1";
   }
};

const assertGetCollectionsPageCalled = (
   expectedPayload: DCollectionsPageQuery
) => {
   expect(getCollectionsPageMock).toHaveBeenCalledTimes(1);
   expect(getCollectionsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("CollectionsDashboard rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered test", async () => {
      collectionsSearchParamsCacheMock.get.mockImplementation(mockSearchParams);

      const page = dtestData.dCollectionsPage();
      getCollectionsPageMock.mockResolvedValue(page);

      const { container } = await renderAsyncRSC(CollectionsDashboard, {});

      const expectedQuery: DCollectionsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: {
            search: mockSearchParams("f_search"),
         },
         sort: {
            field: "name",
            order: "asc",
         },
      };

      await waitFor(() => {
         assertRendered();
         assertGetCollectionsPageCalled(expectedQuery);
      });

      expect(container).toMatchSnapshot();
   });
});
