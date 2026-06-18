jest.mock("@/data/actions/workflow");

import React from "react";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { WorkflowItem } from "./workflow-item";

const assertRendered = () => {
   const card = screen.getByTestId("workflow-item");
   const titleLink = screen.getByTestId("view-details-link");
   const runBtn = screen.getByTestId("run-workflow-btn");
   const moreOptionsBtn = screen.getByTestId("more-options-trigger-btn");

   assertInDocument(card);
   assertInDocument(titleLink);
   assertInDocument(runBtn);
   assertInDocument(moreOptionsBtn);
};

describe("WorkflowItem rendering tests", () => {
   it("with description - test", async () => {
      const workflow = dtestData.dWorkflow();

      const { container } = renderWithRouter(<WorkflowItem workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
         assertInDocument(screen.getByText(workflow.description!));
      });

      expect(container).toMatchSnapshot();
   });

   it("without description - test", async () => {
      const workflow = { ...dtestData.dWorkflow(), description: null };

      const { container } = renderWithRouter(<WorkflowItem workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("step count badge displayed - test", async () => {
      const workflow = dtestData.dWorkflow();

      renderWithRouter(<WorkflowItem workflow={workflow} />);

      await waitFor(() => {
         assertInDocument(screen.getByText(`${workflow.stepCount} Schritte`));
      });
   });

   it("title displayed - test", async () => {
      const workflow = dtestData.dWorkflow();

      renderWithRouter(<WorkflowItem workflow={workflow} />);

      await waitFor(() => {
         assertInDocument(screen.getByText(workflow.title));
      });
   });
});

describe("WorkflowItem ref tests", () => {
   it("ref is forwarded to the card DOM element - test", async () => {
      const ref = React.createRef<HTMLDivElement>();
      const workflow = dtestData.dWorkflow();

      renderWithRouter(<WorkflowItem workflow={workflow} ref={ref} />);

      await waitFor(() => {
         const card = screen.getByTestId("workflow-item");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(card);
      });
   });
});

describe("WorkflowItem functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("title link navigates to workflow detail - test", async () => {
      const workflow = dtestData.dWorkflow();

      renderWithRouter(<WorkflowItem workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const titleLink = screen.getByTestId("view-details-link");
      userEvent.click(titleLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/workflows/${workflow.id}`);
      });
   });
});
