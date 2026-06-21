import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { WorkflowNavigation } from "./workflow-navigation";

const assertRendered = () => {
   const navigation = screen.getByTestId("workflow-navigation");
   const previousStepBtn = screen.getByTestId("previous-step-btn");
   const nextStepBtns = screen.getAllByTestId("next-step-btn");

   assertInDocument(navigation);
   assertInDocument(previousStepBtn);
   expect(nextStepBtns.length).toBeGreaterThan(0);
};

describe("WorkflowNavigation rendering tests", () => {
   it("target defined - test", async () => {
      const steps = dtestData.dWorkflowSteps();
      const edges = steps[0].outgoingEdges;

      const { container } = renderWithRouter(
         <WorkflowNavigation
            edges={edges}
            allSteps={steps}
            onNextStep={jest.fn()}
            onPreviousStep={jest.fn()}
            previousEnabled={true}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("WorkflowNavigation functionality tests", () => {
   it("next step btn clicked - test", async () => {
      const steps = dtestData.dWorkflowSteps();
      const edges = steps[0].outgoingEdges;
      const edge1 = steps[0].outgoingEdges[0];

      const onSelectedFn = jest.fn();

      renderWithRouter(
         <WorkflowNavigation
            edges={edges}
            allSteps={steps}
            onNextStep={onSelectedFn}
            previousEnabled={true}
            onPreviousStep={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      await waitFor(() => {
         assertRendered();
         expect(onSelectedFn).not.toHaveBeenCalled();
      });

      const btn = screen.getAllByTestId("next-step-btn")[0];
      await userEvent.click(btn);

      await waitFor(() => {
         expect(onSelectedFn).toHaveBeenCalledTimes(1);
         expect(onSelectedFn).toHaveBeenCalledWith(edge1.toStepId);
      });
   });

   it("previous step btn clicked - test", async () => {
      const steps = dtestData.dWorkflowSteps();
      const edges = steps[0].outgoingEdges;

      const onPreviousStepFn = jest.fn();

      renderWithRouter(
         <WorkflowNavigation
            edges={edges}
            allSteps={steps}
            previousEnabled={true}
            onNextStep={jest.fn()}
            onPreviousStep={onPreviousStepFn}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      await waitFor(() => {
         assertRendered();
         expect(onPreviousStepFn).not.toHaveBeenCalled();
      });

      const btn = screen.getByTestId("previous-step-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(onPreviousStepFn).toHaveBeenCalledTimes(1);
      });
   });
});
