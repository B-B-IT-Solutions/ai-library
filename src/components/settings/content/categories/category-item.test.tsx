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
   it("CategoryItem render test", async () => {
      const category = dtestData.dPromptCategoryUsage();

      const { container } = renderWithRouter(
         <CategoryItem category={category} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CategoryItem - singular prompt count label - test", async () => {
      const category = dtestData.dPromptCategoryUsage(1);
      category.count = 1;

      renderWithRouter(<CategoryItem category={category} />);

      await waitFor(() => {
         assertInDocument(screen.getByText("1 Prompt"));
      });
   });

   it("CategoryItem - plural prompt count label - test", async () => {
      const category = dtestData.dPromptCategoryUsage(1);
      category.count = 4;

      renderWithRouter(<CategoryItem category={category} />);

      await waitFor(() => {
         assertInDocument(screen.getByText("4 Prompts"));
      });
   });
});
