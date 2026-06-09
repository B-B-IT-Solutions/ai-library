import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { SortBySelect } from "./sort-by-select";

const assertRendered = () => {
   const select = screen.getByTestId("sort-by-select");
   assertInDocument(select);
};

describe("SortBySelect rendering tests", () => {
   it("sortBy asc(createdAt) - test", async () => {
      const url = "/collections";
      const searchParams = "sort=asc(createdAt)";

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

   it("sortBy desc(createdAt) - test", async () => {
      const url = "/collections";
      const searchParams = "sort=desc(createdAt)";

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

   it("sortBy asc(title) - test", async () => {
      const url = "/collections";
      const searchParams = "sort=asc(title)";

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

   it("option asc(date) selected - test", async () => {
      const url = "/collections";
      const searchParams = "sort=asc(title)";
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
         queryString: "?sort=asc(createdAt)",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });

   it("option asc(title) selected - test", async () => {
      const url = "/collections";
      const searchParams = "sort=asc(title)";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<SortBySelect />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const select = screen.getByTestId("sort-by-select");
      await userEvent.click(select);

      await waitFor(() => {
         const option = screen.getByTestId("desc-date");
         assertInDocument(option);
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const option = screen.getByTestId("desc-date");
      await userEvent.click(option);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?sort=desc(createdAt)",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });
});
