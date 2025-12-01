jest.mock("sonner");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";
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
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PromptListItem - isSelected false - rendered test", async () => {
      const prompt = dtestData.dPrompt();
      prompt.isFavorite = true;

      const url = `/prompts/random-prompt-id-123`;
      const { container } = renderWithRouter(
         <PromptListItem prompt={prompt} />,
         url
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptListItem - isSelected true - rendered test", async () => {
      const prompt = dtestData.dPrompt();
      prompt.isFavorite = false;

      const url = `/prompts/${prompt.id}`;
      const { container } = renderWithRouter(
         <PromptListItem prompt={prompt} />,
         url
      );
      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptListItem functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PromptListItem - item clicked - test", async () => {
      const prompt = dtestData.dPrompt();

      const url = "/prompts";
      renderWithRouter(<PromptListItem prompt={prompt} />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const listItem = screen.getByTestId("prompt-list-item");
      await userEvent.click(listItem);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/prompts/${prompt.id}`);
      });
   });

   it("PromptListItem - addTofavorite toggled - test", async () => {
      const prompt = dtestData.dPrompt();

      renderWithRouter(<PromptListItem prompt={prompt} />);

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
