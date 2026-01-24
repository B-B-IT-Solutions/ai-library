jest.mock("@/data/repositories/order");
jest.mock("@/data/services/cart");
jest.mock("@/data/services/library");
jest.mock("@/data/actions/auth-utils");

import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import { requireUser } from "@/data/actions/auth-utils";
import { OrderRepository, OrderUpdate } from "@/data/repositories/order";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { CartService } from "@/data/services/cart";
import { LibraryService } from "@/data/services/library";
import { DOrderUpdate } from "@/data/types/domain/order";

import {
   toDOrder,
   toDOrdersWithItems,
   toDOrderWithItems,
} from "./order.mapper";
import { OrderService } from "./order.service";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

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

   it("getOrders - user undefined - test", async () => {
      const orders = ptestData.pOrdersWithItems();
      requireUserMock.mockRejectedValue("Unknow user");
      orderRepoMock.pGetOrders.mockResolvedValue(orders);

      const result = await orderService.getOrders();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrders).not.toHaveBeenCalled();
   });

   it("getOrders - db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrders.mockRejectedValue("db error");

      const result = await orderService.getOrders();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrders).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrders).toHaveBeenCalledWith(user.id);
   });

   it("getOrders - orders retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const orders = ptestData.pOrdersWithItems();
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrders.mockResolvedValue(orders);

      const result = await orderService.getOrders();

      const expectedResult = toDOrdersWithItems(orders);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrders).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrders).toHaveBeenCalledWith(user.id);
   });
});

describe("getOrder tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getOrder - user undefined - test", async () => {
      requireUserMock.mockRejectedValue("Unknow user");
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await orderService.getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).not.toHaveBeenCalled();
   });

   it("getOrder - id not valid - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      const orderId = "1";

      const result = await orderService.getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).not.toHaveBeenCalled();
   });

   it("getOrder - db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrder.mockRejectedValue("db error");

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await orderService.getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledWith(orderId);
   });

   it("getOrder - order null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrder.mockResolvedValue(null);

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await orderService.getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledWith(orderId);
   });

   it("getOrder - order of a different user - test", async () => {
      const user = dtestData.dLoginUser();
      user.id = "123";
      const order = ptestData.pOrderWithItems();
      order.userId = "456";
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrder.mockResolvedValue(order);

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await orderService.getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledWith(orderId);
   });

   it("getOrder - order retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const order = ptestData.pOrderWithItems();
      order.userId = user.id;
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrder.mockResolvedValue(order);

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await orderService.getOrder(orderId);

      const expectedResult = toDOrderWithItems(order);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledWith(orderId);
   });
});

describe("createOrder tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createOrder - test", async () => {
      const order = ptestData.pOrder();
      orderRepoMock.pCreateOrder.mockResolvedValue(order);

      const userId = "user-1";
      const cart = dtestData.dCart();

      const result = await orderService.createOrder(userId, cart);
      const expectedResult = toDOrder(order);

      const expectedOrderItems = map(cart.items, (item) => ({
         product: {
            connect: {
               id: item.productId,
            },
         },
         productName: item.productName,
         productDescription: item.productDescription,
         productType: item.productType,
         quantity: item.quantity,
         price: Number(item.productPrice),
      }));

      const expectedCreatePayload = {
         user: {
            connect: {
               id: userId,
            },
         },
         status: "PENDING",
         totalAmount: cart.total,
         items: {
            create: expectedOrderItems,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(orderRepoMock.pCreateOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pCreateOrder).toHaveBeenCalledWith(
         expectedCreatePayload
      );
   });
});

describe("updateOrder tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateOrder - test", async () => {
      const orderId = "order-id-1";
      const dUpdate: DOrderUpdate = {
         stripeCheckoutSessionId: "session-id-1",
         stripePaymentStatus: "unpaid",
      };

      await orderService.updateOrder(orderId, dUpdate);

      const expectedUpdatePayload: OrderUpdate = {
         stripeCheckoutSessionId: dUpdate.stripeCheckoutSessionId,
         stripePaymentStatus: dUpdate.stripePaymentStatus,
      };

      expect(orderRepoMock.pUpdateOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pUpdateOrder).toHaveBeenCalledWith(
         orderId,
         expectedUpdatePayload
      );
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

describe("handleStripeCheckoutCompleted tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("handleStripeCheckoutCompleted - order not found - test", async () => {
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";
      const paymentIntentId = "pi_123456";
      const paymentStatus = "succeeded";

      orderRepoMock.pGetOrderProducts.mockResolvedValue(null);

      const fn = () =>
         orderService.handleStripeCheckoutCompleted(
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

   it("handleStripeCheckoutCompleted - order already completed - test", async () => {
      const order = ptestData.pOrderProducts();
      order.status = "COMPLETED";
      const paymentIntentId = "pi_123456";
      const paymentStatus = "succeeded";

      orderRepoMock.pGetOrderProducts.mockResolvedValue(order);

      await orderService.handleStripeCheckoutCompleted(
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

   it("handleStripeCheckoutCompleted - order completed successfully - test", async () => {
      const order = ptestData.pOrderProducts();
      order.status = "PENDING";
      const paymentIntentId = "pi_123456";
      const paymentStatus = "succeeded";

      orderRepoMock.pGetOrderProducts.mockResolvedValue(order);

      await orderService.handleStripeCheckoutCompleted(
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

      const expectedOrderUpdate: OrderUpdate = {
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

      const expectedOrderUpdate: OrderUpdate = {
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

      const expectedOrderUpdate: OrderUpdate = {
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
