import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { StepRunner } from "./step-runner";

const assertRendered = () => {
   const step = screen.getByTestId("step-runner");
   assertInDocument(step);
};

const assertPromptRendered = () => {
   const step = screen.getByTestId("prompt-step");
   assertInDocument(step);
};

const assertStandaloneStepRendered = () => {
   const step = screen.getByTestId("standalone-step");
   assertInDocument(step);
};

describe("StepRunner rendering tests", () => {
   it("prompt step - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const step = dtestData.dWorkflowStep();
      step.type = "PROMPT_REF";

      const { container } = render(
         <StepRunner step={step} workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
         assertPromptRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("standalone step - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const step = dtestData.dWorkflowStep();
      step.type = "STANDALONE";

      const { container } = render(
         <StepRunner step={step} workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
         assertStandaloneStepRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
