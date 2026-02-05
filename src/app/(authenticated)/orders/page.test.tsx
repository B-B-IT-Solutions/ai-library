jest.mock("@/data/actions/order");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import mockRouter from "next-router-mock";

import { getOrders } from "@/data/actions/order";

import { metadata, OrdersPage } from "./page";

const getOrdersMock = getOrders as jest.MockedFunction<typeof getOrders>;

const expectedMetadata: Metadata = {
   title: "Bestellverlauf",
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

   it("OrdersPage - orders empty - redirects to home", async () => {
      getOrdersMock.mockResolvedValue([]);

      const { container } = await renderAsyncRSC(OrdersPage, {});

      await waitFor(() => {
         assertRendered();
         assertOrderEmpty();
         expect(getOrdersMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("OrdersPage - cart with items - rendered test", async () => {
      const orders = dtestData.dOrders();
      getOrdersMock.mockResolvedValue(orders);

      const { container } = await renderAsyncRSC(OrdersPage, {});

      await waitFor(() => {
         assertRendered();
         assertOrderCards(3);
         expect(getOrdersMock).toHaveBeenCalledTimes(1);
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
