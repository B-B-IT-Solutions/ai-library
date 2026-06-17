import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import {
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { updateWorkflowSchema } from "@/data/types/validators/workflow";
import { initWorkflow } from "../utils";

import { WorkflowTabs } from "./workflow-tabs";

type TestWrapperProps = {
   workflow?: DWorkflowWithSteps;
};

const TestWrapper = ({ workflow }: TestWrapperProps) => {
   const form = useForm<DWorkflowUpdate>({
      defaultValues: initWorkflow(workflow),
      resolver: zodResolver(updateWorkflowSchema),
      mode: "all",
   });

   form.trigger();

   return (
      <FormProvider {...form}>
         <WorkflowTabs control={form.control} />
      </FormProvider>
   );
};

const assertRendered = () => {
   const tabs = screen.getByTestId("workflow-tabs");
   const basicInfoTrigger = screen.getByTestId("basic-info-tab-trigger");
   const stepsTrigger = screen.getByTestId("steps-tab-trigger");

   assertInDocument(tabs);
   assertInDocument(basicInfoTrigger);
   assertInDocument(stepsTrigger);
};

const assertBasicInfoTabRendered = () => {
   const tab = screen.getByTestId("basic-info-tab");
   assertInDocument(tab);
};

const assertBasicInfoTabNotRendered = () => {
   const tab = screen.queryByTestId("basic-info-tab");
   assertNotInDocument(tab);
};

const assertStepsTabRendered = () => {
   const tab = screen.getByTestId("steps-tab");
   assertInDocument(tab);
};

const assertStepsTabNotRendered = () => {
   const tab = screen.queryByTestId("steps-tab");
   assertNotInDocument(tab);
};

describe("WorkflowTabs rendering tests", () => {
   it("new worfklow - test", async () => {
      const { container } = render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertBasicInfoTabRendered();
         assertStepsTabNotRendered();
      });

      expect(container).toMatchSnapshot();

      const stepsTab = screen.getByTestId("steps-tab-trigger");
      await userEvent.click(stepsTab);

      await waitFor(() => {
         assertStepsTabRendered();
         assertBasicInfoTabNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("existing worfklow - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();

      const { container } = render(<TestWrapper workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
         assertBasicInfoTabRendered();
         assertStepsTabNotRendered();
      });

      expect(container).toMatchSnapshot();

      const stepsTab = screen.getByTestId("steps-tab-trigger");
      await userEvent.click(stepsTab);

      await waitFor(() => {
         assertStepsTabRendered();
         assertBasicInfoTabNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
