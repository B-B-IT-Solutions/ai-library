jest.mock("@/data/actions/workflow");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { getWorkflowForRunner } from "@/data/actions/workflow";

import { RunWorkflowButton } from "./run-workflow-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const getWorkflowForRunnerMock = getWorkflowForRunner as jest.MockedFunction<
   typeof getWorkflowForRunner
>;

const assertRendered = () => {
   const btn = screen.getByTestId("run-workflow-btn");
   assertInDocument(btn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("run-workflow-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("run-workflow-dialog");
   assertNotInDocument(dialog);
};

describe("RunWorkflowButton rendering tests", () => {
   it("data loaded - test", async () => {
      const data = dtestData.dWorkflowWithSteps();
      getWorkflowForRunnerMock.mockResolvedValue(data);

      const workflow = dtestData.dWorkflow();
      const { container } = render(<RunWorkflowButton workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("with className - rendered test", async () => {
      const data = dtestData.dWorkflowWithSteps();
      getWorkflowForRunnerMock.mockResolvedValue(data);

      const workflow = dtestData.dWorkflow();
      const { container } = render(
         <RunWorkflowButton workflow={workflow} className="custom-class" />
      );

      await waitFor(() => {
         assertRendered();
      });

      const btn = screen.getByTestId("run-workflow-btn");
      expect(btn).toHaveClass("custom-class");
      expect(container).toMatchSnapshot();
   });
});

describe("RunWorkflowButton functionality - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("submit clicked - success - templateData null - test", async () => {
      getWorkflowForRunnerMock.mockResolvedValue(null);

      const workflow = dtestData.dWorkflow();

      render(<RunWorkflowButton workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      const runWorkflowBtn = screen.getByTestId("run-workflow-btn");
      await userEvent.click(runWorkflowBtn);

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(getWorkflowForRunnerMock).toHaveBeenCalledTimes(1);
      expect(getWorkflowForRunnerMock).toHaveBeenCalledWith(workflow.id);
      expect(toastMock.error).toHaveBeenCalledTimes(1);
      expect(toastMock.error).toHaveBeenCalledWith(
         "Workflow konnte nicht geladen werden."
      );
   });

   it("submit clicked - success - data retrieved - test", async () => {
      const data = dtestData.dWorkflowWithSteps();
      getWorkflowForRunnerMock.mockResolvedValue(data);

      const workflow = dtestData.dWorkflow();

      render(<RunWorkflowButton workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      const runWorkflowBtn = screen.getByTestId("run-workflow-btn");
      await userEvent.click(runWorkflowBtn);

      await waitFor(() => {
         assertDialogRendered();
      });
   });

   it("close clicked - test", async () => {
      const data = dtestData.dWorkflowWithSteps();
      getWorkflowForRunnerMock.mockResolvedValue(data);

      const workflow = dtestData.dWorkflow();

      render(<RunWorkflowButton workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      const runWorkflowBtn = screen.getByTestId("run-workflow-btn");
      await userEvent.click(runWorkflowBtn);

      await waitFor(() => {
         assertDialogRendered();
      });

      const closeBtn = screen.getByTestId("close-btn");
      await userEvent.click(closeBtn);

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });
});
