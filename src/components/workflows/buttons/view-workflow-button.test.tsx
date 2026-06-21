import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { ViewWorkflowButton } from "./view-workflow-button";

const assertRendered = () => {
   const menuItem = screen.getByTestId("view-workflow-menu-item");
   assertInDocument(menuItem);
};

describe("ViewWorkflowButton rendering tests", () => {
   it("rendered - test", async () => {
      const workflow = dtestData.dWorkflow();

      const { container } = renderWithRouter(
         <ViewWorkflowButton workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ViewWorkflowButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("view btn clicked - test", async () => {
      const workflow = dtestData.dWorkflow();
      render(<ViewWorkflowButton workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const viewBtn = screen.getByTestId("view-workflow-menu-item");
      await userEvent.click(viewBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/workflows/${workflow.id}`);
      });
   });
});
