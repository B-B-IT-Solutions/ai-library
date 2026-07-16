import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { CategoryItem } from "./category-item";

const assertRendered = () => {
   const item = screen.getByTestId("category-item");
   const renameBtn = screen.getByTestId("rename-category-btn");
   const deleteBtn = screen.getByTestId("delete-category-btn");

   assertInDocument(item);
   assertInDocument(renameBtn);
   assertInDocument(deleteBtn);
};

describe("CategoryItem rendering tests", () => {
   it("prompt count 1 - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();
      category.count = 1;

      const { container } = renderWithRouter(
         <CategoryItem category={category} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt count 10 - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage(1);
      category.count = 10;

      renderWithRouter(<CategoryItem category={category} />);

      await waitFor(() => {
         assertRendered();
      });
   });
});
