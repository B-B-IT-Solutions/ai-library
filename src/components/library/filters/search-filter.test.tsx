import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { SearchFilter } from "./search-filter";

const assertRendered = () => {
   const filter = screen.getByTestId("search-filter");
   const input = screen.getByTestId("input");

   assertInDocument(filter);
   assertInDocument(input);
};

describe("SearchFilter rendering tests", () => {
   it("SearchFilter - f_search test-1 - test", async () => {
      const url = "/library";
      const searchParams = "f_search=test-1";
      const { container } = renderWithRouter(
         <SearchFilter />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("SearchFilter - f_search test-2 - test", async () => {
      const url = "/library";
      const searchParams = "f_search=test-2";
      const { container } = renderWithRouter(
         <SearchFilter />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SearchFilter functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SearchFilter - option category selected - test", async () => {
      const url = "/library";
      const searchParams = "f_search=t";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<SearchFilter />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const value = "est-789";
      const input = screen.getByTestId("input");
      await userEvent.type(input, value);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?f_search=test-789",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });
});
