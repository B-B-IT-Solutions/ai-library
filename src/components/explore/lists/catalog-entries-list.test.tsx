import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { CatalogEntriesList } from "./catalog-entries-list";

const assertRendered = () => {
   const entries = screen.getByTestId("catalog-entries-list");
   assertInDocument(entries);
};

describe("CatalogEntriesList rendering tests", () => {
   it("entries empty - test", async () => {
      const { container } = renderWithReactQuery(
         <CatalogEntriesList entries={[]} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("entries with items - test", async () => {
      const entries = dtestData.dCatalogEntrySummaries();

      const { container } = renderWithReactQuery(
         <CatalogEntriesList entries={entries} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
