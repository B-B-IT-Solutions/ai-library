import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { CatalogEntriesToolbar } from "./category-entries-toolbar";

const defaultProps = {
   viewMode: DListViewMode.GRID,
   categories: dtestData.dCatalogEntryCategories(3),
   totalElements: 12,
};

describe("CatalogEntriesToolbar rendering tests", () => {
   it("renders all toolbar elements", async () => {
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

   it("filter sheet is closed by default", async () => {
      renderWithRouter(<CatalogEntriesToolbar {...defaultProps} />, "/explore");

      await waitFor(() =>
         assertInDocument(screen.getByTestId("mobile-filter-btn"))
      );

      assertNotInDocument(screen.queryByTestId("explore-category-filter"));
   });

   it("clicking filter button opens the sheet with categories", async () => {
      renderWithRouter(<CatalogEntriesToolbar {...defaultProps} />, "/explore");

      await waitFor(() =>
         assertInDocument(screen.getByTestId("mobile-filter-btn"))
      );

      await userEvent.click(screen.getByTestId("mobile-filter-btn"));

      await waitFor(() => {
         assertInDocument(screen.getByTestId("explore-category-filter"));
         assertInDocument(screen.getByTestId("sidebar-category-category-1"));
         assertInDocument(screen.getByTestId("sidebar-category-category-2"));
         assertInDocument(screen.getByTestId("sidebar-category-category-3"));
      });
   });

   it("selecting a category in the sheet closes it", async () => {
      renderWithRouter(<CatalogEntriesToolbar {...defaultProps} />, "/explore");

      await waitFor(() =>
         assertInDocument(screen.getByTestId("mobile-filter-btn"))
      );

      await userEvent.click(screen.getByTestId("mobile-filter-btn"));

      await waitFor(() =>
         assertInDocument(screen.getByTestId("sidebar-category-category-1"))
      );

      await userEvent.click(screen.getByTestId("sidebar-category-category-1"));

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("explore-category-filter"));
      });
   });
});
