jest.mock("@/data/actions/prompt/prompt.template.actions");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, getElementById, renderWithReactQuery } from "@tests";

import { getPromptTemplateCategories } from "@/data/actions/prompt/prompt.template.actions";

import { Filters, TemplateFilters } from "./template-filters";

const getPromptTemplateCategoriesMock =
   getPromptTemplateCategories as jest.MockedFunction<
      typeof getPromptTemplateCategories
   >;

const assertRendered = () => {
   const filters = screen.getByTestId("template-filters");
   const search = screen.getByTestId("search-input");
   const categories = screen.getByTestId("categories-combo-box");
   const category1 = screen.getByText("category 2");

   assertInDocument(filters);
   assertInDocument(search);
   assertInDocument(categories);
   assertInDocument(category1);
};

describe("TemplateFilters rendering tests", () => {
   it("TemplateFilters rendered test", async () => {
      const loadedCategories = ["category 1", "category 2", "category 3"];
      getPromptTemplateCategoriesMock.mockResolvedValue(loadedCategories);

      const { container } = renderWithReactQuery(
         <TemplateFilters onFiltersUpdate={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateFilters functionality tests", () => {
   it("TemplateFilters - search template - test", async () => {
      const categories = ["category 1", "category 2", "category 3"];
      getPromptTemplateCategoriesMock.mockResolvedValue(categories);

      const onFiltersUpdateFn = jest.fn();
      renderWithReactQuery(
         <TemplateFilters onFiltersUpdate={onFiltersUpdateFn} />
      );

      await waitFor(() => {
         assertRendered();
         expect(onFiltersUpdateFn).not.toHaveBeenCalled();
      });

      const serachValue = "test 1";
      const input = getElementById("search-templates");
      await userEvent.type(input, serachValue);

      const exptectedFilters: Filters = { search: serachValue, categories: [] };
      await waitFor(() => {
         expect(onFiltersUpdateFn).toHaveBeenCalledTimes(1);
         expect(onFiltersUpdateFn).toHaveBeenCalledWith(exptectedFilters);
      });
   });

   it("TemplateFilters - categories selected - test", async () => {
      const loadedCategories = ["category 1", "category 2", "category 3"];
      getPromptTemplateCategoriesMock.mockResolvedValue(loadedCategories);

      const onFiltersUpdateFn = jest.fn();
      renderWithReactQuery(
         <TemplateFilters onFiltersUpdate={onFiltersUpdateFn} />
      );

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

      const exptectedFilters1: Filters = { categories: [loadedCategories[0]] };
      await waitFor(() => {
         expect(onFiltersUpdateFn).toHaveBeenCalledTimes(1);
         expect(onFiltersUpdateFn).toHaveBeenCalledWith(exptectedFilters1);
      });

      const cat2 = screen.getByText(loadedCategories[1]);
      await userEvent.click(cat2);

      const exptectedFilters2: Filters = {
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
