jest.mock("@/data/actions/order");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   AuthMockedFunction,
   dtestData,
   ntestData,
   renderAsyncRSC,
} from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import mockRouter from "next-router-mock";

import { auth } from "@/auth";
import { getOrder } from "@/data/actions/order";

import {
   metadata,
   OrderDetailPage,
   OrderDetailPageProps,
   OrderParams,
} from "./page";

const authMock = auth as unknown as AuthMockedFunction;
const getOrderMock = getOrder as jest.MockedFunction<typeof getOrder>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const expectedMetadata: Metadata = {
   title: "Order",
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

   it("OrderDetailPage - session null - redirects to home", async () => {
      authMock.mockResolvedValue(null);

      const params: OrderParams = { id: "order-id-1" };

      const props: OrderDetailPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(OrderDetailPage, props);

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getOrderMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("OrderDetailPage - session.user undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const params: OrderParams = { id: "order-id-1" };

      const props: OrderDetailPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(OrderDetailPage, props);

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getOrderMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("OrderDetailPage - session.user.id undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const params: OrderParams = { id: "order-id-1" };

      const props: OrderDetailPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(OrderDetailPage, props);

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getOrderMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("OrderDetailPage - order not found - redirects to home", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);
      getOrderMock.mockResolvedValue(null);

      const params: OrderParams = { id: "order-id-123" };

      const props: OrderDetailPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(OrderDetailPage, props);

      await waitFor(() => {
         assertRendered();
         assertOrderNotFound();
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getOrderMock).toHaveBeenCalledTimes(1);
         expect(getOrderMock).toHaveBeenCalledWith(params.id);
         expect(redirectMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("OrderDetailPage - order found - rendered test", async () => {
      const session = ntestData.session();
      const order = dtestData.dOrder();
      authMock.mockResolvedValue(session);
      getOrderMock.mockResolvedValue(order);

      const params: OrderParams = { id: "order-id-456" };

      const props: OrderDetailPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(OrderDetailPage, props);

      await waitFor(() => {
         assertRendered();
         assertOrderFound();
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getOrderMock).toHaveBeenCalledTimes(1);
         expect(getOrderMock).toHaveBeenCalledWith(params.id);
         expect(redirectMock).not.toHaveBeenCalled();
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
      const session = ntestData.session();
      const order = dtestData.dOrder();
      authMock.mockResolvedValue(session);
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
      const session = ntestData.session();
      const order = dtestData.dOrder();
      authMock.mockResolvedValue(session);
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
         expect(mockRouter.pathname).toEqual("/library");
      });
   });
});
