jest.mock("@/data/actions/collection");
jest.mock("@/data/actions/prompt-template");
jest.mock("@/components/templates");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs/server";

import { templatesSearchParamsCache } from "@/components/templates";
import { getCollectionById } from "@/data/actions/collection";
import {
   getTemplateDescriptorCategories,
   getTemplateDescriptorModels,
   getTemplateDescriptorsPage,
} from "@/data/actions/prompt-template";

import { CollectionPage, metadata, PageParams, PageProps } from "./page";

const getCollectionByIdMock = getCollectionById as jest.MockedFunction<
   typeof getCollectionById
>;

const getTemplateDescriptorsPageMock =
   getTemplateDescriptorsPage as jest.MockedFunction<
      typeof getTemplateDescriptorsPage
   >;

const getTemplateDescriptorCategoriesMock =
   getTemplateDescriptorCategories as jest.MockedFunction<
      typeof getTemplateDescriptorCategories
   >;

const getTemplateDescriptorModelsMock =
   getTemplateDescriptorModels as jest.MockedFunction<
      typeof getTemplateDescriptorModels
   >;

const templatesSearchParamsCacheMock =
   templatesSearchParamsCache as DeepMockProxy<
      typeof templatesSearchParamsCache
   >;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Sammlung",
};

const assertRendered = () => {
   const page = screen.getByTestId("collection-page");
   const view = screen.getByTestId("collection-view");

   assertInDocument(page);
   assertInDocument(view);
};

describe("CollectionPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();

      const templateDescriptors = dtestData.dTemplateDescriptorsPage();
      getTemplateDescriptorsPageMock.mockResolvedValue(templateDescriptors);

      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();

      getTemplateDescriptorCategoriesMock.mockResolvedValue(categories);
      getTemplateDescriptorModelsMock.mockResolvedValue(models);
   });

   it("collection null - test", async () => {
      getCollectionByIdMock.mockResolvedValue(null);

      const pageParams: PageParams = { id: "collection-id-1" };
      const searchParams: SearchParams = { view: "grid" };

      const props: PageProps = {
         params: Promise.resolve(pageParams),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(CollectionPage, props);

      await waitFor(() => {
         expect(getCollectionByIdMock).toHaveBeenCalledTimes(1);
         expect(templatesSearchParamsCacheMock.parse).toHaveBeenCalledTimes(1);
         expect(templatesSearchParamsCacheMock.parse).toHaveBeenCalledWith(
            props.searchParams
         );
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("collection defined - test", async () => {
      const collection = dtestData.dCollection();
      getCollectionByIdMock.mockResolvedValue(collection);

      const pageParams: PageParams = { id: "collection-id-1" };
      const searchParams: SearchParams = { view: "grid" };

      const props: PageProps = {
         params: Promise.resolve(pageParams),
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(CollectionPage, props);

      await waitFor(() => {
         assertRendered();
         expect(templatesSearchParamsCacheMock.parse).toHaveBeenCalledTimes(1);
         expect(templatesSearchParamsCacheMock.parse).toHaveBeenCalledWith(
            props.searchParams
         );
         expect(getCollectionByIdMock).toHaveBeenCalledTimes(1);
         expect(getCollectionByIdMock).toHaveBeenCalledWith(pageParams.id);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
