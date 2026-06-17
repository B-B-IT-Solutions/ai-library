import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import {
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";

import { StepItems } from "./step-items";

type WrapperProps = {
   steps: DWorkflowStepUpdate[];
   selectedIndex?: number;
   onSelectStep?: (index: number) => void;
   onDeleteStep?: (index: number) => void;
};

const TestWrapper = ({
   steps,
   selectedIndex,
   onSelectStep = jest.fn(),
   onDeleteStep = jest.fn(),
}: WrapperProps) => {
   const form = useForm<DWorkflowUpdate>({
      defaultValues: {
         title: "Workflow",
         description: undefined,
         steps,
      },
   });

   return (
      <FormProvider {...form}>
         <StepItems
            steps={steps}
            selectedIndex={selectedIndex}
            onSelectStep={onSelectStep}
            onDeleteStep={onDeleteStep}
            control={form.control}
         />
      </FormProvider>
   );
};

const assertRendered = () => {
   const steps = screen.getByTestId("steps");
   assertInDocument(steps);
};

const assertItemsRendered = () => {
   const steps = screen.getAllByTestId("step");
   expect(steps.length).toBeGreaterThan(0);
};

const assertStartWarningRendered = () => {
   const warning = screen.getByTestId("start-step-warning");
   assertInDocument(warning);
};

const assertStartWarningNotRendered = () => {
   const warning = screen.queryByText("start-step-warning");
   assertNotInDocument(warning);
};

describe("StepItems rendering tests", () => {
   it("empty steps - test", async () => {
      const { container } = render(<TestWrapper steps={[]} />);

      await waitFor(() => {
         assertRendered();
         assertStartWarningNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("steps - start step defined - test", async () => {
      const steps = dtestData.dWorkflowStepUpdates(3);

      const { container } = render(<TestWrapper steps={steps} />);

      await waitFor(() => {
         assertRendered();
         assertItemsRendered();
         assertStartWarningNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("steps - start step not defined - test", async () => {
      const steps = dtestData.dWorkflowStepUpdates(3);
      steps[0].isStart = false;
      steps[1].isStart = false;
      steps[2].isStart = false;

      const { container } = render(<TestWrapper steps={steps} />);

      await waitFor(() => {
         assertRendered();
         assertItemsRendered();
         assertStartWarningRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("one step - start step not defined - test", async () => {
      const steps = dtestData.dWorkflowStepUpdates(1);
      steps[0].isStart = true;

      const { container } = render(<TestWrapper steps={steps} />);

      await waitFor(() => {
         assertRendered();
         assertItemsRendered();
         assertStartWarningNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("StepItems functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("step clicked - test", async () => {
      const steps = dtestData.dWorkflowStepUpdates(1);
      const onSelectStep = jest.fn();

      render(<TestWrapper steps={steps} onSelectStep={onSelectStep} />);

      await waitFor(() => {
         assertRendered();
         expect(onSelectStep).not.toHaveBeenCalled();
      });

      const step = screen.getByTestId("step");
      await userEvent.click(step);

      await waitFor(() => {
         expect(onSelectStep).toHaveBeenCalledTimes(1);
         expect(onSelectStep).toHaveBeenCalledWith(0);
      });
   });

   it("delete step - test", async () => {
      const onDeleteStep = jest.fn();
      const steps = dtestData.dWorkflowStepUpdates(1);

      render(<TestWrapper steps={steps} onDeleteStep={onDeleteStep} />);

      await waitFor(() => {
         assertRendered();
         expect(onDeleteStep).not.toHaveBeenCalled();
      });

      const moreOptionsBtn = screen.getByTestId("more-options-btn");
      await userEvent.click(moreOptionsBtn);

      await waitFor(() => {
         const deleteOption = screen.getByTestId("delete-menu-item");
         assertInDocument(deleteOption);
      });

      const deleteOption = screen.getByTestId("delete-menu-item");
      await userEvent.click(deleteOption);

      await waitFor(() => {
         expect(onDeleteStep).toHaveBeenCalledTimes(1);
         expect(onDeleteStep).toHaveBeenCalledWith(0);
      });
   });
});
