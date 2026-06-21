jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { WorkflowRunner } from "./workflow-runner";

describe("WorkflowRunner rendering tests", () => {
   it("empty steps - shows empty state - test", async () => {
      const workflow = { ...dtestData.dWorkflowWithSteps(), steps: [] };

      renderWithRouter(<WorkflowRunner workflow={workflow} />);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("workflow-steps-empty"));
      });
   });

   it("no start step - shows no start step state - test", async () => {
      const workflow = {
         ...dtestData.dWorkflowWithSteps(),
         steps: dtestData.dWorkflowSteps().map((s) => ({ ...s, isStart: false })),
      };

      renderWithRouter(<WorkflowRunner workflow={workflow} />);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("workflow-steps-empty"));
      });
   });

   it("renders runner and displays first step - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const startStep = workflow.steps.find((s) => s.isStart)!;

      renderWithRouter(<WorkflowRunner workflow={workflow} />);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("workflow-runner"));
         assertInDocument(screen.getByTestId("step-runner"));
         expect(screen.getByText(startStep.title)).toBeInTheDocument();
      });
   });

   it("back button disabled on first step - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      renderWithRouter(<WorkflowRunner workflow={workflow} />);

      await waitFor(() => {
         const backBtn = screen.getByTestId("previous-step-btn");
         expect(backBtn).toBeDisabled();
      });
   });
});

describe("WorkflowRunner navigation tests", () => {
   // step0 (start) → step1 (middle, has edges) → step2 (end, no edges)
   const buildWorkflow = () => {
      const step0 = dtestData.dWorkflowStep(0);
      const step1 = dtestData.dWorkflowStep(1);
      const step2 = { ...dtestData.dWorkflowStep(2), outgoingEdges: [] };
      return { ...dtestData.dWorkflowWithSteps(), steps: [step0, step1, step2] };
   };

   it("navigates to next step - test", async () => {
      const workflow = buildWorkflow();
      const step0 = workflow.steps[0];
      const step1 = workflow.steps[1];

      renderWithRouter(<WorkflowRunner workflow={workflow} />);

      await waitFor(() => {
         expect(screen.getByText(step0.title)).toBeInTheDocument();
      });

      await userEvent.click(screen.getAllByTestId("next-step-btn")[0]);

      await waitFor(() => {
         expect(screen.getByText(step1.title)).toBeInTheDocument();
      });
   });

   it("back button enabled after navigating forward - test", async () => {
      const workflow = buildWorkflow();

      renderWithRouter(<WorkflowRunner workflow={workflow} />);

      await userEvent.click(screen.getAllByTestId("next-step-btn")[0]);

      await waitFor(() => {
         expect(screen.getByTestId("previous-step-btn")).not.toBeDisabled();
      });
   });

   it("navigates back to previous step - test", async () => {
      const workflow = buildWorkflow();
      const step0 = workflow.steps[0];

      renderWithRouter(<WorkflowRunner workflow={workflow} />);

      await userEvent.click(screen.getAllByTestId("next-step-btn")[0]);
      await userEvent.click(screen.getByTestId("previous-step-btn"));

      await waitFor(() => {
         expect(screen.getByText(step0.title)).toBeInTheDocument();
      });
   });

   it("shows completed state after last step - test", async () => {
      const workflow = buildWorkflow();

      renderWithRouter(<WorkflowRunner workflow={workflow} />);

      await userEvent.click(screen.getAllByTestId("next-step-btn")[0]);
      await userEvent.click(screen.getAllByTestId("next-step-btn")[0]);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("workflow-completed"));
      });
   });

   it("restarts from completed state - test", async () => {
      const workflow = buildWorkflow();
      const step0 = workflow.steps[0];

      renderWithRouter(<WorkflowRunner workflow={workflow} />);

      await userEvent.click(screen.getAllByTestId("next-step-btn")[0]);
      await userEvent.click(screen.getAllByTestId("next-step-btn")[0]);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("workflow-completed"));
      });

      await userEvent.click(screen.getByTestId("restart-btn"));

      await waitFor(() => {
         expect(screen.getByText(step0.title)).toBeInTheDocument();
         assertInDocument(screen.getByTestId("step-runner"));
      });
   });
});
