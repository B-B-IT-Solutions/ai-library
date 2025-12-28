import prisma from "@/data/db/prisma";
import { OrderWithItems } from "@/data/types/db/order";
import { OrderCreateInput } from "@/generated/prisma/models";

export const pGetOrders = async (userId: string): Promise<OrderWithItems[]> => {
   return await prisma.order.findMany({
      where: { userId },
      include: {
         items: true,
      },
      orderBy: {
         createdAt: "desc",
      },
   });
};

export const pGetOrderById = async (
   orderId: string
): Promise<OrderWithItems | null> => {
   return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
         items: {
            include: {
               product: {
                  include: {
                     productItems: {
                        include: {
                           template: {
                              include: {
                                 categories: true,
                              },
                           },
                        },
                     },
                  },
               },
            },
         },
         purchases: {
            include: {
               template: {
                  include: {
                     categories: true,
                  },
               },
            },
         },
      },
   });
};

export const pCreateOrder = async (
   data: OrderCreateInput
): Promise<OrderWithItems> => {
   return await prisma.order.create({
      data,
      include: {
         items: true,
      },
   });
};

export const pUpdateOrderStatus = async (
   orderId: string,
   status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
) => {
   return await prisma.order.update({
      where: { id: orderId },
      data: { status },
   });
};

export type OrderUpdateStripeDetails = {
   stripeCheckoutSessionId?: string;
   stripePaymentIntentId?: string;
   stripePaymentStatus?: string;
   paymentMethod?: string;
};

export const pUpdateOrderWithStripeDetails = async (
   orderId: string,
   data: OrderUpdateStripeDetails
) => {
   return await prisma.order.update({
      where: { id: orderId },
      data,
   });
};

export const pGetOrderByPaymentIntentId = async (paymentIntentId: string) => {
   return await prisma.order.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
   });
};
