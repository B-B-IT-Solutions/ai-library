import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { WorkflowStep } from "./step";

const assertRendered = () => {
   const step = screen.getByTestId("step");
   assertInDocument(step);
};

describe("WorkflowStep rendering tests", () => {
   it("type PROMPT_REF - test", async () => {
      const index = 0;
      const steps = dtestData.dWorkflowSteps();
      const step = steps[index];
      step.type = "PROMPT_REF";

      const { container } = render(
         <WorkflowStep step={step} index={index} steps={steps} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("type STANDALONE - test", async () => {
      const index = 0;
      const steps = dtestData.dWorkflowSteps();
      const step = steps[index];
      step.type = "STANDALONE";
      step.isStart = false;
      step.outgoingEdges = [];

      const { container } = render(
         <WorkflowStep step={step} index={index} steps={steps} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
