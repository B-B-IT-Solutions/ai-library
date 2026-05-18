jest.mock("@/data/actions/prompt0");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithTooltip } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { deletePrompt0 } from "@/data/actions/prompt0";

import { DeletePromptButton } from "./delete-prompt-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const deletePrompt0Mock = deletePrompt0 as jest.MockedFunction<
   typeof deletePrompt0
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
      deletePrompt0Mock.mockResolvedValue(actionResult);

      const prompt = dtestData.dPrompt0();
      renderWithTooltip(<DeletePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(deletePrompt0Mock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-prompt-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deletePrompt0Mock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePrompt0Mock).toHaveBeenCalledTimes(1);
         expect(deletePrompt0Mock).toHaveBeenCalledWith(prompt.id);
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
      deletePrompt0Mock.mockResolvedValue(actionResult);

      const prompt = dtestData.dPrompt0();
      renderWithTooltip(<DeletePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(deletePrompt0Mock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-prompt-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deletePrompt0Mock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePrompt0Mock).toHaveBeenCalledTimes(1);
         expect(deletePrompt0Mock).toHaveBeenCalledWith(prompt.id);
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
         expect(deletePrompt0Mock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-prompt-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deletePrompt0Mock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deletePrompt0Mock).not.toHaveBeenCalled();
         expect(mockRouter.pathname).toEqual("/prompts/test-id");
      });
   });
});
