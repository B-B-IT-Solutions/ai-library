import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { PublicTemplateItemsGrid } from "./template-items-grid-public";

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

describe("PublicTemplateItemsGrid rendering tests", () => {
   it("descriptors - empty - test", async () => {
      const { container } = renderWithReactQuery(
         <PublicTemplateItemsGrid descriptors={[]} />
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptors - with items - test", async () => {
      const descriptors = dtestData.dPrompts();

      const { container } = renderWithReactQuery(
         <PublicTemplateItemsGrid
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
