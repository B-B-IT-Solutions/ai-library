jest.mock("@/data/actions/workflow");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { deleteWorkflow } from "@/data/actions/workflow";

import { DeleteWorkflowButton } from "./delete-workflow-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const deleteWorkflowMock = deleteWorkflow as jest.MockedFunction<
   typeof deleteWorkflow
>;

const assertMenuItemRendered = () => {
   const deleteMenuItem = screen.getByTestId("delete-workflow-menu-item");
   assertInDocument(deleteMenuItem);
};

const assertBtnRendered = () => {
   const deleteBtn = screen.getByTestId("delete-workflow-btn");
   assertInDocument(deleteBtn);
};

describe("DeleteWorkflowButton rendering tests", () => {
   it("asMenuItem true - test", async () => {
      const workflow = dtestData.dWorkflow();
      const { container } = render(
         <DeleteWorkflowButton workflow={workflow} asMenuItem={true} />
      );

      await waitFor(() => {
         assertMenuItemRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("asMenuItem false - test", async () => {
      const workflow = dtestData.dWorkflow();
      const { container } = render(
         <DeleteWorkflowButton workflow={workflow} asMenuItem={false} />
      );

      await waitFor(() => {
         assertBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DeleteWorkflowButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/workflows/test-id");
   });

   it("confirm btn clicked - result.success true - test", async () => {
      const actionResult = {
         success: true,
         message: "Prompt deleted",
      };
      deleteWorkflowMock.mockResolvedValue(actionResult);

      const workflow = dtestData.dWorkflow();
      render(<DeleteWorkflowButton workflow={workflow} />);

      await waitFor(() => {
         assertBtnRendered();
         expect(deleteWorkflowMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-workflow-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deleteWorkflowMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteWorkflowMock).toHaveBeenCalledTimes(1);
         expect(deleteWorkflowMock).toHaveBeenCalledWith(workflow.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/workflows");
      });
   });

   it("confirm btn clicked - result.success false - test", async () => {
      const actionResult = {
         success: false,
         message: "Prompt couldn't be deleted",
      };
      deleteWorkflowMock.mockResolvedValue(actionResult);

      const workflow = dtestData.dWorkflow();
      render(<DeleteWorkflowButton workflow={workflow} asMenuItem={true} />);

      await waitFor(() => {
         assertMenuItemRendered();
         expect(deleteWorkflowMock).not.toHaveBeenCalled();
      });

      const deleteMenuItem = screen.getByTestId("delete-workflow-menu-item");
      await userEvent.click(deleteMenuItem);

      await waitFor(() => {
         expect(deleteWorkflowMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteWorkflowMock).toHaveBeenCalledTimes(1);
         expect(deleteWorkflowMock).toHaveBeenCalledWith(workflow.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/workflows/test-id");
      });
   });

   it("cancel btn clicked - delete not called - test", async () => {
      const workflow = dtestData.dWorkflow();
      render(<DeleteWorkflowButton workflow={workflow} />);

      await waitFor(() => {
         assertBtnRendered();
         expect(deleteWorkflowMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-workflow-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deleteWorkflowMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deleteWorkflowMock).not.toHaveBeenCalled();
         expect(mockRouter.pathname).toEqual("/workflows/test-id");
      });
   });
});
