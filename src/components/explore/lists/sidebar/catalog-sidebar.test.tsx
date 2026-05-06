import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { CatalogSidebar } from "./catalog-sidebar";

const defaultProps = {
   categories: dtestData.dCatalogEntryCategories(3),
   totalElements: 12,
};

describe("CatalogSidebar rendering tests", () => {
   it("renders sidebar with categories", async () => {
      const { container } = renderWithRouter(
         <CatalogSidebar {...defaultProps} />,
         "/explore"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("catalog-sidebar"));
         assertInDocument(screen.getByTestId("categories-filter"));
         assertInDocument(screen.getByTestId("category-category-1"));
         assertInDocument(screen.getByTestId("category-category-2"));
         assertInDocument(screen.getByTestId("category-category-3"));
      });

      expect(container).toMatchSnapshot();
   });

   it("shows total count next to 'Alle'", async () => {
      renderWithRouter(<CatalogSidebar {...defaultProps} />, "/explore");

      await waitFor(() => {
         expect(screen.getByTestId("categories-filter").textContent).toContain(
            "12"
         );
      });
   });

   it("hides reset button when no filters are active", async () => {
      renderWithRouter(<CatalogSidebar {...defaultProps} />, "/explore");

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("sidebar-reset-btn"));
      });
   });

   it("shows reset button when category filter is active", async () => {
      renderWithRouter(
         <CatalogSidebar {...defaultProps} />,
         "/explore",
         "f_categories=category-1"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("sidebar-reset-btn"));
      });
   });

   it("shows reset button when search filter is active", async () => {
      renderWithRouter(
         <CatalogSidebar {...defaultProps} />,
         "/explore",
         "f_search=test"
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("sidebar-reset-btn"));
      });
   });

   it("marks active category with check icon", async () => {
      renderWithRouter(
         <CatalogSidebar {...defaultProps} />,
         "/explore",
         "f_categories=category-1"
      );

      await waitFor(() => {
         const btn = screen.getByTestId("sidebar-category-category-1");
         expect(btn.querySelector("svg")).toBeTruthy();
      });
   });
});

describe("CatalogSidebar interaction tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("clicking a category updates the URL", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogSidebar {...defaultProps} />,
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

   it("clicking 'Alle' clears category filter", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogSidebar {...defaultProps} />,
         "/explore",
         "f_categories=category-1",
         onUrlUpdateFn
      );

      await waitFor(() =>
         assertInDocument(screen.getByTestId("explore-category-filter"))
      );

      await userEvent.click(screen.getByText("Alle"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).not.toContain("f_categories");
      });
   });

   it("clicking reset clears all active filters", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogSidebar {...defaultProps} />,
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
      });
   });
});
