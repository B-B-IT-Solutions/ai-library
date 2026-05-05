import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, renderWithRouter } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { CatalogEntriesToolbar } from "./category-entries-filters";

describe("CatalogEntriesToolbar rendering tests", () => {
   it("renders toolbar elements", async () => {
      const { container } = renderWithRouter(
         <CatalogEntriesToolbar viewMode={DListViewMode.GRID} />,
         "/explore"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("catalog-entries-toolbar"));
         assertInDocument(screen.getByTestId("explore-search-input"));
         assertInDocument(screen.getByTestId("catalog-sort-by-select"));
         assertInDocument(screen.getByTestId("view-toggle"));
      });

      expect(container).toMatchSnapshot();
   });

   it("renders with LIST view mode", async () => {
      const { container } = renderWithRouter(
         <CatalogEntriesToolbar viewMode={DListViewMode.LIST} />,
         "/explore"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("catalog-entries-toolbar"));
      });

      expect(container).toMatchSnapshot();
   });

   it("reflects active search from URL", async () => {
      renderWithRouter(
         <CatalogEntriesToolbar viewMode={DListViewMode.GRID} />,
         "/explore",
         "f_search=test"
      );

      await waitFor(() => {
         const input = screen.getByTestId(
            "explore-search-input"
         ) as HTMLInputElement;
         expect(input.value).toBe("test");
      });
   });
});
