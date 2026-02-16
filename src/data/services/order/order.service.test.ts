jest.mock("@/data/repositories/order");
jest.mock("@/data/services/cart");
jest.mock("@/data/services/library");

import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { OrderRepository } from "@/data/repositories/order";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { CartService } from "@/data/services/cart";
import { LibraryService } from "@/data/services/library";
import { DOrderUpdate } from "@/data/types/domain/order";

import { OrderService } from "./order.service";

const serviceFactory = new ServiceFactory(prisma);
const cartService = serviceFactory.getCartService();
const libraryService = serviceFactory.getLibraryService();

const cartServiceMock = cartService as DeepMockProxy<CartService>;
const libraryServiceMock = libraryService as DeepMockProxy<LibraryService>;

const orderRepo = new OrderRepository(prisma);
const orderRepoMock = orderRepo as DeepMockProxy<OrderRepository>;

const orderService = new OrderService(
   orderRepoMock,
   cartServiceMock,
   libraryServiceMock
);

describe("getOrders tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getOrders - orders retrieved - test", async () => {
      const userId = "user-id-1";
      const orders = dtestData.dOrders();
      orderRepoMock.pGetOrders.mockResolvedValue(orders);

      const result = await orderService.getOrders(userId);

      expect(result).toEqual(orders);
      expect(orderRepoMock.pGetOrders).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrders).toHaveBeenCalledWith(userId);
   });
});

describe("getOrder tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getOrder - order retrieved - test", async () => {
      const userId = "user-id-1";
      const order = dtestData.dOrder();
      orderRepoMock.pGetOrder.mockResolvedValue(order);

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await orderService.getOrder(orderId, userId);

      expect(result).toEqual(order);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledWith(orderId, userId);
   });
});

describe("createOrder tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createOrder - test", async () => {
      const order = dtestData.dOrder();
      orderRepoMock.pCreateOrder.mockResolvedValue(order);

      const userId = "user-id-1";
      const orderCreate = dtestData.dOrderCreate();

      const result = await orderService.createOrder(userId, orderCreate);

      expect(result).toEqual(order);
      expect(orderRepoMock.pCreateOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pCreateOrder).toHaveBeenCalledWith(
         orderCreate,
         userId
      );
   });
});

describe("updateOrder tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateOrder - test", async () => {
      const orderId = "order-id-1";
      const dUpdate = dtestData.dOrderUpdate();

      await orderService.updateOrder(orderId, dUpdate);

      expect(orderRepoMock.pUpdateOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pUpdateOrder).toHaveBeenCalledWith(orderId, dUpdate);
   });
});

describe("deleteOrders tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("deleteOrders - orders deleted - test", async () => {
      const userId = "user-id-1";

      await orderService.deleteOrders(userId);

      expect(orderRepoMock.pDeleteOrders).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pDeleteOrders).toHaveBeenCalledWith(userId);
   });
});

describe("handlePaymentCheckoutCompleted tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("handlePaymentCheckoutCompleted - order not found - test", async () => {
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";
      const paymentIntentId = "pi_123456";
      const paymentStatus = "succeeded";

      orderRepoMock.pGetOrderProducts.mockResolvedValue(null);

      const fn = () =>
         orderService.handlePaymentCheckoutCompleted(
            orderId,
            paymentIntentId,
            paymentStatus
         );

      await expect(fn).rejects.toThrow(`Order ${orderId} not found`);

      expect(orderRepoMock.pGetOrderProducts).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrderProducts).toHaveBeenCalledWith(orderId);
      expect(libraryServiceMock.createLibraryEntries).not.toHaveBeenCalled();
      expect(orderRepoMock.pUpdateOrder).not.toHaveBeenCalled();
      expect(cartServiceMock.clearCart).not.toHaveBeenCalled();
   });

   it("handlePaymentCheckoutCompleted - order already completed - test", async () => {
      const order = ptestData.pOrderProducts();
      order.status = "COMPLETED";
      const paymentIntentId = "pi_123456";
      const paymentStatus = "succeeded";

      orderRepoMock.pGetOrderProducts.mockResolvedValue(order);

      await orderService.handlePaymentCheckoutCompleted(
         order.id,
         paymentIntentId,
         paymentStatus
      );

      expect(orderRepoMock.pGetOrderProducts).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrderProducts).toHaveBeenCalledWith(order.id);
      expect(libraryServiceMock.createLibraryEntries).not.toHaveBeenCalled();
      expect(orderRepoMock.pUpdateOrder).not.toHaveBeenCalled();
      expect(cartServiceMock.clearCart).not.toHaveBeenCalled();
   });

   it("handlePaymentCheckoutCompleted - order completed successfully - test", async () => {
      const order = ptestData.pOrderProducts();
      order.status = "PENDING";
      const paymentIntentId = "pi_123456";
      const paymentStatus = "succeeded";

      orderRepoMock.pGetOrderProducts.mockResolvedValue(order);

      await orderService.handlePaymentCheckoutCompleted(
         order.id,
         paymentIntentId,
         paymentStatus
      );

      expect(orderRepoMock.pGetOrderProducts).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrderProducts).toHaveBeenCalledWith(order.id);

      expect(libraryServiceMock.createLibraryEntries).toHaveBeenCalledTimes(1);
      expect(libraryServiceMock.createLibraryEntries).toHaveBeenCalledWith(
         order
      );

      const expectedOrderUpdate: DOrderUpdate = {
         status: "COMPLETED",
         stripePaymentIntentId: paymentIntentId,
         stripePaymentStatus: paymentStatus,
         paymentMethod: "STRIPE",
      };
      expect(orderRepoMock.pUpdateOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pUpdateOrder).toHaveBeenCalledWith(
         order.id,
         expectedOrderUpdate
      );

      expect(cartServiceMock.clearCart).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.clearCart).toHaveBeenCalledWith(order.userId);
   });
});

describe("handleStripeCheckoutExpired tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("handleStripeCheckoutExpired - order status updated to failed - test", async () => {
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      await orderService.handleStripeCheckoutExpired(orderId);

      const expectedOrderUpdate: DOrderUpdate = {
         status: "FAILED",
      };
      expect(orderRepoMock.pUpdateOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pUpdateOrder).toHaveBeenCalledWith(
         orderId,
         expectedOrderUpdate
      );
   });
});

describe("handleStripePaymentFailed tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("handleStripePaymentFailed - order not found - test", async () => {
      const paymentIntentId = "pi_123456";

      orderRepoMock.pGetOrderByPaymentIntentId.mockResolvedValue(null);

      const fn = () => orderService.handleStripePaymentFailed(paymentIntentId);

      await expect(fn).rejects.toThrow(
         `Order with paymentIntentId ${paymentIntentId} not found`
      );

      expect(orderRepoMock.pGetOrderByPaymentIntentId).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrderByPaymentIntentId).toHaveBeenCalledWith(
         paymentIntentId
      );
      expect(orderRepoMock.pUpdateOrder).not.toHaveBeenCalled();
      expect(orderRepoMock.pUpdateOrder).not.toHaveBeenCalled();
   });

   it("handleStripePaymentFailed - order status updated to failed - test", async () => {
      const order = ptestData.pOrder();
      const paymentIntentId = "pi_123456";

      orderRepoMock.pGetOrderByPaymentIntentId.mockResolvedValue(order);

      await orderService.handleStripePaymentFailed(paymentIntentId);

      expect(orderRepoMock.pGetOrderByPaymentIntentId).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrderByPaymentIntentId).toHaveBeenCalledWith(
         paymentIntentId
      );

      const expectedOrderUpdate: DOrderUpdate = {
         status: "FAILED",
         stripePaymentStatus: "failed",
      };
      expect(orderRepoMock.pUpdateOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pUpdateOrder).toHaveBeenCalledWith(
         order.id,
         expectedOrderUpdate
      );
   });
});
