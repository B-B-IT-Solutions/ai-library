import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { CatalogSortBySelect } from "./catalog-sort-by-select";

const assertRendered = () => {
   assertInDocument(screen.getByTestId("catalog-sort-by-select"));
};

describe("CatalogSortBySelect rendering tests", () => {
   it("renders with default sort (DATE_DESC)", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("renders with DATE_ASC sort", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         "sort=asc(createdAt)"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("renders with TITLE_ASC sort", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         "sort=asc(title)"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("renders with TITLE_DESC sort", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         "sort=desc(title)"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CatalogSortBySelect functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("selecting DATE_ASC updates the URL", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         "sort=desc(createdAt)",
         onUrlUpdateFn
      );

      await waitFor(() => assertRendered());

      await userEvent.click(screen.getByTestId("catalog-sort-by-select"));

      await waitFor(() => {
         assertInDocument(screen.getByTestId("sort-date-asc"));
      });

      await userEvent.click(screen.getByTestId("sort-date-asc"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).toBe("?sort=asc(createdAt)");
         expect(event.options).toEqual({
            history: "replace",
            scroll: false,
            shallow: false,
         });
      });
   });

   it("selecting TITLE_ASC updates the URL", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         "sort=desc(createdAt)",
         onUrlUpdateFn
      );

      await waitFor(() => assertRendered());

      await userEvent.click(screen.getByTestId("catalog-sort-by-select"));

      await waitFor(() => {
         assertInDocument(screen.getByTestId("sort-title-asc"));
      });

      await userEvent.click(screen.getByTestId("sort-title-asc"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).toBe("?sort=asc(title)");
      });
   });

   it("selecting TITLE_DESC updates the URL", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         "sort=desc(createdAt)",
         onUrlUpdateFn
      );

      await waitFor(() => assertRendered());

      await userEvent.click(screen.getByTestId("catalog-sort-by-select"));

      await waitFor(() => {
         assertInDocument(screen.getByTestId("sort-title-desc"));
      });

      await userEvent.click(screen.getByTestId("sort-title-desc"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).toBe("?sort=desc(title)");
      });
   });
});
