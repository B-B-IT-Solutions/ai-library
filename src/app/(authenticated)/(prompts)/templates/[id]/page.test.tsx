jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPrompt, getPromptTemplate } from "@/data/actions/prompt";

import { generateMetadata, PageParams, PageProps, PromptPage } from "./page";

const getPromptMock = getPrompt as jest.MockedFunction<typeof getPrompt>;

const getPromptTemplateMock = getPromptTemplate as jest.MockedFunction<
   typeof getPromptTemplate
>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const assertRendered = () => {
   const page = screen.getByTestId("template-view-page");
   const viewEntry = screen.getByTestId("template-view");

   assertInDocument(page);
   assertInDocument(viewEntry);
};

describe("PromptPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt null - test", async () => {
      getPromptMock.mockResolvedValue(null);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(PromptPage, props);

      await waitFor(() => {
         expect(getPromptMock).toHaveBeenCalledTimes(1);
         expect(getPromptMock).toHaveBeenCalledWith(params.id);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
         expect(getPromptTemplateMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt retrieved - template null - test", async () => {
      const prompt = dtestData.dPrompt();
      getPromptMock.mockResolvedValue(prompt);

      getPromptTemplateMock.mockResolvedValue(null);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(PromptPage, props);

      await waitFor(() => {
         expect(getPromptMock).toHaveBeenCalledTimes(1);
         expect(getPromptMock).toHaveBeenCalledWith(params.id);
         expect(getPromptTemplateMock).toHaveBeenCalledTimes(1);
         expect(getPromptTemplateMock).toHaveBeenCalledWith(prompt.id);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt retrieved - template retrieved - test", async () => {
      const prompt = dtestData.dPrompt();
      getPromptMock.mockResolvedValue(prompt);

      const template = dtestData.dPromptWithContent();
      getPromptTemplateMock.mockResolvedValue(template);

      const params: PageParams = { id: "descriptor-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(PromptPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getPromptMock).toHaveBeenCalledTimes(1);
         expect(getPromptMock).toHaveBeenCalledWith(params.id);
         expect(getPromptTemplateMock).toHaveBeenCalledTimes(1);
         expect(getPromptTemplateMock).toHaveBeenCalledWith(prompt.id);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptPage functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("generateMetadata - prompt null - test", async () => {
      getPromptMock.mockResolvedValue(null);

      const pageParams: PageParams = {
         id: "prompt-id-1",
      };
      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const metadata = await generateMetadata(props);
      const expectedMetadata: Metadata = {
         title: "Prompt",
      };

      expect(metadata).toEqual(expectedMetadata);
      expect(getPromptMock).toHaveBeenCalledTimes(1);
      expect(getPromptMock).toHaveBeenCalledWith(pageParams.id);
   });

   it("generateMetadata - prompt defined - test", async () => {
      const prompt = dtestData.dPrompt();
      getPromptMock.mockResolvedValue(prompt);

      const pageParams: PageParams = {
         id: "prompt-id-1",
      };
      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const metadata = await generateMetadata(props);
      const expectedMetadata: Metadata = {
         title: prompt.title,
      };

      expect(metadata).toEqual(expectedMetadata);
      expect(getPromptMock).toHaveBeenCalledTimes(1);
      expect(getPromptMock).toHaveBeenCalledWith(pageParams.id);
   });
});
