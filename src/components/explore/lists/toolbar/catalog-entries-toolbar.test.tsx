import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { CatalogEntriesToolbar } from "./catalog-entries-toolbar";

const assertRendered = () => {
   const toolbar = screen.getByTestId("catalog-entries-toolbar");
   const mobitleFilterBtn = screen.getByTestId("mobile-filter-btn");
   const viewToggle = screen.getByTestId("view-toggle");
   const searchFilters = screen.getAllByTestId("search-filter");
   const sortBySelects = screen.getAllByTestId("catalog-sort-by-select");

   assertInDocument(toolbar);
   assertInDocument(mobitleFilterBtn);
   assertInDocument(viewToggle);
   expect(searchFilters).toHaveLength(2);
   expect(sortBySelects).toHaveLength(2);
};

const assertFilterRendered = () => {
   const filters = screen.getByTestId("categories-filter");
   assertInDocument(filters);
};

const assertFilterNotRendered = () => {
   const filters = screen.queryByTestId("categories-filter");
   assertNotInDocument(filters);
};

describe("CatalogEntriesToolbar rendering tests", () => {
   it("viewMode GRID - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      const { container } = renderWithRouter(
         <CatalogEntriesToolbar
            viewMode={DListViewMode.GRID}
            categories={categories}
            totalElements={12}
         />,
         "/explore"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("viewMode LIST - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      const { container } = renderWithRouter(
         <CatalogEntriesToolbar
            viewMode={DListViewMode.LIST}
            categories={categories}
            totalElements={12}
         />,
         "/explore"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CatalogEntriesToolbar mobile funtionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("filter btn clicked - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      renderWithRouter(
         <CatalogEntriesToolbar
            viewMode={DListViewMode.GRID}
            categories={categories}
            totalElements={12}
         />,
         "/explore"
      );

      await waitFor(() => {
         assertRendered();
         assertFilterNotRendered();
      });

      const filterBtn = screen.getAllByTestId("mobile-filter-btn")[0];
      await userEvent.click(filterBtn);

      await waitFor(() => {
         assertFilterRendered();
      });

      await waitFor(() => {
         const cat1 = screen.getByTestId("category-category-1");
         assertInDocument(cat1);
      });

      const cat1 = screen.getByTestId("category-category-1");
      await userEvent.click(cat1);

      await waitFor(() => {
         assertFilterNotRendered();
      });
   });
});
