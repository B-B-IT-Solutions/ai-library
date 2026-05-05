import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { CatalogFilterContent } from "./catalog-filter-content";

const defaultProps = {
   categories: dtestData.dCatalogEntryCategories(3),
   totalElements: 10,
};

describe("CatalogFilterContent rendering tests", () => {
   it("renders all categories", async () => {
      const { container } = renderWithRouter(
         <CatalogFilterContent {...defaultProps} />,
         "/explore"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("explore-category-filter"));
         assertInDocument(screen.getByTestId("sidebar-category-category-1"));
         assertInDocument(screen.getByTestId("sidebar-category-category-2"));
         assertInDocument(screen.getByTestId("sidebar-category-category-3"));
      });

      expect(container).toMatchSnapshot();
   });

   it("shows total count next to 'Alle'", async () => {
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} totalElements={42} />,
         "/explore"
      );

      await waitFor(() => {
         expect(
            screen.getByTestId("explore-category-filter").textContent
         ).toContain("42");
      });
   });

   it("hides reset button when no filters are active", async () => {
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} />,
         "/explore"
      );

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("sidebar-reset-btn"));
      });
   });

   it("shows reset button when category filter is active", async () => {
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} />,
         "/explore",
         "f_categories=category-1"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("sidebar-reset-btn"));
      });
   });

   it("shows reset button when search filter is active", async () => {
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} />,
         "/explore",
         "f_search=test"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("sidebar-reset-btn"));
      });
   });

   it("highlights active category", async () => {
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} />,
         "/explore",
         "f_categories=category-2"
      );

      await waitFor(() => {
         const activeBtn = screen.getByTestId("sidebar-category-category-2");
         expect(activeBtn.className).toContain("text-primary");

         const inactiveBtn = screen.getByTestId("sidebar-category-category-1");
         expect(inactiveBtn.className).not.toContain("text-primary");
      });
   });

   it("shows check icon on active category", async () => {
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} />,
         "/explore",
         "f_categories=category-1"
      );

      await waitFor(() => {
         const active = screen.getByTestId("sidebar-category-category-1");
         expect(active.querySelector("svg")).toBeTruthy();

         const inactive = screen.getByTestId("sidebar-category-category-2");
         expect(inactive.querySelector("svg")).toBeFalsy();
      });
   });

   it("highlights 'Alle' when no category is selected", async () => {
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} />,
         "/explore"
      );

      await waitFor(() => {
         const allBtn = screen.getByText(/^Alle/);
         expect(allBtn.className).toContain("text-primary");
      });
   });
});

describe("CatalogFilterContent interaction tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("clicking a category updates the URL", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} />,
         "/explore",
         "",
         onUrlUpdateFn
      );

      await waitFor(() =>
         assertInDocument(screen.getByTestId("sidebar-category-category-1"))
      );

      await userEvent.click(screen.getByTestId("sidebar-category-category-1"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).toContain("f_categories=category-1");
      });
   });

   it("clicking an active category deselects it", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} />,
         "/explore",
         "f_categories=category-1",
         onUrlUpdateFn
      );

      await waitFor(() =>
         assertInDocument(screen.getByTestId("sidebar-category-category-1"))
      );

      await userEvent.click(screen.getByTestId("sidebar-category-category-1"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).not.toContain("f_categories");
      });
   });

   it("clicking 'Alle' clears all category filters", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} />,
         "/explore",
         "f_categories=category-1&f_categories=category-2",
         onUrlUpdateFn
      );

      await waitFor(() =>
         assertInDocument(screen.getByTestId("explore-category-filter"))
      );

      await userEvent.click(screen.getByText(/^Alle/));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).not.toContain("f_categories");
      });
   });

   it("clicking reset clears both search and category filters", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} />,
         "/explore",
         "f_search=test&f_categories=category-1",
         onUrlUpdateFn
      );

      await waitFor(() =>
         assertInDocument(screen.getByTestId("sidebar-reset-btn"))
      );

      await userEvent.click(screen.getByTestId("sidebar-reset-btn"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
         const lastCall =
            onUrlUpdateFn.mock.calls[onUrlUpdateFn.mock.calls.length - 1]![0]!;
         expect(lastCall.queryString).not.toContain("f_search");
         expect(lastCall.queryString).not.toContain("f_categories");
      });
   });

   it("calls onSelect callback when a category is clicked", async () => {
      const onSelect = jest.fn();
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} onSelect={onSelect} />,
         "/explore"
      );

      await waitFor(() =>
         assertInDocument(screen.getByTestId("sidebar-category-category-1"))
      );

      await userEvent.click(screen.getByTestId("sidebar-category-category-1"));

      await waitFor(() => {
         expect(onSelect).toHaveBeenCalledTimes(1);
      });
   });

   it("calls onSelect callback when 'Alle' is clicked", async () => {
      const onSelect = jest.fn();
      renderWithRouter(
         <CatalogFilterContent {...defaultProps} onSelect={onSelect} />,
         "/explore",
         "f_categories=category-1"
      );

      await waitFor(() =>
         assertInDocument(screen.getByTestId("explore-category-filter"))
      );

      await userEvent.click(screen.getByText(/^Alle/));

      await waitFor(() => {
         expect(onSelect).toHaveBeenCalledTimes(1);
      });
   });
});
