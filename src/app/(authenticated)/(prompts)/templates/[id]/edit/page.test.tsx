jest.mock("@/data/actions/prompt-template");
jest.mock("@/data/actions/settings");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTemplateDescriptor } from "@/data/actions/prompt-template";
import { getGlobalTemplateFields } from "@/data/actions/settings";

import { EditTemplatePage, metadata, PageParams, PageProps } from "./page";

const getTemplateDescriptorMock = getTemplateDescriptor as jest.MockedFunction<
   typeof getTemplateDescriptor
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
   const page = screen.getByTestId("template-edit-page");
   const editEntry = screen.getByTestId("template-edit");

   assertInDocument(page);
   assertInDocument(editEntry);
};

describe("EditTemplatePage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("templateDescriptor null - test", async () => {
      getTemplateDescriptorMock.mockResolvedValue(null);
      getGlobalTemplateFieldsMock.mockResolvedValue([]);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(EditTemplatePage, props);

      await waitFor(() => {
         expect(getTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("templateDescriptor defined - test", async () => {
      const libraryEntry = dtestData.dPromptTemplateDescriptorWithTemplate();
      getTemplateDescriptorMock.mockResolvedValue(libraryEntry);

      const templateFields = dtestData.dGlobalTemplateFields();
      getGlobalTemplateFieldsMock.mockResolvedValue(templateFields);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(EditTemplatePage, props);

      await waitFor(() => {
         assertRendered();
         expect(getTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditLibraryEntryPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
