jest.mock("@/data/actions/prompt");
jest.mock("@/data/actions/settings");
jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCollectionById } from "@/data/actions/collection";
import { getPromptWithContent } from "@/data/actions/prompt";
import { getGlobalPromptFields } from "@/data/actions/settings";

import {
   EditPromptPage,
   metadata,
   PageParams,
   PageProps,
   PageSearchParams,
} from "./page";

const getPromptWithContentMock = getPromptWithContent as jest.MockedFunction<
   typeof getPromptWithContent
>;

const getGlobalPromptFieldsMock = getGlobalPromptFields as jest.MockedFunction<
   typeof getGlobalPromptFields
>;

const getCollectionByIdMock = getCollectionById as jest.MockedFunction<
   typeof getCollectionById
>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Vorlage Bearbeiten",
};

const assertRendered = () => {
   const page = screen.getByTestId("prompt-edit-page");
   const editEntry = screen.getByTestId("prompt-edit");

   assertInDocument(page);
   assertInDocument(editEntry);
};

describe("EditPromptPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt null - test", async () => {
      getPromptWithContentMock.mockResolvedValue(null);
      getGlobalPromptFieldsMock.mockResolvedValue([]);

      const params: PageParams = { id: "descriptor-id-1" };
      const searchParams: PageSearchParams = {};
      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(EditPromptPage, props);

      await waitFor(() => {
         expect(getPromptWithContentMock).toHaveBeenCalledTimes(1);
         expect(getPromptWithContentMock).toHaveBeenCalledWith(params.id);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt retrieved - collectionId undefined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      getPromptWithContentMock.mockResolvedValue(prompt);

      const templateFields = dtestData.dGlobalPromptFields();
      getGlobalPromptFieldsMock.mockResolvedValue(templateFields);

      const params: PageParams = { id: "descriptor-id-1" };
      const searchParams: PageSearchParams = {};
      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(EditPromptPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getPromptWithContentMock).toHaveBeenCalledTimes(1);
         expect(getPromptWithContentMock).toHaveBeenCalledWith(params.id);
         expect(getCollectionByIdMock).not.toHaveBeenCalled();
         expect(notFoundMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt retrieved - collectionId defined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      getPromptWithContentMock.mockResolvedValue(prompt);

      const templateFields = dtestData.dGlobalPromptFields();
      getGlobalPromptFieldsMock.mockResolvedValue(templateFields);

      const collection = dtestData.dCollection();
      getCollectionByIdMock.mockResolvedValue(collection);

      const params: PageParams = { id: "descriptor-id-1" };
      const searchParams: PageSearchParams = { collectionId: collection.id };
      const props: PageProps = {
         params: Promise.resolve(params),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(EditPromptPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getPromptWithContentMock).toHaveBeenCalledTimes(1);
         expect(getPromptWithContentMock).toHaveBeenCalledWith(params.id);
         expect(getCollectionByIdMock).toHaveBeenCalledTimes(1);
         expect(getCollectionByIdMock).toHaveBeenCalledWith(collection.id);
         expect(notFoundMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditPromptPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
