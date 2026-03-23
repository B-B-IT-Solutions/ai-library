import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { SortBySelect } from "./sort-by-select";

const assertRendered = () => {
   const select = screen.getByTestId("sort-by-select");
   assertInDocument(select);
};

describe("SortBySelect rendering tests", () => {
   it("SortBySelect - sortBy asc(date) - test", async () => {
      const url = "/library";
      const searchParams = "sort=asc(date)";

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

   it("SortBySelect - sortBy desc(date) - test", async () => {
      const url = "/library";
      const searchParams = "sort=desc(date)";

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

   it("SortBySelect - sortBy asc(name) - test", async () => {
      const url = "/library";
      const searchParams = "sort=asc(name)";

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

   it("SortBySelect - option asc(date) selected - test", async () => {
      const url = "/library";
      const searchParams = "sort=asc(name)";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<SortBySelect />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const select = screen.getByTestId("sort-by-select");
      await userEvent.click(select);

      await waitFor(() => {
         const option = screen.getByTestId("asc-date");
         assertInDocument(option);
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const option = screen.getByTestId("asc-date");
      await userEvent.click(option);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?sort=asc(date)",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });

   it("SortBySelect - option asc(name) selected - test", async () => {
      const url = "/library";
      const searchParams = "sort=desc(date)";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<SortBySelect />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const select = screen.getByTestId("sort-by-select");
      await userEvent.click(select);

      await waitFor(() => {
         const option = screen.getByTestId("asc-name");
         assertInDocument(option);
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const option = screen.getByTestId("asc-name");
      await userEvent.click(option);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?sort=asc(name)",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });
});
