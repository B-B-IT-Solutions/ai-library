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

const defaultProps = {
   viewMode: DListViewMode.GRID,
   categories: dtestData.dCatalogEntryCategories(3),
   totalElements: 12,
};

const assertRendered = () => {
   const toolbar = screen.getByTestId("catalog-entries-toolbar");
   const search = screen.getByTestId("explore-search-input");
   const mobitleFilterBtn = screen.getByTestId("mobile-filter-btn");
   const viewToggle = screen.getByTestId("view-toggle");
   const sortBySelects = screen.getAllByTestId("catalog-sort-by-select");

   assertInDocument(toolbar);
   assertInDocument(search);
   assertInDocument(mobitleFilterBtn);
   assertInDocument(viewToggle);
   expect(sortBySelects).toHaveLength(2);
};

const assertFilterRendered = () => {
   const filters = screen.getByTestId("explore-category-filter");
   assertInDocument(filters);
};

const assertFilterNotRendered = () => {
   const filters = screen.queryByTestId("explore-category-filter");
   assertNotInDocument(filters);
};

describe("CatalogEntriesToolbar rendering tests", () => {
   it("renders all toolbar elements", async () => {
      const { container } = renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} />,
         "/explore"
      );

      await waitFor(() => {
         assertRendered();
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
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("reflects active search value from URL", async () => {
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

   it("shows empty search input when no search param is set", async () => {
      renderWithRouter(<CatalogEntriesToolbar {...defaultProps} />, "/explore");

      await waitFor(() => {
         const input = screen.getByTestId(
            "explore-search-input"
         ) as HTMLInputElement;
         expect(input.value).toBe("");
      });
   });
});

describe("CatalogEntriesToolbar search interaction tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("typing in search updates the URL", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} />,
         "/explore",
         "",
         onUrlUpdateFn
      );

      await waitFor(() =>
         assertInDocument(screen.getByTestId("explore-search-input"))
      );

      await userEvent.type(
         screen.getByTestId("explore-search-input"),
         "Marketing"
      );

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
         const lastCall =
            onUrlUpdateFn.mock.calls[onUrlUpdateFn.mock.calls.length - 1]![0]!;
         expect(lastCall.queryString).toContain("f_search=Marketing");
      });
   });

   it("clearing search removes the URL param", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} />,
         "/explore",
         "f_search=test",
         onUrlUpdateFn
      );

      await waitFor(() =>
         assertInDocument(screen.getByTestId("explore-search-input"))
      );

      await userEvent.clear(screen.getByTestId("explore-search-input"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
         const lastCall =
            onUrlUpdateFn.mock.calls[onUrlUpdateFn.mock.calls.length - 1]![0]!;
         expect(lastCall.queryString).not.toContain("f_search");
      });
   });
});

describe("CatalogEntriesToolbar mobile filter sheet tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("filter btn clicked - test", async () => {
      renderWithRouter(<CatalogEntriesToolbar {...defaultProps} />, "/explore");

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
         const cat1 = screen.getByTestId("sidebar-category-category-1");
         assertInDocument(cat1);
      });

      const cat1 = screen.getByTestId("sidebar-category-category-1");
      await userEvent.click(cat1);

      await waitFor(() => {
         assertFilterNotRendered();
      });
   });
});
