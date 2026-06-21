jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { WorkflowRunner } from "./workflow-runner";

const assertRendered = () => {
   const workflow = screen.getByTestId("workflow-runner");
   const step = screen.getByTestId("step-runner");
   const navigation = screen.getByTestId("workflow-navigation");

   assertInDocument(workflow);
   assertInDocument(step);
   assertInDocument(navigation);
};

const assertStepsEmptyRendered = () => {
   const stepsEmpty = screen.getByTestId("workflow-steps-empty");
   assertInDocument(stepsEmpty);
};

describe("WorkflowRunner rendering tests", () => {
   it("steps empty - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      workflow.steps = [];

      const { container } = renderWithRouter(
         <WorkflowRunner workflow={workflow} />
      );

      await waitFor(() => {
         assertStepsEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("start stepn not defined - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const step = dtestData.dWorkflowStep();
      step.isStart = false;
      workflow.steps = [step];

      const { container } = renderWithRouter(
         <WorkflowRunner workflow={workflow} />
      );

      await waitFor(() => {
         assertStepsEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("start step - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = renderWithRouter(
         <WorkflowRunner workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("WorkflowRunner navigation tests", () => {
   // step0 (start) → step1 (middle, has edges) → step2 (end, no edges)
   const buildWorkflow = () => {
      const step0 = dtestData.dWorkflowStep(0);
      const step1 = dtestData.dWorkflowStep(1);
      const step2 = { ...dtestData.dWorkflowStep(2), outgoingEdges: [] };
      return {
         ...dtestData.dWorkflowWithSteps(),
         steps: [step0, step1, step2],
      };
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
