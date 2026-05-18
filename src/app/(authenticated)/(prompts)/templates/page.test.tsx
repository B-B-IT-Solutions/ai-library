jest.mock("@/components/prompts", () => ({
   PromptsDashboard: () => {
      return <div data-testid="prompts-dashboard" />;
   },
   templatesSearchParamsCache: {
      parse: jest.fn(),
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { templatesSearchParamsCache } from "@/components/prompts";

import { metadata, PageProps, TemplatesPage } from "./page";

const templatesSearchParamsCacheParseMock =
   templatesSearchParamsCache.parse as jest.MockedFunction<
      typeof templatesSearchParamsCache.parse
   >;

const expectedMetadata: Metadata = {
   title: "Meine Vorlagen",
};

const assertRendered = () => {
   const page = screen.getByTestId("templates-page");
   const dashboard = screen.getByTestId("prompts-dashboard");

   assertInDocument(page);
   assertInDocument(dashboard);
};

describe("TemplatesPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("page rendered - test", async () => {
      const params = { view: "grid" };

      const props: PageProps = {
         searchParams: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(TemplatesPage, props);

      await waitFor(() => {
         assertRendered();
         expect(templatesSearchParamsCacheParseMock).toHaveBeenCalledTimes(1);
         expect(templatesSearchParamsCacheParseMock).toHaveBeenCalledWith(
            props.searchParams
         );
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplatesPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
