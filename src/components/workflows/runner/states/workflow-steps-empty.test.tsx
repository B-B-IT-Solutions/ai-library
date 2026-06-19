import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";

import { WorklowStepsEmpty } from "./workflow-steps-empty";

const assertRendered = () => {
   const empty = screen.getByTestId("workflow-steps-empty");
   const editBtn = screen.getByTestId("workflow-edit-btn");

   assertInDocument(empty);
   assertInDocument(editBtn);
};

describe("WorklowStepsEmpty rendering tests", () => {
   it("stepCount 1 - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const { container } = render(
         <WorklowStepsEmpty workflow={workflow} message="Test 1" />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("WorklowStepsEmpty functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("edit btn clicked  - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      render(<WorklowStepsEmpty workflow={workflow} message="Test 1" />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const editBtn = screen.getByTestId("workflow-edit-btn");
      await userEvent.click(editBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/workflows/${workflow.id}/edit`);
      });
   });
});
