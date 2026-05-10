import { screen, waitFor } from "@testing-library/react";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";

import { CatalogEntriesGrid } from "./catalog-entries-grid";

const assertRendered = () => {
   const entries = screen.getByTestId("catalog-entries-grid");
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

describe("CatalogEntriesGrid rendering tests", () => {
   it("entries - empty - test", async () => {
      const { container } = renderWithReactQuery(
         <CatalogEntriesGrid entries={[]} authenticated={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertItemsNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("entries - with items - test", async () => {
      const entries = dtestData.dCatalogEntries();

      const { container } = renderWithReactQuery(
         <CatalogEntriesGrid entries={entries} authenticated={false} />
      );

      await waitFor(() => {
         assertRendered();
         assertItemsRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
