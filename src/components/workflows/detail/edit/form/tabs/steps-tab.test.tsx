import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, assertNotInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { Tabs } from "@/components/shadcn/tabs";
import { DWorkflowUpdate } from "@/data/types/domain/workflow";
import { initWorkflow } from "../utils";

import { StepsTab } from "./steps-tab";

type WrapperProps = {
   activeTab: string;
   value: string;
};

const TestWrapper = ({ activeTab, value }: WrapperProps) => {
   const form = useForm<DWorkflowUpdate>({
      defaultValues: initWorkflow(),
   });

   return (
      <FormProvider {...form}>
         <Tabs defaultValue={activeTab}>
            <StepsTab control={form.control} value={value} />
         </Tabs>
      </FormProvider>
   );
};

const assertTabRendered = () => {
   const tab = screen.getByTestId("steps-tab");
   const steps = screen.getByTestId("workflow-steps");

   assertInDocument(tab);
   assertInDocument(steps);
};

const assertTabNotRendered = () => {
   const tab = screen.queryByTestId("steps-tab");
   assertNotInDocument(tab);
};

describe("StepsTab rendering tests", () => {
   it("tab active - test", async () => {
      const { container } = render(
         <TestWrapper activeTab="tab-1" value="tab-1" />
      );

      await waitFor(() => {
         assertTabRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("tab not active - test", async () => {
      const { container } = render(
         <TestWrapper activeTab="tab-123" value="tab-7" />
      );

      await waitFor(() => {
         assertTabNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
