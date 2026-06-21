jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { getPromptGenerationData } from "@/data/actions/prompt";

import { PromptStep } from "./prompt-step";

const getPromptGenerationDataMock =
   getPromptGenerationData as jest.MockedFunction<
      typeof getPromptGenerationData
   >;

const assertRendered = () => {
   const step = screen.getByTestId("prompt-step");
   assertInDocument(step);
};

const assertPromptDataRendered = () => {
   const usePromptForm = screen.getByTestId("use-prompt-form");
   assertInDocument(usePromptForm);
};

describe("PromptStep rendering tests", () => {
   it("promptData null - test", async () => {
      getPromptGenerationDataMock.mockResolvedValue(null);

      const workflow = dtestData.dWorkflowWithSteps();
      const step = dtestData.dWorkflowStep();
      step.type = "PROMPT_REF";
      step.promptId = "prompt-id-1";

      const { container } = renderWithReactQuery(
         <PromptStep step={step} workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("promptData retrieved - test", async () => {
      const promptData = dtestData.dPromptTemplatingData();
      getPromptGenerationDataMock.mockResolvedValue(promptData);

      const workflow = dtestData.dWorkflowWithSteps();
      const step = dtestData.dWorkflowStep();
      step.type = "PROMPT_REF";
      step.promptId = promptData.template.id;

      const { container } = renderWithReactQuery(
         <PromptStep step={step} workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
         assertPromptDataRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
