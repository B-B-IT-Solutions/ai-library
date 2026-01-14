jest.mock("@/data/actions/prompt/prompt.actions");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, getElementById, renderWithReactQuery } from "@tests";

import { getPromptCategories } from "@/data/actions/prompt/prompt.actions";
import { DPromptDescriptorsFilter } from "@/data/types/domain/prompt";

import { PromptFilters } from "./prompts-filter";

const getPromptCategoriesMock = getPromptCategories as jest.MockedFunction<
   typeof getPromptCategories
>;

const assertRendered = () => {
   const filters = screen.getByTestId("prompts-filter");
   const search = screen.getByTestId("search-filter");
   const categories = screen.getByTestId("categories-filter");

   assertInDocument(filters);
   assertInDocument(search);
   assertInDocument(categories);
};

describe("PromptFilters rendering tests", () => {
   it("PromptFilters rendered test", async () => {
      const categories = ["category 1", "category 2", "category 3"];
      getPromptCategoriesMock.mockResolvedValue(categories);

      const { container } = renderWithReactQuery(<PromptFilters />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptFilters functionality tests", () => {
   it("PromptFilters - search template - test", async () => {
      const categories = ["category 1", "category 2", "category 3"];
      getPromptCategoriesMock.mockResolvedValue(categories);

      const onFiltersUpdateFn = jest.fn();
      renderWithReactQuery(<PromptFilters />);

      await waitFor(() => {
         assertRendered();
      });

      const serachValue = "test 1";
      const input = getElementById("search-prompts");
      await userEvent.type(input, serachValue);

      const exptectedFilters: DPromptDescriptorsFilter = {
         search: serachValue,
         categories: [],
      };
      await waitFor(() => {
         expect(onFiltersUpdateFn).toHaveBeenCalledTimes(1);
         expect(onFiltersUpdateFn).toHaveBeenCalledWith(exptectedFilters);
      });
   });

   it("PromptFilters - categories selected - test", async () => {
      const loadedCategories = ["category 1", "category 2", "category 3"];
      getPromptCategoriesMock.mockResolvedValue(loadedCategories);

      const onFiltersUpdateFn = jest.fn();
      renderWithReactQuery(<PromptFilters />);

      await waitFor(() => {
         assertRendered();
         expect(onFiltersUpdateFn).not.toHaveBeenCalled();
      });

      await waitFor(() => {
         assertRendered();
         expect(onFiltersUpdateFn).not.toHaveBeenCalled();
      });

      const comboBox = screen.getByTestId("categories-combo-box");
      userEvent.click(comboBox);

      const cat1 = screen.getByText(loadedCategories[0]);
      await userEvent.click(cat1);

      const exptectedFilters1: DPromptDescriptorsFilter = {
         categories: [loadedCategories[0]],
      };
      await waitFor(() => {
         expect(onFiltersUpdateFn).toHaveBeenCalledTimes(1);
         expect(onFiltersUpdateFn).toHaveBeenCalledWith(exptectedFilters1);
      });

      const cat2 = screen.getByText(loadedCategories[1]);
      await userEvent.click(cat2);

      const exptectedFilters2: DPromptDescriptorsFilter = {
         categories: [loadedCategories[0], loadedCategories[1]],
      };
      await waitFor(() => {
         expect(onFiltersUpdateFn).toHaveBeenCalledTimes(2);
         expect(onFiltersUpdateFn).toHaveBeenNthCalledWith(
            2,
            exptectedFilters2
         );
      });

      await userEvent.click(cat2);
      await waitFor(() => {
         expect(onFiltersUpdateFn).toHaveBeenCalledTimes(3);
         expect(onFiltersUpdateFn).toHaveBeenNthCalledWith(
            3,
            exptectedFilters1
         );
      });
   });
});
