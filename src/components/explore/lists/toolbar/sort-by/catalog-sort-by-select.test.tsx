import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { DListSortByMode } from "@/data/types/domain/common";

import { CatalogSortBySelect } from "./catalog-sort-by-select";

const assertRendered = () => {
   assertInDocument(screen.getByTestId("catalog-sort-by-select"));
};

const getMobileIconClass = () =>
   screen.getByTestId("sort-mobile-icon").getAttribute("class") ?? "";

describe("CatalogSortBySelect rendering tests", () => {
   it("renders with default sort (DATE_DESC)", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore"
      );

      await waitFor(() => assertRendered());

      expect(container).toMatchSnapshot();
   });

   it("renders with DATE_ASC sort", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.DATE_ASC}`
      );

      await waitFor(() => assertRendered());

      expect(container).toMatchSnapshot();
   });

   it("renders with TITLE_ASC sort", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.TITLE_ASC}`
      );

      await waitFor(() => assertRendered());

      expect(container).toMatchSnapshot();
   });

   it("renders with TITLE_DESC sort", async () => {
      const { container } = renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.TITLE_DESC}`
      );

      await waitFor(() => assertRendered());

      expect(container).toMatchSnapshot();
   });
});

describe("CatalogSortBySelect mobile icon tests", () => {
   it("shows Clock icon for DATE_DESC", async () => {
      renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.DATE_DESC}`
      );

      await waitFor(() => assertRendered());

      expect(getMobileIconClass()).toContain("lucide-clock");
   });

   it("shows ClockArrowDown icon for DATE_ASC", async () => {
      renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.DATE_ASC}`
      );

      await waitFor(() => assertRendered());

      expect(getMobileIconClass()).toContain("lucide-clock-arrow-down");
   });

   it("shows ArrowDownAZ icon for TITLE_ASC", async () => {
      renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.TITLE_ASC}`
      );

      await waitFor(() => assertRendered());

      expect(getMobileIconClass()).toContain("lucide-arrow-down-a-z");
   });

   it("shows ArrowUpAZ icon for TITLE_DESC", async () => {
      renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.TITLE_DESC}`
      );

      await waitFor(() => assertRendered());

      expect(getMobileIconClass()).toContain("lucide-arrow-up-a-z");
   });

   it("icon changes after selecting a new sort option", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.DATE_DESC}`,
         onUrlUpdateFn
      );

      await waitFor(() => assertRendered());
      expect(getMobileIconClass()).toContain("lucide-clock");

      await userEvent.click(screen.getByTestId("catalog-sort-by-select"));

      await waitFor(() =>
         assertInDocument(screen.getByTestId("sort-title-asc"))
      );

      await userEvent.click(screen.getByTestId("sort-title-asc"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).toBe(`?sort=${DListSortByMode.TITLE_ASC}`);
      });
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

      await waitFor(() => assertRendered());

      await userEvent.click(screen.getByTestId("catalog-sort-by-select"));

      await waitFor(() =>
         assertInDocument(screen.getByTestId("sort-date-asc"))
      );

      await userEvent.click(screen.getByTestId("sort-date-asc"));

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

   it("selecting TITLE_ASC updates the URL", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.DATE_DESC}`,
         onUrlUpdateFn
      );

      await waitFor(() => assertRendered());

      await userEvent.click(screen.getByTestId("catalog-sort-by-select"));

      await waitFor(() =>
         assertInDocument(screen.getByTestId("sort-title-asc"))
      );

      await userEvent.click(screen.getByTestId("sort-title-asc"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).toBe(`?sort=${DListSortByMode.TITLE_ASC}`);
      });
   });

   it("selecting TITLE_DESC updates the URL", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CatalogSortBySelect />,
         "/explore",
         `sort=${DListSortByMode.DATE_DESC}`,
         onUrlUpdateFn
      );

      await waitFor(() => assertRendered());

      await userEvent.click(screen.getByTestId("catalog-sort-by-select"));

      await waitFor(() =>
         assertInDocument(screen.getByTestId("sort-title-desc"))
      );

      await userEvent.click(screen.getByTestId("sort-title-desc"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
         const event = onUrlUpdateFn.mock.calls[0]![0]!;
         expect(event.queryString).toBe(`?sort=${DListSortByMode.TITLE_DESC}`);
      });
   });
});
