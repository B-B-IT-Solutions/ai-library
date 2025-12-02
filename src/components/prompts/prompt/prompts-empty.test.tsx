import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { PromptsEmpty } from "./prompts-empty";

const assertRendered = () => {
   const promptsEmpty = screen.getByTestId("prompts-empty");
   assertInDocument(promptsEmpty);
};

describe("PromptsEmpty rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PromptsEmpty rendered test", async () => {
      const { container } = renderWithRouter(<PromptsEmpty />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptsEmpty functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PromptsEmpty - create prompt clicked - test", async () => {
      renderWithRouter(<PromptsEmpty />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const createBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/prompts/new");
      });
   });
});
