jest.mock("@/data/actions/prompt0");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithTooltip } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { deletePrompt } from "@/data/actions/prompt0";

import { DeletePromptButton } from "./delete-prompt-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const deletePromptMock = deletePrompt as jest.MockedFunction<
   typeof deletePrompt
>;

const assertRendered = () => {
   const deleteBtn = screen.getByTestId("delete-prompt-btn");
   assertInDocument(deleteBtn);
};

describe("DeletePromptButton rendering tests", () => {
   it("rendered test", async () => {
      const prompt = dtestData.dPrompt0();
      const { container } = renderWithTooltip(
         <DeletePromptButton prompt={prompt} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DeletePromptButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/prompts/test-id");
   });

   it("confirm btn clicked - result.success true - test", async () => {
      const actionResult = {
         success: true,
         message: "Prompt deleted",
      };
      deletePromptMock.mockResolvedValue(actionResult);

      const prompt = dtestData.dPrompt0();
      renderWithTooltip(<DeletePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(deletePromptMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-prompt-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deletePromptMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePromptMock).toHaveBeenCalledTimes(1);
         expect(deletePromptMock).toHaveBeenCalledWith(prompt.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/prompts");
      });
   });

   it("confirm btn clicked - result.success false - test", async () => {
      const actionResult = {
         success: false,
         message: "Prompt couldn't be deleted",
      };
      deletePromptMock.mockResolvedValue(actionResult);

      const prompt = dtestData.dPrompt0();
      renderWithTooltip(<DeletePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(deletePromptMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-prompt-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deletePromptMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePromptMock).toHaveBeenCalledTimes(1);
         expect(deletePromptMock).toHaveBeenCalledWith(prompt.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/prompts/test-id");
      });
   });

   it("cancel btn clicked - closes dialog - test", async () => {
      const prompt = dtestData.dPrompt0();
      renderWithTooltip(<DeletePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(deletePromptMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-prompt-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deletePromptMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deletePromptMock).not.toHaveBeenCalled();
         expect(mockRouter.pathname).toEqual("/prompts/test-id");
      });
   });
});
