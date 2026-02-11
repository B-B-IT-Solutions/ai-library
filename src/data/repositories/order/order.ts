import { DbClient } from "@/data/types/db/common";
import { OrderProducts, OrderWithItems } from "@/data/types/db/order";
import { Order, OrderStatus } from "@/generated/prisma/client";
import { OrderCreateInput } from "@/generated/prisma/models";

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

   async pGetOrders(userId: string): Promise<OrderWithItems[]> {
      return await this.prisma.order.findMany({
         where: { userId },
         include: {
            items: true,
         },
         orderBy: {
            createdAt: "desc",
         },
      });
   }

   async pGetOrder(
      orderId: string,
      userId: string
   ): Promise<OrderWithItems | null> {
      return await this.prisma.order.findUnique({
         where: {
            id: orderId,
            userId,
         },
         include: {
            items: true,
         },
      });
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

   async pCreateOrder(data: OrderCreateInput): Promise<Order> {
      return await this.prisma.order.create({
         data,
      });
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
