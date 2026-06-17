jest.mock("@/data/actions/workflow");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getWorkflowWithSteps } from "@/data/actions/workflow";

import { metadata, PageParams, PageProps, WorkflowPage } from "./page";

const getWorkflowWithStepsMock = getWorkflowWithSteps as jest.MockedFunction<
   typeof getWorkflowWithSteps
>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Workflow",
};

const assertRendered = () => {
   const page = screen.getByTestId("workflow-page");
   const view = screen.getByTestId("workflow-view");

   assertInDocument(page);
   assertInDocument(view);
};

describe("WorkflowPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("workflow null - test", async () => {
      getWorkflowWithStepsMock.mockResolvedValue(null);

      const params: PageParams = { id: "workflow-1" };

      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(WorkflowPage, props);

      await waitFor(() => {
         expect(getWorkflowWithStepsMock).toHaveBeenCalledTimes(1);
         expect(getWorkflowWithStepsMock).toHaveBeenCalledWith(params.id);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("workflow retrieved - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      getWorkflowWithStepsMock.mockResolvedValue(workflow);

      const params: PageParams = { id: workflow.id };

      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(WorkflowPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getWorkflowWithStepsMock).toHaveBeenCalledTimes(1);
         expect(getWorkflowWithStepsMock).toHaveBeenCalledWith(params.id);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("WorkflowPage functionality tests", () => {
   it("metadata - test", () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
