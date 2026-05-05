import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData, renderWithRouter } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { CatalogEntriesToolbar } from "./category-entries-filters";

const defaultProps = {
   categories: dtestData.dCatalogEntryCategories(3),
   totalElements: 12,
   viewMode: DListViewMode.GRID,
};

const assertCoreElementsRendered = () => {
   assertInDocument(screen.getByTestId("catalog-entries-toolbar"));
   assertInDocument(screen.getByTestId("view-toggle"));
   assertInDocument(screen.getByTestId("explore-search-input"));
   assertInDocument(screen.getByTestId("catalog-sort-by-select"));
   assertInDocument(screen.getByTestId("entry-count"));
   assertInDocument(screen.getByTestId("explore-category-filter"));
};

describe("CatalogEntriesToolbar rendering tests", () => {
   it("renders core toolbar elements", async () => {
      const { container } = renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} />
      );

      await waitFor(() => {
         assertCoreElementsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("renders category pills for each category", async () => {
      renderWithRouter(<CatalogEntriesToolbar {...defaultProps} />);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("explore-category-pill-category-1"));
         assertInDocument(screen.getByTestId("explore-category-pill-category-2"));
         assertInDocument(screen.getByTestId("explore-category-pill-category-3"));
      });
   });

   it("shows singular 'Vorlage' for totalElements = 1", async () => {
      renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} totalElements={1} />
      );

      await waitFor(() => {
         const count = screen.getByTestId("entry-count");
         expect(count.textContent).toContain("Vorlage");
         expect(count.textContent).not.toContain("Vorlagen");
      });
   });

   it("shows plural 'Vorlagen' for totalElements > 1", async () => {
      renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} totalElements={5} />
      );

      await waitFor(() => {
         const count = screen.getByTestId("entry-count");
         expect(count.textContent).toContain("Vorlagen");
      });
   });

   it("hides category pills when categories are empty", async () => {
      renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} categories={[]} />
      );

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("explore-category-filter"));
      });
   });

   it("hides reset button when no filters are active", async () => {
      renderWithRouter(<CatalogEntriesToolbar {...defaultProps} />, "/explore");

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("reset-filters-btn"));
      });
   });

   it("shows reset button with count when search filter is active", async () => {
      renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} />,
         "/explore",
         "f_search=test"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("reset-filters-btn"));
         assertInDocument(screen.getByTestId("active-filter-count"));
         expect(screen.getByTestId("active-filter-count").textContent).toBe("1");
      });
   });

   it("shows reset button with count when category filter is active", async () => {
      renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} />,
         "/explore",
         "f_categories=category-1&f_categories=category-2"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("reset-filters-btn"));
         expect(screen.getByTestId("active-filter-count").textContent).toBe("2");
      });
   });
});

describe("CatalogEntriesToolbar category filter interaction tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("clicking a category pill updates the URL", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} />,
         "/explore",
         "",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("explore-category-pill-category-1"));
      });

      await userEvent.click(screen.getByTestId("explore-category-pill-category-1"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).toContain("f_categories=category-1");
      });
   });

   it("clicking 'Alle' clears category filters", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} />,
         "/explore",
         "f_categories=category-1",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("explore-category-filter"));
      });

      const allButton = screen.getByText(/Alle/);
      await userEvent.click(allButton);

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).not.toContain("f_categories");
      });
   });

   it("clicking reset clears all active filters", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogEntriesToolbar {...defaultProps} />,
         "/explore",
         "f_search=test&f_categories=category-1",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("reset-filters-btn"));
      });

      await userEvent.click(screen.getByTestId("reset-filters-btn"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });
   });
});
