jest.mock("@/data/actions/workflow");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { WorkflowView } from "./workflow-view";

const assertRendered = () => {
   assertInDocument(screen.getByTestId("workflow-view"));
   assertInDocument(screen.getByTestId("workflow-breadcrumb"));
   assertInDocument(screen.getByTestId("workflow-info-card"));
   assertInDocument(screen.getByTestId("workflow-sidebar"));
};

describe("WorkflowView rendering tests", () => {
   it("with steps - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = render(<WorkflowView workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
         assertInDocument(screen.getByTestId("workflow-steps-list"));
      });

      expect(container).toMatchSnapshot();
   });

   it("without steps - shows empty state - test", async () => {
      const workflow = { ...dtestData.dWorkflowWithSteps(), steps: [] };

      const { container } = render(<WorkflowView workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
         assertInDocument(screen.getByTestId("steps-empty"));
      });

      expect(container).toMatchSnapshot();
   });

   it("with description - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      render(<WorkflowView workflow={workflow} />);

      await waitFor(() => {
         assertInDocument(screen.getByText(workflow.description!));
      });
   });

   it("without description - test", async () => {
      const workflow = { ...dtestData.dWorkflowWithSteps(), description: null };

      render(<WorkflowView workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });
   });

   it("title is displayed - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      render(<WorkflowView workflow={workflow} />);

      await waitFor(() => {
         assertInDocument(screen.getByText(workflow.title));
      });
   });

   it("sidebar shows step count and date - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      render(<WorkflowView workflow={workflow} />);

      await waitFor(() => {
         const sidebar = screen.getByTestId("workflow-sidebar");
         const stepLabel = workflow.stepCount === 1 ? "Schritt" : "Schritte";
         expect(sidebar).toHaveTextContent(
            `${workflow.stepCount} ${stepLabel}`
         );
      });
   });
});
