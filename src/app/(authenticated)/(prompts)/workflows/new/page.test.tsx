jest.mock("@/data/actions/workflow");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { getWorkflowsUsage } from "@/data/actions/workflow";

import { metadata, NewWorkflowPage } from "./page";

const getWorkflowsUsageMock = getWorkflowsUsage as jest.MockedFunction<
   typeof getWorkflowsUsage
>;

const expectedMetadata: Metadata = {
   title: "Neuer Workflow",
};

const assertRendered = () => {
   const page = screen.getByTestId("new-workflow-page");
   const edit = screen.getByTestId("workflow-edit");

   assertInDocument(page);
   assertInDocument(edit);
};

describe("NewWorkflowPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("rendered - test", async () => {
      const usage = dtestData.dWorkflowsUsage();
      getWorkflowsUsageMock.mockResolvedValue(usage);

      const { container } = await renderAsyncRSC(NewWorkflowPage, {});

      await waitFor(() => {
         assertRendered();
         expect(getWorkflowsUsageMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("NewWorkflowPage functionality tests", () => {
   it("metadata - test", () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
