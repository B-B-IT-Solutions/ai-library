import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { SearchFilter } from "./serach-filter";

const assertRendered = () => {
   const filter = screen.getByTestId("search-filter");
   const input = screen.getByTestId("search-input");

   assertInDocument(filter);
   assertInDocument(input);
};

const assertInputValue = (value: string) => {
   const input = screen.getByTestId("search-input") as HTMLInputElement;

   assertInDocument(input);
   expect(input.value).toBe(value);
};

describe("SearchFilter rendering tests", () => {
   it("input value empty - test", async () => {
      const { container } = renderWithRouter(<SearchFilter />, "/explore");

      await waitFor(() => {
         assertRendered();
         assertInputValue("");
      });

      expect(container).toMatchSnapshot();
   });

   it("input value defined - test", async () => {
      renderWithRouter(<SearchFilter />, "/explore", "f_search=test");

      await waitFor(() => {
         assertRendered();
         assertInputValue("test");
      });
   });
});

describe("CatalogEntriesToolbar functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("search input - test", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<SearchFilter />, "/explore", "", onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
      });

      const input = screen.getByTestId("search-input");

      const value = "test1";
      await userEvent.type(input, value);

      const expectedPayload1 = {
         options: {
            history: "replace",
            scroll: false,
            shallow: false,
         },
         queryString: `?f_search=${value}`,
      };

      const expectedPayload2 = {
         options: {
            history: "replace",
            scroll: false,
            shallow: false,
         },
         queryString: "",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
         expect(onUrlUpdateFn).toHaveBeenLastCalledWith(
            expect.objectContaining(expectedPayload1)
         );
      });

      await userEvent.clear(input);

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
         expect(onUrlUpdateFn).toHaveBeenLastCalledWith(
            expect.objectContaining(expectedPayload2)
         );
      });
   });
});
