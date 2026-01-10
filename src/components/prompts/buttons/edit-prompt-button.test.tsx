import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithTooltip } from "@tests";
import mockRouter from "next-router-mock";

import { EditPromptButton } from "./edit-prompt-button";

const assertRendered = () => {
   const editBtn = screen.getByTestId("edit-prompt-btn");
   assertInDocument(editBtn);
};

describe("EditPromptButton rendering tests", () => {
   it("EditPromptButton rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      const { container } = renderWithTooltip(
         <EditPromptButton prompt={prompt} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditPromptButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("EditPromptButton - edit btn clicked - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      renderWithTooltip(<EditPromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const editBtn = screen.getByTestId("edit-prompt-btn");
      await userEvent.click(editBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/prompts/${prompt.id}/edit`);
      });
   });
});
