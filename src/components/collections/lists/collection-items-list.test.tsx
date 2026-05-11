import { createRef } from "react";
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

describe("CollectionItemsList ref tests", () => {
   it("ref is forwarded to the last item DOM element - test", async () => {
      const ref = createRef<HTMLDivElement>();
      const collections = dtestData.dCollections();

      renderWithReactQuery(
         <CollectionItemsList collections={collections} ref={ref} />
      );

      await waitFor(() => {
         const items = screen.getAllByTestId("collection-item-card");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(items[items.length - 1]);
      });
   });
});
