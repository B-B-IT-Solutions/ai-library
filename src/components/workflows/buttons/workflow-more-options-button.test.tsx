import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";
import mockRouter from "next-router-mock";

import { WorkflowMoreOptionsButton } from "./workflow-more-options-button";

const assertRendered = () => {
   const btn = screen.getByTestId("workflow-more-options-btn");
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");

   assertInDocument(btn);
   assertInDocument(triggerBtn);
};

const assertContextMenuRendered = () => {
   const viewBtn = screen.getByTestId("view-workflow-menu-item");
   const editBtn = screen.getByTestId("edit-workflow-menu-item");
   const deleteBtn = screen.getByTestId("delete-workflow-menu-item");

   assertInDocument(viewBtn);
   assertInDocument(editBtn);
   assertInDocument(deleteBtn);
};

const assertContextMenuNotRendered = () => {
   const viewBtn = screen.queryByTestId("view-workflow-menu-item");
   const editBtn = screen.queryByTestId("edit-workflow-menu-item");
   const deleteBtn = screen.queryByTestId("delete-workflow-menu-item");

   assertNotInDocument(viewBtn);
   assertNotInDocument(editBtn);
   assertNotInDocument(deleteBtn);
};

const assertDateStateOpen = () => {
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");
   assertHasAttributeWithValue(triggerBtn, "data-state", "open");
};

const assertDateStateClosed = () => {
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");
   assertHasAttributeWithValue(triggerBtn, "data-state", "false");
};

describe("WorkflowMoreOptionsButton rendering tests", () => {
   it("rendered test", async () => {
      const workflow = dtestData.dWorkflow();

      const { container } = renderWithReactQuery(
         <WorkflowMoreOptionsButton workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("WorkflowMoreOptionsButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("trigger clicked - test", async () => {
      const workflow = dtestData.dWorkflow();
      renderWithReactQuery(<WorkflowMoreOptionsButton workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
         assertDateStateClosed();
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertContextMenuRendered();
         assertDateStateOpen();
      });
   });

   it("view workflow btn clicked - test", async () => {
      const workflow = dtestData.dWorkflow();
      renderWithReactQuery(<WorkflowMoreOptionsButton workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
         assertDateStateClosed();
         expect(mockRouter.pathname).toEqual("/");
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertContextMenuRendered();
         assertDateStateOpen();
         expect(mockRouter.pathname).toEqual("/");
      });

      const viewBtn = screen.getByTestId("view-workflow-menu-item");
      await userEvent.click(viewBtn);

      await waitFor(() => {
         assertContextMenuNotRendered();
         expect(mockRouter.pathname).toEqual(`/workflows/${workflow.id}`);
      });
   });
});
