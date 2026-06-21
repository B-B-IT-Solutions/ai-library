jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { getPromptGenerationData } from "@/data/actions/prompt";

import { StepRunner } from "./step-runner";

const getPromptGenerationDataMock =
   getPromptGenerationData as jest.MockedFunction<
      typeof getPromptGenerationData
   >;

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

const assertStepNotFoundRendered = () => {
   const step = screen.getByTestId("step-not-found");
   assertInDocument(step);
};

describe("StepRunner rendering tests", () => {
   it("prompt step - test", async () => {
      const promptData = dtestData.dPromptTemplatingData();
      getPromptGenerationDataMock.mockResolvedValue(promptData);

      const workflow = dtestData.dWorkflowWithSteps();
      const step = dtestData.dWorkflowStep();
      step.type = "PROMPT_REF";
      step.promptId = promptData.template.id;

      const { container } = renderWithReactQuery(
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

      const { container } = renderWithReactQuery(
         <StepRunner step={step} workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
         assertStandaloneStepRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("step not found - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = renderWithReactQuery(
         <StepRunner step={undefined} workflow={workflow} />
      );

      await waitFor(() => {
         assertStepNotFoundRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
