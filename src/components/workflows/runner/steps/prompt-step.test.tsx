import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptStep } from "./prompt-step";

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
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = render(
         <PromptStep promptData={null} workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("content defined - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const promptData = dtestData.dPromptGenerationData();

      const { container } = render(
         <PromptStep promptData={promptData} workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
         assertPromptDataRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
