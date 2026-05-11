import { createRef } from "react";
import { screen, waitFor } from "@testing-library/react";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";

import { CatalogEntriesList } from "./catalog-entries-list";

const assertRendered = () => {
   const entries = screen.getByTestId("catalog-entries-list");
   assertInDocument(entries);
};

const assertItemsRendered = () => {
   const items = screen.getAllByTestId("catalog-entry-item");
   expect(items.length).toBeGreaterThan(0);
};

const assertItemsNotRendered = () => {
   const item = screen.queryByTestId("catalog-entry-item");
   assertNotInDocument(item);
};

describe("CatalogEntriesList rendering tests", () => {
   it("entries empty - test", async () => {
      const { container } = renderWithReactQuery(
         <CatalogEntriesList entries={[]} authenticated={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertItemsNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("entries with items - test", async () => {
      const entries = dtestData.dCatalogEntries();

      const { container } = renderWithReactQuery(
         <CatalogEntriesList entries={entries} authenticated={false} />
      );

      await waitFor(() => {
         assertRendered();
         assertItemsRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CatalogEntriesList ref tests", () => {
   it("ref is forwarded to the last item DOM element - test", async () => {
      const ref = createRef<HTMLDivElement>();
      const entries = dtestData.dCatalogEntries();

      renderWithReactQuery(
         <CatalogEntriesList
            entries={entries}
            authenticated={false}
            ref={ref}
         />
      );

      await waitFor(() => {
         const items = screen.getAllByTestId("catalog-entry-item");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(items[items.length - 1]);
      });
   });
});
