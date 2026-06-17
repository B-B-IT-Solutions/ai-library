import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import {
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { initWorkflow } from "../../../utils";

import { StepForm } from "./step-form";

type WrapperProps = {
   workflow?: DWorkflowWithSteps;
   index: number;
};

const TestWrapper = ({ workflow, index }: WrapperProps) => {
   const form = useForm<DWorkflowUpdate>({
      defaultValues: initWorkflow(workflow),
      mode: "all",
   });

   const steps = form.getValues().steps;

   return (
      <FormProvider {...form}>
         <StepForm index={index} steps={steps} control={form.control} />
      </FormProvider>
   );
};

const assertRendered = (index: number) => {
   const form = screen.getByTestId("step-form");
   const title = screen.getByTestId(`steps.${index}.title`);
   const type = screen.getByTestId(`steps.${index}.type`);
   const isStart = screen.getByTestId(`steps.${index}.isStart`);
   const hint = screen.getByTestId(`steps.${index}.hint`);
   const addEdgeBtn = screen.getByTestId("add-edge-btn");

   assertInDocument(form);
   assertInDocument(title);
   assertInDocument(type);
   assertInDocument(isStart);
   assertInDocument(hint);
   assertInDocument(addEdgeBtn);
};

describe("StepForm rendering tests", () => {
   it("rendered - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const { container } = render(
         <TestWrapper workflow={workflow} index={1} />
      );

      await waitFor(() => {
         assertRendered(1);
      });

      expect(container).toMatchSnapshot();
   });
});
