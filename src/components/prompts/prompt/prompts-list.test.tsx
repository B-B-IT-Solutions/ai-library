jest.mock("@/data/actions/prompt/prompt.actions");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   dtestData,
   renderWithReactQuery,
   renderWithRouter,
} from "@tests";
import mockRouter from "next-router-mock";

import {
   getPromptCategories,
   getPrompts,
} from "@/data/actions/prompt/prompt.actions";

import { PromptsList } from "./prompts-list";

const getPromptCategoriesMock = getPromptCategories as jest.MockedFunction<
   typeof getPromptCategories
>;

const getPromptsMock = getPrompts as jest.MockedFunction<typeof getPrompts>;

const assertRendered = () => {
   const list = screen.getByTestId("prompts-list");
   const filters = screen.getByTestId("prompts-filter");
   const listHeader = screen.getByTestId("prompts-list-header");
   const addPromptBtn = screen.getByTestId("add-prompt-btn");
   const listItems = screen.getByTestId("prompts-list-items");
   const listItem = screen.getAllByTestId("prompt-list-item");

   assertInDocument(list);
   assertInDocument(filters);
   assertInDocument(listHeader);
   assertInDocument(addPromptBtn);
   assertInDocument(listItems);
   expect(listItem).toHaveLength(3);
};

describe("PromptsList rendering tests", () => {
   it("PromptsList rendered test", async () => {
      const categories = ["category 1", "category 2", "category 3"];
      const page = dtestData.dPromptDescriptorsPage();
      getPromptsMock.mockResolvedValue(page);
      getPromptCategoriesMock.mockResolvedValue(categories);

      const { container } = renderWithReactQuery(<PromptsList />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
      expect(getPromptsMock).toHaveBeenCalledTimes(1);
      expect(getPromptCategoriesMock).toHaveBeenCalledTimes(1);
   });
});

describe("PromptsList functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PromptsList - add btn clicked - test", async () => {
      const categories = ["category 1", "category 2", "category 3"];
      const page = dtestData.dPromptDescriptorsPage();
      getPromptsMock.mockResolvedValue(page);
      getPromptCategoriesMock.mockResolvedValue(categories);

      const url = "/prompts";
      renderWithRouter(<PromptsList />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const addPromptBtn = screen.getByTestId("add-prompt-btn");
      await userEvent.click(addPromptBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/prompts/new");
      });
   });
});
