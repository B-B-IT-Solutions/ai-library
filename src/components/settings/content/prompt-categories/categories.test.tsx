jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/react";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderAsyncRSC,
} from "@tests";

import { getPromptCategoriesWithUsage } from "@/data/actions/prompt";

import { Categories } from "./categories";

const getCategoriesWithUsageMock =
   getPromptCategoriesWithUsage as jest.MockedFunction<
      typeof getPromptCategoriesWithUsage
   >;

const assertRendered = () => {
   const categories = screen.getByTestId("prompt-categories");
   const createBtn = screen.getByTestId("create-category-btn");

   assertInDocument(categories);
   assertInDocument(createBtn);
};

const assertCategoriesRendered = () => {
   const categoryItems = screen.getAllByTestId("category-item");
   expect(categoryItems).toHaveLength(3);
};

const assertEmptyStateRendered = () => {
   const empty = screen.getByTestId("categories-empty");
   assertInDocument(empty);
};

const assertEmptyStateNotRendered = () => {
   const empty = screen.queryByTestId("categories-empty");
   assertNotInDocument(empty);
};

describe("Categories rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("categories empty - test", async () => {
      getCategoriesWithUsageMock.mockResolvedValue([]);

      const { container } = await renderAsyncRSC(Categories, {});

      await waitFor(() => {
         assertRendered();
         assertEmptyStateRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("categories retrieved - test", async () => {
      const categories = dtestData.dPromptCategoriesWithUsage();
      getCategoriesWithUsageMock.mockResolvedValue(categories);

      const { container } = await renderAsyncRSC(Categories, {});

      await waitFor(() => {
         assertRendered();
         assertCategoriesRendered();
         assertEmptyStateNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
