import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { CatalogEntriesGrid } from "./catalog-entries-grid";

const assertRendered = () => {
   const entries = screen.getByTestId("catalog-entries-grid");
   assertInDocument(entries);
};

describe("CatalogEntriesGrid rendering tests", () => {
   it("entries - empty - test", async () => {
      const { container } = renderWithReactQuery(
         <CatalogEntriesGrid entries={[]} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("entries - with items - test", async () => {
      const entries = dtestData.dCatalogEntries();

      const { container } = renderWithReactQuery(
         <CatalogEntriesGrid entries={entries} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
