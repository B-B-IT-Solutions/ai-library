jest.mock("@/data/actions/template");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
   getPublicPromptTemplate,
   getPublicTemplateDescriptor,
} from "@/data/actions/template";

import {
   generateMetadata,
   PageParams,
   PageProps,
   PublicTemplatePage,
} from "./page";

const getPublicTemplateDescriptorMock =
   getPublicTemplateDescriptor as jest.MockedFunction<
      typeof getPublicTemplateDescriptor
   >;

const getPublicPromptTemplateMock =
   getPublicPromptTemplate as jest.MockedFunction<
      typeof getPublicPromptTemplate
   >;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const assertRendered = () => {
   const page = screen.getByTestId("public-template-view-page");
   const view = screen.getByTestId("public-template-view");

   assertInDocument(page);
   assertInDocument(view);
};

describe("PublicTemplatePage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("descriptor null - test", async () => {
      getPublicTemplateDescriptorMock.mockResolvedValue(null);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(PublicTemplatePage, props);

      await waitFor(() => {
         expect(getPublicTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(getPublicTemplateDescriptorMock).toHaveBeenCalledWith(
            params.id
         );
         expect(notFoundMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptTemplateMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptor retrieved - template null - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      getPublicTemplateDescriptorMock.mockResolvedValue(descriptor);

      getPublicPromptTemplateMock.mockResolvedValue(null);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(PublicTemplatePage, props);

      await waitFor(() => {
         expect(getPublicTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(getPublicTemplateDescriptorMock).toHaveBeenCalledWith(
            params.id
         );
         expect(getPublicPromptTemplateMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptTemplateMock).toHaveBeenCalledWith(
            descriptor.promptTemplateId
         );
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptor retrieved - template retrieved - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      getPublicTemplateDescriptorMock.mockResolvedValue(descriptor);

      const template = dtestData.dPromptTemplate();
      getPublicPromptTemplateMock.mockResolvedValue(template);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(PublicTemplatePage, props);

      await waitFor(() => {
         assertRendered();
         expect(getPublicTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(getPublicTemplateDescriptorMock).toHaveBeenCalledWith(
            params.id
         );
         expect(getPublicPromptTemplateMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptTemplateMock).toHaveBeenCalledWith(
            descriptor.promptTemplateId
         );
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PublicTemplatePage functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("generateMetadata- collection null - test", async () => {
      getPublicTemplateDescriptorMock.mockResolvedValue(null);

      const pageParams: PageParams = {
         id: "descriptor-id-1",
      };
      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const metadata = await generateMetadata(props);
      const expectedMetadata: Metadata = {
         title: "Vorlage nicht gefunden",
      };

      expect(metadata).toEqual(expectedMetadata);
      expect(getPublicTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(getPublicTemplateDescriptorMock).toHaveBeenCalledWith(
         pageParams.id
      );
   });

   it("generateMetadata- descriptor defined - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      getPublicTemplateDescriptorMock.mockResolvedValue(descriptor);

      const pageParams: PageParams = {
         id: "descriptor-id-1",
      };
      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const metadata = await generateMetadata(props);
      const expectedMetadata: Metadata = {
         title: descriptor.title,
         description: descriptor.description,
      };

      expect(metadata).toEqual(expectedMetadata);
      expect(getPublicTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(getPublicTemplateDescriptorMock).toHaveBeenCalledWith(
         pageParams.id
      );
   });
});
