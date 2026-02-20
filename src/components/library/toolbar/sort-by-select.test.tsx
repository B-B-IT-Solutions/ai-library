import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { SortBySelect } from "./sort-by-select";

const assertRendered = () => {
   const select = screen.getByTestId("sort-by-select");
   assertInDocument(select);
};

describe("SortBySelect rendering tests", () => {
   it("SortBySelect - sortBy date-asc - test", async () => {
      const url = "/library";
      const searchParams = "sort=date-asc";

      const { container } = renderWithRouter(
         <SortBySelect />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("SortBySelect - sortBy date-desc - test", async () => {
      const url = "/library";
      const searchParams = "sort=date-desc";

      const { container } = renderWithRouter(
         <SortBySelect />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("SortBySelect - sortBy name-asc - test", async () => {
      const url = "/library";
      const searchParams = "sort=name-asc";

      const { container } = renderWithRouter(
         <SortBySelect />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SortBySelect functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SortBySelect - option date-asc selected - test", async () => {
      const url = "/library";
      const searchParams = "sort=name-asc";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<SortBySelect />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const select = screen.getByTestId("sort-by-select");
      userEvent.click(select);

      await waitFor(() => {
         const option = screen.getByTestId("date-asc");
         assertInDocument(option);
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const option = screen.getByTestId("date-asc");
      userEvent.click(option);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?sort=date-asc",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });

   it("SortBySelect - option name-asc selected - test", async () => {
      const url = "/library";
      const searchParams = "sort=date-desc";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<SortBySelect />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const select = screen.getByTestId("sort-by-select");
      userEvent.click(select);

      await waitFor(() => {
         const option = screen.getByTestId("name-asc");
         assertInDocument(option);
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const option = screen.getByTestId("name-asc");
      userEvent.click(option);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?sort=name-asc",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });
});
