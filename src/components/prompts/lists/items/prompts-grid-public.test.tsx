import { createRef } from "react";
import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { PublicPromptsGrid } from "./prompts-grid-public";

const assertRendered = () => {
   const items = screen.getByTestId("prompts-grid-public");
   const cards = screen.getAllByTestId("public-prompt-item");

   assertInDocument(items);
   expect(cards.length).toBeGreaterThan(0);
};

describe("PublicPromptItemsGrid rendering tests", () => {
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

describe("PublicPromptItemsGrid ref tests", () => {
   it("ref is forwarded to the last item DOM element - test", async () => {
      const ref = createRef<HTMLDivElement>();
      const descriptors = dtestData.dPrompts(); // 3 items

      renderWithReactQuery(
         <PublicPromptsGrid prompts={descriptors} ref={ref} />
      );

      await waitFor(() => {
         const items = screen.getAllByTestId("public-prompt-item");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(items[items.length - 1]);
      });
   });
});
