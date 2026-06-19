import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { WorkflowSteps } from "./steps";

const assertRendered = () => {
   const steps = screen.getByTestId("workflow-steps");
   const stepItems = screen.getAllByTestId("step");

   assertInDocument(steps);
   expect(stepItems.length).toBeGreaterThan(0);
};

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("workflow-steps-empty");
   assertInDocument(empty);
};

describe("WorkflowSteps rendering tests", () => {
   it("steps empty - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      workflow.steps = [];

      const { container } = render(<WorkflowSteps workflow={workflow} />);

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("steps defined - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = render(<WorkflowSteps workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
