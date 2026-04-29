jest.mock("@/data/actions/prompt-template");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";

import { getPublicTemplateDescriptorsPage } from "@/data/actions/prompt-template";
import { DTemplateDescriptorsPageQuery } from "@/data/types/domain/prompt.template";

import { CollectionViewPublic } from "./collection-view-public";

const getPublicTemplateDescriptorsPageMock =
   getPublicTemplateDescriptorsPage as jest.MockedFunction<
      typeof getPublicTemplateDescriptorsPage
   >;

const assertRendered = () => {
   const view = screen.getByTestId("collection-view-public");
   const items = screen.getByTestId("template-items-grid");

   assertInDocument(view);
   assertInDocument(items);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DTemplateDescriptorsPageQuery
) => {
   expect(getPublicTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
   expect(getPublicTemplateDescriptorsPageMock).toHaveBeenCalledWith(
      expectedPayload
   );
};

describe("CollectionView rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dTemplateDescriptorsPage();
      getPublicTemplateDescriptorsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered - test", async () => {
      const collection = dtestData.dCollection(1);

      const { container } = await renderAsyncRSC(CollectionViewPublic, {
         collection,
      });

      const expectedPayload: DTemplateDescriptorsPageQuery = {
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
