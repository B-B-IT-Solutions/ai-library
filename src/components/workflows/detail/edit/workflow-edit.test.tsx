jest.mock("@/data/actions/workflow");
jest.mock("sonner");

import { MouseEvent } from "react";
import { getByTestId, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   dtestData,
   renderWithReactQuery,
   typeIntoInput,
} from "@tests";
import mockRouter from "next-router-mock";
import { Action, ExternalToast, toast } from "sonner";

import { createWorkflow, updateWorkflow } from "@/data/actions/workflow";
import {
   DWorkflow,
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { ActionResult } from "@/data/types/utils";

import { initWorkflow } from "./form/utils";
import { WorkflowEdit } from "./workflow-edit";

const createWorkflowMock = createWorkflow as jest.MockedFunction<
   typeof createWorkflow
>;
const updateWorkflowMock = updateWorkflow as jest.MockedFunction<
   typeof updateWorkflow
>;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const workflow = screen.getByTestId("workflow-edit");
   const breadcrumb = screen.getByTestId("workflow-breadcrumb");
   const tabs = screen.getByTestId("workflow-tabs");

   assertInDocument(workflow);
   assertInDocument(breadcrumb);
   assertInDocument(tabs);
};

const assertHeaderBtnsRendered = () => {
   const headerActions = screen.getByTestId("header-actions");
   const cancelBtn = getByTestId(headerActions, "cancel-btn");
   const saveBtn = getByTestId(headerActions, "save-btn");

   assertInDocument(cancelBtn);
   assertInDocument(saveBtn);
};

describe("WorkflowEdit rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("create mode - test", async () => {
      const { container } = renderWithReactQuery(<WorkflowEdit />);

      await waitFor(() => {
         assertRendered();
         assertHeaderBtnsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("edit mode - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = renderWithReactQuery(
         <WorkflowEdit workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
         assertHeaderBtnsRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("WorkflowEdit functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("create mode - save clicked - success - test", async () => {
      const workflow = dtestData.dWorkflow();
      const result: ActionResult<DWorkflow> = {
         success: true,
         message: "Workflow erstellt",
         data: workflow,
      };
      createWorkflowMock.mockResolvedValue(result);

      renderWithReactQuery(<WorkflowEdit />);

      await waitFor(() => {
         assertRendered();
      });

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      await waitFor(() => {
         expect(createWorkflowMock).not.toHaveBeenCalled();
      });

      await typeIntoInput("title", "Mein Workflow");

      const initValue = initWorkflow();
      const expectedPayload: DWorkflowUpdate = {
         title: "Mein Workflow",
         description: initValue.description,
         steps: initValue.steps,
      };

      await userEvent.click(saveBtn);

      await waitFor(() => {
         expect(createWorkflowMock).toHaveBeenCalledTimes(1);
         expect(createWorkflowMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.asPath).toEqual(`/workflows/${workflow.id}`);
      });
   });

   it("create mode - save clicked - failed - test", async () => {
      const result: ActionResult<DWorkflow> = {
         success: false,
         message: "Fehler beim Erstellen",
      };
      createWorkflowMock.mockResolvedValue(result);

      renderWithReactQuery(<WorkflowEdit />);

      await waitFor(() => {
         assertRendered();
      });

      await typeIntoInput("title", "Mein Workflow");

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      const initValue = initWorkflow();
      const expectedPayload: DWorkflowUpdate = {
         title: initValue.title + "Mein Workflow",
         description: initValue.description,
         steps: initValue.steps,
      };

      await waitFor(() => {
         expect(createWorkflowMock).toHaveBeenCalledTimes(1);
         expect(createWorkflowMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.asPath).toEqual("/");
      });
   });

   it("create mode - save clicked - upgradeRequired - test", async () => {
      const result: ActionResult<DWorkflow> = {
         success: false,
         message: "Upgrade erforderlich",
         upgradeRequired: true,
      };
      createWorkflowMock.mockResolvedValue(result);

      renderWithReactQuery(<WorkflowEdit />);

      await waitFor(() => {
         assertRendered();
      });

      await typeIntoInput("title", "Mein Workflow");

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      const initValue = initWorkflow();
      const expectedPayload: DWorkflowUpdate = {
         title: initValue.title + "Mein Workflow",
         description: initValue.description,
         steps: initValue.steps,
      };

      const expectedToastPayload = {
         action: {
            label: "Upgrade",
            onClick: expect.any(Function),
         },
      };

      await waitFor(() => {
         expect(createWorkflowMock).toHaveBeenCalledTimes(1);
         expect(createWorkflowMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.error).toHaveBeenCalledWith(
            result.message,
            expectedToastPayload
         );
      });

      const toastCall = toastMock.error.mock.calls[0];
      const toastOptions = toastCall[1] as ExternalToast;
      const action = toastOptions.action as Action;
      const event = null as unknown as MouseEvent<HTMLButtonElement>;
      action.onClick(event);

      expect(mockRouter.asPath).toEqual("/subscription/pricing");
   });

   it("edit mode - save clicked - success - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const result: ActionResult<DWorkflowWithSteps> = {
         success: true,
         message: "Workflow gespeichert",
         data: workflow,
      };
      updateWorkflowMock.mockResolvedValue(result);

      renderWithReactQuery(<WorkflowEdit workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      await typeIntoInput("title", "Mein Workflow");

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      const initValue = initWorkflow(workflow);
      const expectedPayload: DWorkflowUpdate = {
         title: initValue.title + "Mein Workflow",
         description: initValue.description,
         steps: initValue.steps,
      };

      await waitFor(() => {
         expect(updateWorkflowMock).toHaveBeenCalledTimes(1);
         expect(updateWorkflowMock).toHaveBeenCalledWith(
            workflow.id,
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.asPath).toEqual(`/workflows/${workflow.id}`);
      });
   });

   it("edit mode - save clicked - failed - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const result: ActionResult<DWorkflowWithSteps> = {
         success: false,
         message: "Fehler beim Speichern",
      };
      updateWorkflowMock.mockResolvedValue(result);

      renderWithReactQuery(<WorkflowEdit workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      await typeIntoInput("title", "Mein Workflow");

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      const initValue = initWorkflow(workflow);
      const expectedPayload: DWorkflowUpdate = {
         title: initValue.title + "Mein Workflow",
         description: initValue.description,
         steps: initValue.steps,
      };

      await waitFor(() => {
         expect(updateWorkflowMock).toHaveBeenCalledTimes(1);
         expect(updateWorkflowMock).toHaveBeenCalledWith(
            workflow.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.asPath).toEqual("/");
      });
   });
});
