jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";

import { getPublicPromptsPage } from "@/data/actions/prompt";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";

import { CollectionViewPublic } from "./collection-view-public";

const getPublicPromptsPageMock = getPublicPromptsPage as jest.MockedFunction<
   typeof getPublicPromptsPage
>;

const assertRendered = () => {
   const view = screen.getByTestId("collection-view-public");
   const header = screen.getByTestId("collection-header-public");
   const items = screen.getByTestId("public-template-items-grid");

   assertInDocument(view);
   assertInDocument(header);
   assertInDocument(items);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DPromptsPageQuery
) => {
   expect(getPublicPromptsPageMock).toHaveBeenCalledTimes(1);
   expect(getPublicPromptsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("CollectionView rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPromptsPage();
      getPublicPromptsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered - test", async () => {
      const collection = dtestData.dCollection(1);

      const { container } = await renderAsyncRSC(CollectionViewPublic, {
         collection,
      });

      const expectedPayload: DPromptsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: {
            collectionIds: [collection.id],
         },
         sort: {
            field: "createdAt",
            order: "asc",
         },
      };

      await waitFor(() => {
         assertRendered();
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});
