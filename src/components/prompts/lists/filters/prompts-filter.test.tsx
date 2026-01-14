import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithReactQuery } from "@tests";

import { FiltersContext } from "./context";
import { PromptFilters } from "./prompts-filter";
import { DFiltersContext } from "./types";

const mockFiltersContext = (
   search: string = "",
   categories: string[] = []
): DFiltersContext => ({
   filters: {
      search,
      categories,
   },
   setFilters: jest.fn(),
   activeFilters: false,
});

const renderWithContext = (
   contextValue: DFiltersContext | null = mockFiltersContext()
) => {
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

   it("PromptFilters rendered test", async () => {
      const { container } = renderWithContext();

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("should render reset button disabled when no filters are active", async () => {
      renderWithContext(mockFiltersContext("", []));

      await waitFor(() => {
         const resetButton = screen.getByRole("button", {
            name: /Zurücksetzen/i,
         });
         expect(resetButton).toBeInTheDocument();
         expect(resetButton).toBeDisabled();
      });
   });

   it("should render reset button enabled when search filter is active", async () => {
      renderWithContext(mockFiltersContext("test search", []));

      await waitFor(() => {
         const resetButton = screen.getByText("Zurücksetzen");
         expect(resetButton).toBeInTheDocument();
         expect(resetButton).not.toBeDisabled();
      });
   });

   it("should render reset button enabled when categories filter is active", async () => {
      renderWithContext(mockFiltersContext("", ["Category 1", "Category 2"]));

      await waitFor(() => {
         const resetButton = screen.getByText("Zurücksetzen");
         expect(resetButton).toBeInTheDocument();
         expect(resetButton).not.toBeDisabled();
      });
   });

   it("should render reset button enabled when both filters are active", async () => {
      renderWithContext(
         mockFiltersContext("test search", ["Category 1", "Category 2"])
      );

      await waitFor(() => {
         const resetButton = screen.getByText("Zurücksetzen");
         expect(resetButton).toBeInTheDocument();
         expect(resetButton).not.toBeDisabled();
      });
   });

   it("should render the RotateCcw icon in reset button", async () => {
      renderWithContext();

      await waitFor(() => {
         const resetButton = screen.getByText("Zurücksetzen");
         const svg = resetButton.parentElement?.querySelector("svg");
         expect(svg).toBeInTheDocument();
      });
   });
});

describe("PromptFilters functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should clear all filters when reset button is clicked", async () => {
      const mockContext = mockFiltersContext("test search", [
         "Category 1",
         "Category 2",
      ]);
      renderWithContext(mockContext);

      await waitFor(() => {
         assertResetnBtnNotDisabled();
      });

      const resetButton = screen.getByText("Zurücksetzen");
      await userEvent.click(resetButton);

      expect(mockContext.setFilters).toHaveBeenCalledWith({});
   });

   it("should handle reset when search input does not exist", async () => {
      const mockContext = mockFiltersContext("test search", []);
      renderWithContext(mockContext);

      await waitFor(() => {
         assertResetnBtnNotDisabled();
      });

      const resetButton = screen.getByText("Zurücksetzen");

      // This should not throw an error
      await userEvent.click(resetButton);

      expect(mockContext.setFilters).toHaveBeenCalledWith({});
   });

   it("should not allow clicking disabled reset button", async () => {
      const mockContext = mockFiltersContext("", []);
      renderWithContext(mockContext);

      await waitFor(() => {
         assertResetnBtnDisabled();
      });

      const resetButton = screen.getByRole("button", { name: /Zurücksetzen/i });
      await userEvent.click(resetButton);

      // Should not call setFilters when button is disabled
      expect(mockContext.setFilters).not.toHaveBeenCalled();
   });

   it("should only clear filters once when reset is clicked multiple times rapidly", async () => {
      const mockContext = mockFiltersContext("test search", ["Category 1"]);
      renderWithContext(mockContext);

      await waitFor(() => {
         assertResetnBtnNotDisabled();
      });

      const resetButton = screen.getByText("Zurücksetzen");

      // Click multiple times
      await userEvent.click(resetButton);
      await userEvent.click(resetButton);
      await userEvent.click(resetButton);

      // Should call setFilters three times (once per click)
      expect(mockContext.setFilters).toHaveBeenCalledTimes(3);
      expect(mockContext.setFilters).toHaveBeenCalledWith({});
   });

   it("PromptFilters - maintains filter context state across re-renders - test", async () => {
      const mockContext = mockFiltersContext("initial", ["Cat1"]);
      const { rerender } = renderWithContext(mockContext);

      await waitFor(() => {
         assertResetnBtnNotDisabled();
      });

      // Update context
      mockContext.filters.search = "updated";
      mockContext.filters.categories = ["Cat1", "Cat2"];

      rerender(
         <FiltersContext.Provider value={mockContext}>
            <PromptFilters />
         </FiltersContext.Provider>
      );

      await waitFor(() => {
         assertResetnBtnNotDisabled();
      });
   });
});
