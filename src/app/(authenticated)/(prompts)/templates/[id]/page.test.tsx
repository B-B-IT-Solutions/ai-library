jest.mock("@/data/actions/prompt");
jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCollectionById } from "@/data/actions/collection";
import { getPrompt, getPromptWithContent } from "@/data/actions/prompt";

import {
   generateMetadata,
   PageParams,
   PageProps,
   PageSearchParams,
   PromptPage,
} from "./page";

const getPromptMock = getPrompt as jest.MockedFunction<typeof getPrompt>;

const getPromptWithContentMock = getPromptWithContent as jest.MockedFunction<
   typeof getPromptWithContent
>;

const getCollectionByIdMock = getCollectionById as jest.MockedFunction<
   typeof getCollectionById
>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const assertRendered = () => {
   const page = screen.getByTestId("prompt-view-page");
   const view = screen.getByTestId("prompt-view");

   assertInDocument(page);
   assertInDocument(view);
};

describe("PromptPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt null - test", async () => {
      getPromptWithContentMock.mockResolvedValue(null);

      const params: PageParams = { id: "prompt-id-1" };
      const searchParams: PageSearchParams = {};
      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(PromptPage, props);

      await waitFor(() => {
         expect(getPromptWithContentMock).toHaveBeenCalledTimes(1);
         expect(getPromptWithContentMock).toHaveBeenCalledWith(params.id);
         expect(getCollectionByIdMock).not.toHaveBeenCalled();
         expect(notFoundMock).toHaveBeenCalledTimes(1);
         expect(getPromptMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt retrieved - collectionId undefined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      getPromptWithContentMock.mockResolvedValue(prompt);

      const params: PageParams = { id: "prompt-id-1" };
      const searchParams: PageSearchParams = {};
      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(PromptPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getPromptWithContentMock).toHaveBeenCalledTimes(1);
         expect(getPromptWithContentMock).toHaveBeenCalledWith(params.id);
         expect(getCollectionByIdMock).not.toHaveBeenCalled();
         expect(notFoundMock).not.toHaveBeenCalled();
         expect(getPromptMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt retrieved - collectionId defined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      getPromptWithContentMock.mockResolvedValue(prompt);

      const collection = dtestData.dCollection();
      getCollectionByIdMock.mockResolvedValue(collection);

      const params: PageParams = { id: "prompt-id-1" };
      const searchParams: PageSearchParams = { collectionId: collection.id };
      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(PromptPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getPromptWithContentMock).toHaveBeenCalledTimes(1);
         expect(getPromptWithContentMock).toHaveBeenCalledWith(params.id);
         expect(getCollectionByIdMock).toHaveBeenCalledTimes(1);
         expect(getCollectionByIdMock).toHaveBeenCalledWith(collection.id);
         expect(notFoundMock).not.toHaveBeenCalled();
         expect(getPromptMock).not.toHaveBeenCalled();
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
      expect(getPromptWithContentMock).not.toHaveBeenCalled();
   });

   it("generateMetadata - prompt retrieved - test", async () => {
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
      expect(getPromptWithContentMock).not.toHaveBeenCalled();
   });
});
