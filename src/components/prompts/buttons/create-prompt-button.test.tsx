import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { CreatePromptButton } from "./create-prompt-button";

const assertRendered = () => {
   const btn = screen.getByTestId("create-prompt-btn");
   assertInDocument(btn);
};

describe("CreatePromptButton rendering tests", () => {
   it("CreatePromptButton rendered test", async () => {
      const { container } = render(<CreatePromptButton />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreatePromptButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("CreatePromptButton - create btn clicked - test", async () => {
      render(<CreatePromptButton />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const btn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/prompts/new");
      });
   });
});
