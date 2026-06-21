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

const assertWorkflowCompletedRendered = () => {
   const completed = screen.getByTestId("workflow-completed");
   assertInDocument(completed);
};

const assertStepsTitleRendered = (title: string) => {
   const step = screen.getByText(title);
   assertInDocument(step);
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

   it("start step not defined - test", async () => {
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
   it("navigates to next/previous step - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const step0 = workflow.steps[0];
      const step1 = workflow.steps[1];

      renderWithRouter(<WorkflowRunner workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
         assertStepsTitleRendered(step0.title);
      });

      const nextStepBtn = screen.getAllByTestId("next-step-btn")[0];
      await userEvent.click(nextStepBtn);

      await waitFor(() => {
         assertRendered();
         assertStepsTitleRendered(step1.title);
      });

      const previousStepBtn = screen.getByTestId("previous-step-btn");
      await userEvent.click(previousStepBtn);

      await waitFor(() => {
         assertRendered();
         assertStepsTitleRendered(step0.title);
      });
   });

   it("navigate to last step/restart - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const step0 = workflow.steps[0];
      const step1 = workflow.steps[1];
      const step2 = workflow.steps[2];
      step2.outgoingEdges = [];

      renderWithRouter(<WorkflowRunner workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
         assertStepsTitleRendered(step0.title);
      });

      const nextStepBtn1 = screen.getAllByTestId("next-step-btn")[0];
      await userEvent.click(nextStepBtn1);

      await waitFor(() => {
         assertRendered();
         assertStepsTitleRendered(step1.title);
      });

      const nextStepBtn2 = screen.getAllByTestId("next-step-btn")[0];
      await userEvent.click(nextStepBtn2);

      await waitFor(() => {
         assertStepsTitleRendered(step2.title);
         assertWorkflowCompletedRendered();
      });

      const restartBtn = screen.getByTestId("restart-btn");
      await userEvent.click(restartBtn);

      await waitFor(() => {
         assertRendered();
         assertStepsTitleRendered(step0.title);
      });
   });
});
