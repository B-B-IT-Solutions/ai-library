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
         <CatalogEntriesList entries={[]} />
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
         <CatalogEntriesList entries={entries} />
      );

      await waitFor(() => {
         assertRendered();
         assertItemsRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
