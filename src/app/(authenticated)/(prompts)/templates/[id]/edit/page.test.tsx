jest.mock("@/data/actions/prompt");
jest.mock("@/data/actions/settings");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPrompt, getPromptTemplate } from "@/data/actions/prompt";
import { getGlobalPromptFields } from "@/data/actions/settings";

import { EditTemplatePage, metadata, PageParams, PageProps } from "./page";

const getPromptMock = getPrompt as jest.MockedFunction<typeof getPrompt>;

const getPromptTemplateMock = getPromptTemplate as jest.MockedFunction<
   typeof getPromptTemplate
>;

const getGlobalPromptFieldsMock = getGlobalPromptFields as jest.MockedFunction<
   typeof getGlobalPromptFields
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

   it("descriptor null - test", async () => {
      getPromptMock.mockResolvedValue(null);
      getGlobalPromptFieldsMock.mockResolvedValue([]);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(EditTemplatePage, props);

      await waitFor(() => {
         expect(getPromptMock).toHaveBeenCalledTimes(1);
         expect(getPromptMock).toHaveBeenCalledWith(params.id);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
         expect(getPromptTemplateMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptor retrieved - template null - test", async () => {
      const descriptor = dtestData.dPrompt();
      getPromptMock.mockResolvedValue(descriptor);

      getPromptTemplateMock.mockResolvedValue(null);

      const templateFields = dtestData.dGlobalPromptFields();
      getGlobalPromptFieldsMock.mockResolvedValue(templateFields);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(EditTemplatePage, props);

      await waitFor(() => {
         expect(getPromptMock).toHaveBeenCalledTimes(1);
         expect(getPromptMock).toHaveBeenCalledWith(params.id);
         expect(getPromptTemplateMock).toHaveBeenCalledTimes(1);
         expect(getPromptTemplateMock).toHaveBeenCalledWith(descriptor.id);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptor retrieved - template retrieved - test", async () => {
      const descriptor = dtestData.dPrompt();
      getPromptMock.mockResolvedValue(descriptor);

      const template = dtestData.dPromptWithContent();
      getPromptTemplateMock.mockResolvedValue(template);

      const templateFields = dtestData.dGlobalPromptFields();
      getGlobalPromptFieldsMock.mockResolvedValue(templateFields);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(EditTemplatePage, props);

      await waitFor(() => {
         assertRendered();
         expect(getPromptMock).toHaveBeenCalledTimes(1);
         expect(getPromptMock).toHaveBeenCalledWith(params.id);
         expect(getPromptTemplateMock).toHaveBeenCalledTimes(1);
         expect(getPromptTemplateMock).toHaveBeenCalledWith(descriptor.id);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditTemplatePage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
