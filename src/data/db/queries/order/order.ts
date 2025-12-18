import prisma from "@/data/db/prisma";
import { OrderCreateInput } from "@/generated/prisma/models";

export const pCreateOrder = async (data: OrderCreateInput) => {
   return await prisma.order.create({
      data,
      include: {
         items: {
            include: {
               product: {
                  include: {
                     template: {
                        include: {
                           categories: true,
                        },
                     },
                     bundleItems: {
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

export const pGetOrderById = async (orderId: string) => {
   return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
         items: {
            include: {
               product: {
                  include: {
                     template: {
                        include: {
                           categories: true,
                        },
                     },
                     bundleItems: {
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

export const pGetUserOrders = async (userId: string) => {
   return await prisma.order.findMany({
      where: { userId },
      include: {
         items: {
            include: {
               product: true,
            },
         },
      },
      orderBy: {
         createdAt: "desc",
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

export const pCreatePurchases = async (
   orderId: string,
   userId: string,
   templateIds: string[]
) => {
   const purchases = templateIds.map((templateId) => ({
      orderId,
      userId,
      templateId,
   }));

   return await prisma.purchase.createMany({
      data: purchases,
      skipDuplicates: true,
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

export const pGetOrderByStripeSessionId = async (sessionId: string) => {
   return await prisma.order.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
      include: {
         items: {
            include: {
               product: {
                  include: {
                     template: {
                        include: {
                           categories: true,
                        },
                     },
                     bundleItems: {
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

export const pGetOrderByPaymentIntentId = async (paymentIntentId: string) => {
   return await prisma.order.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
   });
};
