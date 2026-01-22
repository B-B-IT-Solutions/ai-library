import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithReactQuery } from "@tests";

import { FiltersContext } from "./context";
import { PromptFilters } from "./prompts-filter";
import { DFiltersContext } from "./types";

const mockFiltersContext = (
   search: string,
   hasActiveFilters: boolean
): DFiltersContext => ({
   filters: {
      search,
      categories: [],
   },
   setFilters: jest.fn(),
   hasActiveFilters,
});

const renderWithContext = (contextValue: DFiltersContext | null) => {
   return renderWithReactQuery(
      <FiltersContext.Provider value={contextValue}>
         <PromptFilters />
      </FiltersContext.Provider>
   );
};

const assertRendered = () => {
   const filter = screen.getByTestId("prompts-filter");
   const resetBtn = screen.getByTestId("reset-btn");
   const search = screen.getByTestId("search-filter");
   const categories = screen.getByTestId("categories-filter");

   assertInDocument(filter);
   assertInDocument(resetBtn);
   assertInDocument(search);
   assertInDocument(categories);
};

const assertResetnBtnDisabled = () => {
   const resetButton = screen.getByTestId("reset-btn");
   expect(resetButton).toBeDisabled();
};

const assertResetnBtnNotDisabled = () => {
   const resetButton = screen.getByTestId("reset-btn");
   expect(resetButton).not.toBeDisabled();
};

describe("PromptFilters rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptFilters - filterContext null - test", () => {
      const { container } = renderWithContext(null);

      expect(container.firstChild).toBeNull();
      expect(container).toMatchSnapshot();
   });

   it("PromptFilters - reset btn enabled - rendered test", async () => {
      const filterContext = mockFiltersContext("test search", true);
      const { container } = renderWithContext(filterContext);

      await waitFor(() => {
         assertRendered();
         assertResetnBtnNotDisabled();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptFilters - reset btn disabled - rendered test", async () => {
      const filterContext = mockFiltersContext("", false);
      const { container } = renderWithContext(filterContext);

      await waitFor(() => {
         assertRendered();
         assertResetnBtnDisabled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptFilters functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptFilters - reset btn clicked - test", async () => {
      const mockContext = mockFiltersContext("test search", true);
      renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
         assertResetnBtnNotDisabled();
         expect(mockContext.setFilters).not.toHaveBeenCalled();
      });

      const resetButton = screen.getByTestId("reset-btn");
      await userEvent.click(resetButton);

      await waitFor(() => {
         expect(mockContext.setFilters).toHaveBeenCalledTimes(1);
         expect(mockContext.setFilters).toHaveBeenCalledWith({});
      });
   });
});
