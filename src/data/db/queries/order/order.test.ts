import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import {
   OrderCreateArgs,
   OrderCreateInput,
   OrderFindFirstArgs,
   OrderFindManyArgs,
   OrderFindUniqueArgs,
   OrderUpdateArgs,
} from "@/generated/prisma/models";

import {
   OrderUpdateStripeDetails,
   pCreateOrder,
   pGetOrderById,
   pGetOrderByPaymentIntentId,
   pGetOrders,
   pUpdateOrderStatus,
   pUpdateOrderWithStripeDetails,
} from "./order";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("pGetOrders tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetOrders test", async () => {
      const userId = "user-id-1";
      const orders = ptestData.pOrdersWithItems();
      prismaMock.order.findMany.mockResolvedValue(orders);

      const result = await pGetOrders(userId);

      const expectedFindManyArgs: OrderFindManyArgs = {
         where: { userId },
         include: {
            items: true,
         },
         orderBy: {
            createdAt: "desc",
         },
      };

      expect(result).toEqual(orders);
      expect(prismaMock.order.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pGetOrderById tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetOrderById test", async () => {
      const orderId = "order-id-1";
      const order = ptestData.pOrderWithItems();
      prismaMock.order.findUnique.mockResolvedValue(order);

      const result = await pGetOrderById(orderId);

      const expectedFindManyArgs: OrderFindUniqueArgs = {
         where: { id: orderId },
         include: {
            items: true,
         },
      };

      expect(result).toEqual(order);
      expect(prismaMock.order.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.findUnique).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pGetOrderByPaymentIntentId tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetOrderByPaymentIntentId test", async () => {
      const paymentIntentId = "payment-id-1";
      const order = ptestData.pOrder();
      prismaMock.order.findFirst.mockResolvedValue(order);

      const result = await pGetOrderByPaymentIntentId(paymentIntentId);

      const expectedFindFirstArgs: OrderFindFirstArgs = {
         where: {
            stripePaymentIntentId: paymentIntentId,
         },
      };

      expect(result).toEqual(order);
      expect(prismaMock.order.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });
});

describe("pCreateOrder tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCreateOrder test", async () => {
      const order = ptestData.pOrder();
      prismaMock.order.create.mockResolvedValue(order);

      const items = ptestData.pCartItems(3);
      const createInput: OrderCreateInput = {
         user: {
            connect: {
               id: "user-1",
            },
         },
         status: "PENDING",
         totalAmount: 27.99,
         items: {
            create: map(items, (i) => ({
               product: {
                  connect: {
                     id: i.productId,
                  },
               },
               productName: i.productName,
               productDescription: i.productDescription,
               productType: i.productType,
               quantity: i.quantity,
               price: 9.99,
            })),
         },
      };
      const result = await pCreateOrder(createInput);

      const expectedOrderCreateArgs: OrderCreateArgs = {
         data: createInput,
         include: {
            items: true,
         },
      };

      expect(result).toEqual(order);
      expect(prismaMock.order.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.create).toHaveBeenCalledWith(
         expectedOrderCreateArgs
      );
   });
});

describe("pUpdateOrderStatus tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pUpdateOrderStatus test", async () => {
      const order = ptestData.pOrderWithItems();
      prismaMock.order.update.mockResolvedValue(order);

      const orderId = "order-id-1";
      const status = "COMPLETED";

      const result = await pUpdateOrderStatus(orderId, status);

      const expectedUpdateArgs: OrderUpdateArgs = {
         where: { id: orderId },
         data: { status },
      };

      expect(result).toEqual(order);
      expect(prismaMock.order.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });
});

describe("pUpdateOrderWithStripeDetails tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pUpdateOrderWithStripeDetails test", async () => {
      const order = ptestData.pOrder();
      prismaMock.order.update.mockResolvedValue(order);

      const stripeUpdates: OrderUpdateStripeDetails = {
         stripeCheckoutSessionId: "53ef3210-b719-4dd2-b612-4f28d4af187d",
         stripePaymentIntentId: "455c1d0a-9065-498e-a298-4e9176d3a8ca",
         stripePaymentStatus: "SUCCESS",
         paymentMethod: "card",
      };

      const result = await pUpdateOrderWithStripeDetails(
         order.id,
         stripeUpdates
      );

      const expectedOrderUpdateArgs: OrderUpdateArgs = {
         where: { id: order.id },
         data: stripeUpdates,
      };

      expect(result).toEqual(order);
      expect(prismaMock.order.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.update).toHaveBeenCalledWith(
         expectedOrderUpdateArgs
      );
   });
});
