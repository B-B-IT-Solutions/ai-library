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
   PublicTemplatePage,
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
      getPublicPromptMock.mockResolvedValue(null);

      const params: PageParams = { id: "descriptor-id-1" };
      const searchParams: PageSearchParams = {};

      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(PublicTemplatePage, props);

      await waitFor(() => {
         expect(getPublicPromptMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptMock).toHaveBeenCalledWith(params.id);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptContentMock).not.toHaveBeenCalled();
         expect(getPublicCollectionByTokenMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptor retrieved - template null - test", async () => {
      const descriptor = dtestData.dPrompt();
      getPublicPromptMock.mockResolvedValue(descriptor);

      getPublicPromptContentMock.mockResolvedValue(null);

      const params: PageParams = { id: "descriptor-id-1" };
      const searchParams: PageSearchParams = {};

      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(PublicTemplatePage, props);

      await waitFor(() => {
         expect(getPublicPromptMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptMock).toHaveBeenCalledWith(params.id);
         expect(getPublicPromptContentMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptContentMock).toHaveBeenCalledWith(descriptor.id);
         expect(getPublicCollectionByTokenMock).not.toHaveBeenCalled();
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptor retrieved - template retrieved - test", async () => {
      const descriptor = dtestData.dPrompt();
      getPublicPromptMock.mockResolvedValue(descriptor);

      const template = dtestData.dPromptWithContent();
      getPublicPromptContentMock.mockResolvedValue(template);

      const collection = dtestData.dCollection();
      getPublicCollectionByTokenMock.mockResolvedValue(collection);

      const params: PageParams = { id: "descriptor-id-1" };
      const searchParams: PageSearchParams = { col: "collection-token-1" };

      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(PublicTemplatePage, props);

      await waitFor(() => {
         assertRendered();
         expect(getPublicPromptMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptMock).toHaveBeenCalledWith(params.id);
         expect(getPublicPromptContentMock).toHaveBeenCalledTimes(1);
         expect(getPublicPromptContentMock).toHaveBeenCalledWith(descriptor.id);
         expect(getPublicCollectionByTokenMock).toHaveBeenCalledTimes(1);
         expect(getPublicCollectionByTokenMock).toHaveBeenCalledWith(
            searchParams.col
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
      getPublicPromptMock.mockResolvedValue(null);

      const pageParams: PageParams = { id: "descriptor-id-1" };
      const searchParams: PageSearchParams = { col: "collection-token-1" };

      const props: PageProps = {
         params: Promise.resolve(pageParams),
         searchParams: Promise.resolve(searchParams),
      };

      const metadata = await generateMetadata(props);
      const expectedMetadata: Metadata = {
         title: "Vorlage nicht gefunden",
      };

      expect(metadata).toEqual(expectedMetadata);
      expect(getPublicPromptMock).toHaveBeenCalledTimes(1);
      expect(getPublicPromptMock).toHaveBeenCalledWith(pageParams.id);
   });

   it("generateMetadata- descriptor defined - test", async () => {
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
   });
});
