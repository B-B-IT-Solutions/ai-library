import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { PublicPromptsGrid } from "./prompts-grid-public";

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("prompt-items-empty");
   assertInDocument(empty);
};

const assertRendered = () => {
   const items = screen.getByTestId("prompts-grid-public");
   const cards = screen.getAllByTestId("public-prompt-item");

   assertInDocument(items);
   expect(cards.length).toBeGreaterThan(0);
};

describe("PublicPromptItemsGrid rendering tests", () => {
   it("prompts - empty - test", async () => {
      const { container } = renderWithReactQuery(
         <PublicPromptsGrid prompts={[]} />
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompts - with items - test", async () => {
      const prompts = dtestData.dPrompts();

      const { container } = renderWithReactQuery(
         <PublicPromptsGrid
            prompts={prompts}
            collectionToken="public-token-1"
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
