import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { CallbackFn } from "@/data/types/common";
import {
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { initWorkflow } from "../../../utils";

import { StepDetail } from "./step-detail";

type WrapperProps = {
   workflow?: DWorkflowWithSteps;
   index?: number;
   addStep?: CallbackFn;
};

const TestWrapper = ({
   workflow,
   index,
   addStep = jest.fn(),
}: WrapperProps) => {
   const form = useForm<DWorkflowUpdate>({
      defaultValues: initWorkflow(workflow),
      mode: "all",
   });

   const steps = form.getValues().steps;

   return (
      <FormProvider {...form}>
         <StepDetail
            index={index}
            steps={steps}
            addStep={addStep}
            control={form.control}
         />
      </FormProvider>
   );
};

const assertBannerRendered = () => {
   const banner = screen.getByTestId("step-not-selected");
   const addStepBtn = screen.getByTestId("add-step-btn");

   assertInDocument(banner);
   assertInDocument(addStepBtn);
};

const assertBannerNotRendered = () => {
   const banner = screen.queryByTestId("step-not-selected");
   const addStepBtn = screen.queryByTestId("add-step-btn");

   assertNotInDocument(banner);
   assertNotInDocument(addStepBtn);
};

const assertFormRendered = () => {
   const form = screen.getByTestId("step-form");
   assertInDocument(form);
};

const assertFormNotRendered = () => {
   const form = screen.queryByTestId("step-form");
   assertNotInDocument(form);
};

describe("StepDetail rendering tests", () => {
   it("index undefined - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = renderWithReactQuery(
         <TestWrapper workflow={workflow} index={undefined} />
      );

      await waitFor(() => {
         assertBannerRendered();
         assertFormNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("index defined - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = renderWithReactQuery(
         <TestWrapper workflow={workflow} index={1} />
      );

      await waitFor(() => {
         assertFormRendered();
         assertBannerNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("StepDetail functionality tests", () => {
   it("addStep btn clicked -test ", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const addStepFn = jest.fn();

      renderWithReactQuery(
         <TestWrapper
            workflow={workflow}
            index={undefined}
            addStep={addStepFn}
         />
      );

      await waitFor(() => {
         assertBannerRendered();
         expect(addStepFn).not.toHaveBeenCalled();
      });

      const btn = screen.getByTestId("add-step-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(addStepFn).toHaveBeenCalledTimes(1);
      });
   });
});
