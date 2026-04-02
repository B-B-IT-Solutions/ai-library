jest.mock("@/data/actions/library");
jest.mock("@/data/actions/settings");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getLibraryEntry } from "@/data/actions/library";
import { getGlobalTemplateFields } from "@/data/actions/settings";

import { EditLibraryEntryPage, metadata, PageParams, PageProps } from "./page";

const getLibraryEntryMock = getLibraryEntry as jest.MockedFunction<
   typeof getLibraryEntry
>;

const getGlobalTemplateFieldsMock =
   getGlobalTemplateFields as jest.MockedFunction<
      typeof getGlobalTemplateFields
   >;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Vorlage Bearbeiten",
};

const assertRendered = () => {
   const page = screen.getByTestId("library-entry-edit-page");
   const editEntry = screen.getByTestId("library-entry-edit");

   assertInDocument(page);
   assertInDocument(editEntry);
};

describe("EditLibraryEntryPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("EditLibraryEntryPage - library entry null - test", async () => {
      getLibraryEntryMock.mockResolvedValue(null);
      getGlobalTemplateFieldsMock.mockResolvedValue([]);

      const params: PageParams = { id: "entry-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(EditLibraryEntryPage, props);

      await waitFor(() => {
         expect(getLibraryEntryMock).toHaveBeenCalledTimes(1);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("EditLibraryEntryPage - library entry defined - test", async () => {
      const libraryEntry = dtestData.dPromptTemplateDescriptorWithTemplate();
      getLibraryEntryMock.mockResolvedValue(libraryEntry);

      const templateFields = dtestData.dGlobalTemplateFields();
      getGlobalTemplateFieldsMock.mockResolvedValue(templateFields);

      const params: PageParams = { id: "entry-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(EditLibraryEntryPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getLibraryEntryMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditLibraryEntryPage functionality tests", () => {
   it("EditLibraryEntryPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
