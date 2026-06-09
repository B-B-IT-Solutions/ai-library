import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { PublicPromptItemsGrid } from "./prompt-items-grid-public";

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("template-items-empty");
   assertInDocument(empty);
};

const assertRendered = () => {
   const items = screen.getByTestId("public-template-items-grid");
   const cards = screen.getAllByTestId("public-template-item-card");

   assertInDocument(items);
   expect(cards.length).toBeGreaterThan(0);
};

describe("PublicPromptItemsGrid rendering tests", () => {
   it("descriptors - empty - test", async () => {
      const { container } = renderWithReactQuery(
         <PublicPromptItemsGrid descriptors={[]} />
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptors - with items - test", async () => {
      const descriptors = dtestData.dPrompts();

      const { container } = renderWithReactQuery(
         <PublicPromptItemsGrid
            descriptors={descriptors}
            collectionToken="public-token-1"
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
