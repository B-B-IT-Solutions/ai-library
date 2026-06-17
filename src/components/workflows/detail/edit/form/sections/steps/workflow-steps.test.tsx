import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import {
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { initWorkflow } from "../../utils";

import { WorkflowSteps } from "./workflow-steps";

type WrapperProps = {
   workflow?: DWorkflowWithSteps;
};

const TestWrapper = ({ workflow }: WrapperProps) => {
   const form = useForm<DWorkflowUpdate>({
      defaultValues: initWorkflow(workflow),
      mode: "all",
   });

   return (
      <FormProvider {...form}>
         <WorkflowSteps control={form.control} />
      </FormProvider>
   );
};

const assertRendered = () => {
   const steps = screen.getByTestId("workflow-steps");
   const addStepBtn = screen.getByTestId("add-step-main-btn");
   const stepItems = screen.getByTestId("steps");

   assertInDocument(steps);
   assertInDocument(addStepBtn);
   assertInDocument(stepItems);
};

const assertStepNotSelectedRendered = () => {
   const stepNotSelected = screen.getByTestId("step-not-selected");
   assertInDocument(stepNotSelected);
};

const assertStepFormRendered = () => {
   const form = screen.getByTestId("step-form");
   assertInDocument(form);
};

const assertStepItemsRendered = (count: number) => {
   const steps = screen.getAllByTestId("step");
   expect(steps.length).toEqual(count);
};

const assertStepItemsNotRendered = () => {
   const step = screen.queryByTestId("step");
   assertNotInDocument(step);
};

describe("WorkflowSteps rendering tests", () => {
   it("steps empty - test", async () => {
      const { container } = renderWithReactQuery(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertStepNotSelectedRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("steps - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = renderWithReactQuery(
         <TestWrapper workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
         assertStepNotSelectedRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("WorkflowSteps functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("add step btn clicked - test", async () => {
      renderWithReactQuery(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertStepItemsNotRendered();
      });

      const addBtn = screen.getByTestId("add-step-main-btn");
      await userEvent.click(addBtn);

      await waitFor(() => {
         assertStepItemsRendered(1);
      });
   });

   it("step selected - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      renderWithReactQuery(<TestWrapper workflow={workflow} />);

      await waitFor(() => {
         assertStepNotSelectedRendered();
      });

      const steps = screen.getAllByTestId("step");
      await userEvent.click(steps[0]);

      await waitFor(() => {
         assertStepFormRendered();
      });
   });

   it("step deleted - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const initialCount = workflow.steps.length;

      renderWithReactQuery(<TestWrapper workflow={workflow} />);

      await waitFor(() => {
         assertStepItemsRendered(initialCount);
      });

      const moreOptionsBtn = screen.getAllByTestId("more-options-btn")[0];
      await userEvent.click(moreOptionsBtn);

      await waitFor(() => {
         const deleteOption = screen.getAllByTestId("delete-menu-item")[0];
         assertInDocument(deleteOption);
      });

      const deleteOption = screen.getAllByTestId("delete-menu-item")[0];
      await userEvent.click(deleteOption);
   });
});
