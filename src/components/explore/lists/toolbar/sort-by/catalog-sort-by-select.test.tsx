import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValueContaining,
   assertInDocument,
   renderWithRouter,
} from "@tests";

import { DListSortByMode } from "@/data/types/domain/common";

import { CatalogSortBySelect } from "./catalog-sort-by-select";

const assertRendered = () => {
   assertInDocument(screen.getByTestId("catalog-sort-by-select"));
};

const assertMobileIconClass = (value: string) => {
   const mobileIcon = screen.getByTestId("sort-mobile-icon");
   assertHasAttributeWithValueContaining(mobileIcon, "class", value);
};

describe("CatalogSortBySelect rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("default (DATE_DESC) sort - test", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore"
      );

      await waitFor(() => {
         assertRendered();
         assertMobileIconClass("lucide-clock");
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
         assertMobileIconClass("lucide-clock-arrow-down");
      });

      expect(container).toMatchSnapshot();
   });

   it("TITLE_ASC sort - test", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.TITLE_ASC}`
      );

      await waitFor(() => {
         assertRendered();
         assertMobileIconClass("lucide-arrow-down-a-z");
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
         assertMobileIconClass("lucide-arrow-up-a-z");
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
         assertMobileIconClass("lucide-clock");
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
         assertMobileIconClass("lucide-clock-arrow-down");
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
