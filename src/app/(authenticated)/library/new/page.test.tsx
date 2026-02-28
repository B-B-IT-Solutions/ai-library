jest.mock("@/data/actions/settings");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { getGlobalTemplateFields } from "@/data/actions/settings";

import { metadata, NewLibraryEntryPage } from "./page";

const getGlobalTemplateFieldsMock =
   getGlobalTemplateFields as jest.MockedFunction<
      typeof getGlobalTemplateFields
   >;

const expectedMetadata: Metadata = {
   title: "Neue Vorlage erstellen",
};

const assertRendered = () => {
   const page = screen.getByTestId("new-library-entry-page");
   const entryEdit = screen.getByTestId("library-entry-edit");

   assertInDocument(page);
   assertInDocument(entryEdit);
};

describe("NewLibraryEntryPage rendering tests", () => {
   it("NewLibraryEntryPage rendered test", async () => {
      const templateFields = dtestData.dGlobalTemplateFields();
      getGlobalTemplateFieldsMock.mockResolvedValue(templateFields);

      const { container } = await renderAsyncRSC(NewLibraryEntryPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("NewLibraryEntryPage functionality tests", () => {
   it("NewLibraryEntryPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
