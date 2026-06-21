import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { StandaloneStep } from "./standalone-step";

const assertRendered = () => {
   const step = screen.getByTestId("standalone-step");
   assertInDocument(step);
};

describe("StandaloneStep rendering tests", () => {
   it("content null - test", async () => {
      const step = dtestData.dWorkflowStep();
      step.content = null;

      const { container } = render(<StandaloneStep step={step} />);

      expect(container).toMatchSnapshot();
   });

   it("content defined - test", async () => {
      const step = dtestData.dWorkflowStep();
      const { container } = render(<StandaloneStep step={step} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
