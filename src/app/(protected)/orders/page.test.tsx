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
import { getOrders } from "@/data/actions/order";

import { metadata, OrdersPage } from "./page";

const authMock = auth as unknown as AuthMockedFunction;
const getOrdersMock = getOrders as jest.MockedFunction<typeof getOrders>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

export const expectedMetadata: Metadata = {
   title: "Orders",
};

const assertRendered = () => {
   const page = screen.getByTestId("order-page");
   assertInDocument(page);
};

const assertOrderEmpty = () => {
   const ordersEmpty = screen.getByTestId("orders-empty");
   const link = screen.getByTestId("market-place-link");

   assertInDocument(ordersEmpty);
   assertInDocument(link);
};

const assertOrderCards = (count: number) => {
   const cards = screen.getByTestId("orders-cards");
   const cardsList = screen.getAllByTestId("order-card");

   assertInDocument(cards);
   expect(cardsList).toHaveLength(count);
};

describe("OrdersPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("OrdersPage - session null - redirects to home", async () => {
      authMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(OrdersPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getOrdersMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("OrdersPage - session.user undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(OrdersPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getOrdersMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("OrdersPage - session.user.id undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(OrdersPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getOrdersMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("OrdersPage - orders empty - redirects to home", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);
      getOrdersMock.mockResolvedValue([]);

      const { container } = await renderAsyncRSC(OrdersPage, {});

      await waitFor(() => {
         assertRendered();
         assertOrderEmpty();
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getOrdersMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("OrdersPage - cart with items - rendered test", async () => {
      const session = ntestData.session();
      const orders = dtestData.dOrders();
      authMock.mockResolvedValue(session);
      getOrdersMock.mockResolvedValue(orders);

      const { container } = await renderAsyncRSC(OrdersPage, {});

      await waitFor(() => {
         assertRendered();
         assertOrderCards(3);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("OrdersPage functionality tests", () => {
   beforeEach(() => {
      mockRouter.push("/");
   });

   it("OrdersPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });

   it("CartPreview - checkout link clicked - test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);
      getOrdersMock.mockResolvedValue([]);

      await renderAsyncRSC(OrdersPage, {});

      await waitFor(() => {
         assertOrderEmpty();
         expect(mockRouter.pathname).toEqual("/");
      });

      const link = screen.getByTestId("market-place-link");
      await userEvent.click(link);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/marketplace");
      });
   });
});
