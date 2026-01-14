jest.mock("@/data/ts-queries/prompt");

import { UseQueryResult } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import { forEach } from "es-toolkit/compat";

import { useLoadPromptCategories } from "@/data/ts-queries/prompt";
import { DPromptDescriptorsFilter } from "@/data/types/domain/prompt";
import { toTestId } from "@/lib/utils";
import { FiltersContext } from "../context";
import { DFiltersContext } from "../types";

import { CategoriesFilter } from "./categories-filter";

const useLoadPromptCategoriesMock =
   useLoadPromptCategories as jest.MockedFunction<
      typeof useLoadPromptCategories
   >;

const mockFiltersContext = (categories: string[] = []): DFiltersContext => ({
   filters: {
      search: "",
      categories,
   },
   setFilters: jest.fn(),
   activeFilters: false,
});

const renderWithContext = (contextValue: DFiltersContext | null) => {
   return render(
      <FiltersContext.Provider value={contextValue}>
         <CategoriesFilter />
      </FiltersContext.Provider>
   );
};

const queryResult = (categories?: string[]) => {
   return { data: categories } as unknown as UseQueryResult<string[]>;
};

const assertRendered = () => {
   const filter = screen.getByTestId("categories-filter");
   const label = screen.getByTestId("filter-label");
   const popoverTrigger = screen.getByTestId("popover-trigger");

   assertInDocument(filter);
   assertInDocument(label);
   assertInDocument(popoverTrigger);
};

const assertCategoriesNotSelected = () => {
   const category = screen.getByTestId("no-selected-category");
   assertInDocument(category);
};

const assertSelectedCategories = (selectedCategories: string[]) => {
   forEach(selectedCategories, (cat) => {
      const category = screen.getByTestId(`selected-category-${toTestId(cat)}`);
      assertInDocument(category);
   });

   const category = screen.queryByTestId("no-selected-category");
   assertNotInDocument(category);
};

const assertOptionsCategories = (optionCategories: string[]) => {
   const categoryOptions = screen.getByTestId("category-options");
   assertInDocument(categoryOptions);

   forEach(optionCategories, (cat) => {
      const category = screen.getByTestId(`category-option-${toTestId(cat)}`);
      assertInDocument(category);
   });
};

const assertCategoryOptionsEmpty = () => {
   const optionsEmpty = screen.getByTestId("category-options-empty");
   assertInDocument(optionsEmpty);
};

describe("CategoriesFilter rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("CategoriesFilter - filtersContext null - test", async () => {
      const categoryOptions = queryResult([]);
      useLoadPromptCategoriesMock.mockReturnValue(categoryOptions);

      const { container } = renderWithContext(null);

      await waitFor(() => {
         // expect(useLoadPromptCategoriesMock).toHaveBeenCalledWith(1);
      });

      expect(container.firstChild).toBeNull();
      expect(container).toMatchSnapshot();
   });

   it("CategoriesFilter - category options undefined - test", async () => {
      const categoryOptions = queryResult(undefined);
      useLoadPromptCategoriesMock.mockReturnValue(categoryOptions);

      const mockContext = mockFiltersContext();
      const { container } = renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CategoriesFilter - category options empty - test", async () => {
      const categoryOptions = queryResult([]);
      useLoadPromptCategoriesMock.mockReturnValue(categoryOptions);

      const mockContext = mockFiltersContext();
      mockContext.filters.categories = undefined;
      const { container } = renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
      });

      const comboBox = screen.getByTestId("popover-trigger");
      await userEvent.click(comboBox);

      await waitFor(() => {
         assertCategoryOptionsEmpty();
      });

      expect(container).toMatchSnapshot();
   });

   it("CategoriesFilter - categories not selected - test", async () => {
      const categories = ["Category 1", "Category 2", "Category 3"];
      const categoryOptions = queryResult(categories);
      useLoadPromptCategoriesMock.mockReturnValue(categoryOptions);

      const mockContext = mockFiltersContext();
      const { container } = renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
         assertCategoriesNotSelected();
      });

      expect(container).toMatchSnapshot();
   });

   it("CategoriesFilter - categories selected - test", async () => {
      const categories = ["Category 1", "Category 2", "Category 3"];
      const categoryOptions = queryResult(categories);
      const selectedCategories = ["Category 1", "Category 2"];

      useLoadPromptCategoriesMock.mockReturnValue(categoryOptions);

      const { container } = renderWithContext(
         mockFiltersContext(selectedCategories)
      );

      await waitFor(() => {
         assertRendered();
         assertSelectedCategories(selectedCategories);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CategoriesFilter functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("CategoriesFilter - category option selected - test", async () => {
      const categories = ["Category 1", "Category 2", "Category 3"];
      const categoryOptions = queryResult(categories);
      useLoadPromptCategoriesMock.mockReturnValue(categoryOptions);

      const mockContext = mockFiltersContext([]);
      renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
      });

      const popover = screen.getByTestId("popover-trigger");
      await userEvent.click(popover);

      await waitFor(() => {
         assertOptionsCategories(categories);
      });

      const selectedOption = categories[0];
      const option = screen.getByTestId(
         `category-option-${toTestId(selectedOption)}`
      );
      await userEvent.click(option);

      const expectedFiltersPayload: DPromptDescriptorsFilter = {
         search: "",
         categories: ["Category 1"],
      };
      await waitFor(() => {
         expect(mockContext.setFilters).toHaveBeenCalledTimes(1);
         expect(mockContext.setFilters).toHaveBeenCalledWith(
            expectedFiltersPayload
         );
      });
   });

   it("CategoriesFilter - category option unselected - test", async () => {
      const categories = ["Category 1", "Category 2", "Category 3"];
      const categoryOptions = queryResult(categories);
      useLoadPromptCategoriesMock.mockReturnValue(categoryOptions);

      const selectedOption = categories[0];

      const mockContext = mockFiltersContext([selectedOption]);
      renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
      });

      const comboBox = screen.getByTestId("popover-trigger");
      await userEvent.click(comboBox);

      await waitFor(() => {
         assertOptionsCategories(categories);
      });

      const option = screen.getByTestId(
         `category-option-${toTestId(selectedOption)}`
      );
      await userEvent.click(option);

      const expectedFiltersPayload: DPromptDescriptorsFilter = {
         search: "",
         categories: [],
      };
      await waitFor(() => {
         expect(mockContext.setFilters).toHaveBeenCalledTimes(1);
         expect(mockContext.setFilters).toHaveBeenCalledWith(
            expectedFiltersPayload
         );
      });
   });

   it("CategoriesFilter - multiple category options selected - test", async () => {
      const categories = ["Category 1", "Category 2", "Category 3"];
      const categoryOptions = queryResult(categories);
      useLoadPromptCategoriesMock.mockReturnValue(categoryOptions);

      const mockContext = mockFiltersContext(["Category 1"]);
      renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
      });

      const popover = screen.getByTestId("popover-trigger");
      await userEvent.click(popover);

      await waitFor(() => {
         assertOptionsCategories(categories);
      });

      const selectedOption = categories[1];

      const option = screen.getByTestId(
         `category-option-${toTestId(selectedOption)}`
      );
      await userEvent.click(option);

      const expectedFiltersPayload: DPromptDescriptorsFilter = {
         search: "",
         categories: ["Category 1", "Category 2"],
      };
      await waitFor(() => {
         expect(mockContext.setFilters).toHaveBeenCalledTimes(1);
         expect(mockContext.setFilters).toHaveBeenCalledWith(
            expectedFiltersPayload
         );
      });
   });

   it("CategoriesFilter - multiple category option unselected - test", async () => {
      const categories = ["Category 1", "Category 2", "Category 3"];
      const categoryOptions = queryResult(categories);
      useLoadPromptCategoriesMock.mockReturnValue(categoryOptions);

      const selectedOption1 = categories[0];
      const selectedOption2 = categories[1];

      const mockContext = mockFiltersContext([
         selectedOption1,
         selectedOption2,
      ]);
      renderWithContext(mockContext);

      await waitFor(() => {
         assertRendered();
      });

      const comboBox = screen.getByTestId("popover-trigger");
      await userEvent.click(comboBox);

      await waitFor(() => {
         assertOptionsCategories(categories);
      });

      const option = screen.getByTestId(
         `category-option-${toTestId(selectedOption2)}`
      );
      await userEvent.click(option);

      const expectedFiltersPayload: DPromptDescriptorsFilter = {
         search: "",
         categories: [selectedOption1],
      };
      await waitFor(() => {
         expect(mockContext.setFilters).toHaveBeenCalledTimes(1);
         expect(mockContext.setFilters).toHaveBeenCalledWith(
            expectedFiltersPayload
         );
      });
   });
});
