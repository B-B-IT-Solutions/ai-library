import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import { OrderProducts, OrderWithItems } from "@/data/types/db/order";
import { DOrder, DOrderCreate, DOrderUpdate } from "@/data/types/domain/order";
import { Order } from "@/generated/prisma/client";
import {
   OrderCreateArgs,
   OrderItemCreateWithoutOrderInput,
   OrderUpdateInput,
} from "@/generated/prisma/models";

import {
   toDOrder,
   toDOrdersWithItems,
   toDOrderWithItems,
} from "./order.mapper";

export class OrderRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetOrders(userId: string): Promise<DOrder[]> {
      const orders = await this.prisma.order.findMany({
         where: { userId },
         include: {
            items: true,
         },
         orderBy: {
            createdAt: "desc",
         },
      });

      return toDOrdersWithItems(orders);
   }

   async pGetOrder(orderId: string, userId: string): Promise<DOrder | null> {
      const order: OrderWithItems | null = await this.prisma.order.findUnique({
         where: {
            id: orderId,
            userId,
         },
         include: {
            items: true,
         },
      });

      if (order) {
         return toDOrderWithItems(order);
      }
      return null;
   }

   async pGetOrderByPaymentIntentId(
      paymentIntentId: string
   ): Promise<DOrder | null> {
      const order = await this.prisma.order.findFirst({
         where: {
            stripePaymentIntentId: paymentIntentId,
         },
      });

      if (order) {
         return toDOrder(order);
      }
      return null;
   }

   async pGetOrderProducts(orderId: string): Promise<OrderProducts | null> {
      return await this.prisma.order.findUnique({
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
      });
   }

   async pCreateOrder(data: DOrderCreate, userId: string): Promise<DOrder> {
      const orderItems: OrderItemCreateWithoutOrderInput[] = map(
         data.items,
         (item) => {
            return {
               product: {
                  connect: {
                     id: item.productId,
                  },
               },
               productName: item.productName,
               productDescription: item.productDescription,
               productType: item.productType,
               quantity: item.quantity,
               price: item.price,
            };
         }
      );

      const args: OrderCreateArgs = {
         data: {
            status: "PENDING",
            totalAmount: data.totalAmount,
            items: {
               create: orderItems,
            },
            user: {
               connect: {
                  id: userId,
               },
            },
         },
      };

      const order = await this.prisma.order.create(args);
      return toDOrder(order);
   }

   async pUpdateOrder(orderId: string, dUpdate: DOrderUpdate) {
      const data: OrderUpdateInput = {
         status: dUpdate.status,
         stripeCheckoutSessionId: dUpdate.stripeCheckoutSessionId,
         stripePaymentIntentId: dUpdate.stripePaymentIntentId,
         stripePaymentStatus: dUpdate.stripePaymentStatus,
         paymentMethod: dUpdate.paymentMethod,
      };

      return await this.prisma.order.update({
         where: { id: orderId },
         data: data,
      });
   }

   async pDeleteOrders(userId: string) {
      return await this.prisma.order.deleteMany({
         where: { userId },
      });
   }
}
