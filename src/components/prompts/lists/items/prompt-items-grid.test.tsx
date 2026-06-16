import { createRef } from "react";
import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { PromptItemsGrid } from "./prompt-items-grid";

const assertRendered = () => {
   const entries = screen.getByTestId("prompt-items-grid");
   assertInDocument(entries);
};

describe("PromptItemsGrid rendering tests", () => {
   it("prompt - collectionId undefined - test", async () => {
      const descriptors = dtestData.dPrompts();

      const { container } = renderWithReactQuery(
         <PromptItemsGrid prompts={descriptors} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt - collectionId defined - test", async () => {
      const descriptors = dtestData.dPrompts();
      const collection = dtestData.dCollectionPreview();

      const { container } = renderWithReactQuery(
         <PromptItemsGrid
            prompts={descriptors}
            currentColleciton={collection}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptItemsGrid ref tests", () => {
   it("ref is forwarded to the last item DOM element - test", async () => {
      const ref = createRef<HTMLDivElement>();
      const descriptors = dtestData.dPrompts(); // 3 items

      renderWithReactQuery(<PromptItemsGrid prompts={descriptors} ref={ref} />);

      await waitFor(() => {
         const items = screen.getAllByTestId("prompt-item");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(items[items.length - 1]);
      });
   });
});
