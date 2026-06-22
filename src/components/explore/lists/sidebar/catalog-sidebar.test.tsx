import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { CatalogSidebar } from "./catalog-sidebar";

const assertRendered = () => {
   const sidebar = screen.getByTestId("catalog-entries-sidebar");
   const filters = screen.getByTestId("catalog-entry-filters");

   assertInDocument(sidebar);
   assertInDocument(filters);
};

describe("CatalogSidebar rendering tests", () => {
   it("render - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      const { container } = renderWithRouter(
         <CatalogSidebar categories={categories} />,
         "/explore"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
