import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";

import {
   LibraryEntryFilterContext,
   LibraryEntryFiltersHelper,
} from "./filters-context";
import { SearchFilter } from "./search-filter";

const filtersHelper = new LibraryEntryFiltersHelper({});

const TestWrapper = () => {
   return (
      <LibraryEntryFilterContext.Provider value={filtersHelper}>
         <SearchFilter />
      </LibraryEntryFilterContext.Provider>
   );
};

const mockGetSearch = (value: string) => {
   return jest
      .spyOn(LibraryEntryFiltersHelper.prototype, "getSearch")
      .mockImplementation(() => value);
};

const mockSetSearch = () => {
   return jest.spyOn(LibraryEntryFiltersHelper.prototype, "setSearch");
};

const assertRendered = () => {
   const filter = screen.getByTestId("search-filter");
   const input = screen.getByTestId("input");

   assertInDocument(filter);
   assertInDocument(input);
};

describe("SearchFilter rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SearchFilter - search test-1 - test", async () => {
      const getSearchFn = mockGetSearch("test-1");

      const { container } = render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         expect(getSearchFn).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("SearchFilter - search test-2 - test", async () => {
      const getSearchFn = mockGetSearch("test-2");
      const { container } = render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         expect(getSearchFn).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SearchFilter functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SearchFilter - search input typed - test", async () => {
      const getSearchFn = mockGetSearch("");
      const setSearchFn = mockSetSearch();

      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         expect(getSearchFn).toHaveBeenCalledTimes(1);
         expect(setSearchFn).not.toHaveBeenCalled();
      });

      const value = "test-789";
      const input = screen.getByTestId("input");
      await userEvent.type(input, value);

      await waitFor(() => {
         expect(setSearchFn).toHaveBeenCalledTimes(1);
         expect(setSearchFn).toHaveBeenCalledWith(value);
      });
   });
});
