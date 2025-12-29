jest.mock("@/data/db/queries/order");
jest.mock("@/data/db/queries/cart");
jest.mock("@/data/db/queries/library");
jest.mock("@/data/services/cart");
jest.mock("@/data/services/library");
jest.mock("../../actions/auth-utils");

import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import { CartRepository } from "@/data/db/queries/cart";
import { LibraryRepository } from "@/data/db/queries/library";
import { OrderRepository } from "@/data/db/queries/order";
import { CartService } from "@/data/services/cart";
import { LibraryService } from "@/data/services/library";
import { requireUser } from "../../actions/auth-utils";

import { toDOrdersWithItems, toDOrderWithItems } from "./order.mapper";
import { OrderService } from "./order.service";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const orderRepo = new OrderRepository(prisma);
const cartRepo = new CartRepository(prisma);
const libraryRepo = new LibraryRepository(prisma);
const cartService = new CartService(cartRepo);
const libraryService = new LibraryService(libraryRepo);
const orderRepoMock = orderRepo as DeepMockProxy<OrderRepository>;
const cartServiceMock = cartService as DeepMockProxy<CartService>;
const libraryServiceMock = libraryService as DeepMockProxy<LibraryService>;

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

describe("handleStripeCheckoutCompleted tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("handleStripeCheckoutCompleted - order not found - test", async () => {
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";
      const paymentIntentId = "pi_123456";
      const paymentStatus = "succeeded";

      orderRepoMock.pGetOrderProducts.mockResolvedValue(null);

      await expect(
         orderService.handleStripeCheckoutCompleted(
            orderId,
            paymentIntentId,
            paymentStatus
         )
      ).rejects.toThrow(`Order ${orderId} not found`);

      expect(orderRepoMock.pGetOrderProducts).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrderProducts).toHaveBeenCalledWith(orderId);
      expect(
         orderRepoMock.pUpdateOrderWithStripeDetails
      ).not.toHaveBeenCalled();
      expect(libraryServiceMock.createLibraryEntries).not.toHaveBeenCalled();
      expect(orderRepoMock.pUpdateOrderStatus).not.toHaveBeenCalled();
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
      expect(
         orderRepoMock.pUpdateOrderWithStripeDetails
      ).not.toHaveBeenCalled();
      expect(libraryServiceMock.createLibraryEntries).not.toHaveBeenCalled();
      expect(orderRepoMock.pUpdateOrderStatus).not.toHaveBeenCalled();
      expect(cartServiceMock.clearCart).not.toHaveBeenCalled();
   });

   it("handleStripeCheckoutCompleted - order completed successfully - test", async () => {
      const order = ptestData.pOrderProducts();
      order.status = "PENDING";
      const paymentIntentId = "pi_123456";
      const paymentStatus = "succeeded";

      orderRepoMock.pGetOrderProducts.mockResolvedValue(order);
      orderRepoMock.pUpdateOrderWithStripeDetails.mockResolvedValue(undefined);
      libraryServiceMock.createLibraryEntries.mockResolvedValue(undefined);
      orderRepoMock.pUpdateOrderStatus.mockResolvedValue(undefined);

      await orderService.handleStripeCheckoutCompleted(
         order.id,
         paymentIntentId,
         paymentStatus
      );

      expect(orderRepoMock.pGetOrderProducts).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrderProducts).toHaveBeenCalledWith(order.id);

      expect(orderRepoMock.pUpdateOrderWithStripeDetails).toHaveBeenCalledTimes(
         1
      );
      expect(orderRepoMock.pUpdateOrderWithStripeDetails).toHaveBeenCalledWith(
         order.id,
         {
            stripePaymentIntentId: paymentIntentId,
            stripePaymentStatus: paymentStatus,
            paymentMethod: "STRIPE",
         }
      );

      expect(libraryServiceMock.createLibraryEntries).toHaveBeenCalledTimes(1);
      expect(libraryServiceMock.createLibraryEntries).toHaveBeenCalledWith(
         order
      );

      expect(orderRepoMock.pUpdateOrderStatus).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pUpdateOrderStatus).toHaveBeenCalledWith(
         order.id,
         "COMPLETED"
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

      orderRepoMock.pUpdateOrderStatus.mockResolvedValue(undefined);

      await orderService.handleStripeCheckoutExpired(orderId);

      expect(orderRepoMock.pUpdateOrderStatus).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pUpdateOrderStatus).toHaveBeenCalledWith(
         orderId,
         "FAILED"
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

      await expect(
         orderService.handleStripePaymentFailed(paymentIntentId)
      ).rejects.toThrow(
         `Order with paymentIntentId ${paymentIntentId} not found`
      );

      expect(orderRepoMock.pGetOrderByPaymentIntentId).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrderByPaymentIntentId).toHaveBeenCalledWith(
         paymentIntentId
      );
      expect(orderRepoMock.pUpdateOrderStatus).not.toHaveBeenCalled();
      expect(
         orderRepoMock.pUpdateOrderWithStripeDetails
      ).not.toHaveBeenCalled();
   });

   it("handleStripePaymentFailed - order status updated to failed - test", async () => {
      const order = ptestData.pOrder();
      const paymentIntentId = "pi_123456";

      orderRepoMock.pGetOrderByPaymentIntentId.mockResolvedValue(order);
      orderRepoMock.pUpdateOrderStatus.mockResolvedValue(undefined);
      orderRepoMock.pUpdateOrderWithStripeDetails.mockResolvedValue(undefined);

      await orderService.handleStripePaymentFailed(paymentIntentId);

      expect(orderRepoMock.pGetOrderByPaymentIntentId).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrderByPaymentIntentId).toHaveBeenCalledWith(
         paymentIntentId
      );

      expect(orderRepoMock.pUpdateOrderStatus).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pUpdateOrderStatus).toHaveBeenCalledWith(
         order.id,
         "FAILED"
      );

      expect(orderRepoMock.pUpdateOrderWithStripeDetails).toHaveBeenCalledTimes(
         1
      );
      expect(orderRepoMock.pUpdateOrderWithStripeDetails).toHaveBeenCalledWith(
         order.id,
         {
            stripePaymentStatus: "failed",
         }
      );
   });
});
