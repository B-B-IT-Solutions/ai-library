import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, getElementById } from "@tests";

import { TemplateFilters } from "./template-filters";

const assertRendered = () => {
   const filters = screen.getByTestId("template-filters");
   const search = screen.getByTestId("search-input");
   const categories = screen.getByTestId("categories-combo-box");

   assertInDocument(filters);
   assertInDocument(search);
   assertInDocument(categories);
};

describe("TemplateFilters rendering tests", () => {
   it("TemplateFilters rendered test", async () => {
      const loadedCategories = ["category 1", "category 2", "category 3"];
      const categories = ["category 1"];
      const search = "test 1";

      const { container } = render(
         <TemplateFilters
            loadedCategories={loadedCategories}
            search={search}
            categories={categories}
            setSearch={jest.fn()}
            setCategories={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateFilters functionality tests", () => {
   it("TemplateFilters - search template - test", async () => {
      const loadedCategories = ["category 1", "category 2", "category 3"];
      const categories: string[] = [];
      const search = "";
      const setSearchFn = jest.fn();

      render(
         <TemplateFilters
            loadedCategories={loadedCategories}
            search={search}
            categories={categories}
            setSearch={setSearchFn}
            setCategories={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(setSearchFn).not.toHaveBeenCalled();
      });

      const serachValue = "test 1";
      const input = getElementById("search-templates");
      userEvent.type(input, serachValue);

      await waitFor(() => {
         expect(setSearchFn).toHaveBeenCalledTimes(6);
         expect(setSearchFn).toHaveBeenNthCalledWith(1, "t");
         expect(setSearchFn).toHaveBeenNthCalledWith(2, "e");
         expect(setSearchFn).toHaveBeenNthCalledWith(3, "s");
         expect(setSearchFn).toHaveBeenNthCalledWith(4, "t");
         expect(setSearchFn).toHaveBeenNthCalledWith(5, " ");
         expect(setSearchFn).toHaveBeenNthCalledWith(6, "1");
      });
   });

   it("TemplateFilters - categories selected - test", async () => {
      const loadedCategories = ["category 1", "category 2", "category 3"];
      const categories: string[] = ["category 1"];
      const search = "";
      const setCategoriesFn = jest.fn();

      render(
         <TemplateFilters
            loadedCategories={loadedCategories}
            search={search}
            categories={categories}
            setSearch={jest.fn()}
            setCategories={setCategoriesFn}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(setCategoriesFn).not.toHaveBeenCalled();
      });

      const comboBox = screen.getByTestId("categories-combo-box");
      userEvent.click(comboBox);

      const cat1 = screen.getAllByText(loadedCategories[0])[1];
      userEvent.click(cat1);

      await waitFor(() => {
         expect(setCategoriesFn).toHaveBeenCalledTimes(1);
         expect(setCategoriesFn).toHaveBeenCalledWith([]);
      });

      const cat2 = screen.getByText(loadedCategories[1]);
      userEvent.click(cat2);

      const expectedPayload2 = [loadedCategories[0], loadedCategories[1]];
      await waitFor(() => {
         expect(setCategoriesFn).toHaveBeenCalledTimes(2);
         expect(setCategoriesFn).toHaveBeenNthCalledWith(2, expectedPayload2);
      });
   });
});
