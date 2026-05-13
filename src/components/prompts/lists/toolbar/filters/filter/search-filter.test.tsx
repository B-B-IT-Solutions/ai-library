import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertHasNoAttribute,
   assertInDocument,
} from "@tests";

import { DPrompt0sFilter } from "@/data/types/domain/prompt0";
import { FiltersContext } from "../context";
import { DFiltersContext } from "../types";

import { SearchFilter } from "./search-filter";

const mockFiltersContext = (search?: string): DFiltersContext => ({
   filters: {
      search,
      categories: ["Category 1", "Category 2"],
   },
   setFilters: jest.fn(),
   hasActiveFilters: false,
});

const renderWithContext = (contextValue: DFiltersContext | null) => {
   return render(
      <FiltersContext.Provider value={contextValue}>
         <SearchFilter />
      </FiltersContext.Provider>
   );
};

const assertRendered = () => {
   const filter = screen.getByTestId("search-filter");
   const label = screen.getByTestId("filter-label");
   const input = screen.getByTestId("search-input");

   assertInDocument(filter);
   assertInDocument(label);
   assertInDocument(input);
   assertHasAttributeWithValue(input, "type", "text");
   assertHasAttributeWithValue(input, "id", "search-prompts");
};

const assertInputValue = (value: string | null) => {
   const input = screen.getByTestId("search-input");
   if (value) {
      assertHasAttributeWithValue(input, "value", value);
   } else {
      assertHasNoAttribute(input, "value");
   }
};

describe("SearchFilter rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SearchFilter - filtersContext null - test", async () => {
      const { container } = renderWithContext(null);

      expect(container.firstChild).toBeNull();
      expect(container).toMatchSnapshot();
   });

   it("SearchFilter - default value empty - rendered tests", async () => {
      const mockContext = mockFiltersContext("");
      const { container } = renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("SearchFilter - default value defined - rendered tests", async () => {
      const mockContext = mockFiltersContext("search 1");
      const { container } = renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SearchFilter functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SearchFilter - search filter updated with debounce - test", async () => {
      const mockContext = mockFiltersContext("");
      renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
      });

      const searchText = "test search - test@#$%&*()";
      const input = screen.getByTestId("search-input");
      await userEvent.type(input, searchText);

      // setFilters should not be called immediately
      expect(mockContext.setFilters).not.toHaveBeenCalled();

      const expectedFiltersPayload: DPrompt0sFilter = {
         search: searchText,
         categories: mockContext.filters.categories,
      };

      // Wait for debounce (300ms + buffer)
      const options = { timeout: 1000 };
      await waitFor(() => {
         expect(mockContext.setFilters).toHaveBeenCalledTimes(1);
         expect(mockContext.setFilters).toHaveBeenCalledWith(
            expectedFiltersPayload
         );
      }, options);
   });

   it("SearchFilter - search filter updated - multiple rapid changes debounced - test", async () => {
      const mockContext = mockFiltersContext("");
      renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
      });

      const input = screen.getByTestId("search-input");

      await userEvent.type(input, "a");
      await userEvent.type(input, "b");
      await userEvent.type(input, "c");

      // At this point, 300ms haven't passed since the last keystroke
      expect(mockContext.setFilters).not.toHaveBeenCalled();

      const expectedFiltersPayload: DPrompt0sFilter = {
         search: "abc",
         categories: mockContext.filters.categories,
      };

      // Wait for debounce (300ms + buffer)
      const options = { timeout: 1000 };
      await waitFor(() => {
         expect(mockContext.setFilters).toHaveBeenCalledTimes(1);
         expect(mockContext.setFilters).toHaveBeenCalledWith(
            expectedFiltersPayload
         );
      }, options);
   });

   it("SearchFilter - search filter updated - multiple separate searches with debouncing - test", async () => {
      const mockContext = mockFiltersContext("");
      renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
      });

      const input = screen.getByTestId("search-input");

      await userEvent.type(input, "first");

      const expectedFiltersPayload1: DPrompt0sFilter = {
         search: "first",
         categories: mockContext.filters.categories,
      };

      const options = { timeout: 1000 };
      await waitFor(() => {
         expect(mockContext.setFilters).toHaveBeenCalledTimes(1);
         expect(mockContext.setFilters).toHaveBeenCalledWith(
            expectedFiltersPayload1
         );
      }, options);

      await userEvent.type(input, " second");

      const expectedFiltersPayload2: DPrompt0sFilter = {
         search: "first second",
         categories: mockContext.filters.categories,
      };

      await waitFor(() => {
         expect(mockContext.setFilters).toHaveBeenCalledTimes(2);
         expect(mockContext.setFilters).toHaveBeenCalledWith(
            expectedFiltersPayload2
         );
      }, options);
   });

   it("SearchFilter - reset btn click resets search value - test", async () => {
      const mockContext = mockFiltersContext("initial");
      const { rerender } = renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
         assertInputValue("initial");
      });

      // Update context
      mockContext.filters.search = undefined;

      rerender(
         <FiltersContext.Provider value={mockContext}>
            <SearchFilter />
         </FiltersContext.Provider>
      );

      await waitFor(() => {
         assertRendered();
         assertInputValue(null);
      });
   });

   it("SearchFilter - search undefined - html input element null - test", async () => {
      const originalGetElementById = document.getElementById;
      const mockGetElementById = jest.fn(() => null);
      document.getElementById = mockGetElementById;

      const mockContext = mockFiltersContext(undefined);
      const { container } = renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
         expect(mockGetElementById).toHaveBeenCalledTimes(1);
         expect(mockGetElementById).toHaveBeenCalledWith("search-prompts");
      });

      expect(container.firstChild).not.toBeNull();
      document.getElementById = originalGetElementById;
   });
});
