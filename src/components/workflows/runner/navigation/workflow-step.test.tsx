import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { NextStep } from "./workflow-step";

const assertBtnRendered = () => {
   const step = screen.getByTestId("next-step-btn");
   assertInDocument(step);
};

describe("NextStep rendering tests", () => {
   it("target defined - test", async () => {
      const steps = dtestData.dWorkflowSteps();
      const edge = steps[0].outgoingEdges[0];

      const { container } = renderWithRouter(
         <NextStep edge={edge} allSteps={steps} onSelected={jest.fn()} />
      );

      await waitFor(() => {
         assertBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("target undefined - test", async () => {
      const steps = dtestData.dWorkflowSteps();
      const edge = steps[0].outgoingEdges[0];

      const { container } = renderWithRouter(
         <NextStep edge={edge} allSteps={[]} onSelected={jest.fn()} />
      );

      await waitFor(() => {
         assertBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("NextStep functionality tests", () => {
   it("next btn clicked - test", async () => {
      const steps = dtestData.dWorkflowSteps();
      const edge = steps[0].outgoingEdges[0];

      const onSelectedFn = jest.fn();

      renderWithRouter(
         <NextStep edge={edge} allSteps={steps} onSelected={onSelectedFn} />
      );

      await waitFor(() => {
         assertBtnRendered();
      });

      await waitFor(() => {
         assertBtnRendered();
         expect(onSelectedFn).not.toHaveBeenCalled();
      });

      const btn = screen.getByTestId("next-step-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(onSelectedFn).toHaveBeenCalledTimes(1);
         expect(onSelectedFn).toHaveBeenCalledWith(edge.toStepId);
      });
   });
});
