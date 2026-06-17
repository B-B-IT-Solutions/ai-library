import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import {
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";

import { StepItem } from "./step-item";

type WrapperProps = {
   steps: DWorkflowStepUpdate[];
   index: number;
   isSelected?: boolean;
   onSelectStep?: (index: number) => void;
   onDeleteStep?: (index: number) => void;
};

const TestWrapper = ({
   steps,
   index,
   isSelected = false,
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
         <StepItem
            steps={steps}
            index={index}
            isSelected={isSelected}
            onSelectStep={onSelectStep}
            onDeleteStep={onDeleteStep}
            control={form.control}
         />
      </FormProvider>
   );
};

const assertRendered = () => {
   const step = screen.getByTestId("step");
   const type = screen.getByTestId("type-badge");
   const moreOptionBtn = screen.getByTestId("more-options-btn");

   assertInDocument(step);
   assertInDocument(type);
   assertInDocument(moreOptionBtn);
};

const assertStartBadgeRendered = () => {
   const badge = screen.getByTestId("start-badge");
   assertInDocument(badge);
};

const assertStartBadgeNotRendered = () => {
   const badge = screen.queryByTestId("start-badge");
   assertNotInDocument(badge);
};

const assertEndBadgeRendered = () => {
   const badge = screen.getByTestId("end-badge");
   assertInDocument(badge);
};

const assertEndBadgeNotRendered = () => {
   const badge = screen.queryByTestId("end-badge");
   assertNotInDocument(badge);
};

describe("StepItem rendering tests", () => {
   it("isStart true - test", async () => {
      const steps = dtestData.dWorkflowStepUpdates(1);
      steps[0].isStart = true;
      steps[0].type = "PROMPT_REF";

      const { container } = render(<TestWrapper steps={steps} index={0} />);

      await waitFor(() => {
         assertRendered();
         assertStartBadgeRendered();
         assertEndBadgeNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("isStart false - test", async () => {
      const steps = dtestData.dWorkflowStepUpdates(1);
      steps[0].isStart = false;
      steps[0].edges = [];
      steps[0].type = "STANDALONE";

      const { container } = render(<TestWrapper steps={steps} index={0} />);

      await waitFor(() => {
         assertRendered();
         assertEndBadgeRendered();
         assertStartBadgeNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("isSelected true - test", async () => {
      const steps = dtestData.dWorkflowStepUpdates(1);

      const { container } = render(
         <TestWrapper steps={steps} index={0} isSelected={true} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("StepItem functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("step selected - test", async () => {
      const onSelectStep = jest.fn();
      const steps = dtestData.dWorkflowStepUpdates(1);

      render(
         <TestWrapper steps={steps} index={0} onSelectStep={onSelectStep} />
      );

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

   it("delete item - test", async () => {
      const onDeleteStep = jest.fn();
      const steps = dtestData.dWorkflowStepUpdates(1);

      render(
         <TestWrapper steps={steps} index={0} onDeleteStep={onDeleteStep} />
      );

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
