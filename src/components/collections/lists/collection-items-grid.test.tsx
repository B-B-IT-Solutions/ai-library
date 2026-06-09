import { createRef } from "react";
import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { CollectionItemsGrid } from "./collection-items-grid";

const assertRendered = () => {
   const items = screen.getByTestId("collection-items-grid");
   const cards = screen.getAllByTestId("collection-item");

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

describe("CollectionItemsGrid ref tests", () => {
   it("ref is forwarded to the last item DOM element - test", async () => {
      const ref = createRef<HTMLDivElement>();
      const collections = dtestData.dCollections();

      renderWithReactQuery(
         <CollectionItemsGrid collections={collections} ref={ref} />
      );

      await waitFor(() => {
         const items = screen.getAllByTestId("collection-item");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(items[items.length - 1]);
      });
   });
});
