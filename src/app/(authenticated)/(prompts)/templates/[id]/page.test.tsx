jest.mock("@/data/actions/prompt-template");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTemplateDescriptor } from "@/data/actions/prompt-template";

import { metadata, PageParams, PageProps, TemplatePage } from "./page";

const getTemplateDescriptorMock = getTemplateDescriptor as jest.MockedFunction<
   typeof getTemplateDescriptor
>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Vorlage",
};

const assertRendered = () => {
   const page = screen.getByTestId("template-view-page");
   const viewEntry = screen.getByTestId("library-entry-view");

   assertInDocument(page);
   assertInDocument(viewEntry);
};

describe("TemplatePage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("templateDescriptor null - test", async () => {
      getTemplateDescriptorMock.mockResolvedValue(null);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(TemplatePage, props);

      await waitFor(() => {
         expect(getTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("templateDescriptor defined - test", async () => {
      const libraryEntry = dtestData.dPromptTemplateDescriptorWithTemplate();
      getTemplateDescriptorMock.mockResolvedValue(libraryEntry);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(TemplatePage, props);

      await waitFor(() => {
         assertRendered();
         expect(getTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplatePage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
