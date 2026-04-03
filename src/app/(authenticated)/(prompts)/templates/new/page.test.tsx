jest.mock("@/data/actions/settings");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { getGlobalTemplateFields } from "@/data/actions/settings";

import { metadata, NewTemplatePage } from "./page";

const getGlobalTemplateFieldsMock =
   getGlobalTemplateFields as jest.MockedFunction<
      typeof getGlobalTemplateFields
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
   it("rendered test", async () => {
      const templateFields = dtestData.dGlobalTemplateFields();
      getGlobalTemplateFieldsMock.mockResolvedValue(templateFields);

      const { container } = await renderAsyncRSC(NewTemplatePage, {});

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
