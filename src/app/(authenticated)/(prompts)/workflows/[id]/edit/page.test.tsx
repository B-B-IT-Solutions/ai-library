jest.mock("@/data/actions/workflow");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
   getWorkflowsUsage,
   getWorkflowWithSteps,
} from "@/data/actions/workflow";

import { EditWorkflowPage, metadata, PageParams, PageProps } from "./page";

const getWorkflowWithStepsMock = getWorkflowWithSteps as jest.MockedFunction<
   typeof getWorkflowWithSteps
>;
const getWorkflowsUsageMock = getWorkflowsUsage as jest.MockedFunction<
   typeof getWorkflowsUsage
>;
const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Workflow bearbeiten",
};

const assertRendered = () => {
   assertInDocument(screen.getByTestId("edit-workflow-page"));
   assertInDocument(screen.getByTestId("workflow-edit"));
};

describe("EditWorkflowPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("workflow null - test", async () => {
      getWorkflowWithStepsMock.mockResolvedValue(null);

      const usage = dtestData.dWorkflowsUsage();
      getWorkflowsUsageMock.mockResolvedValue(usage);

      const params: PageParams = { id: "workflow-1" };

      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(EditWorkflowPage, props);

      await waitFor(() => {
         expect(getWorkflowWithStepsMock).toHaveBeenCalledTimes(1);
         expect(getWorkflowWithStepsMock).toHaveBeenCalledWith(params.id);
         expect(getWorkflowsUsageMock).toHaveBeenCalledTimes(1);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("workflow retrieved - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      getWorkflowWithStepsMock.mockResolvedValue(workflow);

      const usage = dtestData.dWorkflowsUsage();
      getWorkflowsUsageMock.mockResolvedValue(usage);

      const params: PageParams = { id: workflow.id };

      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(EditWorkflowPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getWorkflowWithStepsMock).toHaveBeenCalledTimes(1);
         expect(getWorkflowWithStepsMock).toHaveBeenCalledWith(params.id);
         expect(getWorkflowsUsageMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditWorkflowPage functionality tests", () => {
   it("metadata - test", () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
