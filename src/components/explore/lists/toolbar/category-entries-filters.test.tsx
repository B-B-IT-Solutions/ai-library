import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { CatalogEntriesToolbar } from "./category-entries-filters";

const defaultProps = {
   viewMode: DListViewMode.GRID,
   categories: dtestData.dCatalogEntryCategories(3),
   totalElements: 12,
};

describe("CatalogEntriesToolbar rendering tests", () => {
   it("renders toolbar elements", async () => {
      const { container } = renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} />,
         "/explore"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("catalog-entries-toolbar"));
         assertInDocument(screen.getByTestId("explore-search-input"));
         assertInDocument(screen.getByTestId("catalog-sort-by-select"));
         assertInDocument(screen.getByTestId("view-toggle"));
         assertInDocument(screen.getByTestId("mobile-filter-btn"));
      });

      expect(container).toMatchSnapshot();
   });

   it("renders with LIST view mode", async () => {
      const { container } = renderWithRouter(
         <CatalogEntriesToolbar
            {...defaultProps}
            viewMode={DListViewMode.LIST}
         />,
         "/explore"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("catalog-entries-toolbar"));
      });

      expect(container).toMatchSnapshot();
   });

   it("reflects active search from URL", async () => {
      renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} />,
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

   it("opens filter sheet on mobile button click", async () => {
      renderWithRouter(<CatalogEntriesToolbar {...defaultProps} />, "/explore");

      await waitFor(() =>
         assertInDocument(screen.getByTestId("mobile-filter-btn"))
      );

      await userEvent.click(screen.getByTestId("mobile-filter-btn"));

      await waitFor(() => {
         assertInDocument(screen.getByTestId("explore-category-filter"));
      });
   });
});
