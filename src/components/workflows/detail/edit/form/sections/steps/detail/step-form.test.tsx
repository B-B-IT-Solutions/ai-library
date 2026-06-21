jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { getPromptPreviewsPage } from "@/data/actions/prompt";
import {
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { initWorkflow } from "../../../utils";

import { StepForm } from "./step-form";

const getPromptPreviewsPageMock = getPromptPreviewsPage as jest.MockedFunction<
   typeof getPromptPreviewsPage
>;

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

const assertPromptRefRendered = (index: number) => {
   const promptId = screen.getByTestId(`steps.${index}.promptId`);
   const content = screen.queryByTestId(`steps.${index}.content`);

   assertInDocument(promptId);
   assertNotInDocument(content);
};

const assertStandaloneRendered = (index: number) => {
   const content = screen.getByTestId(`steps.${index}.content`);
   const promptId = screen.queryByTestId(`steps.${index}.promptId`);

   assertInDocument(content);
   assertNotInDocument(promptId);
};

const assertEdgeRendered = (stepIdx: number, edgeIdx: number) => {
   const label = screen.getByTestId(`steps.${stepIdx}.edges.${edgeIdx}.label`);
   const toStepEdgeId = screen.getByTestId(
      `steps.${stepIdx}.edges.${edgeIdx}.toStepEdgeId`
   );

   assertInDocument(label);
   assertInDocument(toStepEdgeId);
};

const assertEdgeNotRendered = (stepIdx: number, edgeIdx: number) => {
   const label = screen.queryByTestId(
      `steps.${stepIdx}.edges.${edgeIdx}.label`
   );
   const toStepEdgeId = screen.queryByTestId(
      `steps.${stepIdx}.edges.${edgeIdx}.toStepEdgeId`
   );

   assertNotInDocument(label);
   assertNotInDocument(toStepEdgeId);
};

describe("StepForm rendering tests", () => {
   it("type PROMPT_REF - test", async () => {
      const prompts = dtestData.dPromptPreviewsPage();
      getPromptPreviewsPageMock.mockResolvedValue(prompts);

      const workflow = dtestData.dWorkflowWithSteps();
      workflow.steps[1].type = "PROMPT_REF";
      workflow.steps[1].outgoingEdges = [];

      const { container } = renderWithReactQuery(
         <TestWrapper workflow={workflow} index={1} />
      );

      await waitFor(() => {
         assertRendered(1);
         assertPromptRefRendered(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("type STANDALONE - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      workflow.steps[1].type = "STANDALONE";

      const { container } = renderWithReactQuery(
         <TestWrapper workflow={workflow} index={1} />
      );

      await waitFor(() => {
         assertRendered(1);
         assertStandaloneRendered(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("StepForm functionality tests", () => {
   it("type switch - test", async () => {
      const index = 1;
      const prompts = dtestData.dPromptPreviewsPage();
      getPromptPreviewsPageMock.mockResolvedValue(prompts);

      const workflow = dtestData.dWorkflowWithSteps();
      workflow.steps[index].type = "PROMPT_REF";

      renderWithReactQuery(<TestWrapper workflow={workflow} index={index} />);

      await waitFor(() => {
         assertRendered(1);
         assertPromptRefRendered(1);
      });

      const type = screen.getByTestId(`steps.${index}.type-trigger`);
      await userEvent.click(type);

      await waitFor(() => {
         const option = screen.getByText("Eigenständig");
         assertInDocument(option);
      });

      const option = screen.getByText("Eigenständig");
      await userEvent.click(option);

      await waitFor(() => {
         assertStandaloneRendered(1);
      });
   });

   it("adds edge btn clicked -test ", async () => {
      const index = 0;
      const workflow = dtestData.dWorkflowWithSteps();
      workflow.steps[0].outgoingEdges = [];

      renderWithReactQuery(<TestWrapper workflow={workflow} index={index} />);

      await waitFor(() => {
         assertRendered(index);
      });

      const btn = screen.getByTestId("add-edge-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertEdgeRendered(index, 0);
      });
   });

   it("removes edge btn clicked - test", async () => {
      const index = 0;
      const workflow = dtestData.dWorkflowWithSteps();

      renderWithReactQuery(<TestWrapper workflow={workflow} index={index} />);

      await waitFor(() => {
         assertRendered(index);
         assertEdgeRendered(index, 0);
         assertEdgeRendered(index, 1);
      });

      const btn = screen.getAllByTestId("remove-edge-btn");
      await userEvent.click(btn[1]);

      await waitFor(() => {
         assertEdgeRendered(index, 0);
         assertEdgeNotRendered(index, 1);
      });
   });
});
