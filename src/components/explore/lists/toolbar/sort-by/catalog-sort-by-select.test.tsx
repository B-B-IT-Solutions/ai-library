import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { DListSortByMode } from "@/data/types/domain/common";

import { CatalogSortBySelect } from "./catalog-sort-by-select";

const assertRendered = () => {
   const sortBy = screen.getByTestId("catalog-sort-by-select");
   assertInDocument(sortBy);
};

describe("CatalogSortBySelect rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("default (TITLE_ASC) sort - test", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("TITLE_DESC sort - test", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.TITLE_DESC}`
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("DATE_ASC sort - test", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.DATE_ASC}`
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("DATE_DESC sort - test", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.DATE_DESC}`
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
         `sort=${DListSortByMode.DATE_DESC}`,
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
      });

      const select = screen.getByTestId("catalog-sort-by-select");
      await userEvent.click(select);

      await waitFor(() => {
         const option = screen.getByTestId("sort-date-asc");
         assertInDocument(option);
      });

      const option = screen.getByTestId("sort-date-asc");
      await userEvent.click(option);

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);

         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).toBe(`?sort=${DListSortByMode.DATE_ASC}`);
         expect(event.options).toEqual({
            history: "replace",
            scroll: false,
            shallow: false,
         });
      });
   });
});
