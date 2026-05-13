import { createRef } from "react";
import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { TemplateItemsGrid } from "./template-items-grid";

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("template-items-empty");
   assertInDocument(empty);
};

const assertRendered = () => {
   const entries = screen.getByTestId("template-items-grid");
   assertInDocument(entries);
};

describe("TemplateItemsGrid rendering tests", () => {
   it("descriptors - empty - test", async () => {
      const collections = dtestData.dCollections();

      const { container } = renderWithReactQuery(
         <TemplateItemsGrid descriptors={[]} collections={collections} />
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptors - with items - test", async () => {
      const collections = dtestData.dCollections();
      const descriptors = dtestData.dPrompts();

      const { container } = renderWithReactQuery(
         <TemplateItemsGrid
            descriptors={descriptors}
            collections={collections}
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
      const collections = dtestData.dCollections();
      const descriptors = dtestData.dPrompts(); // 3 items

      renderWithReactQuery(
         <TemplateItemsGrid
            descriptors={descriptors}
            collections={collections}
            ref={ref}
         />
      );

      await waitFor(() => {
         const items = screen.getAllByTestId("template-item-card");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(items[items.length - 1]);
      });
   });
});
