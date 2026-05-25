jest.mock("@/data/actions/settings");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { getGlobalPromptFields } from "@/data/actions/settings";

import { metadata, NewPromptPage, PageProps, PageSearchParams } from "./page";

const getGlobalPromptFieldsMock = getGlobalPromptFields as jest.MockedFunction<
   typeof getGlobalPromptFields
>;

const expectedMetadata: Metadata = {
   title: "Neuer Prompt",
};

const assertRendered = () => {
   const page = screen.getByTestId("new-prompt-page");
   const entryEdit = screen.getByTestId("prompt-edit");

   assertInDocument(page);
   assertInDocument(entryEdit);
};

describe("NewPromptPage rendering tests", () => {
   it("collectionId undefined - test", async () => {
      const templateFields = dtestData.dGlobalPromptFields();
      getGlobalPromptFieldsMock.mockResolvedValue(templateFields);

      const searchParams: PageSearchParams = {};

      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(NewPromptPage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("collectionId defined - test", async () => {
      const templateFields = dtestData.dGlobalPromptFields();
      getGlobalPromptFieldsMock.mockResolvedValue(templateFields);

      const searchParams: PageSearchParams = {
         collectionId: "collection-id-1",
      };

      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(NewPromptPage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("NewPromptPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
