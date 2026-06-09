import { createRef } from "react";
import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { TemplateItemsGrid } from "./prompt-items-grid";

const assertRendered = () => {
   const entries = screen.getByTestId("template-items-grid");
   assertInDocument(entries);
};

describe("TemplateItemsGrid rendering tests", () => {
   it("prompt - collectionId undefined - test", async () => {
      const descriptors = dtestData.dPrompts();

      const { container } = renderWithReactQuery(
         <TemplateItemsGrid descriptors={descriptors} />
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
         <TemplateItemsGrid
            descriptors={descriptors}
            currentColleciton={collection}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateItemsGrid ref tests", () => {
   it("ref is forwarded to the last item DOM element - test", async () => {
      const ref = createRef<HTMLDivElement>();
      const descriptors = dtestData.dPrompts(); // 3 items

      renderWithReactQuery(
         <TemplateItemsGrid descriptors={descriptors} ref={ref} />
      );

      await waitFor(() => {
         const items = screen.getAllByTestId("template-item-card");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(items[items.length - 1]);
      });
   });
});
