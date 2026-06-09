jest.mock("use-debounce", () => ({
   useDebouncedCallback: <T extends (...args: unknown[]) => unknown>(
      callback: T
   ) => {
      return (...args: Parameters<T>) => callback(...args);
   },
}));

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   renderWithRouter,
} from "@tests";

import { SearchFilter } from "./search-filter";

const assertRendered = () => {
   const filter = screen.getByTestId("search-filter");
   const input = screen.getByTestId("input");

   assertInDocument(filter);
   assertInDocument(input);
};

const assertClearButtonRendered = () => {
   const btn = screen.getByTestId("clear-btn");
   assertInDocument(btn);
};

const assertClearButtonNotRendered = () => {
   const btn = screen.queryByTestId("clear-btn");
   assertNotInDocument(btn);
};

const assertFilterValue = (value: string) => {
   const filter = screen.getByDisplayValue(value);
   assertInDocument(filter);
};

describe("SearchFilter rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("empty - test", async () => {
      const { container } = renderWithRouter(<SearchFilter />, "/", "");

      await waitFor(() => {
         assertRendered();
         assertClearButtonNotRendered();
         assertFilterValue("");
      });

      expect(container).toMatchSnapshot();
   });

   it("search with value - test", async () => {
      const { container } = renderWithRouter(
         <SearchFilter />,
         "/",
         "f_search=test-1"
      );

      await waitFor(() => {
         assertRendered();
         assertClearButtonRendered();
         assertFilterValue("test-1");
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
         assertClearButtonNotRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const value = "test-789";
      const input = screen.getByTestId("input");
      await userEvent.type(input, value);

      await waitFor(() => {
         assertFilterValue(value);
         assertClearButtonRendered();
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).toContain("f_search=test-789");
   });

   it("clear btn click - test", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<SearchFilter />, "/", "f_search=test-2", onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         assertClearButtonRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const clearButton = screen.getByTestId("clear-btn");
      await userEvent.click(clearButton);

      await waitFor(() => {
         assertClearButtonNotRendered();
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).not.toContain("f_search=");
   });
});
