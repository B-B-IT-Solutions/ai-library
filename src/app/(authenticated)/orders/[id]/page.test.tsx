jest.mock("@/data/actions/order");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import mockRouter from "next-router-mock";

import { getOrder } from "@/data/actions/order";

import {
   metadata,
   OrderDetailPage,
   OrderDetailPageProps,
   OrderParams,
} from "./page";

const getOrderMock = getOrder as jest.MockedFunction<typeof getOrder>;

const expectedMetadata: Metadata = {
   title: "Bestellung",
};

const assertRendered = () => {
   const page = screen.getByTestId("order-details-page");
   assertInDocument(page);
};

const assertOrderNotFound = () => {
   const ordersEmpty = screen.getByTestId("order-not-found");
   const ordersLink = screen.getByTestId("orders-link");

   assertInDocument(ordersEmpty);
   assertInDocument(ordersLink);
};

const assertOrderFound = () => {
   const status = screen.getByTestId("order-status");
   const details = screen.getByTestId("order-details");
   const ordersLink = screen.getByTestId("orders-link");
   const libraryLink = screen.getByTestId("library-link");

   assertInDocument(status);
   assertInDocument(details);
   assertInDocument(ordersLink);
   assertInDocument(libraryLink);
};

describe("OrderDetailPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("OrderDetailPage - order not found - redirects to home", async () => {
      getOrderMock.mockResolvedValue(null);

      const params: OrderParams = { id: "order-id-123" };

      const props: OrderDetailPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(OrderDetailPage, props);

      await waitFor(() => {
         assertRendered();
         assertOrderNotFound();
         expect(getOrderMock).toHaveBeenCalledTimes(1);
         expect(getOrderMock).toHaveBeenCalledWith(params.id);
      });

      expect(container).toMatchSnapshot();
   });

   it("OrderDetailPage - order found - rendered test", async () => {
      const order = dtestData.dOrder();
      getOrderMock.mockResolvedValue(order);

      const params: OrderParams = { id: "order-id-456" };

      const props: OrderDetailPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(OrderDetailPage, props);

      await waitFor(() => {
         assertRendered();
         assertOrderFound();
         expect(getOrderMock).toHaveBeenCalledTimes(1);
         expect(getOrderMock).toHaveBeenCalledWith(params.id);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("OrderDetailPage functionality tests", () => {
   beforeEach(() => {
      mockRouter.push("/");
   });

   it("OrderDetailPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });

   it("OrderDetailPage - orders link clicked - test", async () => {
      const order = dtestData.dOrder();
      getOrderMock.mockResolvedValue(order);

      const params: OrderParams = { id: "order-id-456" };

      const props: OrderDetailPageProps = {
         params: Promise.resolve(params),
      };

      await renderAsyncRSC(OrderDetailPage, props);

      await waitFor(() => {
         assertOrderFound();
         expect(mockRouter.pathname).toEqual("/");
      });

      const link = screen.getByTestId("orders-link");
      await userEvent.click(link);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/orders");
      });
   });

   it("OrderDetailPage - library link clicked - test", async () => {
      const order = dtestData.dOrder();

      getOrderMock.mockResolvedValue(order);

      const params: OrderParams = { id: "order-id-456" };

      const props: OrderDetailPageProps = {
         params: Promise.resolve(params),
      };

      await renderAsyncRSC(OrderDetailPage, props);

      await waitFor(() => {
         assertOrderFound();
         expect(mockRouter.pathname).toEqual("/");
      });

      const link = screen.getByTestId("library-link");
      await userEvent.click(link);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates");
      });
   });
});
