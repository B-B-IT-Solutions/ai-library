import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { EditWorkflowButton } from "./edit-workflow-button";

const assertBtnRendered = () => {
   const editBtn = screen.getByTestId("edit-workflow-btn");
   assertInDocument(editBtn);
};

const assertMenuItemRendered = () => {
   const menuItem = screen.getByTestId("edit-workflow-menu-item");
   assertInDocument(menuItem);
};

describe("EditWorkflowButton rendering tests", () => {
   it("asMenuItem false - test", async () => {
      const prompt = dtestData.dWorkflow();

      const { container } = renderWithRouter(
         <EditWorkflowButton workflow={prompt} />
      );

      await waitFor(() => {
         assertBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("asMenuItem true - test", async () => {
      const workflow = dtestData.dWorkflow();

      const { container } = renderWithRouter(
         <EditWorkflowButton workflow={workflow} asMenuItem={true} />
      );

      await waitFor(() => {
         assertMenuItemRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditWorkflowButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("edit btn clicked - test", async () => {
      const workflow = dtestData.dWorkflow();
      renderWithRouter(<EditWorkflowButton workflow={workflow} />);

      await waitFor(() => {
         assertBtnRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const editBtn = screen.getByTestId("edit-workflow-btn");
      await userEvent.click(editBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/workflows/${workflow.id}/edit`);
      });
   });

   it("edit menu item clicked - test", async () => {
      const workflow = dtestData.dWorkflow();

      renderWithRouter(
         <EditWorkflowButton workflow={workflow} asMenuItem={true} />
      );

      await waitFor(() => {
         assertMenuItemRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const menuItem = screen.getByTestId("edit-workflow-menu-item");
      await userEvent.click(menuItem);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/workflows/${workflow.id}/edit`);
      });
   });
});
