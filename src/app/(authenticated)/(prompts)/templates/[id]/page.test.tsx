jest.mock("@/data/actions/template");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
   getPromptTemplate,
   getTemplateDescriptor,
} from "@/data/actions/template";

import { metadata, PageParams, PageProps, TemplatePage } from "./page";

const getTemplateDescriptorMock = getTemplateDescriptor as jest.MockedFunction<
   typeof getTemplateDescriptor
>;

const getPromptTemplateMock = getPromptTemplate as jest.MockedFunction<
   typeof getPromptTemplate
>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Vorlage",
};

const assertRendered = () => {
   const page = screen.getByTestId("template-view-page");
   const viewEntry = screen.getByTestId("template-view");

   assertInDocument(page);
   assertInDocument(viewEntry);
};

describe("TemplatePage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("descriptor null - test", async () => {
      getTemplateDescriptorMock.mockResolvedValue(null);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(TemplatePage, props);

      await waitFor(() => {
         expect(getTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(getTemplateDescriptorMock).toHaveBeenCalledWith(params.id);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
         expect(getPromptTemplateMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptor retrieved - template null - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      getTemplateDescriptorMock.mockResolvedValue(descriptor);

      getPromptTemplateMock.mockResolvedValue(null);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(TemplatePage, props);

      await waitFor(() => {
         expect(getTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(getTemplateDescriptorMock).toHaveBeenCalledWith(params.id);
         expect(getPromptTemplateMock).toHaveBeenCalledTimes(1);
         expect(getPromptTemplateMock).toHaveBeenCalledWith(
            descriptor.promptTemplateId
         );
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptor retrieved - template retrieved - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      getTemplateDescriptorMock.mockResolvedValue(descriptor);

      const template = dtestData.dPromptTemplate();
      getPromptTemplateMock.mockResolvedValue(template);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(TemplatePage, props);

      await waitFor(() => {
         assertRendered();
         expect(getTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(getTemplateDescriptorMock).toHaveBeenCalledWith(params.id);
         expect(getPromptTemplateMock).toHaveBeenCalledTimes(1);
         expect(getPromptTemplateMock).toHaveBeenCalledWith(
            descriptor.promptTemplateId
         );
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplatePage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
