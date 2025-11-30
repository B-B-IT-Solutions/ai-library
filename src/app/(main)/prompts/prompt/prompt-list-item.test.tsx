jest.mock("sonner");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";
import { toast } from "sonner";

import { PromptListItem } from "./prompt-list-item";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const listItem = screen.getByTestId("prompt-list-item");
   const toggleFavoriteBtn = screen.getByTestId("toggle-favorite-btn");

   assertInDocument(listItem);
   assertInDocument(toggleFavoriteBtn);
};

describe("PromptListItem rendering tests", () => {
   it("PromptListItem - isSelected false - rendered test", async () => {
      const prompt = dtestData.dPrompt();
      prompt.isFavorite = true;

      const { container } = renderWithReactQuery(
         <PromptListItem
            prompt={prompt}
            isSelected={false}
            selectPrompt={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptListItem - isSelected true - rendered test", async () => {
      const prompt = dtestData.dPrompt();
      prompt.isFavorite = false;

      const { container } = renderWithReactQuery(
         <PromptListItem
            prompt={prompt}
            isSelected={true}
            selectPrompt={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptListItem functionality tests", () => {
   it("PromptListItem - item clicked - test", async () => {
      const prompt = dtestData.dPrompt();
      const selectPromptFn = jest.fn();

      renderWithReactQuery(
         <PromptListItem
            prompt={prompt}
            isSelected={false}
            selectPrompt={selectPromptFn}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(selectPromptFn).not.toHaveBeenCalled();
      });

      const listItem = screen.getByTestId("prompt-list-item");
      userEvent.click(listItem);

      await waitFor(() => {
         expect(selectPromptFn).toHaveBeenCalledTimes(1);
         expect(selectPromptFn).toHaveBeenCalledWith(prompt);
      });
   });

   it("PromptListItem - addTofavorite toggled - test", async () => {
      const prompt = dtestData.dPrompt();

      renderWithReactQuery(
         <PromptListItem
            prompt={prompt}
            isSelected={false}
            selectPrompt={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(toastMock).not.toHaveBeenCalled();
      });

      const toggleFavoriteBtn = screen.getByTestId("toggle-favorite-btn");
      userEvent.click(toggleFavoriteBtn);

      await waitFor(() => {
         assertRendered();
         expect(toastMock).toHaveBeenCalledTimes(1);
         expect(toastMock).toHaveBeenCalledWith("Prompt added to favorite");
      });
   });
});
