jest.mock("@/data/actions/cart/cart.actions");
jest.mock("@/data/actions/product/product.actions");

import { screen, waitFor } from "@testing-library/dom";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderAsyncRSC,
} from "@tests";
import { Metadata } from "next";

import { getCart } from "@/data/actions/cart";
import { getProduct } from "@/data/actions/product";

import ProductPage, { metadata, ProductPageProps, ProductParams } from "./page";

const getCartMock = getCart as jest.MockedFunction<typeof getCart>;

const getProductMock = getProduct as jest.MockedFunction<typeof getProduct>;

export const expectedMetadata: Metadata = {
   title: "Product",
};

const assertPageRendered = () => {
   const page = screen.getByTestId("product-page");
   const pageHeader = screen.getByTestId("product-page-header");
   const productDeatails = screen.getByTestId("product-details");
   const marketPlaceLink1 = screen.getByTestId("marketplace-link-1");
   const marketPlaceLink2 = screen.getByTestId("marketplace-link-2");

   assertInDocument(page);
   assertInDocument(pageHeader);
   assertInDocument(productDeatails);
   assertInDocument(marketPlaceLink1);
   assertInDocument(marketPlaceLink2);
};

const assertPageNotRendered = () => {
   const page = screen.queryByTestId("product-page");
   const pageHeader = screen.queryByTestId("product-page-header");
   const productDeatails = screen.queryByTestId("product-details");
   const marketPlaceLink1 = screen.queryByTestId("marketplace-link-1");
   const marketPlaceLink2 = screen.queryByTestId("marketplace-link-2");

   assertNotInDocument(page);
   assertNotInDocument(pageHeader);
   assertNotInDocument(productDeatails);
   assertNotInDocument(marketPlaceLink1);
   assertNotInDocument(marketPlaceLink2);
};

describe("ProductPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("ProductPage - product null - rendered test", async () => {
      const cart = dtestData.dCart();
      getProductMock.mockResolvedValue(null);
      getCartMock.mockResolvedValue(cart);

      const params: ProductParams = { id: "product-id-1" };

      const props: ProductPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(ProductPage, props);

      await waitFor(() => {
         assertPageNotRendered();
         expect(getProductMock).toHaveBeenCalledTimes(1);
         expect(getProductMock).toHaveBeenCalledWith(params.id);
         expect(getCartMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("ProductPage - searchParams.view list - rendered test", async () => {
      const product = dtestData.dProduct();
      const cart = dtestData.dCart();
      getProductMock.mockResolvedValue(product);
      getCartMock.mockResolvedValue(cart);

      const params: ProductParams = { id: "product-id-1" };

      const props: ProductPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(ProductPage, props);

      await waitFor(() => {
         assertPageRendered();
         expect(getProductMock).toHaveBeenCalledTimes(1);
         expect(getProductMock).toHaveBeenCalledWith(params.id);
         expect(getCartMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ProductPage functionality tests", () => {
   it("ProductPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
