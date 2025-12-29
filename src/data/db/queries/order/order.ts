import { OrderProducts, OrderWithItems } from "@/data/types/db/order";
import { Order, PrismaClient } from "@/generated/prisma/client";
import { OrderCreateInput } from "@/generated/prisma/models";

export type OrderUpdateStripeDetails = {
   stripeCheckoutSessionId?: string;
   stripePaymentIntentId?: string;
   stripePaymentStatus?: string;
   paymentMethod?: string;
};

export class OrderRepository {
   constructor(private prisma: PrismaClient) {}

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

   async pGetOrder(orderId: string): Promise<OrderWithItems | null> {
      return await this.prisma.order.findUnique({
         where: { id: orderId },
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

   async pCreateOrder(data: OrderCreateInput): Promise<OrderWithItems> {
      return await this.prisma.order.create({
         data,
         include: {
            items: true,
         },
      });
   }

   async pUpdateOrderStatus(
      orderId: string,
      status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
   ) {
      return await this.prisma.order.update({
         where: { id: orderId },
         data: { status },
      });
   }

   async pUpdateOrderWithStripeDetails(
      orderId: string,
      data: OrderUpdateStripeDetails
   ) {
      return await this.prisma.order.update({
         where: { id: orderId },
         data,
      });
   }
}
