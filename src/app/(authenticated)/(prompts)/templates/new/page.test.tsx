jest.mock("@/data/actions/settings");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { getGlobalPromptFields } from "@/data/actions/settings";

import { metadata, NewTemplatePage, PageProps } from "./page";

const getGlobalPromptFieldsMock =
   getGlobalPromptFields as jest.MockedFunction<
      typeof getGlobalPromptFields
   >;

const expectedMetadata: Metadata = {
   title: "Neue Vorlage",
};

const assertRendered = () => {
   const page = screen.getByTestId("new-template-page");
   const entryEdit = screen.getByTestId("template-edit");

   assertInDocument(page);
   assertInDocument(entryEdit);
};

describe("NewTemplatePage rendering tests", () => {
   it("no collectionId - rendered test", async () => {
      const templateFields = dtestData.dGlobalPromptFields();
      getGlobalPromptFieldsMock.mockResolvedValue(templateFields);

      const props: PageProps = {
         searchParams: Promise.resolve({}),
      };

      const { container } = await renderAsyncRSC(NewTemplatePage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("collectionId provided - rendered test", async () => {
      const templateFields = dtestData.dGlobalPromptFields();
      getGlobalPromptFieldsMock.mockResolvedValue(templateFields);

      const props: PageProps = {
         searchParams: Promise.resolve({ collectionId: "test-collection-id" }),
      };

      const { container } = await renderAsyncRSC(NewTemplatePage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("NewLibraryEntryPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
