jest.mock("use-debounce", () => ({
   useDebouncedCallback: <T extends (...args: unknown[]) => unknown>(
      callback: T
   ) => {
      const fn = (...args: Parameters<T>) => callback(...args);
      fn.cancel = () => {};
      return fn;
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
   assertInDocument(screen.getByTestId("search-filter"));
   assertInDocument(screen.getByTestId("input"));
};

const assertClearButtonRendered = () =>
   assertInDocument(screen.getByTestId("clear-btn"));

const assertClearButtonNotRendered = () =>
   assertNotInDocument(screen.queryByTestId("clear-btn"));

const assertFilterValue = (value: string) =>
   assertInDocument(screen.getByDisplayValue(value));

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
         "f_search=mein-workflow"
      );

      await waitFor(() => {
         assertRendered();
         assertClearButtonRendered();
         assertFilterValue("mein-workflow");
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SearchFilter functionality tests", () => {
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

      const input = screen.getByTestId("input");
      await userEvent.type(input, "flow-42");

      await waitFor(() => {
         assertFilterValue("flow-42");
         assertClearButtonRendered();
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).toContain("f_search=flow-42");
   });

   it("clear btn click - test", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <SearchFilter />,
         "/",
         "f_search=mein-workflow",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         assertClearButtonRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      await userEvent.click(screen.getByTestId("clear-btn"));

      await waitFor(() => {
         assertClearButtonNotRendered();
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).not.toContain("f_search=");
   });
});
