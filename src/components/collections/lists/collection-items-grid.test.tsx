import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { CollectionItemsGrid } from "./collection-items-grid";

const assertRendered = () => {
   const items = screen.getByTestId("collection-items-grid");
   const cards = screen.getAllByTestId("collection-item-card");

   assertInDocument(items);
   expect(cards.length).toBeGreaterThan(0);
};

describe("CollectionItemsGrid rendering tests", () => {
   it("rendered - test", async () => {
      const collections = dtestData.dCollections();

      const { container } = renderWithReactQuery(
         <CollectionItemsGrid collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
