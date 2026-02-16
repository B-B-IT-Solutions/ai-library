import { map } from "es-toolkit/compat";

import {
   toDOrder,
   toDOrdersWithItems,
   toDOrderWithItems,
} from "@/data/services/order/order.mapper";
import { DbClient } from "@/data/types/db/common";
import { OrderProducts, OrderWithItems } from "@/data/types/db/order";
import { DOrder, DOrderCreate } from "@/data/types/domain/order";
import { Order, OrderStatus } from "@/generated/prisma/client";
import {
   OrderCreateArgs,
   OrderItemCreateWithoutOrderInput,
} from "@/generated/prisma/models";

export type OrderUpdate = {
   status?: OrderStatus;
   stripeCheckoutSessionId?: string;
   stripePaymentIntentId?: string;
   stripePaymentStatus?: string;
   paymentMethod?: string;
};

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
   ): Promise<Order | null> {
      return await this.prisma.order.findFirst({
         where: {
            stripePaymentIntentId: paymentIntentId,
         },
      });
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

   async pUpdateOrder(orderId: string, data: OrderUpdate) {
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
