jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithTooltip,
} from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { deletePrompt } from "@/data/actions/prompt";

import { DeletePromptButton } from "./delete-prompt-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const deletePromptMock = deletePrompt as jest.MockedFunction<
   typeof deletePrompt
>;

const assertRendered = () => {
   const deleteBtn = screen.getByTestId("delete-prompt-btn");
   assertInDocument(deleteBtn);
};

const assertDialogOpen = () => {
   const content = screen.getByTestId("delete-prompt-dialog-content");
   const header = screen.getByTestId("delete-prompt-dialog-header");

   assertInDocument(content);
   assertInDocument(header);
};

const assertDialogClosed = () => {
   const content = screen.queryByTestId("delete-prompt-dialog-content");
   const header = screen.queryByTestId("delete-prompt-dialog-header");

   assertNotInDocument(content);
   assertNotInDocument(header);
};

describe("DeletePromptButton rendering tests", () => {
   it("DeletePromptButton rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
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

   it("DeletePromptButton - delete btn clicked - opens dialog - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      renderWithTooltip(<DeletePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertDialogClosed();
      });

      const deleteBtn = screen.getByTestId("delete-prompt-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertDialogOpen();
      });
   });

   it("DeletePromptButton - cancel btn clicked - closes dialog - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      renderWithTooltip(<DeletePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      const deleteBtn = screen.getByTestId("delete-prompt-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertDialogOpen();
      });

      const cancelBtn = screen.getByTestId("mock-react-alert-dialog-cancel");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         assertDialogClosed();
      });
   });

   it("DeletePromptButton - confirm delete - result.success true - test", async () => {
      const actionResult = {
         success: true,
         message: "Prompt erfolgreich gelöscht.",
      };
      deletePromptMock.mockResolvedValue(actionResult);

      const prompt = dtestData.dPromptDescriptor();
      renderWithTooltip(<DeletePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(deletePromptMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-prompt-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertDialogOpen();
      });

      const confirmBtn = screen.getByTestId("mock-react-alert-dialog-action");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePromptMock).toHaveBeenCalledTimes(1);
         expect(deletePromptMock).toHaveBeenCalledWith(prompt.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/prompts");
      });
   });

   it("DeletePromptButton - confirm delete - result.success false - test", async () => {
      const actionResult = {
         success: false,
         message: "Prompt konnte nicht gelöscht werden.",
      };
      deletePromptMock.mockResolvedValue(actionResult);

      const prompt = dtestData.dPromptDescriptor();
      renderWithTooltip(<DeletePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(deletePromptMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-prompt-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertDialogOpen();
      });

      const confirmBtn = screen.getByTestId("mock-react-alert-dialog-action");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePromptMock).toHaveBeenCalledTimes(1);
         expect(deletePromptMock).toHaveBeenCalledWith(prompt.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
      });
   });

   it("DeletePromptButton - dialog closes after delete - test", async () => {
      const actionResult = {
         success: true,
         message: "Prompt erfolgreich gelöscht.",
      };
      deletePromptMock.mockResolvedValue(actionResult);

      const prompt = dtestData.dPromptDescriptor();
      renderWithTooltip(<DeletePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      const deleteBtn = screen.getByTestId("delete-prompt-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertDialogOpen();
      });

      const confirmBtn = screen.getByTestId("mock-react-alert-dialog-action");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         assertDialogClosed();
      });
   });
});
