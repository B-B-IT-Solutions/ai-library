jest.mock("@/data/actions/workflow");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { WorkflowView } from "./workflow-view";

const assertRendered = () => {
   const view = screen.getByTestId("workflow-view");
   const breadcrumb = screen.getByTestId("workflow-breadcrumb");
   const info = screen.getByTestId("workflow-info");
   const steps = screen.getByTestId("workflow-steps");
   const sidebar = screen.getByTestId("workflow-sidebar");

   assertInDocument(view);
   assertInDocument(breadcrumb);
   assertInDocument(info);
   assertInDocument(steps);
   assertInDocument(sidebar);
};

describe("WorkflowView rendering tests", () => {
   it("description defined - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = render(<WorkflowView workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("description null - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      workflow.description = null;

      const { container } = render(<WorkflowView workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
