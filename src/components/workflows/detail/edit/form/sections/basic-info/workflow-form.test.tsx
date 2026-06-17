import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import {
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { initWorkflow } from "../../utils";

import { WorkflowEditForm } from "./workflow-form";

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
         <WorkflowEditForm control={form.control} />
      </FormProvider>
   );
};

const assertRendered = () => {
   const form = screen.getByTestId("workflow-edit-form");
   const title = screen.getByTestId("title");
   const description = screen.getByTestId("description");

   assertInDocument(form);
   assertInDocument(title);
   assertInDocument(description);
};

describe("WorkflowEditForm rendering tests", () => {
   it("new workflow - test", async () => {
      const { container } = render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("existing workfow - rendered - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const { container } = render(<TestWrapper workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
