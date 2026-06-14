jest.mock("@/components/workflows", () => ({
   WorkflowsDashboard: () => {
      return <div data-testid="workflows-dashboard" />;
   },
   workflowsSearchParamsCache: {
      parse: jest.fn(),
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { workflowsSearchParamsCache } from "@/components/workflows";

import { metadata, PageProps, WorkflowsPage } from "./page";

const workflowsSearchParamsCacheParseMock =
   workflowsSearchParamsCache.parse as jest.MockedFunction<
      typeof workflowsSearchParamsCache.parse
   >;

const expectedMetadata: Metadata = {
   title: "Meine Workflows",
};

const assertRendered = () => {
   const page = screen.getByTestId("workflows-page");
   const dashboard = screen.getByTestId("workflows-dashboard");

   assertInDocument(page);
   assertInDocument(dashboard);
};

describe("WorkflowsPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("page rendered - test", async () => {
      const params = { view: "grid" };

      const props: PageProps = {
         searchParams: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(WorkflowsPage, props);

      await waitFor(() => {
         assertRendered();
         expect(workflowsSearchParamsCacheParseMock).toHaveBeenCalledTimes(1);
         expect(workflowsSearchParamsCacheParseMock).toHaveBeenCalledWith(
            props.searchParams
         );
      });

      expect(container).toMatchSnapshot();
   });
});

describe("WorkflowsPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
