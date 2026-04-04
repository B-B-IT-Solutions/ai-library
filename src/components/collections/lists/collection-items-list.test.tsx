import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { CollectionItemsList } from "./collection-items-list";

const assertRendered = () => {
   const items = screen.getByTestId("collection-items-list");
   const cards = screen.getAllByTestId("collection-item-card");

   assertInDocument(items);
   expect(cards.length).toBeGreaterThan(0);
};

describe("CollectionItemsList rendering tests", () => {
   it("rendered - test", async () => {
      const collections = dtestData.dCollections();

      const { container } = renderWithReactQuery(
         <CollectionItemsList collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
