jest.mock("use-debounce", () => ({
   useDebouncedCallback: <T extends (...args: unknown[]) => unknown>(
      callback: T
   ) => {
      return (...args: Parameters<T>) => callback(...args);
   },
}));

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

const assertFilterValue = (value: string) => {
   const filter = screen.getByDisplayValue(value);
   assertInDocument(filter);
};

describe("SearchFilter rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("search test-1 - test", async () => {
      const { container } = renderWithRouter(
         <SearchFilter />,
         "/",
         "f_search=test-1"
      );

      await waitFor(() => {
         assertRendered();
         assertFilterValue("test-1");
      });

      expect(container).toMatchSnapshot();
   });

   it("search test-2 - test", async () => {
      const { container } = renderWithRouter(
         <SearchFilter />,
         "/",
         "f_search=test-2"
      );

      await waitFor(() => {
         assertRendered();
         assertFilterValue("test-2");
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SearchFilter functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("search input typed - test", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<SearchFilter />, "/", "", onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const value = "test-789";
      const input = screen.getByTestId("input");
      await userEvent.type(input, value);

      await waitFor(() => {
         assertFilterValue(value);
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).toContain("f_search=test-789");
   });
});
