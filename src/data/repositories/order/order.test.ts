import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DOrderUpdate } from "@/data/types/domain/order";
import {
   OrderCreateArgs,
   OrderCreateInput,
   OrderDeleteManyArgs,
   OrderFindFirstArgs,
   OrderFindManyArgs,
   OrderFindUniqueArgs,
   OrderUpdateArgs,
} from "@/generated/prisma/models";

import { OrderRepository } from "./order";
import {
   toDOrder,
   toDOrdersWithItems,
   toDOrderWithItems,
} from "./order.mapper";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const orderRepository = new OrderRepository(prismaMock);

describe("pGetOrders tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetOrders test", async () => {
      const userId = "user-id-1";
      const orders = ptestData.pOrdersWithItems();
      prismaMock.order.findMany.mockResolvedValue(orders);

      const result = await orderRepository.pGetOrders(userId);

      const expectedResult = toDOrdersWithItems(orders);

      const expectedFindManyArgs: OrderFindManyArgs = {
         where: { userId },
         include: {
            items: true,
         },
         orderBy: {
            createdAt: "desc",
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.order.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pGetOrder tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetOrder - order null - test", async () => {
      const userId = "user-id-1";
      const orderId = "order-id-1";
      prismaMock.order.findUnique.mockResolvedValue(null);

      const result = await orderRepository.pGetOrder(orderId, userId);

      const expectedFindUniqueArgs: OrderFindUniqueArgs = {
         where: {
            id: orderId,
            userId,
         },
         include: {
            items: true,
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.order.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });

   test("pGetOrder - order retrieved - test", async () => {
      const userId = "user-id-1";
      const orderId = "order-id-1";
      const order = ptestData.pOrderWithItems();
      prismaMock.order.findUnique.mockResolvedValue(order);

      const result = await orderRepository.pGetOrder(orderId, userId);

      const expectedResult = toDOrderWithItems(order);

      const expectedFindUniqueArgs: OrderFindUniqueArgs = {
         where: {
            id: orderId,
            userId,
         },
         include: {
            items: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.order.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
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

      const result =
         await orderRepository.pGetOrderByPaymentIntentId(paymentIntentId);

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

describe("pGetOrderProducts tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetOrderProducts test", async () => {
      const orderId = "order-id-1";
      const order = ptestData.pOrderProducts();
      prismaMock.order.findUnique.mockResolvedValue(order);

      const result = await orderRepository.pGetOrderProducts(orderId);

      const expectedFindUniqueArgs: OrderFindUniqueArgs = {
         where: {
            id: orderId,
         },
         select: {
            id: true,
            userId: true,
            status: true,
            items: {
               select: {
                  product: {
                     select: {
                        id: true,
                        productItems: {
                           select: {
                              templateId: true,
                           },
                        },
                     },
                  },
               },
            },
         },
      };

      expect(result).toEqual(order);
      expect(prismaMock.order.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });
});

describe("pCreateOrder tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCreateOrder test", async () => {
      const userId = "user-1";
      const orderCreate = dtestData.dOrderCreate();
      const order = ptestData.pOrder();
      prismaMock.order.create.mockResolvedValue(order);

      const result = await orderRepository.pCreateOrder(orderCreate, userId);

      const expectedResult = toDOrder(order);

      const expectedInput: OrderCreateInput = {
         status: "PENDING",
         totalAmount: orderCreate.totalAmount,
         items: {
            create: map(orderCreate.items, (i) => ({
               product: {
                  connect: {
                     id: i.productId,
                  },
               },
               productName: i.productName,
               productDescription: i.productDescription,
               productType: i.productType,
               quantity: i.quantity,
               price: i.price,
            })),
         },
         user: {
            connect: {
               id: "user-1",
            },
         },
      };

      const expectedOrderCreateArgs: OrderCreateArgs = {
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.order.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.create).toHaveBeenCalledWith(
         expectedOrderCreateArgs
      );
   });
});

describe("pUpdateOrder tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pUpdateOrder - status update - test", async () => {
      const order = ptestData.pOrderWithItems();
      prismaMock.order.update.mockResolvedValue(order);

      const orderId = "order-id-1";
      const orderUpdate: DOrderUpdate = {
         status: "COMPLETED",
      };

      const result = await orderRepository.pUpdateOrder(orderId, orderUpdate);

      const expectedUpdateArgs: OrderUpdateArgs = {
         where: { id: orderId },
         data: {
            status: orderUpdate.status,
         },
      };

      expect(result).toEqual(order);
      expect(prismaMock.order.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });

   test("pUpdateOrder - stripe details update - test", async () => {
      const order = ptestData.pOrder();
      prismaMock.order.update.mockResolvedValue(order);

      const orderId = "order-id-1";
      const orderUpdate: DOrderUpdate = {
         stripeCheckoutSessionId: "53ef3210-b719-4dd2-b612-4f28d4af187d",
         stripePaymentIntentId: "455c1d0a-9065-498e-a298-4e9176d3a8ca",
         stripePaymentStatus: "SUCCESS",
         paymentMethod: "card",
      };

      const result = await orderRepository.pUpdateOrder(orderId, orderUpdate);

      const expectedUpdateArgs: OrderUpdateArgs = {
         where: { id: orderId },
         data: {
            stripeCheckoutSessionId: orderUpdate.stripeCheckoutSessionId,
            stripePaymentIntentId: orderUpdate.stripePaymentIntentId,
            stripePaymentStatus: orderUpdate.stripePaymentStatus,
            paymentMethod: orderUpdate.paymentMethod,
         },
      };

      expect(result).toEqual(order);
      expect(prismaMock.order.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });
});

describe("pDeleteOrders tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pDeleteOrders test", async () => {
      const userId = "user-id-1";
      await orderRepository.pDeleteOrders(userId);

      const expectedDeleteManyArgs: OrderDeleteManyArgs = {
         where: { userId },
      };

      expect(prismaMock.order.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.deleteMany).toHaveBeenCalledWith(
         expectedDeleteManyArgs
      );
   });
});
