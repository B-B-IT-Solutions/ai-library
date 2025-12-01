jest.mock("@/data/actions/prompt/prompt.actions");

import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

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
   const filters = screen.getByTestId("prompts-list-filters");
   const listHeader = screen.getByTestId("prompts-list-header");
   const listItems = screen.getByTestId("prompts-list-items");
   const listItem = screen.getAllByTestId("prompt-list-item");

   assertInDocument(list);
   assertInDocument(filters);
   assertInDocument(listHeader);
   assertInDocument(listItems);
   expect(listItem).toHaveLength(3);
};

describe("PromptsList rendering tests", () => {
   it("PromptsList rendered test", async () => {
      const categories = ["category 1", "category 2", "category 3"];
      const page = dtestData.dPromptsPage();
      getPromptsMock.mockResolvedValue(page);
      getPromptCategoriesMock.mockResolvedValue(categories);

      const { container } = renderWithReactQuery(
         <PromptsList
            addPrompt={jest.fn()}
            selectPrompt={jest.fn()}
            selectedPrompt={null}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
      expect(getPromptsMock).toHaveBeenCalledTimes(1);
      expect(getPromptCategoriesMock).toHaveBeenCalledTimes(1);
   });
});
