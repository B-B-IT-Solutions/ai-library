jest.mock("@/data/actions/prompt");
jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublicCollectionByToken } from "@/data/actions/collection";
import { getPublicPrompt, getPublicPromptContent } from "@/data/actions/prompt";

import {
   generateMetadata,
   PageParams,
   PageProps,
   PageSearchParams,
   PublicPromptPage,
} from "./page";

const getPublicPromptMock = getPublicPrompt as jest.MockedFunction<
   typeof getPublicPrompt
>;

const getPublicPromptContentMock =
   getPublicPromptContent as jest.MockedFunction<typeof getPublicPromptContent>;

const getPublicCollectionByTokenMock =
   getPublicCollectionByToken as jest.MockedFunction<
      typeof getPublicCollectionByToken
   >;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const assertRendered = () => {
   const page = screen.getByTestId("prompt-page-public");
   const view = screen.getByTestId("public-prompt-view");

   assertInDocument(page);
   assertInDocument(view);
};

describe("PublicTemplatePage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt null - test", async () => {
      getPublicPromptContentMock.mockResolvedValue(null);

      const params: PageParams = { id: "descriptor-id-1" };
      const searchParams: PageSearchParams = {};

      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(PublicPromptPage, props);

      await waitFor(() => {
         expect(getPublicPromptContentMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptContentMock).toHaveBeenCalledWith(params.id);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptMock).not.toHaveBeenCalled();
         expect(getPublicCollectionByTokenMock).not.toHaveBeenCalled();
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt retrieved - collectionId undefined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      getPublicPromptContentMock.mockResolvedValue(prompt);

      getPublicCollectionByTokenMock.mockResolvedValue(null);

      const params: PageParams = { id: "descriptor-id-1" };
      const searchParams: PageSearchParams = { col: "collection-token-1" };

      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(PublicPromptPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getPublicPromptContentMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptContentMock).toHaveBeenCalledWith(params.id);
         expect(getPublicPromptMock).not.toHaveBeenCalled();
         expect(getPublicCollectionByTokenMock).toHaveBeenCalledTimes(1);
         expect(getPublicCollectionByTokenMock).toHaveBeenCalledWith(
            searchParams.col
         );
         expect(notFoundMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt retrieved - collectionId defined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      getPublicPromptContentMock.mockResolvedValue(prompt);

      const collection = dtestData.dCollection();
      getPublicCollectionByTokenMock.mockResolvedValue(collection);

      const params: PageParams = { id: "descriptor-id-1" };
      const searchParams: PageSearchParams = { col: "collection-token-1" };

      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(PublicPromptPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getPublicPromptContentMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptContentMock).toHaveBeenCalledWith(params.id);
         expect(getPublicPromptMock).not.toHaveBeenCalled();
         expect(getPublicCollectionByTokenMock).toHaveBeenCalledTimes(1);
         expect(getPublicCollectionByTokenMock).toHaveBeenCalledWith(
            searchParams.col
         );
         expect(notFoundMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PublicTemplatePage functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("generateMetadata- prompt null - test", async () => {
      getPublicPromptMock.mockResolvedValue(null);

      const pageParams: PageParams = { id: "descriptor-id-1" };
      const searchParams: PageSearchParams = { col: "collection-token-1" };

      const props: PageProps = {
         params: Promise.resolve(pageParams),
         searchParams: Promise.resolve(searchParams),
      };

      const metadata = await generateMetadata(props);
      const expectedMetadata: Metadata = {
         title: "Prompt nicht gefunden",
      };

      expect(metadata).toEqual(expectedMetadata);
      expect(getPublicPromptMock).toHaveBeenCalledTimes(1);
      expect(getPublicPromptMock).toHaveBeenCalledWith(pageParams.id);
      expect(getPublicPromptContent).not.toHaveBeenCalled();
   });

   it("generateMetadata- prompt retrieved - test", async () => {
      const descriptor = dtestData.dPrompt();
      getPublicPromptMock.mockResolvedValue(descriptor);

      const pageParams: PageParams = {
         id: "descriptor-id-1",
      };
      const searchParams: PageSearchParams = { col: "collection-token-1" };

      const props: PageProps = {
         params: Promise.resolve(pageParams),
         searchParams: Promise.resolve(searchParams),
      };

      const metadata = await generateMetadata(props);
      const expectedMetadata: Metadata = {
         title: descriptor.title,
         description: descriptor.description,
      };

      expect(metadata).toEqual(expectedMetadata);
      expect(getPublicPromptMock).toHaveBeenCalledTimes(1);
      expect(getPublicPromptMock).toHaveBeenCalledWith(pageParams.id);
      expect(getPublicPromptContent).not.toHaveBeenCalled();
   });
});
