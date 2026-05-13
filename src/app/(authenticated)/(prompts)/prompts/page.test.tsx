jest.mock("@/components/prompt0s", () => ({
   PromptsDashboard: () => {
      return <div data-testid="prompts-dashboard" />;
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { metadata, PageProps, PromptsPage } from "./page";

const expectedMetadata: Metadata = {
   title: "Prompts",
};

const assertRendered = () => {
   const page = screen.getByTestId("prompts-page");
   const dashboard = screen.getByTestId("prompts-dashboard");

   assertInDocument(page);
   assertInDocument(dashboard);
};

describe("PromptsPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptsPage - library page rendered - test", async () => {
      const params = { view: "grid" };

      const props: PageProps = {
         searchParams: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(PromptsPage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptsPage functionality tests", () => {
   it("PromptsPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
