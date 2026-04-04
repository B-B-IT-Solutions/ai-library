jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";

import { getCollections } from "@/data/actions/collection";

import { CollectionsDashboard } from "./collections-dashboard";

const getCollectionsMock = getCollections as jest.MockedFunction<
   typeof getCollections
>;

const assertRendered = () => {
   const dashboard = screen.getByTestId("collections-dashboard");
   const createBtn = screen.getByTestId("create-collection-btn");
   const items = screen.getByTestId("collection-items");

   assertInDocument(dashboard);
   assertInDocument(createBtn);
   assertInDocument(items);
};

describe("CollectionsDashboard rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered test", async () => {
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
