import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { WorkflowSidebar } from "./workflow-sidebar";

const assertRendered = () => {
   const sidebar = screen.getByTestId("workflow-sidebar");
   const useWorkflowBtn = screen.getByTestId("run-workflow-btn");
   const editWorkflowBtn = screen.getByTestId("edit-workflow-btn");
   const deleteWorkflowBtn = screen.getByTestId("delete-workflow-btn");

   assertInDocument(sidebar);
   assertInDocument(useWorkflowBtn);
   assertInDocument(editWorkflowBtn);
   assertInDocument(deleteWorkflowBtn);
};

describe("WorkflowSidebar rendering tests", () => {
   it("1 step - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      workflow.steps = dtestData.dWorkflowSteps(1);

      const { container } = render(<WorkflowSidebar workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("mulitple steps - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = render(<WorkflowSidebar workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
