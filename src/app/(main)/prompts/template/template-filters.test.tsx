import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

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
